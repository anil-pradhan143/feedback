import { emailPattern } from "./patterns";

export const ERROR_TEXTS = {
  emptyStringText: "Please enter your name!",
  phoneNumberInvalid: "Please enter a valid Phone number!",
  emailInvalid: "Please enter a valid email address!",
  invalidPhoneNumber: "Please enter a valid Phone number!",
};

export const FIELD_NAMES = {
  NAME: "name",
  EMAIL: "email",
  MOBILE: "mobile",
};

export const emailRules = {
  pattern: emailPattern,
};

export const defaultCountry = "ae";
