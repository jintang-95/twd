<!--  -->
<template>
  <div>
    <pageTop :title="pageTitle"></pageTop>
    <div class="showContainer">
      <div class="left" v-if="menus.length>0">
        <div class="title_" @click="SelectItem('All')">
          {{title}}
        </div>
        <el-tree
          :data="menus"
          :props="defaultProps"
          accordion
          @node-click="SelectItem"
          style="border-right: 1px solid #e6e6e6;"
          
        >
          <!-- 加图标 -->
          <span slot-scope="{ node, data }">
            <!-- <i :class="data.icon"></i> -->
            <span style="padding-left: 4px;">{{node.label}}</span>
          </span>
        </el-tree>
      </div>
      <div class="right" :style="menus.length>0?'width: calc(100% - 230px);':'flex:1'">
        <slot name="operation"></slot>
        <slot name="table"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import pageTop from '@/components/pageTop.vue'
export default {
  name: "",
  data() {
    return {
      pageTitle:"",
      // defaultProps: {
      //     children: 'children',
      //     label: 'label'
      //   }
    };
  },
  props: {
    menus: Array,
    title: String,
    defaultProps:{
      type:Object,
      default:()=>{
        return {
          children: 'ChildNodes',
          label: 'Name'
        }
      }
    }
  },
  components: {
	  pageTop
  },
  watch: {},
  methods: {
    SelectItem(val) {
      this.$emit("GetTableId", val);
    },
    
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {this.pageTitle = this.$route.meta.title;}
};
</script>
<style scoped lang='less'>

.title_ {
  width: 100%;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  cursor: pointer;
  color: black;
  background: #fff;
}
/* @import url(); 引入css类 */
.showContainer {
  width: 100%;
  height: 100vh;
  display: flex;
  background: #fff;
}
.showContainer>.left {
  min-width: 230px;
 
}
.left{
 height: 100vh;
  background: #fff !important;
}
.showContainer .right {
  text-align: left;
}
</style>
