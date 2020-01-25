import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
const ObjectID = require('mongodb').ObjectID;
type ObjectID = typeof import('mongodb').ObjectID;
import { Container } from 'typedi';
import { IDue } from '../../interfaces/IDue';
import { celebrate, Joi } from 'celebrate';
import DueService from '../../services/due';
import AuthService from '../../services/auth';
import UserService from '../../services/user';
const route = Router();

export default (app: Router) => {
  app.use('/admin', route);

  route.post(
    '/assign-mess',
    celebrate({
      body: Joi.object({
        rollNumber: Joi.string().required(),
        mess: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      // get the corresponding user and updateMess Property
      const userServiceInstance = Container.get(UserService);
      const messsage = await userServiceInstance.updateMess(req.body);
      res.send(messsage);
    },
  );
  route.get(
    '/list-people-without-mess',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      // get the corresponding user and updateMess Property
      const userServiceInstance = Container.get(UserService);
      const messsage = await userServiceInstance.listPeopleWithoutMess();
      res.send(messsage);
    },
  );

  route.delete(
    '/remove-from-mess',
    celebrate({
      body: Joi.object({
        rollNumber: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      // get the corresponding user and updateMess Property
      const userServiceInstance = Container.get(UserService);
      const messsage = await userServiceInstance.removeMess(req.body);
      res.send(messsage);
    },
  );

  // list all the users who does not have mess && is !admin
};
