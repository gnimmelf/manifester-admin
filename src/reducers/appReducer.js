import _debug from "debug";
import { Observable, Subject } from "rxjs";
import normalizeUrl from 'normalize-url';
import { toast } from "my-ui-components";
import {
  objOmit,
  autoReduce,
  takeOneWhen,
} from "../lib/utils";
import {
  appActions,
  redirect
} from "../actions";
import { xhr, xhrHandler } from "../lib/xhr";
import settings from "../lib/settings";
import history$ from '../lib/history$';

const debug = _debug("reducers:appreducer")

const initialState = {
  user: undefined,
  location: undefined,
};

export const fetchCurrentUser$ = new Subject()
  .debug(debug, "FETCHCURRENTUSER")
  .flatMap(() => xhr('user:current')())
  .map(xhrHandler({
      200: (data) => data,
      401: (data) => false,
    }))
  .map(({user}) => ({
    user: user,
  }));

export default Observable.of(() => initialState)
  .merge(

    autoReduce(
      fetchCurrentUser$,
      appActions.authenticate$
        .debug(debug, "AUTHENTICATE")
        .do(() => fetchCurrentUser$.next()),
      takeOneWhen(() => settings.remote.routes)
        .do(() => fetchCurrentUser$.next())
    ),

    history$
      .debug(debug, "> location$")
      .map(payload => state => ({
        ...state,
        location: {
          ...payload,
          parts: payload.pathname.split('/').filter(part => !!part)
        }
      })),

    appActions.logout$
      .do(() => xhr('user:logout')())
      .do(() => redirect('/', {
        history: 'REPLACE',
        onChange: ()=>toast.warn('Logged out')
      }))
      .map(_payload =>  state => ({
        ...state,
        ...objOmit(initialState, 'status', 'location'),
      }))
  );

