import { Message } from '@huatian/model';
import { UserRepository } from '../repo/UserRepository';
import { ChatIdService } from '../service/ChatIdService';

export class ChatContext {
  private static inst: ChatContext = new ChatContext();
  private repo: UserRepository = UserRepository.getInstance();

  public static getInstance() {
    return ChatContext.inst;
  }

  public async send(uid: number, msg: Message) {
    const sentMsg = { ...msg };
    const toReceiveMsg = { ...msg };
    sentMsg.id = await ChatIdService.getInstance().getId();
    toReceiveMsg.id = await ChatIdService.getInstance().getId();

    msg.from = uid;
    const from = this.repo.getUser(msg.from);
    const to = this.repo.getUser(msg.to);
    const session = from.chat().createChatSession(to);
    session.chat(sentMsg, toReceiveMsg);
    return sentMsg.id;
  }

  public async read(uid: number, lastId: number) {
    const user = this.repo.getUser(uid);
    return user.chat().unReadMessage(lastId);
  }
}
