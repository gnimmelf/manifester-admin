import { Observable } from "rxjs";
import axios from "axios";
import { addSchemaError, log } from '../lib/utils';
import loginActions from "../actions/loginActions";

const initialState = {};

const LoginReducer$ = Observable.of(() => {initialState})
  .merge(
    loginActions.submit$.map(payload => state => submitHandler(payload, state)),
    loginActions.reset$.map(_payload => _state => initialState),
  );

export default LoginReducer$;

function submitHandler(payload, state) {
  console.log("!", payload, state)
  return handlers[payload.schemaName](payload, state);
}

const handlers = {
  requestLoginCode: (payload, state) => {
    return axios.post(`${payload.authPath}request`, {
      email: payload.formData.email,
    })
    .then(res => res.data)
    .then(res => {

      if (res.status == 'success') {
        return {
          ...state,
          formData: payload.formData,
          schemaName: 'exchangeLoginCode',
          errorSchema: {},
        }
      }
      else {
        return {
          ...state,
          formData: payload.formData,
          errorSchema: addSchemaError(payload.errorSchema, 'email', res.data.message),
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  exchangeLoginCode: (payload, state) => {
    return axios.post(`${payload.authPath}exchange`, {
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