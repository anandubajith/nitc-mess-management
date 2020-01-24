import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
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
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      const dueServiceInstance = Container.get(DueService);
      const { message } = await dueServiceInstance.addDue(req.body as Due);
      return res.json({ success: message }).status(200);
    },
  );
};
