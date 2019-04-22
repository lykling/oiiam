/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file api route
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
import Router from 'koa-router';
import bcrypt from 'bcrypt';
import bodyparser from 'koa-bodyparser';

const router = new Router();

router.post('/*', bodyparser({
}));

// Check xsrf token first
router.post('/*', async (ctx, next) => {
    const token = ctx.get('x-xsrf-token');
    if (ctx.session.xsrf.token !== token) {
        // Invalid token
        ctx.status = 400;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'xsrf token error',
        });
        return;
    }
    await next();
});

router.post('/signin', async (ctx, next) => {
    ctx.body = JSON.stringify({
        token: ctx.session.xsrf.token,
        referer: ctx.get('referer'),
        code: 0,
    });
});

router.post('/signup', async (ctx, next) => {
    const salt = await bcrypt.genSalt(15);
    const cipher = await bcrypt.hash(ctx.request.body.password, salt);
    ctx.body = JSON.stringify({
        token: ctx.session.xsrf.token,
        password: ctx.request.body.password,
        salt: salt,
        cipher: cipher,
        code: 0,
    });
});
router.post('/signin', async (ctx, next) => {
    await next();
});

export default router;
