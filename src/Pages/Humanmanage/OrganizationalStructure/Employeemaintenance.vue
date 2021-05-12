<!-- 职员维护 start -->
<template>
    <div class="materiaType">
      <!-- <pageTop :title="title"></pageTop> -->
       <right-container 
        @selectType="selectType"
        @pageSizeToggle="pageSizeToggle"
        @pageToggle="pageToggle"
        @pagePrev="pagePrev"
        @pageNext="pageNext"
        @statusChange="statusChange"
        @inputChange="inputChange"
        @refreshPage="refreshPage"
        @addNew="addNew"
        :page="page" 
        :checkList="checkList"
        :pageSize="pageSize" 
        :total="total"
        :process="process"  
        :menuList="treeData" 
        :title="title">
        <el-table
        :data="tableData"
         slot="table"
        :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
        show-overflow-tooltip
        fit
        @handleSortChange="handleSortChange"
        @handleSelectionChange="handleSelectionChange"
        highlight-current-row>
        <el-table-column label="工号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.No }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="{row}">
            <span v-if="row.Sex == 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column label="隶属部门" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrganizationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在职岗位" align="center">
          <template slot-scope="{row}">
            <span>{{ row.JobsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入职时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.EntryTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" sortable="custom" align="center" class-name="status-col">
        <template slot-scope="{row}">
          <div v-if="row.Status=='0'" :type="row.Status | statusFilter">
          <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">草稿</span>
          </div>
          <div v-if="row.Status=='1'" :type="row.Status | statusFilter">
           <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle"> 待审批</span>
          </div>
          <div v-if="row.Status=='2'" :type="row.Status | statusFilter">
           <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle; color:#8CD16B"> 在职</span>
          </div>
          <div v-if="row.Status=='3'" :type="row.Status | statusFilter">
          <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle; color:#F56262"> 离职</span>
          </div>
        </template>
        </el-table-column>
         <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.Status!='0'" type="text" size="mini" @click="dyapiDetail(row)">
           <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  
           <span style="vertical-align:middle">编辑</span> 
          </el-button>
          <el-button v-if="row.Status =='3'" size="mini" type="text" @click="start(row)">
           <img src="../../../assets/images/start_icon.png" alt=""> <span style="vertical-align:middle"> 启用</span> 
          </el-button>
          <el-button v-if="row.Status=='2'" size="mini" type="text" @click="stop(row)">
            <img src="../../../assets/images/stop_icon.png" alt="">   <span style="vertical-align:middle">停用</span> 
          </el-button>
          <el-button v-if="row.Status=='3'||row.Status=='0'" size="mini" type="text" @t="remove(row)">
          <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt="">   <span style="vertical-align:middle">删除</span> 
          </el-button>
        </template>
        </el-table-column>
      </el-table>
      </right-container>
      <employpop ref="employpop"></employpop>
    </div>
</template>

<script>
// import pageTop from '@/components/pageTop.vue'
import RightContainer from '@/components/rightContainer.vue'
import employpop from "./dialog/employpop"
var that;
export default {
  components: {
    employpop,
    RightContainer
    // pageTop
  },
  name: "employeemaintenance",
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'info',
        2: 'success',
        3: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      title:'',
      typeValue:'',
      currentId:0,
      // selectType:'',
      page:1,
      pageSize:10,
      total:0,
      process:['Add','check','search'],
      checkList:[
        {
          title:'全部',
          statu: '',
        },
        // {
        //   title:'草稿',
        //   statu:0,
        // },
        // {
        //   title:'待审批',
        //   statu:1,
        // },
        {
          title:'在职',
          statu:2,
        },
        {
          title:'离职',
          statu:3,
        }
      ],
      treeData:[],
      treeDataList:[],
      checkData:'',
      tableKey: 0,
      modal12: false,
      loading: false,
      checked: true,
      tatolpage: 0,
      KeyWord:'',
      OrganizationId:'',
      tableData: [],
      listfrom: {
        'OrganizationId':'',
        "Status": '',
        "KeyWord": '',
        // "IsStop": '',
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
  watch: {
    "checked":function (params) {
      this.getlistdata();
    },
    "$store.state.Humanmanage.QueryStaff": function (data) {
      this.total = data.ReturnData.DataCount;
      this.tatolpage = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.UnCancelStaff": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
      this.getlistdata();
    },
    "$store.state.Humanmanage.CancelStaff": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
      this.getlistdata();
    },
    "$store.state.Humanmanage.RemoveStaff": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
      this.getlistdata();
    },
    "$store.state.Humanmanage.QueryJobs":function (data){
      if (data.RequestId ==1) {
        let DataContent = data.ReturnData.DataCount;
        this.tableData = data.ReturnData.Data;
        this.tatolpage = data.ReturnData.DataCount;
          // this.postmainoption = JSON.parse(JSON.stringify(data.ReturnData.Data));
        }
    },
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
        this.treeDataList = data.ReturnData;
        this.treeData = this.removechild(this.treeDataList);
    },
  },
  methods: {
    selectType(data) {
       this.currentId = data;
       this.treeData = [];
       this.treeData = this.treeDataList;
       this.getlistdata();
    },
  
    //编辑
    dyapiDetail(row){
      this.$refs.employpop.dialogFormVisible = true;
      this.$refs.employpop.formtype = 2;
      this.$refs.employpop.getstaff(row.Id);
    },
    // 添加组
    addgroup() {
     
    },
    // 获取列表数据
    getlistdata() {
      let obj = {
        "MN": "QueryStaff",
        "SN":"Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          OrganizationId:this.currentId,
          PageSize: this.pageSize,
          PageIndex: this.page,
          KeyWord:this.KeyWord,
          Status :this.checkData,
        }
      }
      this.MIX_send(obj);
    },
     getOrganizationTree() {
      let objor = {
        "MN": "QueryOrganizationTree",
        "SN":"Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {}
      }
      this.MIX_send(objor);

    },
    start(row) {
      this.$confirm('此操作将启用该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            "MN": "UnCancelStaff",
            "SN":"Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              'Ids':row.Id
            }
          }
          this.MIX_send(obj);
        }).catch(() => {
        });
    },
    remove(row) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            "MN": "RemoveStaff",
            "SN":"Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              'Ids':row.Id
            }
          }
          this.MIX_send(obj);
        }).catch(() => {
        });
    },
    stop(row) {
      this.$confirm('此操作将停用该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            "MN": "CancelStaff",
            "SN":"Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              'Ids':row.Id
            }
          }
          this.MIX_send(obj);
        }).catch(() => {
        });
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
      this.listfrom.PageIndex = 1;
       if (data =='All') {
        delete this.listfrom.OrganizationId;
      } else{
        this.listfrom.OrganizationId = data.Id;
      }
        this.getlistdata();
    },
    Toreload() {
      this.listfrom = {
        "Status": '',
        "KeyWord": '',
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
    removechild(data){
      data.forEach((item,index) => {
        if (item.Children && item.Children.length > 0) {
          this.removechild(item.Children);
        } else {
          delete item.Children;
        }
      });
      return data;
    },
    // 添加
    addNew(){
      this.$refs.employpop.dialogFormVisible = true;
      this.$refs.employpop.formtype = 1;
    },
    // 页面Size切换
    pageSizeToggle(data) {
      this.PageSize = PageSize;
      this.getlistdata();
    },
     // 页面切换
    pageToggle(data) {
      this.page = data;
      this.getlistdata();
    },
     // 上一页回调
    pagePrev(data){
       this.page = data;
       this.getlistdata();
    },
    // 下一页回调
    pageNext(data){
      this.page = data;
      this.getlistdata();
    },
    // 顶部复选框过滤
    statusChange( data) {
     this.checkData = data;
    this.getlistdata();
    },
     // 输入框回车键
    inputChange( data) {
       this.KeyWord = data;
       this.getlistdata();
    },
    async refreshPage() {
      await this.getOrganizationTree();
      this.getlistdata();
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    that = this;
    this.getlistdata();
    this.getOrganizationTree();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.title = this.$route.meta.title;
     this.getlistdata();
  }
};
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
.materiaType {
  position: relative;
	width: 100%;
	/* height: 100%; */
	background-color: #FFF;
	border-radius: 5px;
  padding:0 20px;
  overflow-y: auto;
	box-sizing: border-box;
}
.empance {
  width: 100%;
	height: 100%;
  background-color:#FFF;
	border-radius: 5px;
  padding:20px;
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
 
