import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from 'reactstrap';
import { connect, scopeState } from "../state/RxState";
import loginActions from "../actions/loginActions";

export const schema = {
  title: "Login",
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

const log = (evt) => console.log.bind(console, evt);

export const LoginForm = (props) => {
  return (
    <Form schema={schema}
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
  login: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default connect(({login}) => ({...login}), loginActions)(LoginForm);

