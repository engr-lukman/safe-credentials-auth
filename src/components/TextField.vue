<template>
  <div class="w-full ui-form-field">
    <label
      v-if="label"
      :for="id || 'text'"
      class="mb-1 block text-base font-medium text-gray-700"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>
    <div class="relative">
      <!-- Prepend Icon -->
      <div
        v-if="prependIcon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <material-icon :name="prependIcon" />
      </div>
      <div
        v-else-if="prependIconCustom"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        {{ prependIconCustom }}
      </div>

      <input
        :id="id || 'text'"
        v-model="inputValue"
        :type="type"
        :class="
          clsx(
            'block w-full rounded-md border transition-colors duration-200 focus:ring-1 focus:outline-none text-base text-gray-900 placeholder-gray-400 ui-input',
            disabled && 'cursor-not-allowed bg-gray-100 text-gray-400',
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500 placeholder-red-500'
              : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400',
            prependIcon && appendIcon
              ? 'py-2 pr-10 pl-10'
              : prependIcon || prependIconCustom
              ? 'py-2 pr-3 pl-10'
              : appendIcon
              ? 'py-2 pr-10 pl-3'
              : 'px-3 py-2'
          )
        "
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
        @change="onChange"
        @keydown="onKeydown"
        @keyup="onKeyup"
        @keypress="onKeypress"
      />

      <!-- Append Icon -->
      <div
        v-if="appendIcon"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <material-icon :name="appendIcon" />
      </div>
    </div>
    <div v-if="hasError && errorMessage" class="mt-1 text-base text-red-500">
      {{ errorMessage }}
    </div>
    <div v-else-if="hint" class="mt-1 text-base text-gray-500">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import clsx from "clsx";

import MaterialIcon from "@/components/MaterialIcon.vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  prependIcon: { type: String, default: "" },
  prependIconCustom: { type: String, default: "" },
  appendIcon: { type: String, default: "" },
  hasError: { type: Boolean, default: false },
  errorMessage: { type: String, default: "" },
  hint: { type: String, default: "" },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  type: { type: String, default: "text" },
  autocomplete: { type: String, default: "off" },
});

const emit = defineEmits([
  "update:modelValue",
  "blur",
  "focus",
  "input",
  "change",
  "keydown",
  "keyup",
  "keypress",
]);

const inputValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

watch(inputValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const onBlur = (event) => emit("blur", event);
const onFocus = (event) => emit("focus", event);
const onInput = (event) => emit("input", event);
const onChange = (event) => emit("change", event);
const onKeydown = (event) => emit("keydown", event);
const onKeyup = (event) => emit("keyup", event);
const onKeypress = (event) => emit("keypress", event);
</script>
