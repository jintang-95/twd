<!-- 补班 start -->
<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="addgroup">
        新增
      </el-button>
      <el-button class="filter-item" type="primary" style="float: right;" icon="el-icon-search" @click="search">
        搜索
      </el-button>
      <el-input placeholder="请输入关键词" clearable style="width: 200px;float: right;" class="filter-item" v-model="listfrom.KeyWord"/>
      <el-checkbox style="float:right;line-height: 36px;margin-right: 20px;" v-model="checked">已停用</el-checkbox>
    </div> -->
    <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
          <!-- <el-button type="primary" style="width:180px" @click="search">初始化今年节假日信息</el-button> -->
          <!-- <el-button type="primary">配置</el-button> -->
        </div>
        <div class="inputs">
          <div style="margin-right:13px;">
            <!-- <el-select v-model="typeValue" multiple placeholder="状态:选择状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </div>
          <div class="check">
            <el-input v-model="input_one" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div>
      </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      fit
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      style="margin-top:20px;"
      highlight-current-row
      class="tableBox"
      @handleButton="handleButton"
      @rowClick="rowClick"
      @cellClick="cellClick"
      @handleSortChange="handleSortChange"
      @handleSelectionChange="handleSelectionChange">
      <el-table-column label="补班名称" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定班次" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.ShiftName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始日期" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.StartDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.EndDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="{row}">
          <span>{{ row.Desc }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="状态" sortable="custom" align="center" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <div v-if="row.Status=='0'" :type="row.Status | statusFilter">
          <span>草稿</span>  
          </div>

          <div v-if="row.Status=='1'" :type="row.Status | statusFilter">
          <span>待审批</span>  
          </div>

          <div v-if="row.Status=='2'" :type="row.Status | statusFilter">
          <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#8CD16B"> 已启用</span> 
          </div>

          <div v-if="row.Status=='3'" :type="row.Status | statusFilter">
          <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#F56262">已停用</span>  
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="editdetail(row)">
        <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">编辑</span>  
          </el-button>
          <el-button v-if="row.Status =='3'" size="mini" type="text" @click="start(row)">
        <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">启用</span>  
          </el-button>
          <el-button v-if="row.Status=='2'" size="mini" type="text" @click="stop(row)">
        <img src="../../../assets/images/stop_icon.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">停用</span>  
          </el-button>
          <!-- <el-button v-if="row.Status=='3'||row.Status=='0'" size="mini" type="text" @click="remove(row)">
        <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt="">   <span style="vertical-align:middle">删除</span> 
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right;position: absolute;bottom: 150px;right: 10px;">
      <el-pagination
        background
        v-if="tatolpage > 10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listfrom.PageIndex"
        layout=" total,prev, pager, next"
        :total="tatolpage"
      >
      </el-pagination>
    </div>

    <!-- 新增组织维护 -->
    <Makeup ref="Makeup"></Makeup>
  </div>
</template>

<script>
import Makeup from './dialog/Makeup'
import pageTop from '@/components/pageTop.vue'
var that;
export default {
  name: 'Makeupclass',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'info',
        2: 'success',
        3: 'danger',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
 data() {
    return {
      title:'',
      tableKey: 0,
      modal12: false,
      loading: false,
      checked: true,
      input_one:'',
      tatolpage: 0,
      tableData: [],
      listfrom: {
        "Id": '',
        "KeyWord": '',
        "IsStop": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      fromData: {},
      columns: [],
      menus: [],
      optionProps: {
      		value: 'Id',
      		label: 'Name',
      		children: 'Children',
          checkStrictly: true,
          expandTrigger: 'hover'
      	}
    };
  },
  components: {
    Makeup,
    pageTop
  },
  watch: {
    "$store.state.Humanmanage.QueryMakeUp": function (data) {
      this.tatolpage = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    "checked":function (params) {
      that.getlistdata();
    },
    "$store.state.Humanmanage.UnCancelMakeUp": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.CancelMakeUp": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.RemoveMakeUp": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
  },
  methods: {
    // 添加组
    addgroup() {
      this.$refs.Makeup.formtype = 1;
      this.$refs.Makeup.dialogFormVisible = true;
    },
    editdetail(row){
      let rowdata = JSON.parse(JSON.stringify(row))
      this.$refs.Makeup.formtype = 2;
      this.$refs.Makeup.value6 = [rowdata.StartDate,rowdata.EndDate];
      this.$refs.Makeup.form = rowdata;
      this.$refs.Makeup.dialogFormVisible = true;

    },
    start(row) {
     let obj = {
        "MN": "UnCancelMakeUp",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "Ids":row.Id
        }
      }
      this.MIX_send(obj);
    },
    stop(row) {
     let obj = {
        "MN": "CancelMakeUp",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "Ids":row.Id
        }
      }
      this.MIX_send(obj);
    },
    remove(row) {
     let obj = {
        "MN": "RemoveMakeUp",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "Ids":row.Id
        }
      }
      this.MIX_send(obj);
    },
    getlistdata() {
      if (this.checked) {
        this.listfrom.IsStop = 0;
      } else{
        this.listfrom.IsStop = 1;
      }
      let obj = {
        "MN": "QueryMakeUp",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);
    },
    rowClick(data) { },
    handleCurrentChange(data) {
      this.listfrom.PageIndex = data;
      this.getlistdata();
    },
    handleSizeChange(data) {
      // console.log(data,'handleSizeChange');
      this.listfrom.PageSize = data;
      this.getlistdata();
    },
    handleButton(data) { },
    cellClick(data) { },
    handleSortChange(data) { },
    handleSelectionChange(data) { },
    GetTableId(data) {
      console.log(data);
    },
    Toreload() {
      this.listfrom = {
        "Status": '',
        "KeyWord": '',
        "Status": '',
        "PageSize": 10,
        "PageIndex": 1
      }
      this.getlistdata();
    },
    search() {
      this.getlistdata();
    },
    // 表格上方筛选slot的事件回调
    add() {
      console.log("表格上方筛选slot的事件回调");
    },
    // 弹出框表单提交
    Commit() {
      // console.log(this.$refs.PopForm.value);
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    },
    // 刷新按钮
    sendinput() {
      this.getlistdata();
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    that = this;
    this.getlistdata();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
     this.title = this.$route.meta.title;
   }
}
</script>
<style scoped>
/* .tableBox th{
  padding: 0!important;
  height: 50px;
  line-height: 50px;
  background: #F5F5F5;
  color: #666;
  text-align: center;
}
.tableBox td{
  padding: 0!important;
  height: 50px;
  line-height: 50px;
}
.filter-container{
  padding-bottom: 20px;
} */
.app-container {
  position: relative;
	width: 100%;
	height: 100%;
	background-color: #FFF;
	border-radius: 5px;
  padding : 0 20px;
  overflow-y: auto;
	box-sizing: border-box;
}
.operation {
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
/*  padding-left: 20px;
  padding-right: 20px; */
}
.buttons {
  width: 310px;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.buttons > div {
  width: 90px;
  height: 40px;
  color: white;
  line-height: 40px;
  text-align: center;
  background: #108cee;
}
.inputs {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.inputs > div {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.check {
  width: 274px;
  height: 38px !important;
  position: relative;
}
.check > input {
  height: 38px;
  border: none;
  line-height: 40px;
  width: 250px;
  border: 1px solid gray;
}
.check > i {
  position: absolute;
  right: 20px;
  color: #5C87A4;
}
.Pages {
  margin-top: 20px;
  position: absolute;
  right: 100px;
}
.el-button--primary {
    color: #FFF;
    background-color: #0060A0;
    border-color: #0060A0;
	width: 6.8125rem;
	height:2.6875rem;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
.info {
  color: #DFE4ED;
}
.warn{
	color: #FFBA00;
}
.el-tag {
  border: none;
  background: none!important;
  font-size: 14px;
}
.el-tag img{
	display: inline-block;
	margin-right: 5px;
}
.el-button--text{
	color: #0060A0;
	font-size: 14px;
}
.el-button--text img{
	display: inline-block;
	margin-right: 5px;
	width: 13px;
}

</style>
