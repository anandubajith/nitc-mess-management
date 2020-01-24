import { Container } from 'typedi';

const isAdmin = async (req, res, next) => {
  const Logger = Container.get('logger');
  if (req.currentUser.role === 'admin') {
    Logger.info('🔥 Welcome admin');
    return next();
  } else {
    return res.status(403).send();
  }
};
export default isAdmin;
