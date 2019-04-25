/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file hooks
 * @author Pride Leong<lykling.lyk@gmail.com>
 */

import React from 'react';

export function useAsyncLoad(func, scopes) {
    const [state, setState] = React.useState({
        data: null,
        error: new Error('loading'),
    });
    React.useEffect(async () => {
        try {
            const data = await func();
            setState({
                data,
                error: null,
            });
        }
        catch (err) {
            setState({
                data: null,
                error: err,
            });
        }
    }, scopes);
    return state;
}

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

    const handler = async (...args) => {
        dispatch({type: 'REQUEST'});
        try {
            const response = await func(...args);
            dispatch({type: 'REQUEST_SUCC', response: response});
        }
        catch (error) {
            dispatch({type: 'REQUEST_FAIL', error: error});
        }
    };
    return [state, handler];
}

export function useFormFieldChange(initial) {
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
    const [state, dispatch] = React.useReducer(reducer, initial);
    const handler = evt => {
        const type = evt.target.type;
        const name = evt.target.name;
        const action = {
            type: 'INPUT',
            name,
        };
        switch (type) {
            case 'checkbox': {
                if (evt.target.value) {
                    // Treat checkbox as group if `value` defined
                    action.value = {
                        ...state[name],
                        [evt.target.value]: evt.target.checked,
                    };
                }
                else {
                    action.value = evt.target.checked;
                }
                break;
            }
            default: {
                action.value = evt.target.value;
                break;
            }
        }
        dispatch(action);
    };
    return [state, handler];
}
