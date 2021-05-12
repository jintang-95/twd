<!-- 审批管理 -->
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
  background:rgba(248,250,255,1)!important;
  padding: 1.25rem;
  box-sizing: border-box;
}

/deep/.el-card__body{
  height: calc(100vh - 75px);
  padding: 0;
}
.app-container{
  height: 100%;
}

.filter-container{
  padding-bottom: 10px;
}
</style>