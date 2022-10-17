import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { userRegisterInterface } from '@turbo-lottery/data';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException('User Not Found');
    } else {
      const passwordCompare = await bcrypt.compare(pass, user.password);
      if (!passwordCompare) {
        throw new BadRequestException('Invalid credentials');
      } else {
        const { _id, username, isAdmin } = user;
        return { _id, username, isAdmin };
      }
    }
  }

  async passwordEncryption(password: string) {
    const hashPassword: string = await bcrypt.hash(password, 10);
    if (!hashPassword) {
      throw new InternalServerErrorException(
        'Password Encryption Is Not Working'
      );
    } else {
      return hashPassword;
    }
  }

  async login(user: userRegisterInterface) {
    const data = await this.validateUser(user.username, user.password);
    const payload = { username: user.username, sub: data._id };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      id: data._id,
      isAdmin: data.isAdmin,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashPassword: string = await this.passwordEncryption(
      createUserDto.password
    );
    const user = await this.userService.create({
      username: createUserDto.username,
      password: hashPassword,
      credit: createUserDto.credit,
      isAdmin: createUserDto.isAdmin,
    });
    const newUser = {
      username: user.username,
      password: createUserDto.password,
    };
    return await this.login(newUser);
  }
}
