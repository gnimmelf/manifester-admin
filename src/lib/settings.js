import { join, normalize } from 'path';
import deepAssign from 'deep-assign';

const settings = deepAssign({
  remote: {
    host: "",
    routes: {
      "schemas": "/api/schemas", // START HERE! Figure out how to load the schemas!
      "current-user": "/api/user/current",
      "logout": "/api/user/logout",
      "do.requestCodeByEmail": "/api/auth/request",
      "do.exchangeLoginCode2Token": "/api/auth/exchange",
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
