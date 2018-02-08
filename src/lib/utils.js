import dotProp from 'dot-prop';

export const addSchemaError = (schema, key, ...errors) => {
  const errorsKey = key+'.__errors';

  const value = Array.from(new Set(dotProp.get(schema, errorsKey, []).concat(errors)));

  const newSchema = { ...schema };

  dotProp.set(newSchema, errorsKey, value);

  return newSchema;

}

export const log = (...data) => console.log.bind(console, ...data);