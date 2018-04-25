import objectOmit from "object.omit";
import filterObj from "filter-obj";
import { Observable, pipe } from "rxjs";

export const objOmit = (obj, ...keys) => objectOmit(obj, keys);
export const objExtract = (obj, ...keys) => filterObj(obj, keys);

export const getCssRootVar = (varName) => getComputedStyle(document.body).getPropertyValue(varName);

export const getCookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

export const deleteCookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const clearSessionCookie = () => {
  deleteCookie('laravel_session');
}

export const delayedPipe = (rxJsPipeFn, rxJsFilterFn=(x)=>x, interval=500) => {
  console.assert(typeof rxJsPipeFn == 'function', 'rxJsPipeFn: must be a function');

  return Observable.interval(interval)
    .filter(rxJsFilterFn)
    .take(1)
    .pipe(rxJsPipeFn);

}

export const autoReduce = (...reducerStreams) => Observable.empty()
  .merge(...reducerStreams)
  .map(payload => state => ({
    ...state,
    ...payload,
  }))


export const takeOneWhen = (filterFn, interval=200) => Observable.interval(interval).filter(filterFn).take(1)

export const parseUrlSearchString = (q) => (q.startsWith('?') ? q.substr(1) : q).split('&').reduce((acc, cur) => {
  let [key, val] = cur.split('=');
  return {...acc, [key]: decodeURIComponent(val)};
}, {});