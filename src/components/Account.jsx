import _debug from "debug";
import { connect } from "../state/RxState";
import PropTypes from "prop-types";

import { accountActions } from "../actions";

import Form from 'my-jsonschema-form';
import { Button, ButtonGroup } from 'my-ui-components';

import appCss from '../css/app.css';

const debug = _debug("components:account")

export const schema = {
  title: "Konto",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "Fornavn",
    },
    lastName: {
      type: "string",
      title: "Etternavn",
    },
    email: {
      type: "string",
      title: "E-mail address",
      format: "email",
    },
    mobile: {
      type: "string",
      title: "Telefon/mobil",
    },
  }
};

export const AccountForm = function(props) {
  debug("ACCOUNTFORM.props", props)
  return (

    <div styleName="appCss.form-container">
      <Form
          schema={schema}
          formData={props.formData}
          errorSchema={props.errorSchema}
          onSubmit={props.submit$}>
        <ButtonGroup>
          <Button onClick={props.reset$} id="reset">Resett</Button>
          <Button color="primary" type="submit">Lagre</Button>
        </ButtonGroup>
      </Form>
    </div>
  )
}

AccountForm.propTypes = {
  submit$: PropTypes.func.isRequired,
  reset$: PropTypes.func.isRequired,
};

export default connect(({ account, app }) => ({
  formData: app.user, // <-- This first, very important
  ...account,
}), accountActions)(AccountForm);