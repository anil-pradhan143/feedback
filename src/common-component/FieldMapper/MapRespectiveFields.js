import React from "react";
import { ERROR_TEXTS, FIELD_NAMES, emailRules } from "./helpers";
import { FormTextField, FormPhoneCountryInput } from "./Fields";
import PropTypes from "prop-types";

import "./styles.css";
/**
 * @returns an mapper which maps to respective fields as specified
 * this component maps proper form fields like phn number and email and so on
 */

export const MapRespectiveFields = (props) => {
  const {
    items,
    register,
    fieldsFormData,
    defaultValues,
    mandatoryArrayIndex,
    index,
    currentPage,
    errors,
    setError,
    clearErrors,
    onChange,
    control,
    setValue
  } = props;

  const fieldValue =
    fieldsFormData?.[`page${currentPage}`]?.[items?.value] ??
    defaultValues[items?.value];

  const isFieldRequired =
    mandatoryArrayIndex[index] >= 0 ? ERROR_TEXTS.emptyStringText : false;

  const renderTextField = ({
    name,
    isFieldRequired,
    value,
    type,
    rules,
    onChange,
    control
  }) => {
    return (
      <FormTextField
        {...{
          name,
          isFieldRequired,
          value,
          type,
          rules,
          errors,
          items,
          register,
          onChange,
          control
        }}
      />
    );
  };
  const renderPhoneField = ({
    name,
    isFieldRequired,
    value,
    type,
    rules,
    setError,
    onChange,
    setValue,
    control
  }) => {
    const fieldVAluesTemp  = fieldsFormData?.[`page${currentPage}`]?.value || {}
    const temp2 = fieldVAluesTemp&& fieldVAluesTemp || ''
    const defaultValue = temp2[name]
    return (
      <FormPhoneCountryInput
        {...{
          name,
          defaultValue,
          isFieldRequired,
          value,
          type,
          rules,
          errors,
          items,
          register,
          setError,
          clearErrors,
          onChange,
          setValue,
          control
        }}
      />
    );
  };

  const switchFieldsRenderer = ({
    name,
    isFieldRequired,
    value,
    setError,
    clearErrors,
    onChange,
    control,
    setValue,

  }) => {
    switch (name) {
      case FIELD_NAMES.NAME:
        return renderTextField({
          name,
          isFieldRequired,
          value,
          onChange,
          control
        });
      case FIELD_NAMES.MOBILE:
        return renderPhoneField({
          name,
          isFieldRequired,
          value,
          setError,
          clearErrors,
          onChange,
          setValue,
          control
        });
      case FIELD_NAMES.EMAIL:
        return renderTextField({
          name,
          isFieldRequired,
          value,
          rules: emailRules,
          onChange,
          control
        });
      default:
        return renderTextField({
          name,
          isFieldRequired,
          value,
          onChange,
          control
        });
    }
  };

  return switchFieldsRenderer({
    name: items.value,
    isFieldRequired,
    value: fieldValue,
    setError,
    clearErrors,
    onChange,
    control,
    setValue
  });
};

MapRespectiveFields.propTypes = {
  items: PropTypes.object,
  register: PropTypes.func,
  fieldsFormData: PropTypes.object,
  defaultValues: PropTypes.object,
  mandatoryArrayIndex: PropTypes.array,
  index: PropTypes.number,
  currentPage: PropTypes.number,
  errors: PropTypes.object,
  setError: PropTypes.func,
  clearErrors: PropTypes.func,
};
