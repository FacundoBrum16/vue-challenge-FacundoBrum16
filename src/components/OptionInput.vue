<template>
  <div
    class="p-3 w-full min-h-40 rounded-md bg-card flex flex-col justify-between"
  >
    <div class="grid text-white grid-cols-3 gap-2 text-xs font-normal">
      <AppInput
        v-model="localStrikePrice"
        backgroundColorClass="bg-background"
        label="Strike price"
        :formatter="(value) => formatCurrency(value)"
        inputClasses="px-2 py-1"
        textSize="small"
        @input="updateValue"
      />
      <AppInput
        v-model="localValue.expiration_date"
        backgroundColorClass="bg-background"
        label="Expiration"
        inputClasses="px-2 py-1"
        textSize="small"
        type="date"
        @input="updateValue"
      />

      <AppSelect
        v-model="localValue.type"
        textSize="small"
        backgroundColorClass="bg-background"
        label="Type"
        inputClasses="px-2 py-[3px]"
        :options="typeOptions"
        @input="updateValue"
      />

      <AppSelect
        v-model="localValue.long_short"
        textSize="small"
        backgroundColorClass="bg-background"
        label="Position"
        inputClasses="px-2 py-[3px]"
        :options="positionOptions"
        @input="updateValue"
      />

      <AppInput
        v-model="localValue.contracts_quantity"
        backgroundColorClass="bg-background"
        label="Quantity"
        inputClasses="px-2 py-1"
        textSize="small"
        type="number"
        @input="updateValue"
      />

      <AppInput
        v-model="localPremium"
        backgroundColorClass="bg-background"
        label="Premium"
        :formatter="(value) => formatCurrency(value)"
        inputClasses="px-2 py-1"
        textSize="small"
        @input="updateValue"
      />
    </div>

    <div class="w-full text-xs flex gap-x-5 justify-end font-normal">
      <button
        @click="$emit('removePosition')"
        class="text-red-600 hover:text-red-500 items-center flex gap-x-1"
      >
        <IconClose class="w-3 h-3" /><span>Remove</span>
      </button>
    </div>
  </div>
</template>

<script>
import IconClose from '@/components/icons/IconClose.vue';
import AppInput from '@/components/shared/inputs/AppInput.vue';
import AppSelect from '@/components/shared/select/AppSelect.vue';
import { formatPrice } from '@/common/utils';

export default {
  components: { IconClose, AppInput, AppSelect },
  name: 'OptionInput',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      localValue: { ...this.value },
      positionOptions: [
        { value: 'long', text: 'long' },
        { value: 'short', text: 'short' },
      ],
      typeOptions: [
        { value: 'call', text: 'call' },
        { value: 'put', text: 'put' },
      ],
      localStrikePrice: '',
      localPremium: '',
    };
  },
  watch: {
    value(newValue) {
      this.localValue = { ...newValue };
    },
  },
  methods: {
    updateValue() {
      const strikePrice = parseFloat(this.localStrikePrice.replace('$', ''));
      const premium = parseFloat(this.localPremium.replace('$', ''));
      const option = {
        premium: premium,
        contracts_quantity: Number(this.localValue.contracts_quantity),
        expiration_date: this.localValue.expiration_date,
        long_short: this.localValue.long_short,
        strike_price: strikePrice,
        type: this.localValue.type,
      };
      this.$emit('input', option);
    },
    formatCurrency(value) {
      return formatPrice(value);
    },
  },
  mounted() {
    this.localStrikePrice = this.formatCurrency(
      this.localValue.strike_price.toString()
    );
    this.localPremium = this.formatCurrency(this.localValue.premium.toString());
  },
};
</script>
