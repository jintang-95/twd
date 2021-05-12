<template>
  <div>
    <template v-for="(list,index) in menuList">
      <el-submenu
        v-if="list.ChildNodes&&list.ChildNodes.length>0"
        :key="index"
        :index="list.Id + ''"
      >
        <template slot="title" style="padding-left:10px" >
          <i class="iconfont icon-yonghuguanli subMenuIcon" :id="'subMenu' + list.Id"></i>
          <span slot="title" class="subMenuTitle">{{ list.Name }}</span>
        </template>
        <treeData :menuList="list.ChildNodes"></treeData>
      </el-submenu>
      <el-menu-item
        v-else
        :index="list.Id + ''"
        :key="index"
      >
        <i class="iconfont icon-yonghuguanli menuIcon" :id="'menuIcon' + list.Id"></i>
        <span>{{list.Name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'treeData',
  data() {
    return {
        activeIndex: 0
    };
  },
  props: {
    menuList: {
        type: Array,
        default() {
            return []
        }
    },
    currentActive: {
        type: Number,
        default: 0
    }
  },
  watch: {
    currentActive(newVal, oldVal) {
        this.activeIndex = newVal
    }
  }
}
</script>
<style scoped>

.activeMenu {
    color: #409EFF !important;
}
.defaultMenu {
    color: #303133 !important;
}
.defaultMenuIcon {
    color: #909399 !important;
}
</style>