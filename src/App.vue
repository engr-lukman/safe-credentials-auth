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
          Login
        </h2>
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
          :id="FIELDS.PASSWORD"
          v-model="payload[FIELDS.PASSWORD]"
          :name="FIELDS.PASSWORD"
          :label="'Password'"
          :placeholder="'Enter your password'"
          :has-error="hasError(FIELDS.PASSWORD)"
          :error-message="getError(FIELDS.PASSWORD)"
          @blur="touch(FIELDS.PASSWORD)"
          @enter="onSubmitHandler"
        />
        <primary-button
          :disabled="!isEnabled"
          :loading="loading"
          full-width
          class="w-full py-3 mt-2"
          @click="onSubmitHandler"
        >
          Login
        </primary-button>
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
  EMAIL: "email",
  PASSWORD: "password",
};

const payload = reactive({
  [FIELDS.EMAIL]: "",
  [FIELDS.PASSWORD]: "",
});

const validation = createValidation();

const rules = {
  [FIELDS.EMAIL]: validation.email(),
  [FIELDS.PASSWORD]: {
    required: validation.required(),
  },
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
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>
