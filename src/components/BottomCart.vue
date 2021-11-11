<template>
  <q-card v-show="cart.length > 0" class="fixed-bottom bg-primary text-white" square flat>
    <q-card-section horizontal>
      <div class="container row items-center">
        <div class="col">
            <div class="row items-center"><div class="col-auto" style="width: 160px;"><span class="text-weight-bold">Payable</span>(<span class="text-caption">With text</span>) </div><div class="col-auto" style="width: 60px;"><div class="row"><div class="col">{{currency}}</div><div class="col-auto">{{ totalAmount }}</div></div></div></div>
        </div>
        <div class="col-auto"><q-btn href="#cart" icon='shopping_cart' flat type="a" color="white" round /></div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      cart: "cart",
      totalAmount: "totalAmount",
      currency:'currency'
    }),
  },
};
</script>