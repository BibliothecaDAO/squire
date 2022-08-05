import { Router } from 'express';
import BriqRouter from './briq';
import DesiegeRouter from './desiege';
import IndexerRouter from './indexer';

const apiRouter = Router();

apiRouter.use('/', BriqRouter);
apiRouter.use('/', DesiegeRouter);
apiRouter.use('/', IndexerRouter)

export default  apiRouter
