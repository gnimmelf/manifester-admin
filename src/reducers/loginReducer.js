import Rx from "rxjs";
import loginActions from "../actions/loginActions";

const initialState = {
  email: "",
  errors: "",
};

const LoginReducer$ = Rx.Observable.of(() => initialState)
  .merge(

    loginActions.submit.map(payload => state => {
      console.log("loginActions.submit:payload", payload)
      const newState = {
        ...state,
        email: payload.formData.email
      }
      console.log("loginActions.submit:newState", newState);
      return newState;
    }),

    loginActions.reset.map(_payload => _state => initialState),
  );

export default LoginReducer$;