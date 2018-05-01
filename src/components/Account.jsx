import _debug from "debug";
import { connect } from "../state/RxState";

import { accountActions } from "../actions";

import CmsJsonSchemaForm from "./partials/CmsJsonSchemaForm.jsx";

const debug = _debug("components:account")

export default connect(({ account, app }) => ({
  formData: app.user, // <-- This first, very important
  ...account,
}), accountActions, {
  componentDidMount: (props)=> (!props.schema && accountActions.fetchSchema$.next()),
})(CmsJsonSchemaForm);