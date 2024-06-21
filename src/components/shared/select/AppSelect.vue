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
      class="text-white transition-colors aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-50"
      :class="labelSizeClasses"
    >
      {{ label }}
    </label>
    <!--CONTAINER-->
    <div
      :aria-disabled="disabled"
      class="group peer relative inline-flex items-center justify-start overflow-hidden border transition-all duration-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      :class="[inputRoundedClasses, backgroundColorClass]"
    >
      <!--SELECT-->
      <div class="relative grow">
        <select
          v-model="selectedOption"
          @change="handleChange"
          class="peer w-full focus:caret-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          :class="[inputPaddingClasses, textSizeClasses, backgroundColorClass]"
        >
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
    },

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
    preventFocus: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
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
  },
  data() {
    return {
      selectedOption: this.value,
    };
  },
  methods: {
    handleChange(event) {
      this.$emit('input', event.target.value);
    },
  },
  computed: {
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
  watch: {
    value(newValue) {
      this.selectedOption = newValue;
    },
    disabled(newValue) {
      if (newValue && this.inputElementRef) {
        this.inputElementRef.blur();
      }
    },
  },
};
</script>
