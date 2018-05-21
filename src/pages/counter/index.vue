<template>
  <div class="counter-warp">
    <p>Vuex counter：{{ count }}</p>
    <p>
      <button @click="increment(count + 1)">+</button>
      <button @click="increment(count - 1)">-</button>
    </p>
    <a href="/pages/index/main" class="home">去往首页</a>
  </div>
</template>

<script>
// Use Vuex
import {mapMutations, mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'count'
    ])
  },
  methods: {
    ...mapMutations({
      increment: 'SET_COUNT'
    })
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
