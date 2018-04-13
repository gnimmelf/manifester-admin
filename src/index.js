import _debug from "debug";
import './lib/dev-utils';
import ReactDOM from 'react-dom';
import { RxStateProvider, createState } from "./state/RxState";
import rootReducer$ from "./reducers";
import { getCssRootVar } from "./lib/utils";
import App from "./components/App.jsx";
import { ToastContainer, toast, style } from 'my-ui-components';
import settings from "./lib/settings";
// Set locales
import "my-accounting";

const debug = _debug("app");

// Restyle toasts
style({
  colorInfo: getCssRootVar('--info'),
  colorSuccess: getCssRootVar('--success'),
  colorWarning: getCssRootVar('--warning'),
  colorError: getCssRootVar('--error'),
});


const toastProps = {...settings.ui.toast};
toastProps.position = toast.POSITION[toastProps.position || 'TOP_RIGHT'];
toastProps.autoClose = parseInt(toastProps.autoClose) || false;

debug("toastProps", toastProps)

ReactDOM.render(
  <div>
    <ToastContainer
      className="toast-container"
      {...toastProps}
    />
    <RxStateProvider state$={createState(rootReducer$)}>
      <App />
    </RxStateProvider>
  </div>,
  document.getElementById("app"),
);