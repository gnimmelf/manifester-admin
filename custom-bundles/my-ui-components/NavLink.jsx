import { NavLink as BaseNavLink} from "reactstrap";
import history from "my-history-singleton";

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class NavLink extends BaseNavLink {

  onClick(event) {
    if (this.props.disabled) {
      event.preventDefault();
      return;
    }


    if (this.props.onClick) {
      this.props.onClick(event);
    }


    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(this.props.href);
  };
}

export default NavLink;