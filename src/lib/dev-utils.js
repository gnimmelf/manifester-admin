import dotProp from 'dot-prop'
import {
  axios,
  xhr,
  reverseRoute,
} from './xhr';
import settings from "./settings";


if (!process.env.ENV.startsWith('prod')) {

  console.warn("use 'localStorage.remoteHost' to override 'settings.remote.host'!");
  if (window.localStorage.remoteHost) {
    // Server cookie trumps all..
    settings.remote.host = window.localStorage.remoteHost;
  }

  console.warn("use 'localStorage.toastAutoClose' to override 'settings.ui.toast.autoClose'!");
  if (window.localStorage.toastAutoClose !== undefined) {
    // Server cookie trumps all..
    settings.ui.toast.autoClose = window.localStorage.toastAutoClose;
  }

  console.log("SETTINGS", settings)

  // Utils for debugging
  window.my = {
    settings: (k,v) => {
      if (k && v != undefined) return dotProp.set(settings, k, v);
      if (k && v == undefined) return dotProp.get(settings, k);
      if (!k && v == undefined) return {...settings};
    },
    axios: axios,
    reverseRoute: reverseRoute,
    xhr: (routeName, ...params) => {
      const method = routeName.startsWith('do.') ? 'post' : 'get';

      const route = my.reverseRoute(routeName, ...params)

      console.log(route)

      return (data={}, options={}) => axios[method](route, data, options).then(console.log);
    },
  }
}