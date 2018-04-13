import _debug from "debug";
import { Observable, Subject } from "rxjs";
import objectHash from 'stable-sha1';
import { toast } from "my-ui-components";
import {
  axios,
  objOmit,
  objExtract,
  makeAxiosResponseHandler,
  autoReduce,
  takeOneWhen,
 } from "../lib/utils";

import settings, { reverseRoute } from "../lib/settings";

import {
  cartActions,
  authenticate,
  redirect
} from "../actions";

const debug = _debug("reducers:cartreducer")

const initialState = {
  reservations: [],
  order: undefined,
};


export const reserve$ = new Subject()
  // date+startTime+variantId
  // optional: serviceProviderId, quantity
  .debug(debug, "> reserve$")
  .flatMap((booking) => axios.post(reverseRoute('do.booking-reserve'), {
    ...objExtract(booking, "date", "startTime", "variantId", "serviceProviderId"),
    data: booking,
  }))
  .map(makeAxiosResponseHandler({
    200: (res) => res.data.data,
    403: (res) => ({})
  }))
  .map(({uuid, data}) => state => {
    if (uuid) {
      console.assert(uuid && data.hashKey, "Cannot resolve reservation: `uuid` returned without `hashKey`");

      const reservation = state.reservations.find(r => r.hashKey == data.hashKey);
      reservation.uuids.push(uuid);

      toast.success('Behandling reservert, se handlekurv for detaljer.')
    }
    else {
      toast.warn('Beklager, behandlingen er ikke lenger tilgjengelig!')
    }
    return state;
  })

export const fetchOrder$ = new Subject()
  .flatMap(() => axios.get(reverseRoute('booking-order')))
  .map(makeAxiosResponseHandler({
    200: (res) => res.data.data,
  }))
  .map(payload => ({
    // TODO! `order.bookings` => `order.items` Remove when renamed on server...
    ...objOmit(payload, 'bookings'),
    items: payload.items || payload.bookings,
  }))
  .debug(debug, "FETCHORDER")
  .map(payload => state => {
    // TODO! Remove later, not needed?
    state.order = payload;

    payload.items.forEach(item => {
      const hashKey = item.data.hashKey;
      let reservation = state.reservations.find(r => r.hashKey == hashKey);

      if (!reservation) {
        reservation = {
          ...item.data,
          uuids: [],
        };
        state.reservations.push(reservation);
      }
      reservation.uuids.push(item.uuid)
    });

    return state;
  })

export default Observable.of(() => initialState)
  .merge(

    autoReduce(
      takeOneWhen(() => settings.remote.routes)
        .do(() => fetchOrder$.next()),
    ),

    reserve$,
    fetchOrder$,

    cartActions.add$
      .debug(debug, "> add$")
      .map(({hashKeys, ...booking}) => state => {
        const hashKey = objectHash(objExtract(booking, ...hashKeys));
        let reservation = state.reservations.find(r => r.hashKey == hashKey);

        if (!reservation) {
          reservation = {
            ...booking,
            hashKey: hashKey,
            uuids: [],
          };
          state.reservations.push(reservation);
        }
        reserve$.next(objOmit(reservation, "uuids"));

        return state;
      }),

    cartActions.remove$
      .debug(debug, "> remove$")
      .flatMap(({uuid}) => axios.post(reverseRoute('do.booking-cancel'), {uuid: uuid}))
      .map(makeAxiosResponseHandler({
        200: (res) => res.data.data,
      }))
      .map(({uuid, variantId}) => state => {
        const found = state.reservations.find(r => ~r.uuids.indexOf(uuid));
        // Place back on shelf
        return state;
      }),

    cartActions.clear$
      .debug(debug, "> clear$")
      .map(_payload => state => {
        while (state.reservations.length) {
          const reservation = state.reservations.pop();
          while (reservation.uuids.length) {
            cartActions.remove$.next({uuid: reservation.uuids.pop()});
          }
        }
        return state;
      }),


    cartActions.submit$
      .debug(debug, "SUBMIT")
      .map(payload => state => state),

  );
