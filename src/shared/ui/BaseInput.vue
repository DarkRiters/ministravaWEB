<template>
  <div class="flex flex-col">
    <label :for="id" class="mb-1">
      {{ label }}
    </label>

    <input
        :id="id"
        :name="name ?? id"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="px-3 py-2 app-input"
        :value="modelValue"
        @input="sync"
        @change="sync"
        @blur="$emit('blur')"
    />

    <p v-if="error" class="text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      id: string;
      label: string;
      type: string;
      placeholder: string;
      modelValue: string;
      error?: string;

      // NEW:
      autocomplete?: string;
      name?: string;
    }>(),
    {
      autocomplete: "off",
    }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "blur"): void;
}>();

function sync(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>
