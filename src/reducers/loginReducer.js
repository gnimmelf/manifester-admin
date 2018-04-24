import _debug from "debug";
import { Observable, Subject } from "rxjs";
import { addSchemaError } from 'my-jsonschema-form';
import { toast } from "my-ui-components";
import history from "my-history-singleton";
import {
  axios,
  makeAxiosResponseHandler,
  autoReduce,
  parseUrlSearchString,
 } from "../lib/utils";

import settings, { reverseRoute } from "../lib/settings";

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
  .flatMap(({formData}) => axios.post(reverseRoute('do.requestCodeByEmail'), formData))
  .map(makeAxiosResponseHandler({
      200: (data) => {
        flash(`We have sent you an email with a logincode. Please copy and paste it below to log in.`)
        return { stepIdx: 1 };
      },
      422: (data) => toast.warn(data.msg)
    }))

export const exchangeLoginCode2Token$ = new Subject()
  .flatMap(({formData}) => axios.post(reverseRoute('do.exchangeLoginCode2Token'), formData))
  .map(makeAxiosResponseHandler({
      200: (data) => {
        authenticate();
        flash();
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