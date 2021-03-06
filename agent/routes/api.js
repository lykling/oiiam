/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file api route
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
import Router from 'koa-router';
import bcrypt from 'bcrypt';
import bodyparser from 'koa-bodyparser';
import * as hydra from '../../lib/hydra';
import _ from 'lodash';
import {User} from '../../lib/modules';

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
    // Check if credentials valid

    const user = await User.findOne({
        where: {email: ctx.request.body.email}
    });
    if (user == null) {
        ctx.status = 500;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'login failed, email not exists or password mismatch',
            error: null,
        });
        return;
    }
    const cmpRes = await bcrypt.compare(ctx.request.body.password, user.password);
    if (!cmpRes) {
        ctx.status = 500;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'login failed, email not exists or password mismatch',
            error: null,
        });
        return;
    }

    // Authenticated, communicate to hydra
    const referer = new URL(ctx.get('referer'));
    const challenge = referer.searchParams.get('login_challenge');
    try {
        const response = await hydra.acceptLoginRequest({challenge}, {
            subject: ctx.request.body.email,
            remember: ctx.request.body.remember,
            remember_for: 3600,
        });
        ctx.body = JSON.stringify({
            code: 0,
            message: 'success',
            data: response.data,
        });
    }
    catch (err) {
        ctx.body = 500;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'login error',
            error: null,
        });
    }
});

router.post('/signup', async (ctx, next) => {
    const salt = await bcrypt.genSalt(15);
    const cipher = await bcrypt.hash(ctx.request.body.password, salt);
    const user = User.build({
        email: ctx.request.body.email,
        password: cipher,
    });
    try {
        await user.save();
        ctx.body = JSON.stringify({
            code: 0,
            message: 'signup success',
            error: null,
        });
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'signup failed',
            error: null,
        });
    }
});

router.post('/hydra/:method', async (ctx, next) => {
    try {
        const response = await _.get(hydra, ctx.params.method, _.noop)(ctx.query, ctx.request.body);
        ctx.body = response.data;
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = err.response;
    }
});

export default router;
