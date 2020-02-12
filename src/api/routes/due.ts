import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
const ObjectID = require('mongodb').ObjectID;
type ObjectID = typeof import('mongodb').ObjectID;
import { Container } from 'typedi';
import { IDue } from '../../interfaces/IDue';
import { celebrate, Joi } from 'celebrate';
import DueService from '../../services/due';
const route = Router();

export default (app: Router) => {
  app.use('/dues', route);

  route.post(
    '/add',
    celebrate({
      body: Joi.object({
        rollNumber: Joi.string().required(),
        amount: Joi.number().required(),
        message: Joi.string().required(),
        date: Joi.number().required(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      const dueServiceInstance = Container.get(DueService);
      const { message } = await dueServiceInstance.addDue(req.body as IDue);
      return res.json({ success: message }).status(200);
    },
  );
  route.get(
    '/list',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      const dueServiceInstance = Container.get(DueService);
      const { data } = await dueServiceInstance.listAllDues(req.currentUser.mess);
      return res.json(data);
    },
  );
  route.post(
    '/messcut',
    celebrate({
      body: Joi.object({
        rollNumber: Joi.string().required(),
        start: Joi.number().required(),
        end: Joi.number().required(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      const dueServiceInstance = Container.get(DueService);
      const data = await dueServiceInstance.setMessCut(req.body.rollNumber, req.body.start, req.body.end);
      return data;
    },
  );
  route.delete(
    '/delete',
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      const dueServiceInstance = Container.get(DueService);
      const { message } = await dueServiceInstance.removeDue(req.body._id as ObjectID);
      return res.json({ success: message });
    },
  );
};
