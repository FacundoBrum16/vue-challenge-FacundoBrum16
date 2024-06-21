<template>
  <div
    class="inline-flex flex-col gap-y-1"
    :style="{ width }"
    :class="fullWithContainerClasses"
  >
    <!-- LABEL -->
    <label
      v-if="label"
      :aria-disabled="disabled"
      :aria-selected="isInputFocused && ariaSelected"
      :for="inputId"
      class="text-white transition-colors aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-50 aria-selected:text-blue-600"
      :class="labelSizeClasses"
    >
      {{ label }}
    </label>
    <!--CONTAINER-->
    <div
      :aria-selected="isInputFocused && ariaSelected"
      :aria-disabled="disabled"
      class="group peer relative inline-flex items-center justify-start overflow-hidden border transition-all duration-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-selected:border-blue-600 aria-selected:ring-1 aria-selected:ring-blue-600 aria-selected:ring-offset-0"
      :class="[inputRoundedClasses, backgroundColorClass]"
    >
      <!--INPUT-->
      <div class="relative grow">
        <input
          :id="inputId"
          ref="inputElementRef"
          class="peer w-full focus:caret-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          :class="[inputPaddingClasses, textSizeClasses, backgroundColorClass]"
          :disabled="disabled"
          :placeholder="placeholder"
          :value="value"
          :readonly="readonly"
          :type="type"
          :name="name"
          :step="step"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown.enter="onEnterPress"
          @mousedown="onMouseDown"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { generateUuid } from '@/common/utils';

export default {
  components: {},
  props: {
    rounded: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: 'medium',
    },
    textSize: {
      type: String,
      default: 'medium',
    },
    label: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number],
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    step: {
      type: Number,
      default: 1,
    },
    formatter: {
      type: Function,
      default: null,
    },
    backgroundColorClass: {
      type: String,
      default: 'bg-white',
    },
    inputClasses: {
      type: String,
      default: '',
    },
    ariaSelected: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      inputElementRef: null,
      inputId: this.id || generateUuid(),
      inputValue: this.value,
      isInputFocused: false,
    };
  },
  computed: {
    isInputFilled() {
      return this.value !== undefined && this.value !== '';
    },

    fullWithContainerClasses() {
      return this.fullWidth ? 'w-full' : '';
    },
    inputRoundedClasses() {
      switch (this.rounded) {
        case 'none':
          return 'rounded-none';
        case 'default':
          switch (this.size) {
            case 'small':
              return 'rounded-md';
            case 'medium':
              return 'rounded-lg';
            case 'large':
              return 'rounded-lg';
            default:
              return 'rounded-lg';
          }
        case 'full':
          return 'rounded-full';
        default:
          return 'rounded';
      }
    },
    inputPaddingClasses() {
      if (this.inputClasses) return this.inputClasses;
      const mediumSizeClass = 'px-4 py-2';
      switch (this.size) {
        case 'small':
          return 'px-2 py-1';
        case 'medium':
          return mediumSizeClass;
        case 'large':
          return 'px-7 py-3';
        default:
          return mediumSizeClass;
      }
    },

    textSizeClasses() {
      const mediumTextSizeClass = 'text-sm';
      switch (this.textSize) {
        case 'small':
          return 'text-xs';
        case 'medium':
          return mediumTextSizeClass;
        case 'large':
          return 'text-lg';
        default:
          return mediumTextSizeClass;
      }
    },
    labelSizeClasses() {
      switch (this.size) {
        case 'small':
          return 'text-xs';
        case 'medium':
          return 'text-sm';
        case 'large':
          return 'text-base';
        default:
          return 'text-sm';
      }
    },
  },
  methods: {
    onInput(event) {
      let value = event.target.value;
      let formattedValue = value;
      if (this.formatter) {
        formattedValue = this.formatter(value);
      }

      if (formattedValue !== value) {
        event.target.value = formattedValue;
      }

      this.inputValue = formattedValue;
      this.$emit('update:value', formattedValue);
      this.$emit('input', formattedValue);
    },
    onFocus(event) {
      event.preventDefault();
      this.isInputFocused = true;
      this.$emit('focus');
    },
    onMouseDown() {
      if (this.type == 'date') {
        this.$refs.inputElementRef.showPicker();
      }
    },
    onBlur() {
      this.isInputFocused = false;
      this.$emit('blur');
    },
    onEnterPress() {
      this.$emit('enter', this.value);
    },
  },
  watch: {
    disabled(newValue) {
      if (newValue && this.inputElementRef) {
        this.inputElementRef.blur();
      }
    },
  },
};
</script>

<style scoped>
/* Hide calendar */
input[type='date']::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
