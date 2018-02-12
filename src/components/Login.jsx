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

const getSchema = (name => schemas[name || 'requestLoginCode']);

export const LoginForm = function(props) {
  return (
    <Form schema={getSchema(props.schemaName)}
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

const Loading = (<div>Loading...</div>);

LoginForm.propTypes = {
  email: PropTypes.string,
  login: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default connect(({login}) => ({...login}), loginActions)(LoginForm, Loading);

