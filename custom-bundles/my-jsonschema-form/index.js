import _debug from "debug";
import reactJsonschemaForm from "react-jsonschema-form";
import {
  getDefaultFormState,
  retrieveSchema,
  toIdSchema } from "react-jsonschema-form/lib/utils"
import dotProp from 'dot-prop';
import omit from 'object.omit';

const debug = _debug("lib:Form")

console.log("class Form extends reactJsonschemaForm")

class Form extends reactJsonschemaForm {
  constructor(props){
    super(props);
  }

  getStateFromProps(props) {
    const state = this.state || {};
    const schema = "schema" in props ? props.schema : this.props.schema;
    const uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
    const edit = typeof props.formData !== "undefined";
    const liveValidate = props.liveValidate || this.props.liveValidate;
    const mustValidate = edit && !props.noValidate && liveValidate;
    const { definitions } = schema;
    const formData = getDefaultFormState(schema, props.formData, definitions);
    const retrievedSchema = retrieveSchema(schema, definitions, formData);

    let errorSchema, errors;
    if (props.errorSchema) {
      errorSchema = props.errorSchema;
      errors = toErrorList(errorSchema);
    } else {
      ({ errors, errorSchema } =
        mustValidate
          ? this.validate(formData, schema)
          : {
              errors: state.errors || [],
              errorSchema: state.errorSchema || {},
            });
    }

    const additionalProps = omit(props, [
      "schema",
      "formData",
      "showErrorList",
      "errorSchema",
      "onSubmit",
      "children",
      "uiSchema",
      "noValidate",
      "liveValidate",
      "safeRenderCompletion",
      "noHtml5Validate",
      "idSchema",
      "ErrorList",
      "errors"]);

    const idSchema = toIdSchema(
      retrievedSchema,
      uiSchema["ui:rootFieldId"],
      definitions,
      formData,
      props.idPrefix
    );

    return {
      ...additionalProps,
      schema,
      uiSchema,
      idSchema,
      formData,
      edit,
      errors,
      errorSchema,
    };
  }

}

// Export a wrapper function aound `Form` to overrride defaults.
export default ({showErrorList=false, children, ...props}) => {
  return React.createElement(Form, {showErrorList: showErrorList, ...props}, children);
}

export const addSchemaError = (errorSchema, keys, ...errors) => {

  let errorsKey,
      prevErrors,
      nextErrors;

  const newSchema = (keys instanceof Array ? keys : [keys]).reduce((schema, key) => {
    errorsKey = key+'.__errors';

    // Flatten
    prevErrors = [].concat(...errors, ...dotProp.get(schema, errorsKey, []))

    // Remove duplicates
    nextErrors = Array.from(new Set(prevErrors));

    dotProp.set(schema, errorsKey, nextErrors);
    return schema;
  }, {...errorSchema})

  return newSchema;
}

export const toErrorList = (errorSchema, fieldName = "root") =>
/*
Taken directly from:
  https://github.com/mozilla-services/react-jsonschema-form/blob/158fd6465b46ba232864727a05704bf3708d2c5e/src/validate.js#L67
-Must propbably be updated for next version of react-jsonschema-form
*/
{
  // Extract anything from the `__error`-prop
  const errorList = (errorSchema.__errors || []).map(stack => ({ stack: `${fieldName}: ${stack}` }));

  // Extend `errorList` by recursing into `errorSchema`-entries
  const recursedList = errorList.concat(Object.entries(errorSchema)
    .filter(([key, value]) => key !== "__errors")
    .map(([key, value]) => toErrorList(value, key)));

  debug("errorList", errorList)

  return recursedList;
}
