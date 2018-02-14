import { Observable } from "rxjs";
import axios from "axios";
import { addSchemaError } from '../lib/Form';
import adminActions from "../actions/adminActions";

const initialState = {
  authPath: window.AppSettings.authPath,
  schemaName: 'requestLoginCode',
  formData: {},
  errorSchema: {},
};

const AdminReducer$ = Observable.of(() => initialState)
  .merge(
    adminActions.submit$.map(payload => state => submitHandler(payload, state)),
    adminActions.reset$.map(_payload => _state => initialState),
  );

export default AdminReducer$;

function submitHandler(payload, state) {
  console.log("submitHandler", payload, state)
  return handlers[state.schemaName](payload, state);
}

const handlers = {
  requestLoginCode: (payload, state) => {
    return axios.post(`${payload.authPath}request`, {
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

      console.log(res.status.toUpperCase(), state)
      return state;
    })
    .catch(err => {
      console.log(err)
    })
  }
}