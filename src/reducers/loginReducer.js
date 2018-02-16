import _debug from "debug";
import { Observable } from "rxjs";
import axios from "axios";
import { addSchemaError } from 'jsonschema-form';
import loginActions from "../actions/loginActions";
import settings from "../lib/settings"

const debug = _debug("reducers:loginReducer")

const initialState = {
  schemaName: 'requestLoginCode',
  formData: {},
  errorSchema: {},
};

const LoginReducer$ = Observable.of(() => initialState)
  .merge(
    loginActions.submit$
      .debug(debug)
      .map(payload => state => submitHandler(payload, state)),
    loginActions.reset$.map(_payload => _state => initialState),
  );

export default LoginReducer$;

function submitHandler(payload, state) {
  debug("submitHandler", payload, state)
  return handlers[state.schemaName](payload, state);
}

const handlers = {
  requestLoginCode: (payload, state) => {
    return axios.post(`${settings.authPath}request`, {
      email: payload.formData.email,
    })
    .then(res => res.data)
    .then(res => {

      if (res.status == 'success') {
        state = {
          ...state,
          formData: payload.formData,
          schemaName: 'exchangeLoginCode',
          errorSchema: {},
        }
      }
      else {
        state = {
          ...state,
          formData: payload.formData,
          errorSchema: addSchemaError(payload.errorSchema, 'email', res.data.message),
        }
      }

      debug(res.status.toUpperCase(), state)
      return state;
    })
    .catch(err => {
      console.log(err)
    })
  },
  exchangeLoginCode: (payload, state) => {
    return axios.post(`${settings.authPath}exchange`, {
      email: payload.formData.email,
      code: payload.formData.code,
    })
    .then(res => res.data)
    .then(res => {

      if (res.status == 'success') {
        return window.location = new URL(window.location).searchParams.get('origin') || '/';
      }
      else {
        return {
          ...state,
          formData: payload.formData,
          errorSchema: addSchemaError(payload.errorSchema, 'code', res.data.message),
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
}