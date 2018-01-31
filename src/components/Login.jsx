import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
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
    },
  }
};

const log = (evt) => console.log.bind(console, evt);

export const LoginForm = ({login, submit, reset}) => {
  console.log("LoginForm", login, submit, reset)
  return (
    <Form schema={schema}
        formData={{email: login.email}}
        onSubmit={submit}
        onError={log("errors")}>
      <div classname="btn-group">
        <button className="btn btn-secondary" onClick={reset} id="reset">Reset</button>
        <button className="btn btn-primary" type="submit">Submit</button>
      </div>
    </Form>
  )
}


LoginForm.propTypes = {
  email: PropTypes.string,
  login: PropTypes.func.isRequired,
};

export default connect(({ login }) => ({ login }), loginActions)(LoginForm);
