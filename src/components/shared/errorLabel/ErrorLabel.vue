<template>
  <transition
    enter-active-class="transform transition duration-700 ease-in-out"
    leave-active-class="transform transition duration-700 ease-in-out"
    :enter-class="transitionEnterAndLeaveClasses"
    :leave-to-class="transitionEnterAndLeaveClasses"
  >
    <div
      v-if="errorText"
      :aria-disabled="ariaDisabled"
      class="flex w-min items-center gap-x-1 whitespace-nowrap rounded-[4px] border border-red-900 bg-red-900 px-[2px] text-xs font-light text-white aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-50"
    >
      <IconColoredError class="h-3.5 w-3.5" />
      <span>{{ errorText }}</span>
    </div>
  </transition>
</template>

<script>
import IconColoredError from '@/components/icons/IconColoredError.vue';
export default {
  components: {
    IconColoredError,
  },
  props: {
    direction: {
      type: String,
      default: 'right',
    },
    ariaDisabled: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      required: true,
    },
  },
  computed: {
    transitionEnterAndLeaveClasses() {
      switch (this.direction) {
        case 'right':
          return 'opacity-0 translate-x-96';
        case 'left':
          return 'opacity-0 -translate-x-96';
        default:
          return 'opacity-0 translate-x-96';
      }
    },
  },
};
</script>
