import { useVuelidate } from "@vuelidate/core";
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
  sameAs,
} from "@vuelidate/validators";
import { computed, reactive, watchEffect } from "vue";

import { PASSWORD_POLICY } from "@/utils/constants";
import { REGEX } from "@/utils/regex";
import { MESSAGES } from "@/utils/messages";

const initPolicyState = {
  isLengthValid: false,
  hasUppercase: false,
  hasLowercase: false,
  hasNumber: false,
  hasSpecialChar: false,
};

export const createValidation = () => {
  // Password policy validation function
  const policy = (password, policyConfig = PASSWORD_POLICY) => {
    const validationResults = reactive({ ...initPolicyState });

    // Watch for password changes and update validation results
    watchEffect(() => {
      const { value } = password;
      if (!value) {
        Object.assign(validationResults, initPolicyState);
      } else {
        validationResults.isLengthValid =
          value.length >= policyConfig.minLength &&
          value.length <= policyConfig.maxLength;
        validationResults.hasUppercase = REGEX.UPPERCASE.test(value);
        validationResults.hasLowercase = REGEX.LOWERCASE.test(value);
        validationResults.hasNumber = REGEX.NUMBER.test(value);
        validationResults.hasSpecialChar = REGEX.SPECIAL_CHAR.test(value);
      }
    });

    return validationResults;
  };

  return {
    required: (message = "") =>
      helpers.withMessage(message || MESSAGES.required, required),

    minLength: (minLen = LENGTH.MIN.DEFAULT, message = "") =>
      helpers.withMessage(
        message || MESSAGES.min_length(minLen),
        minLength(minLen)
      ),

    maxLength: (maxLen = LENGTH.MAX.DEFAULT, message = "") =>
      helpers.withMessage(
        message || MESSAGES.max_length(maxLen),
        maxLength(maxLen)
      ),

    email: ({ isRequired = true } = {}) => {
      const validationRules = {};

      if (isRequired) {
        validationRules.required = helpers.withMessage(
          MESSAGES.email_required,
          required
        );
      }

      validationRules.policy = helpers.withMessage(MESSAGES.email, email);

      return validationRules;
    },

    password: (policy = PASSWORD_POLICY) => {
      const validationRules = {
        required: helpers.withMessage(MESSAGES.password_required, required),
      };

      // Only add validation rules if they are enabled in the policy
      if (policy?.hasLowercase) {
        validationRules.hasLowercase = helpers.withMessage(
          MESSAGES.password_has_lowercase,
          (value) => REGEX.LOWERCASE.test(value)
        );
      }

      if (policy?.hasUppercase) {
        validationRules.hasUppercase = helpers.withMessage(
          MESSAGES.password_has_uppercase,
          (value) => REGEX.UPPERCASE.test(value)
        );
      }

      if (policy?.hasNumber) {
        validationRules.hasNumber = helpers.withMessage(
          MESSAGES.password_has_number,
          (value) => REGEX.NUMBER.test(value)
        );
      }

      if (policy?.hasSpecialChar) {
        validationRules.hasSpecialChar = helpers.withMessage(
          MESSAGES.password_has_special_char,
          (value) => REGEX.SPECIAL_CHAR.test(value)
        );
      }

      validationRules.minLength = helpers.withMessage(
        MESSAGES.password_min_length(policy?.minLength),
        minLength(policy?.minLength)
      );

      validationRules.maxLength = helpers.withMessage(
        MESSAGES.password_max_length(policy?.maxLength),
        maxLength(policy?.maxLength)
      );

      return validationRules;
    },

    confirmPassword: (target) => {
      const validationRules = {};

      validationRules.required = helpers.withMessage(
        MESSAGES.password_required,
        required
      );

      validationRules.sameAs = helpers.withMessage(
        MESSAGES.password_match_confirm_password,
        sameAs(target)
      );

      return validationRules;
    },

    sameAs: (target, message = "") =>
      helpers.withMessage(
        message || MESSAGES.fields_must_match,
        sameAs(target)
      ),

    // Password policy validation
    policy,
  };
};

export function useFormValidation(rules, formData, options = {}) {
  const defaultOptions = {
    $autoDirty: true,
    ...options,
  };

  const v$ = useVuelidate(rules, formData, defaultOptions);

  const isValid = computed(() => !v$.value.$invalid);
  const hasErrors = computed(() => v$.value.$error);

  const getError = (fieldName) => {
    const field = v$.value[fieldName];
    return field?.$errors?.[0]?.$message ?? "";
  };

  const hasError = (fieldName) => {
    const field = v$.value[fieldName];
    return field?.$error ?? false;
  };

  const validateForm = () => {
    return v$.value.$validate();
  };

  const resetValidation = () => {
    v$.value.$reset();
  };

  const touch = (fieldName) => {
    const field = v$.value[fieldName];
    field?.$touch?.();
  };

  return {
    v$,
    isValid,
    hasErrors,
    getError,
    hasError,
    validateForm,
    resetValidation,
    touch,
  };
}
