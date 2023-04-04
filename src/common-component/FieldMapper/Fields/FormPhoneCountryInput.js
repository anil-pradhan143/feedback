import React, { useState } from "react";
import { Typography } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import PropTypes from "prop-types";

import { ERROR_TEXTS, defaultCountry } from "../helpers";

import "react-phone-number-input/style.css";
import "../styles.css";

/**
 * @returns
 * Phone number Fields with respective validations and country selections
 * this field requires clearErrors in props
 */

export const FormPhoneCountryInput = (props) => {
  const [stateNumber, setStateNumber] = useState("");
  const {
    register,
    name,
    isFieldRequired,
    errors,
    items,
    setError,
    clearErrors,
    onChange,
  } = props;

  const handleValidate = (value) => {
    if (value) {
      onChange(name,value)
      setStateNumber(value.replace(/\s/g, ""))
      const isValid = isValidPhoneNumber(value);
      if (!isValid) {
        return setError(name, { message: ERROR_TEXTS.phoneNumberInvalid });
      }
      clearErrors(name);
    }
  };
  const errorMapper = (error) => {
    const errorText = error.message || "Error";
    return errorText;
  };

  return (
    <>
      <div className={"form-country-input-wrapper"}>
        <PhoneInput
          {...register(name, {
            required: isFieldRequired,
            minLength: {
              value: 5,
              message: ERROR_TEXTS.invalidPhoneNumber,
            },
          })}
          defaultCountry={defaultCountry}
          international
          value={stateNumber}
          countryCallingCodeEditable={true}
          onChange={handleValidate}
        />
      </div>
      {errors?.[items.value] && (
        <Typography className={"errorTextStyle"} variant={"caption"}>
          {errorMapper(errors?.[items.value])}
        </Typography>
      )}
    </>
  );
};

FormPhoneCountryInput.propTypes = {
  name: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.object,
  items: PropTypes.object,
  setError: PropTypes.func,
  clearErrors: PropTypes.func,
};
