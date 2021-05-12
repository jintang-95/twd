
<template>
  <div class="menusBox">
    <template v-for="(list,index) in this.menuList">
      <el-submenu
        v-if="list.children&&list.children.length>0"
        :key="index"
        :index="list.meta.title"
      >
        <template slot="title" style="padding-left:10px">
          <i class="iconfont" :class="list.meta.icon||''"></i>
          <span slot="title">{{ list.meta.title}}</span>
        </template>
        <Menu :menuList="list.children"></Menu>
      </el-submenu>
      <el-menu-item
        v-else-if="!list.hide"
        :index="list.meta.title"
        :key="index"
		style="padding-left: 50px;"
		:class="{'homePageItem':list.name=='homePage'}"
        :route="{path:list.path}"
      >
        <i class="iconfont" :class="list.meta.icon||''"></i>
        <span>{{list.meta.title}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<style>
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>
<script>
export default {
  name: "Menu", //模板名称
  data() {
    return {};
  },
  methods: {
    // aaa(val) {
    //   console.log(val);
    // },
    // bbb(val) {
    //   console.log(val);
    // }
  },
  created() {},
  beforeMount() {},
  props: ["menuList"]
};
</script>
<style >
.homePageItem{
	padding-left: 20px!important;

}
.el-menu-item i{
	color: #BCCAE6!important;
	font-size: 18px;
}
</style>
