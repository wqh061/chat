import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { AccountContext } from './context/AccountContext';
import { Token } from './dao/Token';
import { ChatContext } from './context/ChatContext';
import { Message } from '@huatian/model';

const app = express();
app.use(cookieParser());

type LoggedInRequest = Request & { uid: number };

async function token(req: LoggedInRequest, res: Response, next: NextFunction) {
  const tokenHash = req.cookies['x-token'];
  const token = Token.getInstance();
  const tokenObject = token.getToken(tokenHash.token);

  if (tokenObject === null) {
    res.status(401).send({
      success: false,
    });
    return;
  }
  req.uid = tokenObject.uid;
  next();
}

function sendStdResponse<T>(res: Response, f: T);
function sendStdResponse(res: Response, f: Promise<any>);
function sendStdResponse(res: Response, f: () => Promise<any>);

async function sendStdResponse(res: Response, f: any) {
  let data = typeof f === 'function' ? f() : f;
  try {
    if (data instanceof Promise) {
      data = await data;
    }
    res.send({
      success: true,
      data,
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
}

app.get('/foo', token, (req: LoggedInRequest, res: Response) => {
  res.send(req.uid + '_ok');
});

app.post('/token', express.json(), async (req, res) => {
  const { uname, pwd } = req.body;
  const account = AccountContext.getInstance();
  const user = await account.verify(uname, pwd);
  const token = Token.getInstance();
  const tokenObj = token.refreshToken(user.id);

  res.cookie('x-token', tokenObj);
  sendStdResponse(res, 'ok');
});

app.post(
  '/message',
  token,
  express.json(),
  async (req: LoggedInRequest, res) => {
    const uid = req.uid;
    const chatContext = ChatContext.getInstance();
    sendStdResponse(res, async () => {
      return await chatContext.send(uid, req.body as Message);
    });
  },
);

app.get('/message', token, async (req: LoggedInRequest, res) => {
  const uid = req.uid;
  const lastId = parseInt(req.query.last_id as string) || 0;
  console.log({ uid, lastId });

  const chatContext = ChatContext.getInstance();
  sendStdResponse(res, () => {
    return chatContext.read(uid, lastId);
  });
});

app.listen(6001, () => {
  console.log(`6001端口监听中`);
});
