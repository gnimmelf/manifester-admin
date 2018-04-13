import { join, normalize } from 'path';
import deepAssign from 'deep-assign';
import normalizeUrl from 'normalize-url';
import { getCookie } from './utils';

const settings = deepAssign({
  remote: {
    host: "",
    routes: undefined,
  },
  ui: {
    toast: {
      autoClose: 5000,
      position: 'TOP_CENTER',
    }
  }
}, process.env.DOT_ENV_SETTINGS);

export const reverseRoute = (routeName, ...params) => {
  console.assert(settings.remote.routes, `"settings.remote.routes" not loaded for "${routeName}"!`);
  const route = settings.remote.routes[routeName]
  console.assert(route, 'Route not found: '+routeName);

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
  console.assert(!parsedPathname.includes('{'), 'Not all params filled: '+parsedPathname);
  return normalizeUrl(settings.remote.host + '/'+parsedPathname);
}

export default settings;
