import _debug from "debug";
import { connect } from "../state/RxState";
import PropTypes from "prop-types";
import Form from 'my-jsonschema-form';
import { Nav, Link, Button, ButtonGroup } from 'my-ui-components';

import app from '../css/app.css';

import { loginActions } from "../actions";

const debug = _debug("component:login")

export const schemas = [
  {
    title: "Request a logincode by email",
    type: "object",
    required: ["email"],
    properties: {
      email: {
        type: "string",
        title: "E-mail address",
        format: "email",
      }
    }
  },
  {
    title: "Autheticate logincode",
    type: "object",
    required: ["code"],
    properties: {
      code: {
        type: "number",
        title: "Logincode",
      },

    }
  }
];

export const uiSchema =  {
  password: {
    "ui:widget": "password",
  }
};


export const LoginForm = function(props) {
  debug("LOGINFORM.props", props)

  const schema = schemas[props.stepIdx];

  return (
    <div styleName="app.dialog-container">
      <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={props.formData}
          errorSchema={props.errorSchema}
          onSubmit={props.submit$}>
        <ButtonGroup>
          <Button onClick={props.reset$} id="reset">Reset</Button>
          <Button color="primary" type="submit">Submit</Button>
        </ButtonGroup>

      </Form>

    </div>
  )
}

LoginForm.propTypes = {
  submit$: PropTypes.func.isRequired,
  reset$: PropTypes.func.isRequired,
};

export default connect(({ login }) => login, loginActions)(LoginForm);
