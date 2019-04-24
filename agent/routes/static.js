/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file static router
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
import path from 'path';
import Router from 'koa-router';
import serve from 'koa-static';
import uuid from 'uuid/v4';
import * as hydra from '../../lib/hydra';

const router = new Router();

async function addXsrfToken(ctx, next) {
    // Add signup random token to session, verity it in post request
    ctx.session.xsrf = {
        token: uuid(),
        timestamp: new Date(),
    };
    ctx.cookies.set(
        'oiiam:xsrftoken',
        ctx.session.xsrf.token,
        {
            domain: 'iooy.cc',
            path: '/',
            maxAge: 30 * 60 * 1000,
            httpOnly: false,
            sameSite: 'strict',
            overwrite: false,
        }
    );
    await next();
}

async function getLoginRequest(ctx, next) {
    const challenge = ctx.query.login_challenge;
    try {
        const response = await hydra.getLoginRequest({challenge});
        if (response.data.skip) {
            const accept = await hydra.acceptLoginRequest({challenge}, {
                subject: response.subject,
            });
            ctx.redirect(accept.data.redirect_to);
            return;
        }
        await next();
        return;
    }
    catch (err) {
        ctx.body = JSON.stringify({
            code: 1,
            message: 'get login request error',
            error: {},
        });
    }
}

router.get('/signup', addXsrfToken);
router.get('/signup.html', addXsrfToken);

router.get('/signin', addXsrfToken);
router.get('/signin', getLoginRequest);
router.get('/signin.html', addXsrfToken);
router.get('/signin.html', getLoginRequest);

router.get('/consent', addXsrfToken);
router.get('/consent.html', addXsrfToken);

router.get('/*', serve(path.join(__dirname, '../..', 'sense'), {
    extensions: ['html'],
}));

export default router;
