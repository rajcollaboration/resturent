<template>
  <q-card flat bordered class="q-mt-md">
    <q-card-section>
      <div class="text-h6">Your Order</div>
    </q-card-section>
    <q-card-section>
      <CartItems :cartData="cart" />
    </q-card-section>
    <q-card-section>
      <q-input  v-on:change="chkCupon" style="text-transform: uppercase;" outlined v-model="promoCode" label="Enter Promo Code" />
     
      <p>{{apiPromoCodeObj.message}}</p>
       <q-btn @click="chkCupon()" class="full-width" color="primary">CHECK PROMO CODE</q-btn>
    </q-card-section>
    
    <q-card-section v-if="cart.length > 0">
      <div class="row items-center"><div class="col"><span class="text-h6">Subtotal</span></div><div class="col-auto" style="width: 60px;"><div class="row"><div class="col">{{currency}}</div><div class="col-auto">{{ amount }}</div></div></div></div>
      <div class="row items-center"><div class="col">Discount:</div><div class="col-auto" style="width: 60px;"><div class="col"><div class="row"><div class="col">{{currency}}</div><div class="col-auto">{{apiPromoCodeObj.discount}}</div></div></div></div></div>
      <div class="row items-center"><div class="col">Delivery:</div><div class="col-auto" style="width: 60px;"><div class="col"><div class="row"><div class="col">{{currency}}</div><div class="col-auto">{{ delivery }}</div></div></div></div></div>
      <div class="row items-center"><div class="col"><span class="text-weight-bold">Payable</span>(<span class="text-caption">With TAX</span>) </div><div class="col-auto" style="width: 60px;"><div class="row"><div class="col">{{currency}}</div><div class="col-auto">{{ totalAmount }}</div></div></div></div>
    </q-card-section>
    <q-card-section>
      <q-input outlined type="textarea" v-model="note" dense placeholder="Note" @keyup="SET_NOTE" />
    </q-card-section>
    <q-card-section>
      <q-btn @click="order" class="full-width" color="primary">Click to WhatsApp</q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import CartItems from "./CartItems.vue";
import Vue from "vue";
import VueCookies from 'vue-cookies';
import axios from 'axios';
import * as constants from '../env' 
Vue.use(VueCookies);
export default {
  components: { CartItems },
  data() {
    return {
      note: '',
      promoCode:"",
      total:"",
      couponMessage:"",
    };
  },
  methods: {
    ...mapMutations(["SET_NOTE","GET_USER_INPUT_PROMO","setApiCouponData"]),
    chkCupon(){
      this.getuserpromo()
    },
    async getuserpromo(){
      this.GET_USER_INPUT_PROMO({name:this.promoCode.toUpperCase()})
      let self = this;
      await this.$store.dispatch("CHECK_PROMOCODE",{});
    },
    order(){
      // for check out validation of cart is empty or not
      if(this.totalItem==0){
        this.$store.commit('SET_NOTIFICATON', { state: true, message: 'Please add items in cart before checkout', type: 'warning' });
        setTimeout(() => {
          this.$store.commit('SET_NOTIFICATON', { state: false, message: '', type: 'warning' });
        }, 3000);
      }else if(this.isValid){
        this.saveOrder();
        const URL = `https://api.whatsapp.com/send?phone=+91-9650210909&text=${encodeURIComponent(this.orderText)}`
        window.open(URL,'_newtab');
      }else{
        this.$store.commit('SET_NOTIFICATON', { state: true, message: 'Please enter delivery details', type: 'warning' });
        setTimeout(() => {
          this.$store.commit('SET_NOTIFICATON', { state: false, message: '', type: 'warning' });
        }, 3000);
      }
      console.log(this.orderText);
      
    },
    async saveOrder() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        mobile: this.getFullAddress.number,
        fileContent: this.orderText,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(constants.baseUrl+ "saveOrder", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    },
  },
  computed: {
    ...mapGetters({
      cart: "cart",
      tax: "tax",
      amount: "amount",
      totalAmount: "totalAmount",
      delivery: "delivery",
      currency: "currency",
      isValid: 'isValid',
      orderText: "orderText",
      promoCodeObj:"promoCodeMatch",
      apiPromoCodeObj:"getApiCouponData",
      getlocations:"getlocations",      
      getFullAddress: "getFullAddress",  
      totalItem:"totalItem",    
    })
    ,
   message(){
     return this.couponMessage
   }
    
  },
};
</script>