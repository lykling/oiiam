/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file consent view
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import request from './request';
import * as hooks from './hooks';
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
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    scopes: {
        display: 'flex',
        flexDirection: 'row',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        display: 'flex',
    }
});

function Consent(props) {
    const {classes} = props;
    const url = new URL(window.location.href);
    const challenge = url.searchParams.get('consent_challenge');
    const {data: req, error} = hooks.useAsyncLoad(
        _.partial(request, '/api/hydra/getConsentRequest', {challenge}),
        []
    );
    const [fieldsState, handleInput] = hooks.useFormFieldChange({});

    const [action, accept, reject] = hooks.useRaceAsync(
        _.partial(request, '/api/hydra/acceptConsentRequest', {challenge}),
        _.partial(request, '/api/hydra/rejectConsentRequest', {challenge})
    )

    async function deny() {
        const resp = await reject({
            error: 'access_denied',
            error_description: 'The resource owner denied the request',
        });
        window.location.href = resp.redirect_to;
    }
    async function allow() {
        const resp = await accept({
            grant_scope: _.keys(_.pickBy(fieldsState.scopes)),
            grant_access_token_audience: req.requested_access_token_audience,
            session: {},
            remember: Boolean(fieldsState.remember),
            remember_for: 3600,
        });
        window.location.href = resp.redirect_to;
    }

    function renderScopes(scopes) {
        return (
            <div className={classes.scopes}>
                {scopes.map(x => (
                    <FormControlLabel
                        key={`scope-${x}`}
                        control={
                            <Checkbox
                                name="scopes"
                                value={x}
                                onChange={handleInput}
                                color="primary"
                            />
                        }
                        label={x}
                    />
                ))}
            </div>
        );
    }

    function renderClient(client) {
        return (
            <Typography component="section" variant="">
                <Typography component="header" variant="title">
                    <strong>{client.client_name || client.client_id}</strong>
                </Typography>
                <Typography component="p" variant="body1">
                    wants access resources on your behalf and to:
                </Typography>
            </Typography>
        );
    }

    function renderContent(req, error) {
        if (error != null) {
            return (
                <em>{error.stack}</em>
            );
        }
        return (
            <Paper className={classes.paper}>
                {renderClient(req.client)}
                <form className={classes.form}>
                    {renderScopes(req.requested_scope)}
                    <Divider variant="middle" />
                    <FormControlLabel
                        control={<Checkbox name="remember" color="primary" onChange={handleInput} />}
                        label="Remember me"
                    />
                    <div className={classes.buttons}>
                        <Button
                            onClick={allow}
                            variant="contained"
                            color="primary"
                        >
                            Accept
                        </Button>
                        <Button
                            onClick={deny}
                            variant="contained"
                            color="secondary"
                        >
                            Reject
                        </Button>
                    </div>
                </form>
                {action.error == null
                ? ''
                : (
                    <em>action.error.stack</em>
                )
                }
            </Paper>
        );
    }

    return (
        <main className={classes.main}>
            {renderContent(req, error)}
        </main>
    );
}
Consent.propTypes = {
    classes: PropTypes.object.isRequired,
};
const Component = withStyles(styles)(Consent);

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(
    <Component />,
    root
);
