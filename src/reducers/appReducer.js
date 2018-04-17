import _debug from "debug";
import { Observable, Subject } from "rxjs";
import {
  map,
  flatMap,
} from 'rxjs/operators';
import normalizeUrl from 'normalize-url'
import {
  axios,
  objOmit,
  makeAxiosResponseHandler,
  autoReduce,
  takeOneWhen,
} from "../lib/utils";
import {
  appActions,
  redirect
} from "../actions";
import settings, { reverseRoute } from "../lib/settings";
import history$ from '../lib/history$';

const debug = _debug("reducers:appreducer")

const initialState = {
  status: 'START',
  user: undefined,
  location: undefined,
};

export const fetchCurrentUser$ = new Subject()
  .debug(debug, "FETCHCURRENTUSER")
  .flatMap(() => axios.get(reverseRoute('current-user')))
  .map(makeAxiosResponseHandler({
      200: (data) => data,
      401: (data) => false,
    }))
  .map(data => ({
    user: data,
  }));

export default Observable.of(() => initialState)
  .merge(

    autoReduce(
      fetchCurrentUser$,
      appActions.authenticate$
        .debug(debug, "AUTHENTICATE")
        .do(() => fetchCurrentUser$.next()),
      takeOneWhen(() => settings.remote.routes)
        .do(() => fetchCurrentUser$.next()),
    ),

    history$
      .debug(debug, "> location$")
      .map(payload => state => ({
        ...state,
        location: {
          ...payload,
          parts: payload.pathname.split('/').filter(x=>x)
        }
      })),

    appActions.logout$
      .do(() => axios.post(reverseRoute('do.logout')))
      .do(() => redirect('/', 'Logged out!'))
      .map(_payload =>  state => ({
        ...state,
        ...objOmit(initialState, 'status', 'location'),
      })),

  );

