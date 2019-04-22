/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file hydra api
 * @author Pride Leong<lykling.lyk@gmail.com>
 */

import axios from 'axios';
import * as env from './env';

async function get(url, params) {
    return await axios.request({
        url,
        baseURL: env.hydraAdminUrl,
        responseType: 'json',
        method: 'GET',
        params,
    });
}

async function put(url, params, data) {
    return await axios.request({
        url,
        baseURL: env.hydraAdminUrl,
        responseType: 'json',
        method: 'PUT',
        params,
        data,
    });
}

export async function getLoginRequest(challenge) {
    return await get('/oauth2/auth/requests/login', {challenge});
}

export async function acceptLoginRequest(challenge, data) {
    return await put('/oauth2/auth/requests/login/accept', {challenge}, data);
}

export async function rejectLoginRequest(challenge, data) {
    return await put('/oauth2/auth/requests/login/reject', {challenge}, data);
}

export async function getConsentRequest(challenge) {
    return await get('/oauth2/auth/requests/consent', {challenge});
}

export async function acceptConsentRequest(challenge, data) {
    return await put('/oauth2/auth/requests/consent/accept', {challenge}, data);
}

export async function rejectConsentRequest(challenge, data) {
    return await put('/oauth2/auth/requests/consent/reject', {challenge}, data);
}
