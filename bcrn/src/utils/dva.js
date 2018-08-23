/**
 * Created by liangfangzheng on 2018/6/16.
 */
import React from 'react';
import { create } from 'dva-core';
import { Provider, connect } from 'react-redux';

export const createAction = type => payload => ({ type, payload });

export { connect };

export const createPromise = (action, payload) => (
    new Promise((resolve, reject) => {
        action({payload, resolve, reject});
    })
);

export default function(options) {
    const app = create(options);
    // HMR workaround
    if (!global.registered && options.models)
        options.models.forEach(model => app.model(model));
    if (!global.registered && options.plugins)
        options.plugins.forEach(plugin => app.use(plugin));
    global.registered = true;

    app.start();
    // eslint-disable-next-line no-underscore-dangle
    const store = app._store;
    app.start = container => () => <Provider store={store}>{container}</Provider>;
    app.getStore = () => store;
    return app;
}
