<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  created(){
    // this.$q.dark.set('auto')
  }
};
</script>

<style>
.t {
  border: 1px solid red;
}
html {
  scroll-behavior: smooth;
}

body {
  padding: 0;
  margin: 0;
}
* {
  box-sizing: border-box;
}

button:focus {
  outline: 0;
}

.container {
  width: 90%;
  max-width: 1368px;
  margin: 0 auto;
}
.container--fluid {
  width: 100%;
  margin: 0 auto;
}
.bg-white {
  background-color: #ffffff;
}
@media (max-width: 1024px) {
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
  }
}
</style>