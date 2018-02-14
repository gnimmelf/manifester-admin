import React, { Component } from "react";
import JSONForm from "react-jsonschema-form";

export default class Form extends JSONForm {
  constructor(props){
    super(props);

    // Set `additionalProps` on `this.state`...
    const {
      schema,
      formData,
      showErrorList,
      errorSchema,
      onSubmit,
      children,
      uiSchema,
      noValidate,
      liveValidate,
      safeRenderCompletion,
      noHtml5Validate,
      idSchema,
      ErrorList,
      ...additionalProps} = props;

    Object.entries(additionalProps).reduce((acc, [key, value]) => {
      // console.log("PROP", key, value, acc[!key])
      if (!acc[key]) acc[key] = value;
      return acc;
    }, this.state)

    console.log("FORM.props", this.state)
  }
}
