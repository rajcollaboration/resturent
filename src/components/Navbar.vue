<template>
  <q-card class="sticky" ref="nav" bordered>
    <q-card-section>
      <div class="row items-center q-gutter-x-md" v-if="wannaSearch">
        <div class="col-auto">
          <q-btn icon="dark_mode" color="primary" round flat @click="setDark" />
        </div>
        <div class="col">
            <q-input outlined dense type="search" v-model="searchText"  @keyup="search" placeholder="Type search text here..." />
        </div>
        <div class="col-auto">
          <q-btn round @click="wannaSearch = !wannaSearch; searchText = ''; search();" label="X" color="primary" />
        </div>
      </div>
      <div class="row items-center q-gutter-x-md" v-else>
        <div class="col-auto">
          <q-btn round color="primary" icon="search" @click="wannaSearch = !wannaSearch" />
        </div>
        <div class="col">
          <div class="row">
            <div class="menu">
              <q-btn flat type="a" @click="showSelectedCategory(item.id)" class="col-auto btn" v-for="(item, index) in menu" :key="`menu-${index}`" >{{ item.name }}</q-btn>
            </div>
          </div>
        </div>
      </div>

    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      wannaSearch: false,
      searchText: "",
    };
  },
  computed: {
    ...mapGetters({
      menu: "menu",
      products: "products",
    }),
  },
  methods: {
  showSelectedCategory(catId){
    console.log(catId," showSelectedCategory");
    this.$store.commit("SHOW_SELECTED_CATEGORY", catId);
  },
    search() {
      let filteredProducts = this.products.filter((item) => item.name.toLowerCase().includes(this.searchText.toLowerCase()));
      this.$store.commit("SET_FILTERED_PRODUCTS", filteredProducts);
    },
    setDark(){
      this.$q.dark.toggle()
    }
  },
};
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 100;
}
.menu {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  position: -webkit-sticky;
  overflow-x: scroll;
  display: flex;
}
.menu::-webkit-scrollbar {
  display: none;
}
</style>