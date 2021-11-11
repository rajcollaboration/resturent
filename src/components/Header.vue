<template>
  <header>
    <div class="container">
      <div class="header">
        <div class="header__col">
          <div class="header__logo">
            <img :src="restaurant.logo" alt="" />
          </div>
        </div>
        <div class="header__col header__col--full">
          <div class="header__item">ORDER ON WHATSAPP FROM</div>
          <div class="header__item header__item--title">{{ restaurant.name }}</div>
          <div class="header__item header__item--subtitle">
            {{ restaurant.address }}
          </div>
          <div class="header__item" style="padding: 20px 0 0 0;">
            <div class="header__chips" :style="{backgroundColor: status? '#23D160': 'red'}">{{status? 'Open': 'Close'}}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed:{
    ...mapGetters({
        restaurant: "restaurant",
        status: 'status'
      }
    ),
    isOpen(){
      return this.status == 'open' ? true : false
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  padding: 25px;
  font-family: Arial, Helvetica, sans-serif;
}
.header__col {
  padding: 5px;
}
.header__col--full {
  width: 100%;
}
.header__logo {
  padding: 10px;
}
.header__logo img {
  width: 70px;
  height: 70px;
}
.header__item {
  padding: 2px 0;
  color: #999;
}
.header__item--title {
  font-size: 30px;
  padding: 5px 0;
  color: #333;
  font-weight: bold;
}
.header__item--subtitle {
  font-size: 20px;
}
.header__chips{
  font-size: small;
  color: #fff;
  width: auto;
  display: inline;
  padding: 5px 15px;
  border-radius: 5px;
}
@media (max-width: 1024px) {
  .header {
    padding: 10px 25px;
  }
  .header__col {
    padding: 5px;
  }
  .header__logo {
    padding: 5px;
  }
  .header__logo img {
    width: 70px;
    height: 70px;
  }
  .header__item {
    padding: 0;
    color: #999;
  }
  .header__item--title {
    font-size: 25px;
    padding: 5px 0;
    color: #333;
    font-weight: bold;
  }
}
@media (max-width: 850px) {
  .header {
    padding: 10px 15px;
  }
  .header__logo {
    padding: 0px;
  }
  .header__logo img {
    width: 50px;
    height: 50px;
  }
  .header__item {
    padding: 0;
    color: #999;
    font-size: small;
  }
  .header__item--title {
    font-size: 20px;
    padding: 5px 0;
    color: #333;
    font-weight: bold;
  }
  .header__item--subtitle {
    font-size: 14px;
  }
}

</style>