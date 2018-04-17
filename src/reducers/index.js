import { Observable } from "rxjs";
import appReducer$ from "./appReducer";
import loginReducer$ from "./loginReducer";
import registerReducer$ from "./registerReducer";
import navTopReducer$ from "./navTopReducer";
import flashMessageReducer$ from "./flashMessageReducer";
import accountReducer$ from "./accountReducer";
import bookingReducer$ from "./bookingReducer";
import cartReducer$ from "./cartReducer";


const rootReducer$ = Observable.merge(
  appReducer$.map(reducer => ["app", reducer]),
  loginReducer$.map(reducer => ["login", reducer]),
  registerReducer$.map(reducer => ["register", reducer]),
  navTopReducer$.map(reducer => ["navTop", reducer]),
  flashMessageReducer$.map(reducer => ["flashMessage", reducer]),
  accountReducer$.map(reducer => ["account", reducer]),
  //bookingReducer$.map(reducer => ["booking", reducer]),
  //cartReducer$.map(reducer => ["cart", reducer]),
);

export default rootReducer$;