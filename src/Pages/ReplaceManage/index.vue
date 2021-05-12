<!-- 测试 -->
<template>
  <div class="white">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.white {
  height: calc(100vh - 75px);
  overflow-y: auto;
  background:#F0F5FE !important;
  padding: 1.25rem;
  box-sizing: border-box;
}

</style>