import { Message } from './Message';
import { User } from './User';

export class ChatSession {
  private from: User;
  private to: User;
  public constructor(from: User, to: User) {
    this.from = from;
    this.to = to;
  }

  public chat(sentMsg: Message, receiveMsg: Message) {
    this.from.chat().send(sentMsg);
    this.to.chat().receive(receiveMsg);
  }
}
