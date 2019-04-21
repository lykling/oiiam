/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file router index
 * @author Pride Leong<lykling.lyk@gmail.com>
 */

import session from 'koa-session';
import Router from 'koa-router';

import apiRouter from './api';
import staticRouter from './static';

const router = new Router();

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
router.use(staticRouter.routes(), staticRouter.allowedMethods());

export default router;
