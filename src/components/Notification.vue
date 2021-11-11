<template>
    <q-card v-if="notification.state" :class="['fixed-top', ...style]" style="z-index: 1000;" square>
      <q-card-section>
        <div class="container" style="text-align: center;">
            {{ notification.message }}
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
      notification: "notification"
    }),
    style(){
      switch (this.notification.type) {
        case 'info':
          return 'bg-primary text-white';
        case 'warning':
          return 'bg-warning text-black';
        default:
          break;
      }
    }
  },
};
</script>

<style scoped>
.cart {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #318cc9;
  justify-content: center;
  align-items: center;
  padding: 10px 25px;
  box-shadow: 0 0 5 lightgrey;
  z-index: 1000;
  color: #fff;
  text-align: center;
}
.cart__item {
}
</style>