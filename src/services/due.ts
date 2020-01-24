import { Service, Inject } from 'typedi';
import MailerService from './mailer';
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

  public async addDue(due: Due): Promise<{ message: string }> {
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
  public async listDues(user: User): Promise<{ dues: any[] }> {
    // this.logger.info(JSON.stringify(user));
    const dues = await this.dueModel.find({ rollNumber: user.rollNumber });
    return { dues };
  }
}
