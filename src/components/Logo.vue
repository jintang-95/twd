<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-links" :to="{path:$route.fullPath}">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" :to="{path:$route.fullPath}">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'MMIS管理系统',
      logo: require("@/assets/images/img/logos.png")
    }
  }
}
</script>

<style scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 7rem;
  /* line-height: 4.1875rem; */
  background: #0060A0;
  text-align: center;
  overflow: hidden;
}
.sidebar-title {
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px dashed rgba(191,222,243,.5);
  margin-left: -112px;
  margin-top: 79px;
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 600;
  line-height: 2.725rem;
  font-size: 18px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}
.collapse .sidebar-logo {
  margin-right: 0px;
  width: 40px;
  margin-top: 4.0625rem;
}
.sidebar-logo-link {
    height: 7rem;
    width: 100%;
    z-index: 11;
    position: absolute;
    margin-left: -96px;
    margin-top: 7px;
}
.sidebar-logo-links {
    height: 7rem;
    width: 100%;
    z-index: 11;
}
.sidebar-logo-link .sidebar-logo {
  width: 70px;
  vertical-align: middle;
  margin-right: 10px;
  margin-top: 1rem;
}
</style>
<style >
 /* a{
    position: absolute;
    margin-left: -83px;
    margin-top: -17px;
}
.sidebar-title{

} */
</style>