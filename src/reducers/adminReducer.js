import _debug from "debug";
import { Observable } from "rxjs";
import adminActions from "../actions/adminActions";
import settings from "../lib/settings"
import axios from "axios";

const debug = _debug("reducers:adminReducer")

const initialState = {
  schemas: [],
  selectedSchema: null
};

const AdminReducer$ = Observable.of(() => initialState)
  .merge(
    adminActions.loadSchemas$
      .startWith("onload")
      .flatMap(() => {
        return axios.get(`${settings.apiPath}schemas`).then(res => res.data.data.schemas)
      })
      .debug(debug, "loadSchemas")
      .map(payload => state => ({...state, schemas: payload})),
    adminActions.selectSchema$.map(payload => state => submitHandler(payload, state)),
  );

export default AdminReducer$;


