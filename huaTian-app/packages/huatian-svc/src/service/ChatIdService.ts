import { ChatIDSetDao } from '../dao/Dao';
import { DB } from '../dao/DB';

const STEP = 10000;

export class ChatIdService {
  private static inst: ChatIdService = new ChatIdService();

  private id_base: number = -1;
  private id_start: number = 0;

  public static getInstance(): ChatIdService {
    return ChatIdService.inst;
  }

  /**
   * 每次拿到的是一个集合的id
   * 比如：0~999
   */
  private async requestIdSet() {
    if (this.id_base >= this.id_start && this.id_base < this.id_start + STEP)
      return;
    const sequelize = DB.getSequelize();
    const transction = await sequelize.transaction();

    try {
      const lastRecord = await ChatIDSetDao.findOne({
        order: [['id', 'desc']],
        lock: transction.LOCK.UPDATE, // 加一把锁防止并发请求id
      });

      const startNumber = lastRecord
        ? lastRecord.getDataValue('start') + 10000
        : 0;
      await ChatIDSetDao.create({
        app: 'test',
        start: startNumber,
      });
      this.id_start = startNumber;
      this.id_base = startNumber;
    } catch (ex) {
      console.error(ex);
      transction.rollback();
    }
  }

  public async getId() {
    await this.requestIdSet();
    return this.id_base++;
  }
}
