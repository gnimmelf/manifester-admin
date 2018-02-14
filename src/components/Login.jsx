import PropTypes from "prop-types";
import { Button, ButtonGroup } from 'reactstrap';
import { connect } from "../state/RxState";
import Form from '../lib/Form';
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
  console.log("LOGINFORM.props", props)
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
