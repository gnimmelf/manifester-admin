import _debug from "debug";
import { connect } from "../state/RxState";
import { basename } from "path";
import PropTypes from "prop-types";
import dotProp from "dot-prop";

import { cmsActions } from "../actions";

import CmsJsonSchemaForm from "./partials/CmsJsonSchemaForm.jsx";

import {
  Link,
  Button,
  FontAwesome as Fa,
} from 'my-ui-components'


import cmsCss from '../css/cms.css';

const debug = _debug("components:cms")

const SchemaGroupItems = ({children, itemGenerator}) => {
  return (
    <For each="group" of={children}>

      {itemGenerator(group)}

      <If condition={group.children && group.children.length}>
        <ul>
          <SchemaGroupItems children={group.children} itemGenerator={itemGenerator} />
        </ul>
      </If>

    </For>
  )
};

const SelectSchemaWidget = (props) => {

  const itemGenerator = (group) => group.isLeaf ?
    (<li styleName="cmsCss.leaf" onClick={ ()=>props.selectSchema$(group.id) }>{group.name}</li>) :
    (<li>{group.name}</li>);

  return (
    <ul>
      <SchemaGroupItems children={props.schemaGroups} itemGenerator={itemGenerator} />
    </ul>
  )
}

const Cms = (props) => {
  debug("CMS.props", props)
  return (
    <div>
      <h1>CMS</h1>

      <Choose>
        <When condition={props.schemaGroups}>

          <SelectSchemaWidget {...props} />

        </When>

      </Choose>

      <CmsJsonSchemaForm {...props} schema={props.currentSchema} />

    </div>
  );
}

export default connect(({ cms, app }) => ({
  user: app.user,
  ...cms,
}), cmsActions, {
  componentDidMount: (props)=> (!props.schemaNames && cmsActions.fetchSchemas$.next()),
})(Cms);