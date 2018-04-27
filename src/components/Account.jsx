import _debug from "debug";
import { connect } from "../state/RxState";
import PropTypes from "prop-types";

import { accountActions } from "../actions";

import Form from 'my-jsonschema-form';
import { Button, ButtonGroup } from 'my-ui-components';

import appCss from '../css/app.css';

const debug = _debug("components:account")

export const AccountForm = function(props) {
  debug("ACCOUNTFORM.props", props)
  return (
    <div styleName="appCss.form-container">
      <Choose>
        <When condition={props.schema}>

          <Form
              schema={props.schema}
              formData={props.formData}
              errorSchema={props.errorSchema}
              onSubmit={props.submit$}>
            <ButtonGroup>
              <Button onClick={props.reset$} id="reset">Resett</Button>
              <Button color="primary" type="submit">Lagre</Button>
            </ButtonGroup>
          </Form>

        </When>
      </Choose>
    </div>
  )
}

export default connect(({ account, app }) => ({
  formData: app.user, // <-- This first, very important
  ...account,
}), accountActions, {
  componentDidMount: (props)=> (!props.schema && accountActions.fetchSchema$.next()),
})(AccountForm);