import Form from "react-jsonschema-form";

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

const LoginForm = () => (
  <div className="card w-75">
    <div className="card-block">
      <Form schema={schema}
          onChange={log("changed")}
          onSubmit={log("submitted")}
          onError={log("errors")} />
    </div>
  </div>
)

export default LoginForm;