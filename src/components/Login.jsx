import _debug from "debug";
import { connect } from "../state/RxState";
import PropTypes from "prop-types";
import Form from 'jsonschema-form';
import { Button, ButtonGroup } from 'reactstrap';
import loginActions from "../actions/loginActions";

const debug = _debug("components:login")

export const schemas = {};

schemas.requestLoginCode = {
  title: "Request Login Code",
  type: "object",
  required: ["email"],
  properties: {
    email: {
      type: "string",
      title: "E-mail address",
      format: "email",
    },
  }
};

schemas.exchangeLoginCode = {
  title: "Exchange Login Code",
  type: "object",
  required: ["code"],
  properties: {
    email: schemas.requestLoginCode.properties.email,
    code: {
      type: "number",
      title: "Login Code",
    },
  }
};

export const LoginForm = function(props) {
  debug("LOGINFORM.props", props)
  return !props.schemaName ? Loading : (
    <Form
        schemaName={props.schemaName}
        authPath={props.authPath}
        schema={schemas[props.schemaName]}
        formData={props.formData}
        showErrorList={false}
        errorSchema={props.errorSchema}
        onSubmit={props.submit$}>
      <ButtonGroup>
        <Button onClick={props.reset$} id="reset">Reset</Button>
        <Button color="primary" type="submit">Submit</Button>
      </ButtonGroup>
    </Form>
  )
}

LoginForm.propTypes = {
  email: PropTypes.string,
  code: PropTypes.number,
  schemaName: PropTypes.string.required,
  login$: PropTypes.func.isRequired,
  reset$: PropTypes.func.isRequired,
};

const Loading = (<div>Loading...</div>);

export default connect(({ login }) => login, loginActions)(LoginForm);
