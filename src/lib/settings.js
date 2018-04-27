import { join, normalize } from 'path';
import deepAssign from 'deep-assign';

const settings = deepAssign({
  remote: {
    host: "",
    routes: {
      "schemas": "/api/schemas/{filter}",
      "user:current": "/api/user/current",
      "user:logout": "/api/user/logout",
      "do.auth:requestCodeByEmail": "/api/auth/request",
      "do.auth:exchangeLoginCode2Token": "/api/auth/exchange",
    },
  },
  ui: {
    toast: {
      autoClose: 5000,
      position: 'TOP_CENTER',
    }
  }
}, process.env.DOT_ENV_SETTINGS);

export default settings;
