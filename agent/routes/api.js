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

router.post('/signup', async (ctx, next) => {
    console.log(ctx.request.body);
    const token = ctx.get('x-xsrf-signuptoken');
    if (ctx.session.signup.token !== token) {
        // Invalid token
        ctx.status = 400;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'token error',
        });
        return;
    }
    const salt = await bcrypt.genSalt(15);
    const cipher = await bcrypt.hash(ctx.request.body.password, salt);
    ctx.body = JSON.stringify({
        token: ctx.session.signup.token,
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
