<template>
  <div class="w-full ui-form-field">
    <!-- Password field label, shows required indicator if needed -->
    <label
      v-if="label"
      :for="id"
      class="mb-1 block text-base font-medium text-gray-700"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Optional left-side icon -->
      <div
        v-if="prependIcon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <material-icon :name="prependIcon" />
      </div>

      <!-- Standard password input (not secure mode) -->
      <input
        v-if="!policyConfig?.enableSecurePassword"
        :id="id"
        v-model="model"
        :name="name"
        :type="showPassword ? 'text' : 'password'"
        :class="
          clsx(
            'block w-full rounded-md border transition-colors duration-200 focus:ring-1 focus:outline-none text-base text-gray-900 placeholder-gray-400 ui-input',
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500 placeholder-red-500'
              : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400',
            prependIcon ? 'py-2 pr-10 pl-10' : 'py-2 pr-10 pl-3'
          )
        "
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @blur="onBlurHandler"
        @focus="onFocusHandler"
      />

      <!-- Secure password input (contenteditable, custom masking) -->
      <div
        v-else
        :id="id"
        ref="passwordFieldRef"
        :name="name"
        contenteditable="true"
        :spellcheck="false"
        :class="
          clsx(
            'block w-full rounded-md border text-left transition-colors duration-200 focus:ring-1 focus:outline-none text-base text-gray-900 placeholder-gray-400 ui-input ui-secure-input',
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500 placeholder-red-500'
              : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400',
            prependIcon ? 'py-2 pr-10 pl-10' : 'py-2 pr-10 pl-3'
          )
        "
        :data-placeholder="placeholder"
        @input="syncInputContent"
        @keydown="onKeyDownHandler"
        @blur="onBlurHandler"
        @focus="onFocusHandler"
        @copy="onCopyHandler"
        @cut="onCutHandler"
        @paste="onPasteHandler"
      ></div>

      <!-- Button to toggle password visibility -->
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 focus:outline-none"
        @click="togglePasswordVisibility"
      >
        <material-icon :name="showPassword ? 'visibility' : 'visibility_off'" />
      </button>
    </div>

    <!-- Error message below field -->
    <div v-if="hasError && errorMessage" class="mt-1 text-base text-red-500">
      {{ errorMessage }}
    </div>

    <!-- Optional helper text below field -->
    <div v-else-if="hint" class="mt-1 text-base text-gray-500">
      {{ hint }}
    </div>

    <!-- Password policy requirements display -->
    <div
      v-if="showPolicy"
      class="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3"
    >
      <div
        class="mb-3 flex items-center justify-between text-base font-medium text-gray-700"
      >
        <span> Password Requirements </span>
      </div>
      <div class="space-y-2">
        <div v-for="(item, index) in policyStateList" :key="index">
          <div v-if="item?.isVisible" class="flex items-center space-x-2">
            <material-icon
              :name="item?.icon"
              :class="item?.class"
              size="18px"
            />
            <span :class="item?.class">
              {{ item?.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import clsx from "clsx";

import { createValidation } from "@/composables/useFormValidation";
import MaterialIcon from "@/components/MaterialIcon.vue";
import { PASSWORD_POLICY } from "@/utils/constants";

defineProps({
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  prependIcon: { type: String, default: "" },
  hasError: { type: Boolean, default: false },
  errorMessage: { type: String, default: "" },
  hint: { type: String, default: "" },
  id: { type: String, default: "password" },
  name: { type: String, default: "password" },
  autocomplete: { type: String, default: "new-password" },
  showPolicy: { type: Boolean, default: false },
});
const emit = defineEmits(["blur", "focus", "enter"]);
const model = defineModel({ type: String });

const policyConfig = PASSWORD_POLICY;
const validation = createValidation();
const policyState = validation.policy(model);

const showPassword = ref(false); // Shared state
const passwordFieldRef = ref(null); // Secure input state
const passwordCharacters = ref([]); // Secure input state
// Undo/Redo stacks for secure input
const undoStack = ref([]);
const redoStack = ref([]);
const ctrlASelection = ref(false); // Track Ctrl+A selection state

const POLICY_LABELS = {
  uppercase: "At least one uppercase letter",
  lowercase: "At least one lowercase letter",
  number: "At least one number",
  special_char: "At least one special character",
  length: (min, max) => `Password length ${min}-${max} characters`,
};

const policyStateList = computed(() => [
  {
    isVisible: policyConfig?.hasUppercase,
    icon: policyState?.hasUppercase ? "check_circle" : "cancel",
    label: POLICY_LABELS.uppercase,
    class: policyState?.hasUppercase ? "text-green-600" : "text-red-600",
  },
  {
    isVisible: policyConfig?.hasLowercase,
    icon: policyState?.hasLowercase ? "check_circle" : "cancel",
    label: POLICY_LABELS.lowercase,
    class: policyState?.hasLowercase ? "text-green-600" : "text-red-600",
  },
  {
    isVisible: policyConfig?.hasNumber,
    icon: policyState?.hasNumber ? "check_circle" : "cancel",
    label: POLICY_LABELS.number,
    class: policyState?.hasNumber ? "text-green-600" : "text-red-600",
  },
  {
    isVisible: policyConfig?.hasSpecialChar,
    icon: policyState?.hasSpecialChar ? "check_circle" : "cancel",
    label: POLICY_LABELS.special_char,
    class: policyState?.hasSpecialChar ? "text-green-600" : "text-red-600",
  },
  {
    isVisible: true,
    icon: policyState?.isLengthValid ? "check_circle" : "cancel",
    label: POLICY_LABELS.length(
      policyConfig?.minLength,
      policyConfig?.maxLength
    ),
    class: policyState?.isLengthValid ? "text-green-600" : "text-red-600",
  },
]);

// Utility Methods (Caret, Selection, Content)
const setCaretPosition = (element, position) => {
  const range = document.createRange();
  const selection = window.getSelection();
  const textNode = element.firstChild;
  const safePosition = Math.min(position, textNode?.length || 0);
  range.setStart(textNode || element, safePosition);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

const getCaretPosition = (element) => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);
  return element.contains(range.startContainer) ? range.startOffset : 0;
};

const getSelectionRange = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const start = range.startOffset;
  const end = range.endOffset;

  if (start === end) return null; // No selection

  const from = Math.min(start, end);
  const to = Math.max(start, end);
  return { from, to };
};

// Undo/Redo Management
const pushUndoState = () => {
  undoStack.value.push([...passwordCharacters.value]);
  // Optional: limit stack size
  if (undoStack.value.length > 100) undoStack.value.shift();
  // Clear redo stack after new input
  redoStack.value = [];
};

// Secure Input Content Management
const updateInputContent = (element, caretPosition) => {
  const password = passwordCharacters.value || [];
  model.value = password.join("");
  element.textContent = showPassword.value
    ? password.join("")
    : "•".repeat(password.length);
  setCaretPosition(element, caretPosition);
};

const deleteTextInRange = (from, to, element) => {
  pushUndoState();
  passwordCharacters.value.splice(from, to - from);
  model.value = passwordCharacters.value.join("");
  updateInputContent(element, from);
};

// Clipboard Event Handlers
const clipboardEventHandler = (event, shouldCut = false) => {
  const range = getSelectionRange();

  if (!range) return;

  const { from, to } = range;
  const selectedText = passwordCharacters.value.slice(from, to).join("");
  event.preventDefault();
  event.clipboardData.setData("text/plain", selectedText);

  // If cutting, delete the selected text
  if (shouldCut) {
    deleteTextInRange(from, to, event.target);
  }
};

const onCopyHandler = (event) => clipboardEventHandler(event, false);
const onCutHandler = (event) => clipboardEventHandler(event, true);

// Field Event Handlers
const onBlurHandler = (event) => {
  ctrlASelection.value = false;
  emit("blur", event);
};

const onFocusHandler = (event) => emit("focus", event);

// Password Visibility Toggle
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;

  if (!policyConfig?.enableSecurePassword) return;

  passwordFieldRef.value.textContent = showPassword.value
    ? passwordCharacters.value.join("")
    : "•".repeat(passwordCharacters.value.length);
};

// Input Sync and Key Handling
const syncInputContent = (event) => {
  pushUndoState();
  const inputElement = event.target;
  const { inputType, data } = event;
  const caretPosition = getCaretPosition(inputElement);
  const password = passwordCharacters.value;

  if (passwordCharacters?.value?.length >= policyConfig?.maxLength) {
    updateInputContent(inputElement, caretPosition);
    return;
  }

  // Delete backward/forward
  if (["deleteContentBackward", "deleteContentForward"].includes(inputType)) {
    password.splice(caretPosition, 1);
    updateInputContent(inputElement, caretPosition);
    return;
  }

  // Insert a single character
  if (data?.length === 1) {
    let newCaretPosition = caretPosition;

    // If caret is at the end, insert at the end
    if (caretPosition <= password.length) {
      newCaretPosition = caretPosition - 1;
    }

    password.splice(newCaretPosition, 0, data);
    updateInputContent(inputElement, caretPosition);
  }
};

const onPasteHandler = (event) => {
  pushUndoState();
  event.preventDefault();

  const inputElement = event.target;
  const pastedText = event.clipboardData
    .getData("text/plain")
    .replace(/[\r\n]+/g, "")
    .trim();

  if (!pastedText || pastedText?.length > policyConfig?.maxLength) return;

  const password = passwordCharacters.value;
  const range = getSelectionRange();

  if (password.length === 0) {
    // Case 1: Field is empty — insert entire value
    passwordCharacters.value = pastedText.split("");
    updateInputContent(inputElement, pastedText.length);
    return;
  }

  if (range) {
    // Case 2: Text is selected — delete selected range, insert at start
    deleteTextInRange(range.from, range.to, inputElement);
    password.splice(range.from, 0, ...pastedText.split(""));
    updateInputContent(inputElement, range.from + pastedText.length);
    return;
  }

  // Case 3: No selection — insert at current caret position
  const caretPosition = getCaretPosition(inputElement);
  password.splice(caretPosition, 0, ...pastedText.split(""));
  updateInputContent(inputElement, caretPosition + pastedText.length);
};

const onKeyDownHandler = (event) => {
  const { key, ctrlKey, shiftKey } = event;
  const lowerKey = key?.toLowerCase();
  const inputElement = event.target;

  // Track Ctrl+A
  if (ctrlKey && lowerKey === "a") {
    ctrlASelection.value = true;
    return;
  }

  // Handle Delete or Backspace after Ctrl+A (Firefox workaround)
  if (ctrlASelection.value && ["backspace", "delete"].includes(lowerKey)) {
    event.preventDefault();
    ctrlASelection.value = false;

    pushUndoState();
    passwordCharacters.value = [];
    model.value = "";
    updateInputContent(inputElement, 0);
    return;
  }

  ctrlASelection.value = false; // Reset if any other key is pressed

  // Handle Undo
  if (ctrlKey && lowerKey === "z" && !shiftKey) {
    event.preventDefault();
    if (undoStack.value.length > 0) {
      redoStack.value.push([...passwordCharacters.value]);
      const lastState = undoStack.value.pop();
      passwordCharacters.value = [...lastState];
      updateInputContent(inputElement, passwordCharacters.value.length);
    }
    return;
  }

  // Handle Redo
  if (ctrlKey && ((shiftKey && lowerKey === "z") || lowerKey === "y")) {
    event.preventDefault();
    if (redoStack.value.length > 0) {
      undoStack.value.push([...passwordCharacters.value]);
      const nextState = redoStack.value.pop();
      passwordCharacters.value = [...nextState];
      updateInputContent(inputElement, passwordCharacters.value.length);
    }
    return;
  }

  if (["enter", "tab"].includes(lowerKey)) {
    event.preventDefault(); // Prevent newline
    emit("enter", event);
    return;
  }

  const range = getSelectionRange();

  if (range && ["backspace", "delete"].includes(lowerKey)) {
    event.preventDefault();
    deleteTextInRange(range.from, range.to, inputElement);
  } else if (range && !ctrlKey && lowerKey?.length === 1) {
    // If a single character is typed, delete the selected range first
    deleteTextInRange(range.from, range.to, inputElement);
  }
};
</script>

<style scoped>
/* Gray placeholder text for secure input when empty */

.ui-secure-input:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.ui-secure-input[contenteditable] {
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  width: 100%;
  line-height: 1.5;
  font-size: 1rem;
  font-weight: 400;
}

.ui-secure-input[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
  display: inline-block;
}
</style>
