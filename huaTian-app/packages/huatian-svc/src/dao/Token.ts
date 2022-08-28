import crypto from 'crypto';

type TokenObj = {
  uid: number;
  token: string;
  expires: number;
};

export class Token {
  static inst: Token = new Token();

  private cache: Record<string, TokenObj> = {};

  static getInstance() {
    return Token.inst;
  }
  private create(uid: number) {
    const token = Math.random() + '-' + new Date().getTime();
    const expires = new Date().getTime() + 3600 * 24;
    const sha = crypto.createHash('sha1');
    sha.update(token);
    const hash = sha.digest('hex');
    const tokenObj = {
      uid,
      token: hash,
      expires,
    };
    this.cacheSet(hash, tokenObj);
    return tokenObj;
  }

  private cacheSet(hash: string, token: TokenObj) {
    this.cache[hash] = token;
  }
  private cacheGet(hash: string) {
    return this.cache[hash] || null;
  }
  public refreshToken(uid: number) {
    return this.create(uid);
  }
  public getToken(hash: string) {
    const token = this.cacheGet(hash);
    if (!token) return null;
    if (token.expires > new Date().getTime()) return token;
    return null;
  }
}
