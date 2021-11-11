import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies';

import { restaurant } from "../../api";
import axios from 'axios';
import * as constants from '../env' 

Vue.use(Vuex)
Vue.use(VueCookies);

export default new Vuex.Store({
  state: {
    promoCode:[],
    notification: { state: false, message: '', type: 'info' },
    restaurant: {},
    filteredProducts: [],
    status: 'open',
    menu: [],
    cart: [],
    name: '',
    number: '',
    address: '',
    AddressLine1:'',
    AddressLine2:'',
    zip: '',
    city:"",
    location:[],
    note: '',
    promoCodei:"",
    promoDiscount:0,
    totalpurches:"",
    deliverytype: 'delivery',
    selectedCategory:'',
    fullAddress:"",
    totalItemCounter:0,
    apiCouponObject:{"message":"","discount":0}
    
  },
  mutations: {
    setApiCouponData:(state,payload)=> state.apiCouponObject = payload,
    setlocation:(state,payload)=> {
      state.location = payload;
    },
    SET_COOKIE_TO_STATE: (state,payload) =>{
      state.name = payload.name;
      state.number = payload.number;
      state.zip = payload.zip;
      state.address = payload.address;
      state.AddressLine1 = payload.AddressLine1;
      state.AddressLine2 = payload.AddressLine2;
      state.city = payload.city;
    },
    GET_USER_INPUT_PROMO:(state,payload) =>{
      state.promoCodei = payload.name;
    },
    SHOW_SELECTED_CATEGORY: (state,payload) => state.selectedCategory = payload ,
    SET_NOTIFICATON: (state, payload) => state.notification = payload,
    SET_RESTAURANT: (state, payload) => state.restaurant = payload,
    SET_STATUS: (state, payload) => state.status = payload,
    SET_FILTERED_PRODUCTS: (state, payload) => state.filteredProducts = payload,
    ADD_CART: (state, payload) => {
      state.notification = { state: true, message: 'Cart Update', type: 'info' };
      setTimeout(() => {
        state.notification = { state: false, message: '', type: 'info' };
      }, 3000);
      const item = state.cart.find(item => {
        let isSame = item.name == payload.name;
        if (item.options) {
          isSame = JSON.stringify(item.options) == JSON.stringify(payload.options);
        }
        return isSame;
      });
      if (item) {
        item.quantity += 1;
        state.totalItemCounter += 1;
      } else {
        let item = { id: state.cart.length + 1, name: payload.name, quantity: 1, price: payload.price, options: payload.options }
        state.cart.push(item)
        state.totalItemCounter += 1;
      }
      

    },
    REMOVE_CART: (state, name) => {
      state.notification = { state: true, message: 'Cart Update', type: 'info' };
      setTimeout(() => {
        state.notification = { state: false, message: '', type: 'info' };
      }, 3000);
      const item = state.cart.find(item => item.name == name);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          state.cart = state.cart.filter(item => item.name !== name)
        }
        state.totalItemCounter -= 1;
      }
    },
    SET_NAME: (state, payload) => state.name = payload.target.value,
    SET_NUMBER: (state, payload) => state.number = payload.target.value,
    SET_ADDRESS: (state, payload) => state.address = payload.target.value,
    SET_AddressLine1:(state,payload)=> state.AddressLine1 = payload.target.value,
    SET_AddressLine2:(state,payload)=> state.AddressLine2 = payload.target.value,
    SET_ZIP: (state, payload) => state.zip = payload.target.value,
    SET_CITY: (state, payload) => state.city = payload.target.value,
    SET_NOTE: (state, payload) => state.note = payload.target.value,
    SET_DELIVERY_TYPE: (state, payload) => state.deliverytype = payload,
    SET_PROMO_COUPON_OBJ: (state, payload) => state.apiCouponObject = payload,
  },
  actions: {
    restaurant: (context) => {
      const restaurantItem = restaurant();
      context.commit('SET_RESTAURANT', restaurantItem)
      context.commit('SET_FILTERED_PRODUCTS', restaurantItem.products)
    },
    ["CHECK_PROMOCODE"]: ({ commit, dispatch,getters,state }, data) => {
     
      return new Promise((resolve, reject) => {
        axios({
          url: constants.baseUrl+'checkCoupon',
          data: {"amount":getters.amount,"couponCode":state.promoCodei.toUpperCase(),"itemCount":getters.totalItem},
          method: 'POST'
        })
          .then(resp => {
            commit("SET_PROMO_COUPON_OBJ",resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
   
  },
  getters: {
    getApiCouponData:(state)=> state.apiCouponObject,
    getlocations:(state)=>{
      return state.location;
    },
    promoCodeMatch:(state,getters)=>{
      if(state.promoCodei=="") return  {"message":"","discount":0};
    state.promoDiscount=0;
    let  promoCodelength = state.restaurant.promoCode.length
    let selectedPCodeIndex=0;
    let promoMessage ="";
    let i=0;
      for (i = 0; i < promoCodelength; i++) {
      let promocodename = state.restaurant.promoCode[i].name;
        if (promocodename == state.promoCodei) {
          selectedPCodeIndex=i;
          break; 
        }
      }
      if (state.restaurant.promoCode[selectedPCodeIndex].hasCondition == true && state.restaurant.promoCode[selectedPCodeIndex].discountType == "price") {
        if (state.restaurant.promoCode[selectedPCodeIndex].minPurchase >= 0) {
          if (state.totalItemCounter >= state.restaurant.promoCode[selectedPCodeIndex].itemCount ) {
            
            state.promoDiscount = state.restaurant.promoCode[selectedPCodeIndex].discount;
            promoMessage = "Enjoy Your Meal with Saftey";
          }else{
            promoMessage = state.restaurant.promoCode[selectedPCodeIndex].message;
          }
        }
      }
      else if (state.restaurant.promoCode[selectedPCodeIndex].hasCondition == true && state.restaurant.promoCode[selectedPCodeIndex].discountType == "percentage") {
       
        if (getters.amount >= state.restaurant.promoCode[selectedPCodeIndex].minPurchase) {
          if (state.restaurant.promoCode[selectedPCodeIndex].itemCount >=0) {
            state.promoDiscount = (state.restaurant.promoCode[selectedPCodeIndex].discount/100)*getters.amount;
            promoMessage = "Enjoy Your Meal with Saftey";
          }
        }else{
          promoMessage =state.restaurant.promoCode[selectedPCodeIndex].message;
        }
      }else{
        promoMessage = state.restaurant.promoCode[selectedPCodeIndex].message
      }
      return {"message":promoMessage,"discount":state.promoDiscount};
    },
    getSelectedCategory: (state) => state.selectedCategory,
    totalItem:(state)=>state.totalItemCounter,
    number: (state) => state.number,
    getFullAddress: (state) => state.fullAddress,
    notification: (state) => state.notification,
    restaurant: (state) => state.restaurant,
    tax: (state, getters) => Math.round((state.restaurant.tax / 100) * (getters.amount - (state.apiCouponObject.discount || 0))),
    delivery: (state) => state.restaurant.deliveryCharge,
    menu: (state) => state.restaurant.menu,
    currency: (state) => state.restaurant.currency,
    products: (state) => state.restaurant.products,
    productsByCategory: (state) => (categoryId) => state.filteredProducts.filter(product => product.categoryId == categoryId),
    status: (state) => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      today = yyyy + '/' + mm + '/' + dd;
      const open = new Date(`${today} ${ state.restaurant.open}`).getTime()/1000
      const close = new Date(`${today} ${ state.restaurant.close}`).getTime()/1000
      const now = new Date().getTime()/1000
      return now > open ? now < close : false
    },
    cart: (state) => state.cart,
    deliverytype: (state) => state.deliverytype,
    isValid: (state, getters) => {
      if(getters.deliverytype == 'delivery'){
        if(state.name && state.number && state.address && state.zip){
          state.fullAddress={"name":state.name,"number":state.number,"address":state.address,"zip":state.zip,};
          $cookies.set('name',state.name);
          $cookies.set('number',state.number);
          $cookies.set('address',state.address);
          $cookies.set('zip',state.zip);
          $cookies.set('city',state.city);
          $cookies.set('AddressLine1',state.AddressLine1);
          $cookies.set('AddressLine2',state.AddressLine2);
          return true;
        }
      }else{
        if(state.name && state.number){
          $cookies.set('name',state.name);
          $cookies.set('number',state.number);
          return true;
        }
      }
      return false;
    },
    amount: (state) => {
      let amount = 0;
      for (let index = 0; index < state.cart.length; index++) {
        const item = state.cart[index];
        if (item.options) {
          for (let index = 0; index < item.options.length; index++) {
            const option = item.options[index];
            amount += option.price;
          }
        }
        amount += item.quantity * item.price;
        state.totalpurches = amount;
      }
      return amount;
      
    },
    totalAmount: (state, getters) =>((getters.amount - (state.apiCouponObject.discount || 0)) + getters.tax + getters.delivery),
    orderText: (state, getters) => {
      let cartText = ''
      let getCartText = (item, isLast) => {
        let text = item.name;
        let amount = item.price * item.quantity;
        if (item.options) {
          for (let index = 0; index < item.options.length; index++) {
            const element = item.options[index];
            amount += element.price;
            text += `[${element.name}],`
          }
        }
        return `${text} x ${item.quantity} - ${amount} ${getters.currency}${!isLast?'\n':''}`;
      }

      for (let index = 0; index < state.cart.length; index++) {
        const cart = state.cart[index];
        cartText += getCartText(cart, index+1 == state.cart.length);
      }
      const orderText = `#New order ${state.restaurant.name} (#${Date.now()})\nCustomer Name: ${state.name} \nCustomer Number: ${state.number}\nCustomer Address: ${state.address}\nAddressLine1: ${state.AddressLine1}\nAddressLine2: ${state.AddressLine2}\nCity: ${state.city}\nZip Code: ${state.zip}\nNote: ${state.note}\n-----------------------------\n${cartText}\n-----------------------------\nTotal - ${state.restaurant.tax} ${getters.currency}\nTax - ${getters.tax} ${getters.currency}\nDiscount - ${ (state.apiCouponObject.discount || 0) } ${getters.currency}\nDevivery charge - ${state.restaurant.deliveryCharge} ${getters.currency}\nPayable - ${getters.totalAmount} ${getters.currency}`
      return orderText;
    }
  },
  modules: {
  }
})