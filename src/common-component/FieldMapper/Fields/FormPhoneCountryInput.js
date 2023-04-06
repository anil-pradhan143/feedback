import React, { useState } from "react";
import { Typography } from "@mui/material";
import { isValidPhoneNumber } from "react-phone-number-input";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";

import { ERROR_TEXTS, defaultCountry } from "../helpers";

import "react-phone-number-input/style.css";
import "../styles.css";
import "react-phone-input-2/lib/style.css";
import { Controller } from "react-hook-form";
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
    setValue,
    control,
  } = props;

  const handleValidate = (value) => {
    if (value) {
      onChange(name, value);
      setStateNumber(value.replace(/\s/g, ""));
      setValue(name, value.replace(/\s/g, ""));
      const isValid = isValidPhoneNumber("+" + value);
      if (!isValid) {
        return ERROR_TEXTS.invalidPhoneNumber;
      }
    }
  };
  const errorMapper = (error) => {
    const errorText = error.message || "Error";
    return errorText;
  };

  return (
    <>
      <div className={"form-country-input-wrapper"}>
        <Controller
          control={control}
          name={name}
          rules={{
            required: "Please enter a valid phone number!",
            validate: (value) => handleValidate(value),
          }}
          render={({ field: { ref, ...field } }) => {
            return (
              <PhoneInput
                enableSearch={true}
                {...field}
                innerRef={ref}
                country={defaultCountry}
                international
                value={stateNumber}
                countryCallingCodeEditable={true}
              />
            );
          }}
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
