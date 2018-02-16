import { Observable } from "rxjs";
import axios from "axios";
import { addSchemaError } from 'jsonschema-form';
import adminActions from "../actions/adminActions";
import settings from "../lib/settings"

const initialState = {
  schemas: [],
};

axios.get(`${settings.apiPath}schemas`)
  .then(res => res.data.data.schemas)
  .then(schemas => adminActions.schemas$.next({schemas})) // <-- Try `Observable.pipe`...!

const AdminReducer$ = Observable.of(() => initialState)
  .merge(
    adminActions.schemas$.map(payload => state => ({...state, ...payload})),
    adminActions.submit$.map(payload => state => submitHandler(payload, state)),
    adminActions.reset$.map(_payload => _state => initialState),
  );

export default AdminReducer$;
