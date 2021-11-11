<template>
  <div>
    <!-- <div class="product">
      <div class="product__item">
        <img class="product__item__image" :src="product.imageURL" alt="" />
      </div>
      <div class="product__item product__item--col product__item--fluid">
        <div class="text-h6">{{ product.name }}</div>
        <div>{{ product.size }}</div>
      </div>
      <div class="product__item">
        {{ currency }} <span style="width: 5px" /> {{ product.price }}
      </div>
      <div class="product__item">
        <q-btn @click="addTocart" color="primary" round :outline="!product.options" label="+"/>
      </div>
      <div v-show="optionDialog" class="dialog" @click.self="fromTigger">
        <form :id="`options${product.id}`" name="form_name" class="dialog__item" @submit.prevent="submit" @change="change">
          <div v-for="(option, index) in product.options" :key="`options--${index}`" style="padding: 10px 5px;">
            {{ option.name }}
            <div v-for="(item, index) in option.list" :key="`option--${index}`" style="padding: 5px;">
              <input :type="option.type" :name="option.type == 'radio' ?option.name: item.name" :value="item.name" :checked="option.type == 'radio' && index == 0"> <label :for="item.name">{{item.name}} <span style="color: grey;">+{{currency}} {{item.price}}</span></label>
            </div>
          </div>
          <hr>
          <div class="btn__panel"><button class="btn" type="submit" >+</button><span style="padding: 0 10px;">{{amount}}</span></div>
        </form>
      </div>
    </div> -->
    <q-card class="q-my-sm" bordered flat>
      <q-card-section>
        <div class="col">
          <div class="row q-gutter-x-md items-center">
            <q-img class="rounded-borders col-auto" :src="product.imageURL" width="60px" height="60px" />
            <div class="col">
              <div class="row">{{ product.name }}</div>
              <div class="row">{{ product.size }}</div>
            </div>
            <div class="col-auto">
              <div class="row items-center">
                <div class="col"><q-btn @click="addTocart" color="primary" :outline="!product.options" :label="`${currency} ${product.price}`"/></div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="optionDialog">
      <q-card style="width: 400px">
          <form :id="`options${product.id}`" name="form_name" @submit.prevent="submit" @change="change">
        <q-card-section>
            <div v-for="(option, index) in product.options" :key="`options--${index}`" style="padding: 10px 5px;">
              {{ option.name }}
              <div v-for="(item, index) in option.list" :key="`option--${index}`" style="padding: 5px;">
                <input :type="option.type" :name="option.type == 'radio' ?option.name: item.name" :value="JSON.stringify(item)" :checked="option.type == 'radio' && index == 0"> <label :for="item.name">{{item.name}} <span style="color: grey;">+{{currency}} {{item.price}}</span></label>
              </div>
            </div>
        </q-card-section>
        <hr>
        <q-card-section>
            <q-btn color="primary" class="btn" type="submit" :label="`${currency} ${amount}`" />
        </q-card-section>
          </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["product"],
  data(){
    return{
      optionDialog: false,
      amount: this.product.price
    }
  },
  methods:{
    fromTigger(){
      this.optionDialog = !this.optionDialog;
      let dialog = document.querySelector(`#options${this.product.id}`);
      dialog.reset();
      this.amount = this.product.price
      for (let item of dialog) {
        item.disabled = false
      }
      for (let item of dialog) {
        if (item.type == 'radio') item.checked = true; return;
      }
    },
    addTocart(){
      if(!this.product.options) this.$store.commit('ADD_CART', this.product);
      else this.optionDialog = !this.optionDialog
      this.$store.dispatch("CHECK_PROMOCODE",{});
    },
    submit(event){
      var formData = new FormData(event.target)
      let options = [...formData.values()].map(option => JSON.parse(option));
      const product = { ...this.product }
      product.options = options;
      this.$store.commit('ADD_CART', product);
      this.optionDialog = !this.optionDialog;
      this.$store.dispatch("CHECK_PROMOCODE",{});
    },
    change(event){
      const radio = [...event.target.form].filter(item => item.type == 'radio');
      const checkbox = [...event.target.form].filter(item => item.type == 'checkbox');
      let checked = checkbox.filter(item => item.checked);
      let unchecked = checkbox.filter(item => !item.checked);
      if(checked.length == this.product.options.find(item => item.type == 'checkbox').max){
        for (let index = 0; index < unchecked.length; index++) {
          const checkbox = unchecked[index];
          checkbox.disabled = true
        }
      }else{
        for (let index = 0; index < unchecked.length; index++) {
          const checkbox = unchecked[index];
          checkbox.disabled = false
        }
      }
      let amount = this.product.price
      for (let item of radio) {
        let op = this.product.options.find(option => option.type == 'radio').list.find(radio => {
          let parseItem = JSON.parse(item.value)
          return radio.name == parseItem.name;
        })
        if(item.checked) amount += op.price
      }
      for (let item of checkbox) {
        let op = this.product.options.find(option => option.type == 'checkbox').list.find(chBox => {
          let parseItem = JSON.parse(item.value)
          return chBox.name == parseItem.name;
        })
        if(item.checked) amount += op.price
      }
      this.amount = amount
    }
  },
  computed: {
    ...mapGetters({
      currency: "currency",
    }),
  },
};
</script>