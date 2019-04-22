/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file signup view
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import * as hooks from './hooks';
import crypto from 'crypto';
import request from './request';
import _ from 'lodash';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

function SignUp(props) {
    const {classes} = props;

    const [fieldsState, handleInput] = hooks.useFormFieldChange();
    const [apiState, api] = hooks.useApi(_.partial(request, '/api/signup'));

    async function submit(evt) {
        evt.preventDefault();
        if (fieldsState.password !== fieldsState.confirm) {
            return;
        }
        const params = {
            email: fieldsState.email,
            password: crypto.createHash('sha512').update(fieldsState.password).digest('hex'),
        }
        await api(params);
    }
    return (
        <main className={classes.main}>
            <CssBaseline />
            {apiState.response == null
            ? (
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        SignUp
                    </Typography>
                    <form className={classes.form} onSubmit={submit}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input
                                id="email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={handleInput}
                            />
                        </FormControl>
                        <FormControl
                            margin="normal"
                            required
                            fullWidth
                            error={fieldsState.password !== fieldsState.confirm}
                        >
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                onChange={handleInput}
                            />
                        </FormControl>
                        <FormControl
                            margin="normal"
                            required
                            fullWidth
                            error={fieldsState.password !== fieldsState.confirm}
                        >
                            <InputLabel htmlFor="confirm">Confirm</InputLabel>
                            <Input
                                id="confirm"
                                name="confirm"
                                type="password"
                                autoComplete="new-password"
                                onChange={handleInput}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={apiState.phase === 'submitting'}
                            className={classes.submit}
                        >
                            SignUp
                        </Button>
                    </form>
                    {apiState.error == null
                    ? (
                        ''
                    )
                    : (
                        JSON.stringify(apiState.error)
                    )
                    }
                </Paper>
            )
            : (
                'Sign Up Success'
            )
            }
        </main>
    );
}

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

const Component = withStyles(styles)(SignUp);

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(
    <Component />,
    root
);
