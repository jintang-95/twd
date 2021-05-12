<template>
  <div class="container">
	<pageTop :title="pageTitle"></pageTop>
    <div class="materiaAllType" v-if="showTree">
      <div class="typeLabel" @click="selectAll(0)"><i class="icon-front"></i>{{ title }}</div>
      <el-tree :data="menuList" :props="defaultProps" accordion @node-click="handleSelect" class="treeBox"></el-tree>
    </div>
    <div class="materiaTable">
      <div class="process">
        <div>
          <el-button type="primary" style="background-color:#0060A0; " @click="addEvent" v-if="process.indexOf('Add') !== -1">新增</el-button>
          <el-button
            type="primary"
            @click="watchEvent"
            v-if="process.indexOf('Monitor') !== -1"
          >库存监控</el-button>
          <el-button type="primary" @click="importEvent" style="background-color:#0060A0; "   v-if="process.indexOf('Import') !== -1">导入</el-button>
          <el-select
            v-model="selectValue"
            @change="optionChange"
            placeholder="请选择"
            v-if="process.indexOf('Select') !== -1"
          >
            <el-option
              v-for="(item, index) in optionList"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
          <el-button
            type="primary" style="background-color:#0060A0; " 
            @click="highWatch"
            v-if="process.indexOf('highSelect') !== -1"
          >高级查询</el-button>
          <el-button type="primary" @click="setWatch" style="background-color:#0060A0; "   v-if="process.indexOf('set') !== -1">配置</el-button>
        </div>
        <div class="filter">
          <!-- <el-checkbox-group
            v-model="checked"
            @change="handleConditionChange"
            class="checkMargin"
            v-if="process.indexOf('check') !== -1"
          >
            <el-checkbox
              v-for="(item, index) in checkList"
              :key="index"
              :label="item.statu"
            >{{item.title}}</el-checkbox>
          </el-checkbox-group> -->
          <el-select v-if="process.indexOf('check') !== -1" v-model="valueSelect" placeholder="请选择" @change="handleConditionChange" >
            <el-option
              v-for="(item, index) in checkList"
              :key="index"
              :label="item.title"
              :value="item.statu"
              >
              {{item.title}}
            </el-option>
          </el-select>
          <div class="search" v-if="process.indexOf('search') !== -1">
            <el-input
              placeholder="请输入内容"
              suffix-icon="el-icon-search"
              v-model="searchKey"
              @change="handleInputChange"
              
            ></el-input>
            <!-- <i class="iconfont icon-shuaxin" style="margin-left:10px;color:#5C87A4;" @click="Toreload" ></i> -->
            <!-- <el-button icon="el-icon-refresh" size="small" class="refresh" @click="refreshPage"></el-button> -->
          </div>
        </div>
      </div>
      <slot name="table"></slot>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        align="right"
        class="pagination"
      ></el-pagination>
      <!-- <template>
      <div class="infinite-list-wrapper" style="overflow:auto">
         <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
          <li v-for="i in count" class="infinite-list-item">{{ i }}</li>
        </ul>
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
      </div>
    </template> -->
    </div>
  </div>
</template>

<script>
import treeData from './tree.vue'
import pageTop from '@/components/pageTop.vue'
export default {
  name: '',
  data () {
    return {
      pageTitle:"",
      valueSelect:'',
      count: 10,
      loading: false,
      currentPage: 1,
      searchKey: '',
      selectValue: '',
      checked: [],
      currentActive: 0,
      defaultProps: {
        children: 'Children',
        label: 'Name',
      },
    };
  },
  props: {
    menuList: { //树形结构数据
      type: Array,
      default () {
        return []
      }
    },
    showTree: {
      type: Boolean,
      default: true
    },
    columns: { //表头
      type: Array,
      default () {
        return []
      }
    },
    title: { //左侧树形标题
      type: String,
      default: ''
    },
    page: { //左侧树形标题
      type: Number,
      default: 1
    },
    pageSize: { //左侧树形标题
      type: Number,
      default: 10
    },
    process: { //页面功能数组（新增等）
      type: Array,
      default () {
        return []
      }
    },
    optionList: { //下拉框选项列表
      type: Array,
      default () {
        return []
      }
    },
    selectVal: { //下拉框选项列表
      type: String,
      default: ''
    },
    checkList: { //复选框列表
      type: Array,
      default () {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  // computed:{
  //    noMore () {
  //       return this.count >= 20
  //     },
  //     disabled () {
  //       return this.loading || this.noMore
  //     }
  // },
  watch: {
    selectVal (newVal, oldVal) {
      this.selectValue = newVal
    }
  },
  methods: {
    Toreload() {
        this.$router.go(0);
      },
    // load () {
    //     this.loading = true
    //       this.count += 2
    //       this.loading = false
    //   },
    selectAll (Id) {
      this.currentActive = 0
      let length = document.getElementsByClassName('subMenuIcon').length
      let length2 = document.getElementsByClassName('menuIcon').length
      for (let i = 0; i < length; i++) {
        document.getElementsByClassName('subMenuIcon')[i].classList.remove('activeMenu')
        document.getElementsByClassName('subMenuIcon')[i].nextElementSibling.classList.remove('activeMenu')
      }
      for (let i = 0; i < length2; i++) {
        document.getElementsByClassName('menuIcon')[i].classList.remove('activeMenu')
        document.getElementsByClassName('menuIcon')[i].nextElementSibling.classList.remove('activeMenu')
      }
      this.$emit('selectType', Id)
    },
    handleSelect (Id) {
      this.currentActive = 0
      // let length = document.getElementsByClassName('subMenuIcon').length
      // let length2 =  document.getElementsByClassName('menuIcon').length
      // for (let i = 0; i < length; i++) {
      //     document.getElementsByClassName('subMenuIcon')[i].classList.remove('activeMenu')
      //     document.getElementsByClassName('subMenuIcon')[i].nextElementSibling.classList.remove('activeMenu')
      // }
      // for (let i = 0; i < length2; i++) {
      //     document.getElementsByClassName('menuIcon')[i].classList.remove('activeMenu')
      //     document.getElementsByClassName('menuIcon')[i].nextElementSibling.classList.remove('activeMenu')
      // }
      // document.getElementById('menuIcon' + Id).classList.remove('defaultMenuIcon')
      // document.getElementById('menuIcon' + Id).nextElementSibling.classList.remove('defaultMenu')
      this.$emit('selectType', Id.Id)
    },
    handleOpen (Id) {
      this.currentActive = Number(Id)
      let length = document.getElementsByClassName('subMenuIcon').length
      let length2 = document.getElementsByClassName('menuIcon').length
      for (let i = 0; i < length; i++) {
        document.getElementsByClassName('subMenuIcon')[i].classList.remove('activeMenu')
        document.getElementsByClassName('subMenuIcon')[i].nextElementSibling.classList.remove('activeMenu')
      }
      for (let i = 0; i < length2; i++) {
        document.getElementsByClassName('menuIcon')[i].classList.remove('activeMenu')
        document.getElementsByClassName('menuIcon')[i].nextElementSibling.classList.remove('activeMenu')
        document.getElementsByClassName('menuIcon')[i].classList.add('defaultMenuIcon')
        document.getElementsByClassName('menuIcon')[i].nextElementSibling.classList.add('defaultMenu')
      }
      document.getElementById('subMenu' + Id).classList.add('activeMenu')
      document.getElementById('subMenu' + Id).nextElementSibling.classList.add('activeMenu')
      this.$emit('selectType', Id)
    },
    handleSizeChange (pageSize) {
      this.$emit('pageSizeToggle', pageSize)
    },
    handleCurrentChange (page) {
      this.$emit('pageToggle', page)
    },
    handlePrevClick (page) {
      this.$emit('pagePrev', page)
    },
    handleNextClick (page) {
      this.$emit('pageNext', page)
    },
    handleConditionChange (data) {
      console.log(data)
      this.$emit('statusChange', data)
    },
    handleInputChange (data) {
      console.log(data)
      this.$emit('inputChange', data)
    },
    refreshPage () {
      this.$emit('refreshPage')
    },
    handleClick (list) {
      console.log(list.Id)
    },
    // 点击新增
    addEvent () {
      this.$emit('addNew')
    },
    watchEvent () {
      this.$emit('addWatch')
    },
    importEvent () {
      this.$emit('importEvent')
    },
    highWatch () {
      this.$emit('highWatch')
    },
    setWatch () {
      this.$emit('setWatch')
    },
    optionChange (Id) {
      this.$emit('optionChange', Id)
    }
  },
  components: {
    treeData,
	  pageTop
  },
  mounted(){
	  this.pageTitle = this.$route.meta.title;
  }
}

</script>
<style scoped lang="less">

.el-menu {
  border-right: none !important;
}

.container {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  padding-top: 3.125rem;
}

.pageTOP {
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    line-height: 3.125rem;
    // position: relative;
    position: absolute;
    top: 0;
    // padding: 0 20px;
}

.materiaType {
  width: 100%;
  height: 100%;
  display: flex;

  .typeLabel {
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    cursor: pointer;
    border-bottom: 1px solid #e6e6e6;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
  }
  
  .treeBox{
	  height: 100%;
	  overflow-y: auto;
	  padding-right: 15px;
	  box-sizing: border-box;
  }

  .typeLabel:hover {
    background: rgb(236, 245, 255);
  }

  .typeLabel:active {
    background: #e6e6e6;
  }

  .materiaAllType {
  // max-width: 230px;
	width: 20vh;
	height: 100%;
	border-right: 1px solid #e6e6e6;
	position: relative;
	padding-top: 56px;
	box-sizing: border-box;
	overflow: hidden;
  }

  *::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 2px;
  }

  *::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 4px;
    background-color: #e6e6e6;
  }

  .materiaTable {
    flex: 1;
    height: 100%;
	width: calc(100vh - 20vh);
    .process {
      height: 56px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;

      .checkMargin {
        margin-right: 20px;
      }

      .filter {
        display: flex;

        .search {
          margin-left: 10px;
          display: flex;
          flex-direction: row;
        }

        .refresh {
          height: 40px;
          padding: 0;
          width: 40px;
          margin-top: 8px;
          margin-left: 10px;
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    padding-right: 20px;
  }
}
</style>
<style lang="">
.headerClass th {
  background: #F0F7FB !important;
  color:#5C87A4;
  text-align: center !important;
}
.icon-front{
	width: 2px;
	height: 15px;
	background: rgba(0,96,160,1);
	display: inline-block;
	position: absolute;
	top: 50%;
	left: 10px;
	margin-top: -8px;
}
.is-current>.el-tree-node__content{
	background-color: rgba(240,247,251,1);
	color: #0060A0;
}
</style>
