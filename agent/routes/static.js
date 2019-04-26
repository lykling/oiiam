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
                subject: response.data.subject,
            });
            ctx.redirect(accept.data.redirect_to);
            return;
        }
        await next();
        return;
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'get login request error',
            error: {},
        });
    }
}

async function getConsentRequest(ctx, next) {
    const challenge = ctx.query.consent_challenge;
    try {
        const response = await hydra.getConsentRequest({challenge});
        if (response.data.skip) {
            const accept = await hydra.acceptConsentRequest({challenge}, {
                grant_scope: response.data.requested_scope,
                grant_access_token_audience: response.data.requested_access_token_audience,
                session: {},
            });
            ctx.redirect(accept.data.redirect_to);
            return;
        }
        await next();
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = JSON.stringify({
            code: 1,
            message: 'get consent request error',
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
router.get('/consent', getConsentRequest);
router.get('/consent.html', addXsrfToken);
router.get('/consent.html', getConsentRequest);

router.get('/*', serve(path.join(__dirname, '../..', 'sense'), {
    extensions: ['html'],
}));

export default router;
