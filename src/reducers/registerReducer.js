import _debug from "debug";
import { Observable, Subject } from "rxjs";
import { addSchemaError } from 'my-jsonschema-form';
import { toast } from "my-ui-components";
import {
  axios,
  makeAxiosResponseHandler,
  autoReduce,
} from "../lib/utils";
import settings, { reverseRoute } from "../lib/settings"
import {
  registerActions,
  flash,
  redirect
} from "../actions";

const debug = _debug("reducers:registerreducer")

const initialState = {
  formData: {
    firstname: 'Flemming',
    lastname: 'Hansen',
    email: 'flemming2@glimrende.no',
    mobile: '90066044',
    password: 'Glimrende',
    password_confirmation: 'Glimrende',
  },
  errorSchema: {},
  errors: [],
};

export const doRegistration$ = new Subject()
  .flatMap(({formData}) => axios.post(reverseRoute('do.register'), formData))
  .map(makeAxiosResponseHandler({
      200: (res) => {
        redirect('/account', `Validerings-epost sent til ${payload.formData.email}. Følg instruksene i e-posten for å logge inn.`, {
          autoClose: false,
        });
        return initialState;
      },
      422: (res) => {
        flash.clear(Object.values(res.data.errors).join(', '), 'danger')
        return {
          errors: [],
          errorSchema: Object.entries(res.data.errors).reduce((schema, [key, msg]) => addSchemaError(schema, key, msg), {}),
        }
      }
    }))

export default Observable.of(() => initialState)
  .merge(

    autoReduce(doRegistration$),

    registerActions.submit$
      .do((payload) => doRegistration$.next({formData: payload.formData}))
      .map(payload => state => ({
        formData: payload.formData,
      })),

    registerActions.reset$.map(_payload => _state => initialState),
  );
