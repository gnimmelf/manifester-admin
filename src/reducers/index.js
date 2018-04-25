import { Observable } from "rxjs";
import navTopReducer$ from "./navTopReducer";
import appReducer$ from "./appReducer";
import loginReducer$ from "./loginReducer";
import flashMessageReducer$ from "./flashMessageReducer";
import accountReducer$ from "./accountReducer";
import cmsReducer$ from "./cmsReducer";


const rootReducer$ = Observable.merge(
  navTopReducer$.map(reducer => ["navTop", reducer]),
  appReducer$.map(reducer => ["app", reducer]),
  loginReducer$.map(reducer => ["login", reducer]),
  flashMessageReducer$.map(reducer => ["flashMessage", reducer]),
  accountReducer$.map(reducer => ["account", reducer]),
  cmsReducer$.map(reducer => ["cms", reducer]),
);

export default rootReducer$;