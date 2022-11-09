/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/nest-api/src/app/Schemas/ticket.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ticketSchema = void 0;
const mongoose_1 = __webpack_require__("mongoose");
const user_schema_1 = __webpack_require__("./apps/nest-api/src/app/Schemas/user.schema.ts");
exports.ticketSchema = new mongoose_1.default.Schema({
    price: { type: Number, required: true, default: 100 },
    maxplayers: { type: Number, required: true, default: 5 },
    ticketName: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true, default: true },
    timer: { type: Number, required: true, default: 10 },
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: user_schema_1.userSchema }],
    ticketHistory: {
        type: [
            {
                winner: String,
                playedOn: String,
            },
        ],
    },
});


/***/ }),

/***/ "./apps/nest-api/src/app/Schemas/user.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.userSchema = void 0;
const mongoose_1 = __webpack_require__("mongoose");
exports.userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credit: { type: Number, required: true, default: 1000 },
    creditHistory: {
        type: [{ description: String, transaction: String, balance: String }],
    },
    isAdmin: { type: Boolean, required: true, default: false },
});


/***/ }),

/***/ "./apps/nest-api/src/app/app.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_service_1 = __webpack_require__("./apps/nest-api/src/app/app.service.ts");
const auth_service_1 = __webpack_require__("./apps/nest-api/src/app/auth/auth.service.ts");
let AppController = class AppController {
    constructor(appService, authService) {
        this.appService = appService;
        this.authService = authService;
    }
    getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./apps/nest-api/src/app/app.gateway.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppGateway = void 0;
const tslib_1 = __webpack_require__("tslib");
const websockets_1 = __webpack_require__("@nestjs/websockets");
const app_service_1 = __webpack_require__("./apps/nest-api/src/app/app.service.ts");
const user_service_1 = __webpack_require__("./apps/nest-api/src/app/user/user.service.ts");
const socket_io_1 = __webpack_require__("socket.io");
const ticket_service_1 = __webpack_require__("./apps/nest-api/src/app/ticket/ticket.service.ts");
const common_1 = __webpack_require__("@nestjs/common");
const data_1 = __webpack_require__("./libs/data/src/index.ts");
let AppGateway = class AppGateway {
    constructor(appService, userService, ticketService) {
        this.appService = appService;
        this.userService = userService;
        this.ticketService = ticketService;
    }
    handleTicketHistory(TicketId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketService.get(TicketId);
                this.server.sockets.emit('putTicketHistory', ticket.ticketHistory, TicketId);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    handleJoin({ userId, ticketId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketService.get(ticketId);
                this.server.sockets.emit('receive', ticket.participants, ticketId);
                const user = yield this.userService.get(userId);
                this.server.sockets.emit('putCredit', user.credit, user.creditHistory, userId);
                // if (ticket.participants.length >= ticket.maxplayers) {
                //   this.server.sockets.emit(
                //     'message',
                //     `Players are full for this lottery ticket`,
                //     ticketId
                //   );
                //   const intvl = setInterval(() => {
                //     this.server.sockets.emit('message', '', ticketId);
                //     clearInterval(intvl);
                //   }, 3000);
                // }
                // else {
                //   this.server.sockets.emit(
                //     'message',
                //     `1....Waitinggg for ${ticket.maxplayers} - ${ticket.participants.length} more users to buy this ticket`,
                //     ticketId
                //   );
                // }
                this.server.sockets.emit('timer', ticket.timer, ticketId);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
            // this.server.sockets.emit('receive', data);
            // console.log('connected');
        });
    }
    handleBoughtTicket({ userId, ticketId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketService.get(ticketId);
                const user = yield this.userService.get(userId);
                //   console.log(userId);
                //   console.log(ticket);
                if (ticket.participants.length >= ticket.maxplayers) {
                    this.server.sockets.emit('message', `Players are full for `, ticketId, userId, data_1.messageEnum.invalid);
                    // const intvl = setInterval(() => {
                    //   this.server.sockets.emit('message', '', ticketId, userId);
                    //   clearInterval(intvl);
                    // }, 10000);
                }
                else {
                    if (ticket.participants.includes(userId)) {
                        this.server.sockets.emit('message', `You are already a part of`, ticketId, userId, data_1.messageEnum.invalid);
                        // const intvl = setInterval(() => {
                        //   this.server.sockets.emit('message', '', ticketId, userId);
                        //   clearInterval(intvl);
                        // }, 10000);
                    }
                    else {
                        // if (ticket.participants.length === 0) {
                        //   // this.server.sockets.emit('winner', '');
                        //   this.server.sockets.emit('public', '');
                        // }
                        if (ticket.active) {
                            if (user.credit < ticket.price) {
                                this.server.sockets.emit('message', `You have less money to buy`, ticketId, userId, data_1.messageEnum.invalid);
                                return;
                            }
                            ticket.participants.push(userId);
                            let updateTicket = yield this.ticketService.update(ticketId, ticket);
                            // this.server.sockets.emit(
                            //   'message',
                            //   `3......Waiting for ${updateTicket.maxplayers} - ${updateTicket.participants.length} more users to buy this ticket`,
                            //   ticketId
                            // );
                            user.credit -= ticket.price;
                            const balance = user.credit;
                            user.creditHistory.push({
                                description: `Bought ${ticket.ticketName}`,
                                transaction: `-${ticket.price}`,
                                balance: `${balance}`,
                            });
                            const updateUser = yield this.userService.update(userId, user);
                            this.server.sockets.emit('receive', updateTicket.participants, ticketId);
                            this.server.sockets.emit('putCredit', updateUser.credit, updateUser.creditHistory, `${updateUser._id}`);
                            if (updateTicket.participants.length === updateTicket.maxplayers) {
                                // this.server.sockets.emit(
                                //   'message',
                                //   `4.....Waiting for ${updateTicket.maxplayers} - ${updateTicket.participants.length} more users to buy this tickets ticketstickkets`,
                                //   ticketId
                                // );
                                const d = new Date();
                                const interval = setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                    updateTicket.timer -= 1;
                                    this.server.sockets.emit('timer', updateTicket.timer, ticketId);
                                    if (updateTicket.timer === 0) {
                                        let winnerId = updateTicket.participants[Math.floor(Math.random() * updateTicket.maxplayers)];
                                        const idWinner = yield this.userService.get(winnerId);
                                        const previousWinnerName = updateTicket.ticketHistory[updateTicket.ticketHistory.length - 1].winner;
                                        const previousWinner = yield this.userService.findOne(previousWinnerName);
                                        if (previousWinner._id.equals(idWinner._id)) {
                                            winnerId =
                                                updateTicket.participants[Math.floor(Math.random() * updateTicket.maxplayers)];
                                        }
                                        const winner = yield this.userService.get(winnerId);
                                        this.server.sockets.emit('message', `${winner.username} you are the winner of `, ticketId, `${winner._id}`, data_1.messageEnum.winner);
                                        // const intvl = setInterval(() => {
                                        //   this.server.sockets.emit('winner', '', `${winner._id}`);
                                        //   clearInterval(intvl);
                                        // }, 5000);
                                        this.server.sockets.emit('message', `${winner.username} is the winner of `, ticketId, `${winner._id}`, data_1.messageEnum.message);
                                        // const intvl2 = setInterval(() => {
                                        //   this.server.sockets.emit('public', '', `${winner._id}`);
                                        //   clearInterval(intvl2);
                                        // }, 5000);
                                        winner.credit += ticket.price * ticket.maxplayers;
                                        const winnerBalance = winner.credit;
                                        winner.creditHistory.push({
                                            description: `Won ${ticket.ticketName}`,
                                            transaction: `+${ticket.price * ticket.maxplayers}`,
                                            balance: `${winnerBalance}`,
                                        });
                                        const winnerUpdated = yield this.userService.update(`${winner._id}`, winner);
                                        this.server.sockets.emit('putCredit', winnerUpdated.credit, winnerUpdated.creditHistory, `${winner._id}`);
                                        updateTicket.participants.splice(0, updateTicket.participants.length);
                                        updateTicket.ticketHistory.push({
                                            winner: `${winner.username}`,
                                            playedOn: `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
                                        });
                                        updateTicket.timer = 10;
                                        updateTicket = yield this.ticketService.update(`${updateTicket._id}`, updateTicket);
                                        this.server.sockets.emit('putTicketHistory', updateTicket.ticketHistory, ticketId);
                                        this.server.sockets.emit('receive', updateTicket.participants, ticketId);
                                        this.server.sockets.emit('timer', updateTicket.timer, ticketId);
                                        clearInterval(interval);
                                        return;
                                    }
                                    // updateTicket = await this.ticketService.update(
                                    //   `${updateTicket._id}`,
                                    //   updateTicket
                                    // );
                                }), 1000);
                            }
                        }
                        else {
                            this.server.sockets.emit('message', 'Ticket has made disabled. Please try after some time for ', ticketId, userId, data_1.messageEnum.invalid);
                        }
                    }
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
            // try {
            //   const ticket = await this.ticketService.get(ticketId);
            //   const activePlayers = ticket.participants.length;
            //   this.server.sockets.emit('receive', activePlayers);
            // } catch (error) {
            //   throw new InternalServerErrorException(error);
            // }
            // this.server.sockets.emit('receive', data);
            // console.log('connected');
        });
    }
    handleGetCredit(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.get(userId);
                this.server.sockets.emit('putCredit', user.credit, user.creditHistory, userId);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
};
tslib_1.__decorate([
    (0, websockets_1.WebSocketServer)(),
    tslib_1.__metadata("design:type", typeof (_d = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _d : Object)
], AppGateway.prototype, "server", void 0);
tslib_1.__decorate([
    (0, websockets_1.SubscribeMessage)('getTicketHistory'),
    tslib_1.__param(0, (0, websockets_1.MessageBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AppGateway.prototype, "handleTicketHistory", null);
tslib_1.__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    tslib_1.__param(0, (0, websockets_1.MessageBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppGateway.prototype, "handleJoin", null);
tslib_1.__decorate([
    (0, websockets_1.SubscribeMessage)('boughtTicket'),
    tslib_1.__param(0, (0, websockets_1.MessageBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppGateway.prototype, "handleBoughtTicket", null);
tslib_1.__decorate([
    (0, websockets_1.SubscribeMessage)('getCredit'),
    tslib_1.__param(0, (0, websockets_1.MessageBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AppGateway.prototype, "handleGetCredit", null);
AppGateway = tslib_1.__decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object, typeof (_c = typeof ticket_service_1.TicketService !== "undefined" && ticket_service_1.TicketService) === "function" ? _c : Object])
], AppGateway);
exports.AppGateway = AppGateway;


/***/ }),

/***/ "./apps/nest-api/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const app_controller_1 = __webpack_require__("./apps/nest-api/src/app/app.controller.ts");
const app_service_1 = __webpack_require__("./apps/nest-api/src/app/app.service.ts");
const user_module_1 = __webpack_require__("./apps/nest-api/src/app/user/user.module.ts");
const ticket_module_1 = __webpack_require__("./apps/nest-api/src/app/ticket/ticket.module.ts");
const auth_module_1 = __webpack_require__("./apps/nest-api/src/app/auth/auth.module.ts");
const app_gateway_1 = __webpack_require__("./apps/nest-api/src/app/app.gateway.ts");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            ticket_module_1.TicketModule,
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forRoot(process.env.NX_DB_ADDRESS),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_gateway_1.AppGateway],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/nest-api/src/app/app.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let AppService = class AppService {
    getData() {
        return { message: 'Welcome to nestaApi!' };
    }
};
AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/Guards/jwt-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/Guards/local-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
LocalAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/auth.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const create_user_dto_1 = __webpack_require__("./apps/nest-api/src/app/user/dto/create-user.dto.ts");
const auth_service_1 = __webpack_require__("./apps/nest-api/src/app/auth/auth.service.ts");
const local_auth_guard_1 = __webpack_require__("./apps/nest-api/src/app/auth/Guards/local-auth.guard.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(createUserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.authService.register(createUserDto);
        });
    }
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.authService.login(user);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const user_module_1 = __webpack_require__("./apps/nest-api/src/app/user/user.module.ts");
const auth_controller_1 = __webpack_require__("./apps/nest-api/src/app/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__("./apps/nest-api/src/app/auth/auth.service.ts");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const local_strategy_1 = __webpack_require__("./apps/nest-api/src/app/auth/strategies/local.strategy.ts");
const jwt_strategy_1 = __webpack_require__("./apps/nest-api/src/app/auth/strategies/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.NX_SECRET_KEY,
                signOptions: { expiresIn: '2 days' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/auth.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const user_service_1 = __webpack_require__("./apps/nest-api/src/app/user/user.service.ts");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const bcrypt = __webpack_require__("bcrypt");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    validateUser(username, pass) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findOne(username);
            if (!user) {
                throw new common_1.NotFoundException('Either your username or password is incorrect');
            }
            else {
                const passwordCompare = yield bcrypt.compare(pass, user.password);
                if (!passwordCompare) {
                    throw new common_1.BadRequestException('Either your username or password is incorrect');
                }
                else {
                    const { _id, username, isAdmin } = user;
                    return { _id, username, isAdmin };
                }
            }
        });
    }
    passwordEncryption(password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield bcrypt.hash(password, 10);
            if (!hashPassword) {
                throw new common_1.InternalServerErrorException('Password Encryption Is Not Working');
            }
            else {
                return hashPassword;
            }
        });
    }
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.validateUser(user.username, user.password);
            const payload = { username: user.username, sub: data._id };
            return {
                access_token: this.jwtService.sign(payload),
                username: user.username,
                id: data._id,
                isAdmin: data.isAdmin,
            };
        });
    }
    register(createUserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield this.passwordEncryption(createUserDto.password);
            const user = yield this.userService.create({
                username: createUserDto.username,
                password: hashPassword,
                credit: createUserDto.credit,
                isAdmin: createUserDto.isAdmin,
            });
            const newUser = {
                username: user.username,
                password: createUserDto.password,
            };
            return yield this.login(newUser);
        });
    }
};
AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/strategies/jwt.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_jwt_1 = __webpack_require__("passport-jwt");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.NX_SECRET_KEY,
        });
    }
    validate(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return { userId: payload.sub, username: payload.username };
        });
    }
};
JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),

/***/ "./apps/nest-api/src/app/auth/strategies/local.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_local_1 = __webpack_require__("passport-local");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./apps/nest-api/src/app/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    validate(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.validateUser(username, password);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            return user;
        });
    }
};
LocalStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),

/***/ "./apps/nest-api/src/app/ticket/dto/create-ticket.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTicketDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateTicketDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(50),
    tslib_1.__metadata("design:type", Number)
], CreateTicketDto.prototype, "price", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(2),
    tslib_1.__metadata("design:type", Number)
], CreateTicketDto.prototype, "maxplayers", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateTicketDto.prototype, "active", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], CreateTicketDto.prototype, "timer", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9 ]*$/),
    tslib_1.__metadata("design:type", String)
], CreateTicketDto.prototype, "ticketName", void 0);
exports.CreateTicketDto = CreateTicketDto;


/***/ }),

/***/ "./apps/nest-api/src/app/ticket/dto/update-ticket.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTicketDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class UpdateTicketDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(50),
    tslib_1.__metadata("design:type", Number)
], UpdateTicketDto.prototype, "price", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(2),
    tslib_1.__metadata("design:type", Number)
], UpdateTicketDto.prototype, "maxplayers", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateTicketDto.prototype, "active", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], UpdateTicketDto.prototype, "timer", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9 ]*$/),
    tslib_1.__metadata("design:type", String)
], UpdateTicketDto.prototype, "ticketName", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], UpdateTicketDto.prototype, "participants", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], UpdateTicketDto.prototype, "ticketHistory", void 0);
exports.UpdateTicketDto = UpdateTicketDto;


/***/ }),

/***/ "./apps/nest-api/src/app/ticket/ticket.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__("./apps/nest-api/src/app/auth/Guards/jwt-auth.guard.ts");
const create_ticket_dto_1 = __webpack_require__("./apps/nest-api/src/app/ticket/dto/create-ticket.dto.ts");
const update_ticket_dto_1 = __webpack_require__("./apps/nest-api/src/app/ticket/dto/update-ticket.dto.ts");
const ticket_service_1 = __webpack_require__("./apps/nest-api/src/app/ticket/ticket.service.ts");
let TicketController = class TicketController {
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    create(createTicketDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ticketService.create(createTicketDto);
        });
    }
    getTickets() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ticketService.getAll();
        });
    }
    getTicket(ticketId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ticketService.get(ticketId);
        });
    }
    updateTicket(ticketId, updateTicketDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ticketService.updateByAdmin(ticketId, updateTicketDto);
        });
    }
    deleteUser(ticketId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ticketService.delete(ticketId);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_ticket_dto_1.CreateTicketDto !== "undefined" && create_ticket_dto_1.CreateTicketDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "getTickets", null);
tslib_1.__decorate([
    (0, common_1.Get)(':ticketId'),
    tslib_1.__param(0, (0, common_1.Param)('ticketId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "getTicket", null);
tslib_1.__decorate([
    (0, common_1.Put)(':ticketId'),
    tslib_1.__param(0, (0, common_1.Param)('ticketId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof update_ticket_dto_1.UpdateTicketDto !== "undefined" && update_ticket_dto_1.UpdateTicketDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "updateTicket", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':ticketId'),
    tslib_1.__param(0, (0, common_1.Param)('ticketId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "deleteUser", null);
TicketController = tslib_1.__decorate([
    (0, common_1.Controller)('ticket'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof ticket_service_1.TicketService !== "undefined" && ticket_service_1.TicketService) === "function" ? _a : Object])
], TicketController);
exports.TicketController = TicketController;


/***/ }),

/***/ "./apps/nest-api/src/app/ticket/ticket.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const ticket_schema_1 = __webpack_require__("./apps/nest-api/src/app/Schemas/ticket.schema.ts");
const ticket_controller_1 = __webpack_require__("./apps/nest-api/src/app/ticket/ticket.controller.ts");
const ticket_service_1 = __webpack_require__("./apps/nest-api/src/app/ticket/ticket.service.ts");
let TicketModule = class TicketModule {
};
TicketModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'ticket', schema: ticket_schema_1.ticketSchema }]),
        ],
        controllers: [ticket_controller_1.TicketController],
        providers: [ticket_service_1.TicketService],
        exports: [ticket_service_1.TicketService],
    })
], TicketModule);
exports.TicketModule = TicketModule;


/***/ }),

/***/ "./apps/nest-api/src/app/ticket/ticket.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
let TicketService = class TicketService {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    checkId(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID');
        }
    }
    create(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = new this.ticketModel({
                    price: body.price,
                    maxplayers: body.maxplayers,
                    ticketName: body.ticketName,
                    active: body.active,
                    timer: body.timer,
                });
                const savedTicket = yield ticket.save();
                const { _id, ticketName } = savedTicket;
                return { _id, ticketName };
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new common_1.BadRequestException('Ticket Already Exist');
                }
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketModel.find();
                if (!tickets || tickets.length === 0) {
                    throw new common_1.NotFoundException('Tickets Not Found');
                }
                else {
                    return tickets;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    get(ticketId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.checkId(ticketId);
            try {
                const ticket = yield this.ticketModel.findById(ticketId);
                if (!ticket) {
                    throw new common_1.NotFoundException('Ticket Not Found');
                }
                else {
                    return ticket;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    updateByAdmin(ticketId, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ticketBeforeUpdate = yield this.get(ticketId);
            if (ticketBeforeUpdate.participants.length === 0) {
                yield this.update(ticketId, body);
            }
            else {
                throw new common_1.BadRequestException('Ticket contain some participants');
            }
        });
    }
    update(ticketId, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.checkId(ticketId);
            try {
                const ticket = yield this.ticketModel.findByIdAndUpdate(ticketId, {
                    $set: Object.assign({}, body),
                }, { new: true });
                if (!ticket) {
                    throw new common_1.NotFoundException('Ticket Not Found');
                }
                else {
                    return ticket;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    // async updatePriority(ticketId: string, body: UpdateTicketDto) {
    //   try {
    //     const ticket = await this.update(ticketId, body);
    //     const { ticketName, priority } = ticket;
    //     return { ticketName, priority };
    //   } catch (error) {
    //     throw new InternalServerErrorException(error);
    //   }
    // }
    delete(ticketId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ticketBeforeDelete = yield this.get(ticketId);
            if (ticketBeforeDelete.participants.length === 0 &&
                !ticketBeforeDelete.active) {
                try {
                    const ticket = yield this.ticketModel.findByIdAndDelete(ticketId);
                    if (!ticket) {
                        throw new common_1.NotFoundException('Ticket Not Found');
                    }
                    else {
                        return { msg: 'Ticket Deleted Successfully' };
                    }
                }
                catch (error) {
                    throw new common_1.InternalServerErrorException(error);
                }
            }
            else {
                throw new common_1.BadRequestException(ticketBeforeDelete.participants.length === 0
                    ? 'Ticket is Active. Please make inactive first'
                    : 'Ticket contain some participants');
            }
        });
    }
};
TicketService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)('ticket')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TicketService);
exports.TicketService = TicketService;


/***/ }),

/***/ "./apps/nest-api/src/app/user/dto/create-user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateUserDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z_]*$/),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/(?=.*[a-z])/),
    (0, class_validator_1.Matches)(/(?=.*[A-Z])/),
    (0, class_validator_1.Matches)(/(?=.*\d)/),
    (0, class_validator_1.Matches)(/(?=.*[@$!%*#?&])/),
    (0, class_validator_1.Matches)(/^\S*$/),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], CreateUserDto.prototype, "credit", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateUserDto.prototype, "isAdmin", void 0);
exports.CreateUserDto = CreateUserDto;


/***/ }),

/***/ "./apps/nest-api/src/app/user/dto/update-user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class UpdateUserDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(20),
    tslib_1.__metadata("design:type", String)
], UpdateUserDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    tslib_1.__metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], UpdateUserDto.prototype, "credit", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isAdmin", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], UpdateUserDto.prototype, "creditHistory", void 0);
exports.UpdateUserDto = UpdateUserDto;


/***/ }),

/***/ "./apps/nest-api/src/app/user/user.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const user_service_1 = __webpack_require__("./apps/nest-api/src/app/user/user.service.ts");
const create_user_dto_1 = __webpack_require__("./apps/nest-api/src/app/user/dto/create-user.dto.ts");
const update_user_dto_1 = __webpack_require__("./apps/nest-api/src/app/user/dto/update-user.dto.ts");
const jwt_auth_guard_1 = __webpack_require__("./apps/nest-api/src/app/auth/Guards/jwt-auth.guard.ts");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.create(createUserDto);
        });
    }
    getUsers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.getAll();
        });
    }
    getUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.get(userId);
        });
    }
    updateUser(userId, updateUserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.addCredit(userId, updateUserDto);
        });
    }
    deleteUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userService.delete(userId);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':userId'),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':userId'),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':userId'),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = tslib_1.__decorate([
    (0, common_1.Controller)('user'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);
exports.UserController = UserController;


/***/ }),

/***/ "./apps/nest-api/src/app/user/user.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const user_schema_1 = __webpack_require__("./apps/nest-api/src/app/Schemas/user.schema.ts");
const user_controller_1 = __webpack_require__("./apps/nest-api/src/app/user/user.controller.ts");
const user_service_1 = __webpack_require__("./apps/nest-api/src/app/user/user.service.ts");
let UserModule = class UserModule {
};
UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'user', schema: user_schema_1.userSchema }])],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;


/***/ }),

/***/ "./apps/nest-api/src/app/user/user.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const mongoose = __webpack_require__("mongoose");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    checkId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID');
        }
    }
    create(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const user = new this.userModel({
                    username: body.username,
                    password: body.password,
                    credit: body.credit,
                    isAdmin: body.isAdmin,
                    creditHistory: [
                        {
                            description: 'Initialized Credit',
                            transaction: '+1000',
                            balance: '1000',
                        },
                    ],
                });
                const savedUser = yield user.save();
                const { _id, username } = savedUser;
                // status: true,
                return { _id, username };
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new common_1.BadRequestException('User Already Exist');
                    // return { status: false, message: 'User Already Exist' };
                }
                throw new common_1.InternalServerErrorException(error);
                // return { status: false, message: error };
            }
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userModel.find();
                if (!users || users.length === 0) {
                    throw new common_1.NotFoundException('Users Not Found');
                }
                else {
                    return users;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    get(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.checkId(userId);
            try {
                const user = yield this.userModel.findById(userId);
                if (!user) {
                    throw new common_1.NotFoundException('User Not Found');
                }
                else {
                    return user;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    findOne(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.findOne({ username: username });
                if (!user) {
                    // throw new NotFoundException('User Not Found');
                    return null;
                }
                else {
                    return user;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    update(userId, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // this.checkId(userId);
            try {
                const user = yield this.userModel.findByIdAndUpdate(userId, {
                    $set: Object.assign({}, body),
                }, { new: true });
                if (!user) {
                    throw new common_1.NotFoundException('User Not Found');
                }
                else {
                    return user;
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    addCredit(userId, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.checkId(userId);
            try {
                const user = yield this.get(userId);
                user.credit += body.credit;
                const balance = user.credit;
                user.creditHistory.push({
                    description: 'Added by Admin',
                    transaction: `+${body.credit}`,
                    balance: `${balance}`,
                });
                const updateUser = yield this.update(userId, user);
                const { _id, credit, username } = updateUser;
                return { _id, username, credit };
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    delete(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.checkId(userId);
            try {
                const user = yield this.userModel.findByIdAndDelete(userId);
                if (!user) {
                    throw new common_1.NotFoundException('User Not Found');
                }
                else {
                    return { msg: 'User Deleted Successfully' };
                }
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
};
UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)('user')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserService);
exports.UserService = UserService;


/***/ }),

/***/ "./libs/data/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/data/src/lib/data.ts"), exports);


/***/ }),

/***/ "./libs/data/src/lib/data.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.messageEnum = exports.data = void 0;
function data() {
    return 'data';
}
exports.data = data;
var messageEnum;
(function (messageEnum) {
    messageEnum[messageEnum["winner"] = 0] = "winner";
    messageEnum[messageEnum["invalid"] = 1] = "invalid";
    messageEnum[messageEnum["message"] = 2] = "message";
})(messageEnum = exports.messageEnum || (exports.messageEnum = {}));


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/websockets":
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),

/***/ "bcrypt":
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-jwt":
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "socket.io":
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const app_module_1 = __webpack_require__("./apps/nest-api/src/app/app.module.ts");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        // const globalPrefix = 'api';
        // app.setGlobalPrefix(globalPrefix);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
        }));
        app.enableCors({
            origin: [`${process.env.NX_FRONT}`, `${process.env.NX_FRONTEND}`],
            credentials: true,
        });
        const port = process.env.PORT || 3340;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map