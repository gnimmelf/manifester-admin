import _debug from "debug";
import { connect } from "../state/RxState";
import PropTypes from "prop-types";

import { registerActions } from "../actions";

import Form from 'my-jsonschema-form';
import { Button, ButtonGroup } from 'my-ui-components';

import app from '../css/app.css';

const debug = _debug("components:register")

export const schema = {
  title: "Opprett konto",
  type: "object",
  properties: {
    firstname: {
      type: "string",
      title: "Fornavn",
    },
    lastname: {
      type: "string",
      title: "Etternavn",
    },
    email: {
      type: "string",
      title: "E-post-addresse",
      format: "email",
    },
    mobile: {
      type: "string",
      title: "Mobilnummer",
      pattern: "[ 0-9]{8}",
    },
    password: {
      type: "string",
      title: "Nytt password",
    },
    'password_confirmation': {
      type: "string",
      title: "Bekreft password",
    },
  }
};

schema.required = Object.keys(schema.properties);

export const uiSchema =  {
  mobile: {
    "ui:help": "Merk! Krever smart-telefon med Vipps-app installert for betaling."
  },
  password: {
    "ui:widget": "password",
  },
  password_confirmation: {
    "ui:widget": "password",
  },
};

export const RegisterForm = function(props) {
  debug("REGISTERFORM.props", props)
  return (
    <div styleName="app.form-container">
      <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={props.formData}
          errorSchema={props.errorSchema}
          onSubmit={props.submit$}>

        <ButtonGroup>
          <Button onClick={props.reset$} id="reset">Resett</Button>
          <Button color="primary" type="submit">Opprett konto</Button>
        </ButtonGroup>
      </Form>
    </div>
  )
}

RegisterForm.propTypes = {
  submit$: PropTypes.func.isRequired,
  reset$: PropTypes.func.isRequired,
};

export default connect(({ register }) => register, registerActions)(RegisterForm);
