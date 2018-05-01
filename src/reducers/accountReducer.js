import _debug from "debug";
import { Observable } from "rxjs";
import { addSchemaError } from 'my-jsonschema-form';
import { toast } from "my-ui-components";
import {
  accountActions,
  flash,
  redirect
} from "../actions";
import { xhr, xhrHandler } from "../lib/xhr";

const debug = _debug("reducers:accountreducer")

const initialState = {
  errorSchema: {},
  errors: [],
};

export const getSubmitRequest$ = (payload) =>
  Observable.from(xhr('do.edit')(payload.formData))
    .map(xhrHandler({
      200: (res) => {
        toast.info('Changes saved!')
        return {
          errors: [],
          errorSchema: {},
        };
      },
      422: (res) => {
        flash(Object.values(res.data.errors).join(', '), 'danger')
        return {
          errors: [],
          errorSchema: Object.entries(res.data.errors).reduce((schema, [key, msg]) => addSchemaError(schema, key, msg), {}),
        }
      }
    }))
    .map((data={}) => state => ({
      ...state,
      ...data,
      formData: payload.formData,
    }))

export default Observable.of(() => initialState)
  .merge(

    accountActions.fetchSchema$
      .flatMap(() => xhr('schemas', 'user.json')())
      .map(xhrHandler({
        200: (data) => data,
        401: (data) => false,
      }))
      .map(({schema}) => state => ({
        ...state,
        schema: schema,
      })),

    accountActions.submit$.flatMap(getSubmitRequest$),
    accountActions.reset$.map(_payload => _state => initialState),
  );
