<template>
  <div id="app">
    <!-- 根路由出口 -->
    <!-- 想用variables的样式 -->
    <router-view/>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
  name: 'App'

})
</script>

<style lang="scss" scoped>
// 单独注入，全局注入见-vue.config.js
// @import '~@/styles/variables.scss';
.text{
  color:$success-color
}
</style>
