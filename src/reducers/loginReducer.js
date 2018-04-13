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
  redirect
} from "../actions";

const debug = _debug("reducers:loginreducer")

const initialState = {
  formData: {
    email: 'flemming@glimrende.no',
    password: 'Glimrende',
  },
  errorSchema: {},
};

export const doLogin$ = new Subject()
  .flatMap(({formData}) => axios.post(reverseRoute('do.login'), formData))
  .map(makeAxiosResponseHandler({
      200: (res) => {
        authenticate();
        redirect(parseUrlSearchString(history.location.search)['redirect'] || '/', 'Logged in!');
        return initialState;
      },
      403: (res) => toast.warn(res.data.msg)
    }))

export default Observable.of(() => initialState)
  .merge(

    autoReduce(doLogin$),

    loginActions.submit$
      .do((payload) => doLogin$.next({formData: payload.formData}))
      .debug(debug, "SUBMIT")
      .map(payload => state => ({
        formData: payload.formData,
      })),

    loginActions.reset$.map(_payload => _state => initialState),
  );