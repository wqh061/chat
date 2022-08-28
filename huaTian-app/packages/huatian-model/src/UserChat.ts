import { User } from './User';
import { Message, MessageStatus, MessageType } from './Message';
import { ChatSession } from './ChatSession';

export class UserChat {
  private user: User;
  private msgs: Array<Message> = [];
  private sessions: Record<number, ChatSession> = {};

  constructor(user: User) {
    this.user = user;
  }

  public createChatSession(to: User) {
    if (this.sessions[to.id]) {
      return this.sessions[to.id];
    }
    const session = new ChatSession(this.user, to);
    this.sessions[to.id] = session;
    return session;
  }

  public send(msg: Message) {
    this.msgs.push(msg);
    msg.status = MessageStatus.SENT;
    msg.type = MessageType.SEND;
  }

  public receive(msg: Message) {
    this.msgs.push(msg);
    msg.status = MessageStatus.RECEIVING;
    msg.type = MessageType.RECEIVED;
  }

  public readTo(lastId: number) {
    const readeds = this.msgs.filter(
      (m) => m.id <= lastId && m.status === MessageStatus.RECEIVED,
    );
    readeds.forEach((m) => (m.status = MessageStatus.READED));
  }

  public unReadMessage(lastId: number) {
    // client 缓存最后一条已读消息的id
    return this.msgs.filter((m) => m.id > lastId);
  }
}
