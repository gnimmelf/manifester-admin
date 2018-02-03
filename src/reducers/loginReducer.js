import Rx from "rxjs";
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

  console.log("loginActions.submit", payload, state);

  const newState = {
    ...state,
    formData: payload.formData,
    errorSchema: addSchemaError(payload.errorSchema, 'email', 'Work, goddamit!'),
  }

  console.log("loginActions.submit:newState", newState);

  return Promise.resolve(newState)
}
