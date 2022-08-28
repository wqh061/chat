import { User } from '@huatian/model';

export class UserRepository {
  private users: Record<number, User> = {};

  private static inst = new UserRepository();

  public getUser(uid: number): User;
  public getUser(user: string, pwd: string): User;
  public getUser(identity: number | string, pwd?: string): User {
    if (typeof identity === 'number') {
      const uid = identity;
      if (this.users[uid]) {
        return this.users[uid];
      }
      const newUser = new User(uid);
      this.users[uid] = newUser;
      return newUser;
    }
    const user = identity;
    const idmap = {
      zhangsan: 1,
      lisi: 2,
      wangwu: 3,
    };
    return this.getUser(idmap[user] || 1);
  }
  public static getInstance() {
    return UserRepository.inst;
  }
}
