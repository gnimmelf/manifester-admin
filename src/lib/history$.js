import _debug from "debug";
import { Observable } from "rxjs";
import history from "my-history-singleton";
import { toast } from 'my-ui-components';

const debug = _debug("lib:history$");

let currentPathname;
export const locationChangeFilter = (location) => {
  if (location.state.flashMessage) {
    toast.info(location.state.flashMessage);
  }

  if (currentPathname != location.pathname){
    currentPathname = location.pathname;
    return true
  }
}

const history$ = Observable.create(obs => {
    history.listen(obs.next.bind(obs))
  })
  .startWith(history.location)
  .map(location => ({
    ...location,
    state: location.state||{},
  }))
  .debug(debug, "history$ >")
  .filter(locationChangeFilter)
  .debug(debug, "history$ >>");

export default history$;