import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IDue } from '../../interfaces/IDue';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type DueModel = Model<IDue & Document>;
  }
}
