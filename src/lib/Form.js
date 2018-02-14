import React, { Component } from "react";
import JSONForm from "react-jsonschema-form";

export default class Form extends JSONForm {
  constructor(props){
    super(props);

    let errors, errorSchema;
    if (props.errorSchema) {
      errorSchema = props.errorSchema;
      errors = toErrorList(errorSchema);
    } else {
      ({ errors, errorSchema } =
        !props.noValidate && this.liveValidate
          ? this.validate(formData, schema)
          : {
              errors: this.state.errors || [],
              errorSchema: this.state.errorSchema || {},
            });
    }

    // console.log("additionalProps", this.state, Object.entries(props.additionalProps || {}))
    // Object.entries(props.additionalProps || {}).reduce((acc, [key, value]) => {
    //   if (acc[!key]) acc[key] = value;
    //   else console.warn(`Form.state: ${key} is alleady set!`);
    //   return acc;
    // }, this.state)

    console.log("STATE", this.state)
  }
}
