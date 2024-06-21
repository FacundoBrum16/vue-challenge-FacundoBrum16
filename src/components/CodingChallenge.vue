<template>
  <div class="w-full h-full flex flex-col xl:flex-row">
    <div class="w-full h-full p-2 xl:p-5">
      <div
        class="w-full h-[35rem] rounded-xl p-2 xl:p-5 border-[1px] border-custom-white"
      >
        <line-chart
          class="w-full"
          :options="chartOptions"
          v-if="chartData"
          :data="chartData"
        ></line-chart>
      </div>
      <div
        class="bg-card text-white w-full mt-5 p-2 rounded-md flex flex-col justify-start"
      >
        <div class="flex justify-center w-fit flex-col gap-y-1 w-.">
          <div class="flex items-center justify-between overflow-x-hidden">
            <span class="text-sm">Price Range</span>
            <ErrorLabel :errorText="priceRangeValidation"></ErrorLabel>
          </div>
          <div class="flex gap-x-2 items-center">
            <AppInput
              v-model="minPrice"
              placeholder="Min price"
              :formatter="(value) => formatCurrency(value)"
              backgroundColorClass="bg-background"
              inputClasses="px-2 py-1"
              textSize="small"
              @input="generateGraph()"
            />
            <span>-</span>
            <AppInput
              v-model="maxPrice"
              placeholder="Max price"
              :formatter="(value) => formatCurrency(value)"
              backgroundColorClass="bg-background"
              inputClasses="px-2 py-1"
              textSize="small"
              @input="generateGraph()"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="h-full w-full xl:w-auto xl:min-w-96 border-l-[1px] border-custom-white flex flex-col"
    >
      <div class="w-full p-2 mb-3">
        <button
          class="w-full py-2 flex gap-x-1 justify-center items-center text-white rounded-md bg-blue-600 hover:bg-blue-700"
          @click="addPosition"
        >
          <IconPlus class="w-5 h-5" />
          <span>Add Position</span>
        </button>
      </div>
      <div class="flex p-2 flex-col overflow-y-auto h-full w-full gap-y-2">
        <OptionInput
          v-for="(option, index) in optionsData"
          :key="index"
          v-model="optionsData[index]"
          @input="generateGraph()"
          @removePosition="removePosition(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OptionInput from '@/components/OptionInput.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import AppInput from '@/components/shared/inputs/AppInput.vue';
import { generateNumbersBetween, formatPrice, sumArray } from '@/common/utils';
import ErrorLabel from '@/components/shared/errorLabel/ErrorLabel.vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import annotationPlugin from 'chartjs-plugin-annotation';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  annotationPlugin,
  Title,
  Tooltip,
  Legend
);

export default {
  components: {
    LineChart: Line,
    OptionInput,
    IconPlus,
    AppInput,
    ErrorLabel,
  },
  name: 'CodingChallenge',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          annotation: {
            annotations: {},
          },
        },
        scales: {
          x: {
            grid: {
              color: '#24262D',
            },
            title: {
              display: true,
              text: 'Underlying Price',
            },
          },
          y: {
            grid: {
              color: '#24262D',
            },
            title: {
              display: true,
              text: 'Profit/Loss',
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },

      chartData: null,
      results: null,
      optionsData: [...this.value],
      minPrice: '$80',
      maxPrice: '$120',
    };
  },
  computed: {
    graphLabels() {
      const minPrice = parseFloat(this.minPrice.replace('$', ''));
      const maxPrice = parseFloat(this.maxPrice.replace('$', ''));
      return generateNumbersBetween(minPrice, maxPrice);
    },
    priceRangeValidation() {
      const minPrice = parseFloat(this.minPrice.replace('$', ''));
      const maxPrice = parseFloat(this.maxPrice.replace('$', ''));

      if (minPrice >= maxPrice) return 'The range is invalid';

      return '';
    },
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue !== this.optionsData) {
          this.optionsData = [...newValue];
        }
      },
      deep: true,
    },
    optionsData: {
      handler(newValue) {
        if (newValue !== this.value) {
          this.$emit('input', newValue);
        }
      },
      deep: true,
    },
  },
  methods: {
    formatCurrency(value) {
      return formatPrice(value);
    },
    addPosition() {
      this.optionsData.push({
        strike_price: 100,
        type: 'call',
        premium: 11,
        long_short: 'long',
        expiration_date: '2025-12-17',
        contracts_quantity: 3,
      });

      this.generateGraph();
    },

    removePosition(index) {
      this.optionsData.splice(index, 1);
      this.generateGraph();
    },

    formatCurrencyArray(numbers) {
      return numbers.map((number) => `$${number}`);
    },

    findMaxProfitIndex(array) {
      const maxProfit = Math.max(...array);

      for (let i = 0; i < array.length; i++) {
        if (array[i] === maxProfit) {
          return i;
        }
      }
      return -1;
    },

    findMaxLossIndex(array) {
      const maxLoss = Math.min(...array);

      let largestIndex = -1;
      for (let i = 0; i < array.length; i++) {
        if (array[i] === maxLoss) {
          largestIndex = i;
        }
      }
      return largestIndex;
    },

    generateGraph() {
      const profitLossData = this.calculateProfitLoss();

      console.log(profitLossData);

      this.chartData = {
        labels: this.formatCurrencyArray(this.graphLabels),
        datasets: [
          {
            label: 'Profit/Loss',
            data: profitLossData,
            backgroundColor: '#f87979',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      };

      const maxProfitIndex = this.findMaxProfitIndex(profitLossData);
      const maxLossIndex = this.findMaxLossIndex(profitLossData);

      this.chartOptions.plugins.annotation.annotations = {
        maxProfitLine: {
          type: 'line',
          scaleID: 'x',
          value: maxProfitIndex,
          borderColor: 'green',
          borderWidth: 4,
          label: {
            enabled: true,
            display: true,
            content: `Max Profit: $${profitLossData[maxProfitIndex]}`,
            backgroundColor: 'green',
          },
        },
        maxLossLine: {
          type: 'line',
          scaleID: 'x',
          value: maxLossIndex,
          borderColor: 'red',
          borderWidth: 4,
          label: {
            enabled: true,
            display: true,
            content: `Max Loss: $${profitLossData[maxLossIndex]}`,
            backgroundColor: 'red',
          },
        },
        breakEvenLine: {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y',
          value: 0,
          borderColor: 'gray',
          borderWidth: 2,
          label: {
            enabled: true,
            display: true,
            content: `Break Even`,
            backgroundColor: 'gray',
          },
        },
      };
    },

    calculateForPrice(price, option) {
      //calculate option profit/loss for specific action price
      const { strike_price, type, premium, long_short, contracts_quantity } =
        option;
      const contractSize = 100;

      const investment = premium * contracts_quantity * contractSize;
      let profitLoss = 0;
      if (type === 'call') {
        if (long_short === 'long') {
          profitLoss =
            Math.max(price - strike_price, 0) *
              contracts_quantity *
              contractSize -
            investment;
        } else {
          profitLoss =
            investment -
            Math.max(price - strike_price, 0) *
              contracts_quantity *
              contractSize;
        }
      } else if (type === 'put') {
        if (long_short === 'long') {
          profitLoss =
            Math.max(strike_price - price, 0) *
              contracts_quantity *
              contractSize -
            investment;
        } else {
          profitLoss =
            investment -
            Math.max(strike_price - price, 0) *
              contracts_quantity *
              contractSize;
        }
      }
      return parseFloat(profitLoss.toFixed(2));
    },
    calculateProfitLoss() {
      // calculate the profit/loss for all open operations, adding the profits or losses of the operations for each price

      const profitLossArr = this.graphLabels.map((price) => {
        const profitLossByPrice = this.optionsData.map((option) => {
          return this.calculateForPrice(price, option);
        });
        const profitLoss = sumArray(profitLossByPrice);
        return profitLoss;
      });
      return profitLossArr;
    },
  },
  created() {
    this.generateGraph();
  },
};
</script>
