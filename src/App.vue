<template>
  <div class="w-full h-full">
    <CodingChallenge v-model="sampleData" />
  </div>
</template>

<script>
import CodingChallenge from '@/components/CodingChallenge.vue';

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
      ],
    };
  },
};
</script>
