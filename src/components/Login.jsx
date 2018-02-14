import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from 'reactstrap';
import { connect, scopeState } from "../state/RxState";
import loginActions from "../actions/loginActions";

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
  // TODO! Check that required props are available before rendering...
  return !props.settings ? Loading : (
    <Form
        additionalProps={props.settings.authPath}
        schema={schemas[props.settings.schemaName]}
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
  login: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

const Loading = (<div>Loading...</div>);

export default connect(({login, authPath}) => ({
  ...login,
  settings: {
    authPath: authPath,
    schemaName: 'requestLoginCode',
  }
}), loginActions)(LoginForm);

