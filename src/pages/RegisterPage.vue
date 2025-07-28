<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
  >
    <div
      class="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-lg p-8"
    >
      <form @submit.prevent class="space-y-7">
        <h2
          class="text-center text-2xl font-bold text-gray-900 mb-6 tracking-tight"
        >
          Register
        </h2>

        <text-field
          :id="FIELDS.FULL_NAME"
          v-model="payload[FIELDS.FULL_NAME]"
          :name="FIELDS.FULL_NAME"
          :label="'Full Name'"
          :placeholder="'Enter your full name'"
          :has-error="hasError(FIELDS.FULL_NAME)"
          :error-message="getError(FIELDS.FULL_NAME)"
          @blur="touch(FIELDS.FULL_NAME)"
        />

        <text-field
          :id="FIELDS.EMAIL"
          v-model="payload[FIELDS.EMAIL]"
          :name="FIELDS.EMAIL"
          :label="'Email ID'"
          :placeholder="'Enter your email'"
          :has-error="hasError(FIELDS.EMAIL)"
          :error-message="getError(FIELDS.EMAIL)"
          @blur="touch(FIELDS.EMAIL)"
          @keypress.enter="onSubmitHandler"
        />

        <password-field
          :id="FIELDS.NEW_PASSWORD"
          v-model="payload[FIELDS.NEW_PASSWORD]"
          :name="FIELDS.NEW_PASSWORD"
          :label="'New Password'"
          :placeholder="'Enter your new password'"
          :show-policy="true"
          :has-error="hasError(FIELDS.NEW_PASSWORD)"
          :error-message="getError(FIELDS.NEW_PASSWORD)"
          @blur="touch(FIELDS.NEW_PASSWORD)"
          @enter="onSubmitHandler"
        />

        <password-field
          :id="FIELDS.CONFIRM_PASSWORD"
          v-model="payload[FIELDS.CONFIRM_PASSWORD]"
          :name="FIELDS.CONFIRM_PASSWORD"
          :label="'Confirm Password'"
          :placeholder="'Re-enter your new password'"
          :has-error="hasError(FIELDS.CONFIRM_PASSWORD)"
          :error-message="getError(FIELDS.CONFIRM_PASSWORD)"
          @blur="touch(FIELDS.CONFIRM_PASSWORD)"
          @enter="onSubmitHandler"
        />

        <primary-button
          :disabled="!isEnabled"
          :loading="loading"
          full-width
          class="w-full py-3 mt-2"
          @click="onSubmitHandler"
        >
          Register
        </primary-button>

        <div class="text-center mt-4">
          <router-link to="/" class="text-blue-600 hover:underline">
            Already have an account? Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import PasswordField from "@/components/PasswordField.vue";
import TextField from "@/components/TextField.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import {
  createValidation,
  useFormValidation,
} from "@/composables/useFormValidation";

const loading = ref(false);

const FIELDS = {
  FULL_NAME: "fullName",
  EMAIL: "email",
  NEW_PASSWORD: "newPassword",
  CONFIRM_PASSWORD: "confirmPassword",
};

const payload = reactive({
  [FIELDS.FULL_NAME]: "",
  [FIELDS.EMAIL]: "",
  [FIELDS.NEW_PASSWORD]: "",
  [FIELDS.CONFIRM_PASSWORD]: "",
});

const validation = createValidation();

const rules = {
  [FIELDS.FULL_NAME]: {
    required: validation.required(),
  },
  [FIELDS.EMAIL]: validation.email(),
  [FIELDS.NEW_PASSWORD]: validation.password(),
  [FIELDS.CONFIRM_PASSWORD]: validation.confirmPassword(
    computed(() => payload[FIELDS.NEW_PASSWORD])
  ),
};

const { isValid, hasError, getError, touch } = useFormValidation(
  rules,
  payload
);

const isEnabled = computed(() => isValid.value);

const onSubmitHandler = async () => {
  try {
    if (loading.value || !isEnabled.value) return;
    loading.value = true;
    // Simulate registration process
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (error) {
    console.error("Registration failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>
