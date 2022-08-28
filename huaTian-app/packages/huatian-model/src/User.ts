import { UserChat } from './UserChat';

export class User {
  private _id: number;
  private _chat: UserChat;

  public constructor(id: number) {
    this._id = id;
    this._chat = new UserChat(this);
  }

  get id() {
    return this._id;
  }
  set id(id: number) {
    this._id = id;
  }

  public chat() {
    return this._chat;
  }
}
