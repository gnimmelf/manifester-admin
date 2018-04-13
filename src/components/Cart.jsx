// https://www.npmjs.com/package/babel-plugin-jsx-control-statements
import _debug from "debug";
import PropTypes from "prop-types";
import { connect } from "../state/RxState";
import { cartActions } from "../actions";
import {
  Button,
  ButtonGroup,
  FontAwesome as Fa,
} from 'my-ui-components';

const debug = _debug("component:cart")

const Cart = (props) => {
  debug("CART.props", props)
  return (
    <div>
      <h1>Cart...</h1>

      <ButtonGroup>
        <Button color="danger" onClick={props.clear$}><Fa icon="trash" /></Button>
        <Button color="primary" onClick={props.submit$}>Betal</Button>
      </ButtonGroup>

      <hr />

      <b>Reservations</b>
      <pre>{JSON.stringify(props.reservations, null, 2)}</pre>

      <hr />

      <b>Order</b>
      <pre>{JSON.stringify(props.order, null, 2)}</pre>


    </div>
  );
}

export default connect(({cart})=>cart, cartActions)(Cart);