import _debug from "debug";
import PropTypes from "prop-types";
import { connect } from "../state/RxState";
import adminActions from "../actions/adminActions";

const debug = _debug("components:admin")

export const Admin = function(props) {
  debug("ADMIN.props", props)
  return !props.schemas ? Loading : (
    <h1>Admin comming..</h1>
  )
}

const Loading = (<div>Loading...</div>);

export default connect(({ admin }) => admin, adminActions)(Admin);