import _debug from 'debug';
import { flash } from "../actions";

const debug = _debug('lib:makeAxiosResponseHandler')

export default (statusHandlers={}, defaultHandler) => {

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