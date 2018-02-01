import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from 'reactstrap';
import { connect } from "../state/RxState";
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
      //"pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
    },
  }
};

const log = (evt) => console.log.bind(console, evt);

export const LoginForm = ({login, submit, reset}) => {
  console.log("LoginForm", login, submit, reset)
  return (
    <Form schema={schema}
        formData={{email: login.email}}
        showErrorList={false}
        onSubmit={submit}
        onError={log("errors")}>
      <ButtonGroup>
        <Button onClick={reset} id="reset">Reset</Button>
        <Button color="primary" type="submit">Submit</Button>
      </ButtonGroup>
    </Form>
  )
}


LoginForm.propTypes = {
  email: PropTypes.string,
  login: PropTypes.func.isRequired,
};

export default connect(({ login }) => ({ login }), loginActions)(LoginForm);
