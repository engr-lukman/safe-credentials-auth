<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="
      clsx(
        'inline-flex items-center justify-center rounded py-2 text-base font-semibold transition-colors duration-300 border',
        disabled
          ? 'cursor-not-allowed bg-gray-300 text-gray-400 border-gray-300'
          : 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700 border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none',
        fullWidth ? 'w-full' : ''
      )
    "
  >
    <!-- Loading Icon -->
    <material-icon
      v-if="loading"
      name="autorenew"
      class="animate-spin text-white"
    />
    <div v-else class="text-base font-semibold" :class="classes">
      <slot />
    </div>
  </button>
</template>

<script setup>
import clsx from "clsx";

import MaterialIcon from "@/components/MaterialIcon.vue";

defineProps({
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  classes: {
    type: String,
    default: "",
  },
});
</script>
