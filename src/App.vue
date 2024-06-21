<template>
  <div class="w-full h-full">
    <CodingChallenge v-model="sampleData" />
  </div>
</template>

<script>
import CodingChallenge from './components/CodingChallenge.vue';

export default {
  name: 'App',
  components: {
    CodingChallenge,
  },
  data() {
    return {
      sampleData: [
        {
          strike_price: 100,
          type: 'call',
          premium: 11,
          long_short: 'long',
          expiration_date: '2025-12-17',
          contracts_quantity: 3,
        },
        {
          strike_price: 100,
          type: 'put',
          premium: 11,
          long_short: 'short',
          expiration_date: '2025-12-17',
          contracts_quantity: 1,
        },
        // {
        //   strike_price: 102.5,
        //   type: 'Call',
        //   premium: 11,
        //   long_short: 'long',
        //   expiration_date: '2025-12-17T00:00:00Z',
        // },
        // {
        //   strike_price: 103,
        //   type: 'Put',
        //   premium: 11,
        //   long_short: 'short',
        //   expiration_date: '2025-12-17T00:00:00Z',
        // },
        // {
        //   strike_price: 105,
        //   type: 'Put',
        //   premium: 11,
        //   long_short: 'long',
        //   expiration_date: '2025-12-17T00:00:00Z',
        // },
      ],
    };
  },
};
</script>
