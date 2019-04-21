/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file hooks
 * @author Pride Leong<lykling.lyk@gmail.com>
 */

import React from 'react';

export function useApi(func) {
    const reducer = (state, action) => {
        switch (action.type) {
            case 'REQUEST': {
                return {...state, phase: 'submitting', response: null, error: null};
            }
            case 'REQUEST_SUCC': {
                return {
                    ...state,
                    phase: 'complete',
                    response: action.response,
                    error: null,
                };
            }
            case 'REQUEST_FAIL': {
                return {
                    ...state,
                    phase: 'failed',
                    response: null,
                    error: action.error,
                };
            }
            default: {
                return state;
            }
        }
    };
    const [state, dispatch] = React.useReducer(reducer, {
        phase: 'init',
        response: null,
        error: null,
    });

    const handler = async opts => {
        dispatch({type: 'REQUEST'});
        try {
            const response = await func(opts);
            dispatch({type: 'REQUEST_SUCC', response: response});
        }
        catch (error) {
            dispatch({type: 'REQUEST_FAIL', error: error});
        }
    };
    return [state, handler];
}

export function useFormFieldChange() {
    const reducer = (state, action) => {
        switch (action.type) {
            case 'INPUT': {
                return {...state, [action.name]: action.value};
            }
            default: {
                return state;
            }
        }
    };
    const [state, dispatch] = React.useReducer(reducer, {});
    const handler = evt => {
        dispatch({type: 'INPUT', name: evt.target.name, value: evt.target.value});
    };
    return [state, handler];
}
