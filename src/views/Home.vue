<template>
  <div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Enter Your Phone Number</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="number" autofocus v-on:keyup="validate()" @keyup.enter="addcokie()" />
          <p style="color:red">{{validateError}}</p>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-on:click="addcokie()" :disabled="isButtonEnabled"  flat label="Submit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Notification />
    <Header class="container--fluid" />
    <main class="main container">
      <aside class="main__item main__item--fluid">
        <Navbar />
        <Items />
      </aside>
      <aside class="main__item main__item--side">
        <div>
          <Delivery  />
          <Cart />
        </div>
      </aside>
    </main>
    <BottomCart />
    <Footer class="container--fluid" />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Navbar from "../components/Navbar.vue";
import Items from "../components/Items.vue";
import Delivery from "../components/Delivery.vue";
import Cart from "../components/Cart.vue";
import Notification from "../components/Notification.vue";
import BottomCart from "../components/BottomCart.vue";
import vue from 'vue';
import VueCookies from 'vue-cookies';
vue.use(VueCookies);

export default {
  components: { Header, Footer, Navbar, Items, Delivery, Cart, BottomCart, Notification },
  data(){
    return{
      allcookie : {},
      prompt: false,
      validateError:"",
      number: '',
      isButtonEnabled:true
    }
  },
  created() {
    this.$store.dispatch("restaurant");
    
    this.GetCookiePhNumber();
  },
  computed:{
   
  },
  methods:{
 
    addcokie(){
      if(!this.isButtonEnabled){
        this.$cookies.set('number',this.number);
        this.emitSetNumber(this.number);
        this.prompt = false; 
      }
    },
    GetCookiePhNumber(){
     if (this.$cookies.get('number') == null) {
        this.prompt = true;
     }  
    },
    emitSetNumber(num) {
     this.$root.$emit("setNumberFromPatent",num)
    },
    validate(){
      this.isButtonEnabled=true;
      if (this.number.length <10) {
        this.validateError="You Must Have To Enter atlist 10 Digit Number"
      }
      else if(this.number.length>10){
        this.validateError="Please enter exact 10 Digit Number"
      }
      else{
        this.validateError = ""
        this.isButtonEnabled=false;
      }
      return this.isButtonEnabled;
    }
  }
};
</script>

<style scoped>
.main {
  display: flex;
}
.main__item {
  padding: 10px;
}
.main__item--fluid {
  width: 100%;
}
.main__item--side {
  width: 500px;
}
@media (max-width: 850px) {
  .main {
    flex-direction: column;
  }
  .main__item {
    padding: 0px;
  }
  .main__item--side {
    margin-top: 100px;
    width: 100%;
  }
}
</style>