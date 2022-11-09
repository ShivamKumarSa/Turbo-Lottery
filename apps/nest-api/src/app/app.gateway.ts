import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Server } from 'socket.io';
import { TicketService } from './ticket/ticket.service';
import { InternalServerErrorException } from '@nestjs/common';
import { messageEnum } from '@turbo-lottery/data';

@WebSocketGateway({ cors: true })
export class AppGateway {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly ticketService: TicketService
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getTicketHistory')
  async handleTicketHistory(@MessageBody() TicketId: string | null) {
    try {
      const ticket = await this.ticketService.get(TicketId);
      this.server.sockets.emit(
        'putTicketHistory',
        ticket.ticketHistory,
        TicketId
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody()
    { userId, ticketId }: { userId: string | null; ticketId: string | null }
  ) {
    try {
      const ticket = await this.ticketService.get(ticketId);

      this.server.sockets.emit('receive', ticket.participants, ticketId);

      const user = await this.userService.get(userId);
      this.server.sockets.emit(
        'putCredit',
        user.credit,
        user.creditHistory,
        userId
      );
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    // this.server.sockets.emit('receive', data);
    // console.log('connected');
  }

  @SubscribeMessage('boughtTicket')
  async handleBoughtTicket(
    @MessageBody()
    { userId, ticketId }: { userId: string | null; ticketId: string | null }
  ) {
    try {
      const ticket = await this.ticketService.get(ticketId);
      const user = await this.userService.get(userId);
      //   console.log(userId);

      //   console.log(ticket);
      if (ticket.participants.length >= ticket.maxplayers) {
        this.server.sockets.emit(
          'message',
          `Players are full for `,
          ticketId,
          userId,
          messageEnum.invalid
        );
        // const intvl = setInterval(() => {
        //   this.server.sockets.emit('message', '', ticketId, userId);
        //   clearInterval(intvl);
        // }, 10000);
      } else {
        if (ticket.participants.includes(userId)) {
          this.server.sockets.emit(
            'message',
            `You are already a part of`,
            ticketId,
            userId,
            messageEnum.invalid
          );

          // const intvl = setInterval(() => {
          //   this.server.sockets.emit('message', '', ticketId, userId);
          //   clearInterval(intvl);
          // }, 10000);
        } else {
          // if (ticket.participants.length === 0) {
          //   // this.server.sockets.emit('winner', '');
          //   this.server.sockets.emit('public', '');
          // }
          if (ticket.active) {
            if (user.credit < ticket.price) {
              this.server.sockets.emit(
                'message',
                `You have less money to buy`,
                ticketId,
                userId,
                messageEnum.invalid
              );
              return;
            }
            ticket.participants.push(userId);
            let updateTicket = await this.ticketService.update(
              ticketId,
              ticket
            );
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

            const updateUser = await this.userService.update(userId, user);
            this.server.sockets.emit(
              'receive',
              updateTicket.participants,
              ticketId
            );
            this.server.sockets.emit(
              'putCredit',
              updateUser.credit,
              updateUser.creditHistory,
              `${updateUser._id}`
            );
            if (updateTicket.participants.length === updateTicket.maxplayers) {
              // this.server.sockets.emit(
              //   'message',
              //   `4.....Waiting for ${updateTicket.maxplayers} - ${updateTicket.participants.length} more users to buy this tickets ticketstickkets`,
              //   ticketId
              // );
              const d = new Date();
              const interval = setInterval(async () => {
                updateTicket.timer -= 1;
                this.server.sockets.emit('timer', updateTicket.timer, ticketId);
                if (updateTicket.timer === 0) {
                  let winnerId =
                    updateTicket.participants[
                      Math.floor(Math.random() * updateTicket.maxplayers)
                    ];

                  const idWinner = await this.userService.get(winnerId);

                  const previousWinnerName =
                    updateTicket.ticketHistory[
                      updateTicket.ticketHistory.length - 1
                    ].winner;

                  const previousWinner = await this.userService.findOne(
                    previousWinnerName
                  );

                  if (previousWinner._id.equals(idWinner._id)) {
                    winnerId =
                      updateTicket.participants[
                        Math.floor(Math.random() * updateTicket.maxplayers)
                      ];
                  }

                  const winner = await this.userService.get(winnerId);

                  this.server.sockets.emit(
                    'message',
                    `${winner.username} you are the winner of `,
                    ticketId,
                    `${winner._id}`,
                    messageEnum.winner
                  );
                  // const intvl = setInterval(() => {
                  //   this.server.sockets.emit('winner', '', `${winner._id}`);
                  //   clearInterval(intvl);
                  // }, 5000);

                  this.server.sockets.emit(
                    'message',
                    `${winner.username} is the winner of `,
                    ticketId,
                    `${winner._id}`,
                    messageEnum.message
                  );
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

                  const winnerUpdated = await this.userService.update(
                    `${winner._id}`,
                    winner
                  );

                  this.server.sockets.emit(
                    'putCredit',
                    winnerUpdated.credit,
                    winnerUpdated.creditHistory,
                    `${winner._id}`
                  );

                  updateTicket.participants.splice(
                    0,
                    updateTicket.participants.length
                  );

                  updateTicket.ticketHistory.push({
                    winner: `${winner.username}`,
                    playedOn: `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
                  });
                  updateTicket.timer = 10;
                  updateTicket = await this.ticketService.update(
                    `${updateTicket._id}`,
                    updateTicket
                  );

                  this.server.sockets.emit(
                    'putTicketHistory',
                    updateTicket.ticketHistory,
                    ticketId
                  );

                  this.server.sockets.emit(
                    'receive',
                    updateTicket.participants,
                    ticketId
                  );
                  this.server.sockets.emit(
                    'timer',
                    updateTicket.timer,
                    ticketId
                  );
                  clearInterval(interval);
                  return;
                }

                // updateTicket = await this.ticketService.update(
                //   `${updateTicket._id}`,
                //   updateTicket
                // );
              }, 1000);
            }
          } else {
            this.server.sockets.emit(
              'message',
              'Ticket has made disabled. Please try after some time for ',
              ticketId,
              userId,
              messageEnum.invalid
            );
          }
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
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
  }

  @SubscribeMessage('getCredit')
  async handleGetCredit(@MessageBody() userId: string | null) {
    try {
      const user = await this.userService.get(userId);
      this.server.sockets.emit(
        'putCredit',
        user.credit,
        user.creditHistory,
        userId
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
