import { createActions } from "../state/RxState";

export default createActions([
  "selectService$",
  "selectVariant$",
  "selectDate$",
  "selectTimeslot$",
  "fetchServiceAvailability$",
  "fetchServiceAvailabilityByDate$",
  "changeResourceCapacity$",
]);