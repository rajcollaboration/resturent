<template>
  <div class="row">
    <div class="col q-mt-sm" v-if="products.length > 0 && (getSelectedCategory == products[0].categoryId || getSelectedCategory == 0)">
      <div class="text-h5" :id="category.name" v-if="products.length > 0">
        {{ category.name }}
      </div>
      <ListItem
        v-for="(item, index) in products"
        :product="item"
        :key="`productslist-${index}`"
      />
    </div>
    <div class="col q-mt-sm" v-if="products.length == 0 && getSelectedCategory !=0 && category.id == getSelectedCategory">
     <q-card class="q-my-sm" bordered flat>
      <q-card-section>
        <div class="col">
          <div class="row q-gutter-x-md items-center"> 
            <div class="col">
              <div class="row">Empty Category</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    </div>
  </div>
</template>

<script>
import ListItem from "./ListItem";
import { mapGetters } from "vuex";
export default {
  props: ["category"],
  components: { ListItem },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      getSelectedCategory: 'getSelectedCategory'
    }),
    products() {
      return this.$store.getters.productsByCategory(this.category.id);
    },
  },
};
</script>