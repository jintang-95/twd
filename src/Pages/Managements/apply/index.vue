<!-- 空白页 -->
<template>
  <div class="body">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
/* .body{
  height: calc(100vh - 51px);
  overflow: hidden;
} */
.body {
  height: calc(100vh - 75px);
  overflow-y: auto;
  background:#F3F6FF !important;
  padding: 0 !important;
  border: 1px solid rgba(225, 225, 225, .1);
  box-sizing: border-box;
}
</style>