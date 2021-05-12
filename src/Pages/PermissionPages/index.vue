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
  background:rgba(248,250,255,1)!important;
  padding: 1.25rem;
  box-sizing: border-box;
}
</style>