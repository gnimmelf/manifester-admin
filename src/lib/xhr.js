import _debug from 'debug';
import Axios from "axios";
import normalizeUrl from 'normalize-url';

import settings from './settings';
import { flash } from "../actions";

const debug = _debug('lib:xhr')

// Custom axios instance
export const axios = Axios.create({
  validateStatus: () => true,
  withCredentials: true,
});

// Reverse route and return a curried caller
export const xhr = (routeName, ...params) => {
  const method = routeName.startsWith('do.') ? 'post' : 'get';

  const route = my.reverseRoute(routeName, ...params)

  return (data={}, options={}) => axios[method](route, data, options);
}

export const xhrHandler = (statusHandlers={}, defaultHandler) => {

  defaultHandler = defaultHandler || ((res) => flash(`${res.status}:${res.statusText} @${res.request.responseURL}`, 'danger'));

  const handlers = Object.keys(statusHandlers).reduce((handlers, key) => {
    handlers[parseInt(key)] = statusHandlers[key];
    return handlers;
  }, {});

  return (response) => {

    debug('response:'+response.request.responseURL, response);

    const status = parseInt(response.status);
    const handler = typeof handlers[status] == 'function' ? handlers[status] : defaultHandler;

    return handler(response.data, response);
  }
}

export const reverseRoute = (routeName, ...params) => {
  console.assert(settings.remote.routes, `"settings.remote.routes" not loaded!`);

  const route = settings.remote.routes[routeName]
  let parsedPathname;

  if (params.length == 1 && !~['string', 'number'].indexOf(typeof params[0])) {
    // `params[0]` contains a key-value-object.
    // Use key-value-object and Replace `{paramName}` with corresponding key-value
    parsedPathname = Object.entries(params[0]).reduce((route, [key, value]) => route.replace('{'+key+'}', value), route);
  }
  else {
    // `params` is an array of values, so use "as-is" and replace sequentially for each pair of curlybrackets `{<whatever>}` in route
    parsedPathname =  params.reduce((route, param) => route.replace(/[{].*?[}]/, param), route)
  }

  if (parsedPathname) {
    console.assert(!parsedPathname.includes('{'), 'Not all params filled: '+parsedPathname);
    return normalizeUrl(settings.remote.host + '/'+parsedPathname);
  }
  else throw new Error('Route not found: '+routeName)
}