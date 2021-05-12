<!-- 备件管理 -->
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
.body__{
  width: 100%;
  height: calc(100vh - 51px);
  overflow: hidden;
  /* margin-bottom: 20px;  */
}

.app-container{
  padding: 20px;
}

.filter-container{
  padding-bottom: 10px;
}
</style>