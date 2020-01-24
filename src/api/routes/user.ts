import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import DueService from '../../services/due';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });

  route.get('/dues', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const dueServiceInstance = Container.get(DueService);
    const { dues } = await dueServiceInstance.listDues(req.currentUser as User);
    return res.json(dues).status(200);
  });
};
