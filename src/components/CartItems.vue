<template>
  <q-list bordered separator>
    <q-item dense v-for="(item, index) in cartData" :key="`card-item-${index}`" :item="item" clickable v-ripple>
        <q-item-section>
          <div class="row items-center q-gutter-x-xs q-pa-xs">
            <div class="col-auto">
              <q-btn round label="-" dense unelevated @click="removeToCart(item)" color="primary"/>
            </div>
            <div class="col">
              <div class="row items-center">
                <div class="col">
                  <div class="row">
                    <div class="col-auto">
                  {{ item.quantity }}
                    </div>
                    <div class="col">
                      <span style="margin: 0 5px;">x</span>{{ item.name }}
                      <span v-for="(option, index) in item.options" :key="`option-${index}`">[{{ option.name }}],</span>
                    </div>
                  </div>
                  </div>
                <div class="col-auto">
                  <q-btn round label="+" dense unelevated @click="addTocart(item)" color="primary"/>
                </div>
              </div>
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item v-if="cartData.length == 0">
            <div class="text-subtitle1" style="text-align: center;">Empty</div>
      </q-item>
  </q-list>
</template>

<script>
export default {
  props: ["cartData"],
  data(){return{}},
  methods: {
    removeToCart(item) {
      this.$store.commit("REMOVE_CART", item.name);
      this.$store.dispatch("CHECK_PROMOCODE",{});
    },
    addTocart(item) {
      this.$store.commit("ADD_CART", item);
      this.$store.dispatch("CHECK_PROMOCODE",{});
    },
  },
};
</script>
