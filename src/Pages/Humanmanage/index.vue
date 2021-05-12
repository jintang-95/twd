<template>
  <div class="body__">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
.body__{
  height: calc(100vh - 75px);
  overflow-y: auto;
  background:#EFF4FF!important;
  padding: 1.25rem;
  box-sizing: border-box;
}

.app-container{
  padding: 20px;
}

.filter-container{
  padding-bottom: 10px;
}
</style>
