import Rx from "rxjs";
import loginActions from "../actions/loginActions";

const initialState = {
  email: "",
};

const LoginReducer$ = Rx.Observable.of(() => initialState)
  .merge(
    loginActions.submit.map(payload => state => submitHandler(payload, state)),
    loginActions.reset.map(_payload => _state => initialState),
  );

export default LoginReducer$;


function submitHandler(payload, state) {
  /*
    How to do XHR, catch errors and return them?
    - https://github.com/mozilla-services/react-jsonschema-form/issues/155
    Perhaps this, since `payload` is the entire Form...
    - https://github.com/epoberezkin/ajv-errors
  */

  console.log("loginActions.submit:payload", payload)
  const newState = {
    ...state,
    email: payload.formData.email
  }
  console.log("loginActions.submit:newState", newState);
  return Promise.resolve(newState);
}