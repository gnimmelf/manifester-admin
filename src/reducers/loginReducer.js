import Rx from "rxjs";
import axios from "axios";
import { addSchemaError, log } from '../lib/utils';
import loginActions from "../actions/loginActions";

const authPath = window.AppSettings.authPath;

const initialState = {
  formData: {
    email: "aa@aa",
  },
  errorSchema: {},
};

const LoginReducer$ = Rx.Observable.of(() => initialState)
  .merge(
    loginActions.submit$.map(payload => state => submitHandler(payload, state)),
    loginActions.reset$.map(_payload => _state => initialState),
  );

export default LoginReducer$;

function submitHandler(payload, state) {

  return axios.post(`${authPath}/request`, {
    email: payload.formData.email,
  })
  .then(res => res.data)
  .then(res => {
    if (res.status == "success" && window.location.search) {
      const url = new URL(window.location)
      const origin = url.searchParams.get('origin');
      origin ? window.location = origin : '/';
    }
    else {
      return {
        ...state,
        formData: payload.formData,
        errorSchema: res.status == "success" ? {} : addSchemaError(payload.errorSchema, 'email', res.data.message),
      };
    }
  })
}
