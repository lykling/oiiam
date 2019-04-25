/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file request.js
 * @author Pride Leong<lykling.lyk@gmail.com>
 */

import axios from 'axios';
import uuid from 'uuid/v4';

export default async function request(path, params, data) {
    const response = await axios.request({
        url: path,
        method: 'POST',
        responseType: 'json',
        xsrfCookieName: 'oiiam:xsrftoken',
        xsrfHeaderName: 'x-xsrf-token',
        params,
        headers: {
            time: +(new Date()),
            requestid: uuid(),
        },
        data: {
            ...data,
        },
        withCredentials: true,
    });
    return response.data;
}
