/* eslint-disable no-underscore-dangle, callback-return */
import { FETCHR } from "redux-effects-fetchr";
import { create } from "axios";
import { isEqual } from "lodash/fp";

export default axiosConfig => {
  const axios = create(axiosConfig);

  return ({ dispatch }) => next => action => {
    if (action.type !== FETCHR) {
      return next(action);
    } else {
      if (window && window.__MOCKING_LOG__) {
        return new Promise((resolve, reject) => {
          const log = window.__MOCKING_LOG__.find(_log =>
            isEqual(_log.action, JSON.parse(JSON.stringify(action))),
          );
          if (log) return resolve(log.response);
          else return reject(new Error(`Could'nt find ${action}`));
        });
      }
      const promise = next(action);
      promise
        .then(response => {
          axios.post("/", {
            action,
            response,
          });
        })
        .catch(e => {
          axios.post("/", {
            action,
            response: e.message,
          });
        });
      return promise;
    }
  };
};
