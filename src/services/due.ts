import { Service, Inject } from 'typedi';
import MailerService from './mailer';
import { IUser } from '../interfaces/IUser';
import { IDue } from '../interfaces/IDue';
const ObjectID = require('mongodb').ObjectID;
type ObjectID = typeof import('mongodb').ObjectID;
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';

@Service()
export default class DueService {
  constructor(
    @Inject('dueModel') private dueModel: Models.DueModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async addDue(due: IDue): Promise<{ message: string }> {
    try {
      this.logger.silly(due);
      const dueRecord = await this.dueModel.create({
        ...due,
      });
      if (!dueRecord) {
        return { message: 'Failed to save' };
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
    return { message: 'Save success' };
  }
  public async listDues(user: IUser): Promise<{ dues: any[] }> {
    // this.logger.info(JSON.stringify(user));
    const dues = await this.dueModel.find({ rollNumber: user.rollNumber });
    return { dues };
  }
  public async listAllDues(): Promise<{ data: any[] }> {
    // TODO: optimize this query
    let data = await this.dueModel.aggregate([
      { $group: { _id: '$rollNumber', total: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'rollNumber',
          as: 'name',
        },
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$name', 0] }, '$$ROOT'] } },
      },
      { $project: { name: 0, salt: 0, password: 0, __v: 0, createdAt: 0, updatedAt: 0, role: 0, _id: 0 } },
      { $sort: { total: -1 } },
    ]);
    return { data };
  }
  public async removeDue(id: ObjectID): Promise<{ message: string }> {
    try {
      this.logger.silly('Removing due');
      const r = await this.dueModel.deleteOne({ _id: id });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
    return { message: 'Delete success' };
  }
}
