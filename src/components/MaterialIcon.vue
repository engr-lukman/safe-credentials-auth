<template>
  <span
    class="material-icons text-base text-gray-500 transition-colors duration-200 hover:text-gray-700"
    :class="classes"
    :style="{ fontSize: computedSize }"
    :aria-label="ariaLabel"
    role="img"
  >
    {{ name }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: "24px",
  },
  ariaLabel: {
    type: String,
    default: "",
  },
  classes: {
    type: String,
    default: "",
  },
});

const computedSize = computed(() =>
  typeof props?.size === "number" ? `${props?.size}px` : props?.size
);
</script>
