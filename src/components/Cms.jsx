import _debug from "debug";
import { connect } from "../state/RxState";
import PropTypes from "prop-types";

import { cmsActions } from "../actions";

import appCss from '../css/app.css';

const debug = _debug("components:cms")

const SelectSchemaWidget = (props) => (
  <ul>
    <For each="schemaName" of={ props.schemaNames }>
      <li key={ schemaName }>{ schemaName }</li>
    </For>
  </ul>
)

const Cms = (props) => {
  debug("CMS.props", props)
  return (
    <div>
      <h1>CMS</h1>

      <Choose>
        <When condition={props.schemaNames}>

          <SelectSchemaWidget {...props} />

        </When>
      </Choose>
    </div>
  );
}

export default connect(({ cms, app }) => ({
  user: app.user,
  ...cms,
}), cmsActions, {
  componentDidMount: (props)=> (!props.schemaNames && cmsActions.fetchSchemas$.next()),
})(Cms);