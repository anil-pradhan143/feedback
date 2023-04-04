import { emailPattern } from "./patterns";

export const ERROR_TEXTS = {
  emptyStringText: "Field required",
  phoneNumberInvalid: "Phone number invalid",
  emailInvalid: "Email is invalid",
  invalidPhoneNumber: "Phone number is invalid",
};

export const FIELD_NAMES = {
  NAME: "name",
  EMAIL: "email",
  MOBILE: "mobile",
};

export const emailRules = {
  pattern: emailPattern,
};

export const defaultCountry = "AE";
