<template>
  <div id="cart">
    <q-card flat bordered>
      <q-card-section>
        <q-btn-group push>
          <q-btn
            color="primary"
            unelevated
            :outline="!delivery"
            label="Delivery"
            @click="methodSwitcher"
          />
          <q-btn
            color="primary"
            unelevated
            :outline="delivery"
            label="Pick-up"
            @click="methodSwitcher"
          />
        </q-btn-group>
      </q-card-section>
      <q-card-section class="q-gutter-y-sm">
        <div class="text-h6">Your Details</div>
        <div>
          <label for="name">Name</label>
          <q-input
            dense
            v-model="userDetail.name"
            outlined
            @keyup="SET_NAME"
            type="text"
            name="name"
            autocomplete="off"
          />
        </div>
        <div>
          <label for="number">Contact Number</label>
          <q-input
            dense
            v-model="userDetail.number"
            outlined
            @keyup="SET_NUMBER"
            type="text"
            name="number"
            autocomplete="off"
          />
        </div>
        <div>
          <label for="address">Address</label>
          <q-input
            dense
            v-model="userDetail.address"
            :filled="!delivery"
            outlined
            @keyup="predictSearchLocation($event)"
            type="text"
            name="address"
            autocomplete="off"
            :disable="!delivery"
          />
        </div>
        <!--  -->
        <div class="dropdown">
          <div
            id="myDropdown"
            class="dropdown-content"
            v-if="predictedPlaces.length > 0"
          >
          <!-- Start Address -->
            <div
              v-for="(predictedPlace, index) in predictedPlaces"
              :key="index"
            >
              <a
                @click="setPedictedAddress(predictedPlace)"
                class="pointer-cursor"
                >{{ predictedPlace }}</a
              >
            </div>
          </div>
        </div>
        <!--  -->
        <div>
          <label for="address">Address Line 1</label>
          <q-input
            v-model="userDetail.AddressLine1"
            dense
            :filled="!delivery"
            outlined
            @keyup="SET_AddressLine1"
            type="text"
            name="Address Line 1"
            autocomplete="off"
            :disable="!delivery"
          />
        </div>
        <div>
          <label for="address">Address Line 2</label>
          <q-input
            v-model="userDetail.AddressLine2"
            dense
            :filled="!delivery"
            outlined
            @keyup="SET_AddressLine2"
            type="text"
            name="Address Line 2"
            autocomplete="off"
            :disable="!delivery"
          />
        </div>
        <div>
          <label for="address">City</label>
          <q-input
            v-model="userDetail.city"
            dense
            :filled="!delivery"
            outlined
            type="text"
            name="address"
            autocomplete="off"
            :disable="!delivery"
          />
        </div>

        <div>
          <label for="zip">Landmark/Zipcode</label>
          <q-input
            dense
            v-model="userDetail.zip"
            :filled="!delivery"
            outlined
            @keyup="SET_ZIP"
            type="text"
            name="zip"
            autocomplete="off"
            :disable="!delivery"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import vue from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";
vue.use(VueCookies);
import * as constants from "../env";

export default {
  data() {
    return {
      delivery: true,
      userDetail: {
        name: "",
        number: "",
        address: "",
        zip: "",
        city: "",
        AddressLine1: "",
        AddressLine2: "",
      },
      predictedPlaces: [],
    };
  },
  created() {
    this.setCookiData();
  },
  mounted() {
    this.$root.$on("setNumberFromPatent", (data) => {
      this.userDetail.number = data;
      this.$store.commit("SET_NUMBER", { target: { value: data } });
    });
  },
  // for postal code
  methods: {
    setApiPostalCodeData(data) {
      if (data.status == "OK") {
        let address_components = data.results[0].address_components;
        for (let i = 0; i < address_components.length; i++) {
          for (let j = 0; j < address_components[i].types.length; j++) {
            if (address_components[i].types[j] == "postal_code") {
              let postal_code = address_components[i].long_name;
              this.userDetail.zip = postal_code;
              console.log(postal_code);
              this.$store.commit("SET_ZIP", { target: { value: postal_code } });
              break;
            }
            if (address_components[i].types[j] == "locality") {
              let city = address_components[i].long_name;
              this.userDetail.city = city;
              console.log(city);
              this.$store.commit("SET_CITY", { target: { value: city } });
              break;
            }
          }
        }
      }
    },
    setCookiData() {
      this.userDetail.name = this.$cookies.get("name") || this.userDetail.name;
      this.userDetail.number = this.$cookies.get("number");
      this.userDetail.zip = this.$cookies.get("zip");
      this.userDetail.address = this.$cookies.get("address");
      this.userDetail.AddressLine1 = this.$cookies.get("AddressLine1");
      this.userDetail.AddressLine2 = this.$cookies.get("AddressLine2");
      this.userDetail.city = this.$cookies.get("city");
      console.log(this.userDetail);
      this.$store.commit("SET_COOKIE_TO_STATE", {
        name: this.userDetail.name,
        number: this.userDetail.number,
        zip: this.userDetail.zip,
        address: this.userDetail.address,
        AddressLine1:this.userDetail.AddressLine1,
        AddressLine2:this.userDetail.AddressLine2,
        city:this.userDetail.city,
      });
    },
    setPedictedAddress(prdctAdrs) {
      this.userDetail.address = prdctAdrs;
      this.$store.commit("SET_ADDRESS", { target: { value: prdctAdrs } });
      console.log(this.userDetail.address);
      let self = this;
      axios
        .put(constants.baseUrl + "getPostalcode", { placename: prdctAdrs })
        .then(function (response) {
          self.setApiPostalCodeData(response.data);
        });
        this.predictedPlaces = [];
    },
    methodSwitcher() {
      this.delivery = !this.delivery;
      this.userDetail.address = "";
      this.userDetail.zip = "";
      this.userDetail.AddressLine1 = "";
      this.userDetail.AddressLine2 = "";
      let deliveryType = this.delivery ? "delivery" : "pick-up";
      this.$store.commit("SET_DELIVERY_TYPE", deliveryType);
      if (deliveryType == "delivery") {
        this.setCookiData();
      }
    },
    setApiLocationData(response) {
      let staticAddress = [];
      staticAddress = [];
      if (response.data.status == "OK") {
        for (let i = 0; i < response.data.predictions.length; i++) {
          staticAddress.push(response.data.predictions[i].description);
        }
      }
      this.predictedPlaces = staticAddress;
    },
    predictSearchLocation(event) {
      this.$store.commit("SET_ADDRESS", event);
      let self = this;
      axios
        .put(constants.baseUrl + "getPrediction", {
          placename: event.target.value,
        })
        .then(function (response) {
          self.setApiLocationData(response);
        });
    },
    ...mapMutations([
      "SET_NAME",
      "SET_NUMBER",
      "SET_ADDRESS",
      "SET_ZIP",
      "SET_AddressLine1",
      "SET_AddressLine2",
    ]),
  },
  computed: {
    ...mapGetters({
      number: "number",
    }),
  },
};
</script>
<style scoped>
.dropbtn {
  background-color: #04aa6d;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn:hover,
.dropbtn:focus {
  background-color: #3e8e41;
}
.pointer-cursor {
  cursor: pointer;
}
#myInput {
  box-sizing: border-box;
  /* background-image: url('searchicon.png'); */
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 45px;
  border: none;
  border-bottom: 1px solid #ddd;
}

#myInput:focus {
  outline: 3px solid #ddd;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  background-color: #f6f6f6;
  min-width: 230px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  max-height: 200px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {
  background-color: #ddd !important;
}
</style>
