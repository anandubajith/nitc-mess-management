import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import due from './routes/due';
import agendash from './routes/agendash';
import admin from './routes/admin';
// import due from '../models/due';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  due(app);
  admin(app);
  agendash(app);

  return app;
};
