import _debug from "debug";
import { Observable, Subject, pipe } from "rxjs";
import settings, { reverseRoute } from "../lib/settings";
import {
  moment,
  accounting,
} from 'my-accounting';
import {
  tap,
  map,
  flatMap,
} from 'rxjs/operators';
import {
  axios,
  objOmit,
  makeAxiosResponseHandler,
  autoReduce,
  takeOneWhen,
} from "../lib/utils";
import {
  bookingActions,
  cartActions,
  redirect
} from "../actions";

const debug = _debug("reducers:bookingreducer")

const initialState = {
  // Selections
  selectedService: undefined,
  selectedVariant: undefined,
  selectedDate: undefined,
  // Data
  servicesList: undefined,
  serviceDatesList: undefined,
  serviceDateVariantsList: undefined,
};

export const fetchServices$ = new Subject()
  .flatMap(() => axios.get(reverseRoute('services.list')))
  .map(makeAxiosResponseHandler({
        200: (res) => res.data.data,
      }))
  .map(data => data.map(service => ({
    ...service,
    variants: service.variants.map(variant => ({
      ...variant,
      name: `${variant.duration} minutter`,
    }))
  })))
  .map(data => ({
    servicesList: data,
    selectedService: data[0],
    selectedVariant: data[0].variants[0],
  }))
  .do(data => fetchServiceAvailability$.next({
    serviceId: data.selectedService.id
  }))
  .debug(debug, "FETCHSERVICES")

export const fetchServiceAvailability$ = new Subject()
  .flatMap(({serviceId}) => axios.get(reverseRoute('service-availability.list', serviceId)))
  .map(makeAxiosResponseHandler({
    200: (res) => res.data.data,
  }))
  .map(data => ({
    serviceDatesList: data,
  }));

export const fetchServiceAvailabilityByDate$ = new Subject()
  .flatMap(({serviceId, selectedDate}) => axios.get(reverseRoute('service-availability-by-date.list', serviceId, selectedDate)))
  .map(makeAxiosResponseHandler({
    200: (res) => res.data.data,
  }))
  .map(data => ({
    selectedDate: data.date,
    serviceDateVariantsList: data.variants.map(variant => {
      // Turn `timeslots` into an Array
      const timeslots = data.variants
        .map(variant => variant.timeslots)

      const timeslotsList = Object.entries(timeslots[0]||[])
        .map(([timeStr, resourcesList]) => ({
          startTime: timeStr,
          resourcesList: resourcesList,
        }));

      return {
        ...objOmit(variant, 'timeslots'),
        timeslotsList: timeslotsList,
      }
    }),
  }));

export const changeResourceCapacity$ = new Subject()
  .map(payload => state => {

    // TODO! Decrement some `capacities` for the reservation...?

    return state;
  })


export default Observable.of(() => initialState)
  .merge(

    autoReduce(
      fetchServices$,
      fetchServiceAvailability$,
      fetchServiceAvailabilityByDate$,
      takeOneWhen(() => settings.remote.routes)
        .do(() => fetchServices$.next()),
    ),

    changeResourceCapacity$,

    bookingActions.selectService$
      .map(({serviceId}) => state => {
        const selectedService = state.servicesList.find(s => s.id == serviceId);
        fetchServiceAvailability$.next({
          serviceId: selectedService.id
        });
        return {
          ...initialState,
          servicesList: state.servicesList,
          selectedService: selectedService,
          selectedVariant: selectedService.variants[0],
        }
      }),

    bookingActions.selectVariant$
      .map(({variantId}) => state => ({
        ...state,
        selectedVariant: state.selectedService.variants.find(v => v.id == variantId),
      })),

    bookingActions.selectDate$
      .map(({isoDateStr}) => state => {
        fetchServiceAvailabilityByDate$.next({
          serviceId: state.selectedService.id,
          selectedDate: isoDateStr
        });
        return {
          ...state,
          selectedDate: isoDateStr,
        }
      }),

    bookingActions.selectTimeslot$
      .map(({startTime, selectedResource}) => state => {

        const description = [
          moment(state.selectedDate, "YYYY-MM-DD").format("DD.MM.YYYY"),
          state.selectedService.name,
          state.selectedVariant.name,
          selectedResource.serviceProvider.fullname,
          accounting.currency(selectedResource.price),
        ].join(' ');

        // START HERE! Figure out how to split the booking-data so that it passes to all corners gracefully!

        cartActions.add$.next({
          date: state.selectedDate,
          startTime: startTime,
          serviceProviderId: selectedResource.serviceProvider.id,
          serviceId: state.selectedService.id,
          variantId: state.selectedVariant.id,
          description: description,
          price: selectedResource.price,
          hashKeys: ["date", "startTime", "variantId", "serviceProviderId"],
        });

        return state;
      }),

  );