<template>
  <div>
    <ProductsByCategory v-for="(item, index) in menu" :category="item" :key="`productslist-${index}`" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProductsByCategory from "./ProductsByCategory.vue";
export default {
  components: { ProductsByCategory },
  computed: {
    ...mapGetters({
      menu: 'menu'
    }),
  },
};
</script>

<style>
</style>