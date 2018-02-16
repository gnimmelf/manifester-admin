import _debug from "debug";
import reactJsonschemaForm from "react-jsonschema-form";
import {
  getDefaultFormState,
  retrieveSchema,
  toIdSchema } from "react-jsonschema-form/lib/utils"
import dotProp from 'dot-prop';
import omit from 'object.omit';

const debug = _debug("lib:Form")

export default class Form extends reactJsonschemaForm {
  constructor(props){

    console.log("class Form extends reactJsonschemaForm")

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
      schema,
      uiSchema,
      idSchema,
      formData,
      edit,
      errors,
      errorSchema,
      additionalProps,
    };
  }

}

export const addSchemaError = (schema, key, ...errors) => {
  const errorsKey = key+'.__errors';

  const value = Array.from(new Set(dotProp.get(schema, errorsKey, []).concat(errors)));

  const newSchema = { ...schema };

  dotProp.set(newSchema, errorsKey, value);

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
