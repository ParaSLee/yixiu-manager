<template>
  <div class="container">
    <Header></Header>
    <Swipe></Swipe>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './components/header.vue'
  import Swipe from './components/swipe.vue'
  import Footer from './components/footer.vue'
  export default {
    components: {
      Header,
      Swipe,
      Footer
    },
    methods: {
     
    }
  }
</script>

<style scoped>
.container {
  width: 1920px;
  margin: 0 auto;
}
</style>