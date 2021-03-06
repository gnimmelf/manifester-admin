// https://www.npmjs.com/package/babel-plugin-jsx-control-statements
import _debug from "debug";
import PropTypes from "prop-types";
import { connect } from "../state/RxState";

import { navTopActions } from "../actions";

import appCss from '../css/app.css';
import navTopCss from '../css/nav-top.css';

import {
  Nav,
  Navbar,
  NavbarToggler,
  NavLink,
  NavItem,
  NavbarBrand,
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Link,
  Button,
  FontAwesome as Fa,
} from 'my-ui-components';

const debug = _debug("component:navtop")

export const NavItems = (props) => {
  debug("NavItems.props", props)
  return (
    <With location={props.location.pathname} user={props.user}>

      <Choose>
        <When condition={user}>

          <With url={'/account'}>
            <With isActive={url==location}>
              <NavItem active={isActive}>
                <NavLink onClick={()=>props.accountDropdown$('CLOSE')}
                         active={isActive} href={url}>My account</NavLink>
              </NavItem>
            </With>
          </With>

          <With url={'/logout'}>
            <With isActive={url==location}>
              <NavItem active={isActive}>
                <NavLink href="" onClick={props.logout$}>Log out</NavLink>
              </NavItem>
            </With>
          </With>

        </When>

      </Choose>
    </With>
  )
}

const NavTop = (props) => {
  debug("NAVTOP.props", props);
  return (
    <Navbar color="faded" light expand="md" styleName="navTopCss.nav-bar">
      <NavbarBrand href="/">Manifester</NavbarBrand>

      <NavbarToggler onClick={() => props.navbarToggler$('TOGGLE')} />
      <Collapse isOpen={props.navbarIsOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItems {...props} />
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default connect(({navTop}) => navTop, navTopActions)(NavTop);