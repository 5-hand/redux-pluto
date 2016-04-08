import { inspect } from 'util';
import React, { createFactory } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import Fetchr from 'fetchr';
import debugFactory from 'debug';
import createStore from '../../shared/redux/createStore';
import { loadAllMasters as loadAllMastersAction } from '../../shared/redux/modules/masters';
import routes from '../../shared/routes';
import Html from '../Html';

const debug = debugFactory('app:server:middleware:reduxApp');
const html = createFactory(Html);

export default function(fetchrConfig) {
  const fetchr = new Fetchr(fetchrConfig);

  const logger = __DEVELOPMENT__ ? (store) => (next) => (action) => {
    debug(`Invoking action: ${inspect(action).replace(/\s*\n\s*/g, ' ')}`);
    return next(action);
  } : null;

  const initialStore = createStore({}, {
    fetchr,
    logger,
    history: createMemoryHistory('/'),
  });
  let initialState = '';

  function reduxApp(req, res, next) {
    const memoryHistory = createMemoryHistory(req.url);
    const store = createStore(initialStore.getState(), {
      fetchr,
      logger,
      history: memoryHistory,
    });
    const history = syncHistoryWithStore(memoryHistory, store);

    match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        return res.status(500).send(error.message);
      }

      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      if (!renderProps) {
        return next();
      }

      loadOnServer({ ...renderProps, store }).then(() => {
        const content = renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );
        const initialState = JSON.stringify(store.getState());
        const { routes } = renderProps;
        const status = routes[routes.length - 1].status || 200;
        res.status(status).send('<!doctype html>\n' + renderToStaticMarkup(html({ content, initialState })));
      });
    });
  }

  function loadAllMasters() {
    debug('Loading initial data');
    return initialStore.dispatch(loadAllMastersAction()).then(() => {
      debug('Loaded initial data');
    });
  }

  return { reduxApp, loadAllMasters };
}