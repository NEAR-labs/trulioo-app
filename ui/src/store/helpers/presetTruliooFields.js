const presetTruliooFields = (schemaObj, formDataObj) => {
  for (const [formDataKey, formDataVal] of Object.entries(formDataObj)) {
    if (schemaObj[formDataKey] && !schemaObj[formDataKey].properties) {
      schemaObj[formDataKey].default = formDataVal;
    }
    if (schemaObj[formDataKey] && schemaObj[formDataKey].properties) {
      presetTruliooFields(schemaObj[formDataKey].properties, formDataVal);
    }
  }
};

export { presetTruliooFields };
