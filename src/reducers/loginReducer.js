import _debug from "debug";
import { Observable, Subject } from "rxjs";
import { addSchemaError } from 'my-jsonschema-form';
import { toast } from "my-ui-components";
import history from "my-history-singleton";
import {
  autoReduce,
  parseUrlSearchString,
 } from "../lib/utils";
import { xhr, xhrHandler } from "../lib/xhr";
import settings from "../lib/settings";

import {
  loginActions,
  authenticate,
  redirect,
  flash,
} from "../actions";

const debug = _debug("reducers:loginreducer")

const initialState = {
  stepIdx: 0,
  formData: {
    email: 'gnimmelf@gmail.com',
  },
  errorSchema: {},
};

export const requestCodeByEmail$ = new Subject()
  .flatMap(({formData}) => xhr('do.requestCodeByEmail')(formData))
  .map(xhrHandler({
      200: (data) => ({ stepIdx: 1 }),
      422: (data) => toast.warn(data.msg)
    }))

export const exchangeLoginCode2Token$ = new Subject()
  .flatMap(({formData}) => xhr('do.exchangeLoginCode2Token')(formData))
  .map(xhrHandler({
      200: (data) => {
        authenticate();
        redirect(parseUrlSearchString(history.location.search)['redirect'] || '/', 'Logged in!');
        return initialState;
      },
      422: (data) => toast.warn(data.msg)
    }))

export default Observable.of(() => initialState)
  .merge(

    autoReduce(
      requestCodeByEmail$,
      exchangeLoginCode2Token$,
    ),

    loginActions.submit$
      .map(payload => state => {
        switch (state.stepIdx) {
          case 0:
            requestCodeByEmail$.next({formData: payload.formData});
            break;
          case 1:
            exchangeLoginCode2Token$.next({formData: payload.formData})
            break;
        };
        return {
          ...state,
          formData: payload.formData,
        };
      }),

    loginActions.reset$.map(_payload => _state => initialState),
  );