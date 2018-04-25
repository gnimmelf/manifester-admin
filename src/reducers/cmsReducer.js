import _debug from "debug";
import { Observable, Subject } from "rxjs";
import {
  map,
  flatMap,
} from 'rxjs/operators';
import normalizeUrl from 'normalize-url';
import { toast } from "my-ui-components";
import {
  objOmit,
  autoReduce,
  takeOneWhen,
} from "../lib/utils";
import {
  cmsActions,
} from "../actions";
import { xhr, xhrHandler } from "../lib/xhr";
import settings from "../lib/settings";
import history$ from '../lib/history$';

const debug = _debug("reducers:cmsreducer")

const initialState = {
  schemaNames: undefined,
  currentSchema: undefined,
};

export default Observable.of(() => initialState)
  .merge(

    cmsActions.fetchSchemas$
      .debug(debug, "FETCHSCHEMAS")
      .flatMap(() => xhr('schemas:list', 'content.*')())
      .map(xhrHandler({
          200: (data) => data,
          401: (data) => false,
        }))
      .map(({schemas}) => state => ({
        ...state,
        schemaNames: schemas,
      })),

    cmsActions.selectSchema$
      .do(() => xhr('schema.load')())
      .map(payload =>  state => ({
        ...state,
      }))
  );

