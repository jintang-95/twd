<!-- 岗位维护 start -->
<template>
    <div class="materiaType">
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
        :menuList="menus" 
        :title="title">
        <el-table
            :key="tableKey"
            v-loading="loading"
            :data="tableData"
            fit
            slot="table"
            highlight-current-row
            style="width: 100%;"
            class="tableBox"
            :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
            @handleButton="handleButton"
            @rowClick="rowClick"
            @cellClick="cellClick"
            @handleSortChange="handleSortChange"
            @handleSelectionChange="handleSelectionChange">
            <el-table-column label="编号" align="center">
              <template slot-scope="{row}">
                <span>{{ row.No }}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
              <template slot-scope="{row}">
                <span>{{ row.Name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="隶属部门" align="center">
              <template slot-scope="{row}">
                <span>{{ row.OrganizationName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直接上级" align="center">
              <template slot-scope="{row}">
                <span>{{ row.SuperiorName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="登录方式" align="center">
              <template slot-scope="{row}">
                <div v-if="row.LoginMethod=='1'">
                  账号
                </div>
                <div v-if="row.LoginMethod=='2'">
                  人脸
                </div>
                <div v-if="row.LoginMethod=='3'">
                  ID卡
                </div>
                <div v-if="row.LoginMethod=='4'">
                  指纹
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="描述" align="center">
              <template slot-scope="{row}">
                <span>{{ row.Desc }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="状态" sortable="custom" align="center" class-name="status-col" width="100">
              <template slot-scope="{row}">
                <div v-if="row.Status=='0'" :type="row.Status | statusFilter">
                  草稿
                </div>
                <div v-if="row.Status=='1'" :type="row.Status | statusFilter">
                  待审批
                </div>
                <div v-if="row.Status=='2'" :type="row.Status | statusFilter">
                <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#8CD16B;">已启用</span> 
                </div>
                <div v-if="row.Status=='3'" :type="row.Status | statusFilter">
                <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#F56262;">已停用</span>  
                </div>
                <div v-if="row.Status=='4'" :type="row.Status | statusFilter">
                <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#F56262;">已删除</span> 
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button v-if="row.Status!='0'" type="text" size="mini" @click="dyapiDetail(row)">
              <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle">编辑</span>  
                </el-button>
                <el-button v-if="row.Status =='3'" size="mini" type="text" @click="start(row)">
              <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle">启用</span>  
                </el-button>
                <el-button v-if="row.Status=='2'" size="mini" type="text" @click="stop(row)">
              <img src="../../../assets/images/stop_icon.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">停用</span>  
                </el-button>
                <el-button v-if="row.Status=='3'||row.Status=='0'" size="mini" type="text" @click="deletedata(row)">
              <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle">删除</span>  
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </right-container> 
      <!-- 新增岗位维护 -->
       <postmain ref="postmain"></postmain>
    </div>
    
   
</template>

<script>
import postmain from './dialog/postmain.vue'
import RightContainer from '@/components/rightContainer.vue'
var that;
export default {
  name: 'Organizationmaintenance',
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
   components: {
    postmain,
    RightContainer
  },
 data() {
    return {
      dialogFormVisible : false,
      title:'',
      // selectType:'',
      page:1,
      pageSize:10,
      total:0,
      typeList: [],
      process: ['Add','check','search'],
      treeData:[],
      tableKey: 0,
      modal12: false,
      loading: false,
      currentId:0,
      formtype: 1,
      checked: true,
      tatolpage: 0,
      OrganizationId:'',
      statu:'',
      KeyWord:'',
      checkData:'',
      tableData: [],
       listfrom:{
        "OrganizationId":'',
        "KeyWord":'',
         "Status":'',
        "IsStop":'1',
        "PageSize":10,
        "PageIndex":1
      },
      checkList: [
        {
          title: "全部",
          statu: '',
        },
        // {
        //   title: "草稿",
        //   statu: 0,
        // },
        //  {
        //   title: "待审批",
        //   statu: 1,
        // },
        {
          title: "已启用",
          statu: 2,
        },
        {
          title: "已停用",
          statu: 3,
        },
        // {
        //   title: "删除",
        //   statu: 4,
        // },
      ],
      formData: {},
      formType: "1",
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
    "$store.state.Humanmanage.QueryJobs": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
      this.tatolpage = data.ReturnData.DataCount;
      this.total = data.ReturnData.DataCount;
    },
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.menus = data.ReturnData;
      this.menus = this.removechild(this.menus);
    },
    "$store.state.Humanmanage.CancelJobs": function (data) {
      this.$message({
            type: 'success',
            message: '停用成功!'
          });
          this.getlistdata();
          this.getOrganizationTree();
    },
    "$store.state.Humanmanage.UnCancelJobs": function (data) {
      this.$message({
            type: 'success',
            message: '启用成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.RemoveJobs": function (data) {
      this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getlistdata();
    },
    "checked": function (data) {
      this.getlistdata()
    },
  },
  methods: {
    selectType(data) {
       this.currentId = data;
       this.treeData = [];
       this.treeData = this.menus;
       this.getlistdata();
    },
    // 编辑岗位
    dyapiDetail(row){
      this.$refs.postmain.dialogFormVisible = true;
      this.$refs.postmain.menus = this.menus;
      let arr = []
      this.getId(row.OrganizationId,this.menus,arr);
      this.$refs.postmain.listfrom = JSON.parse(JSON.stringify(row));
      this.$refs.postmain.value = this.arr;
      this.$refs.postmain.formtype = 2;
      this.$refs.postmain.orangchange();
    },
    // 启用
    start(row){
      let that = this;
      this.$confirm('此操作将启用该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
			"SN":"Organization",
            "MN": "UnCancelJobs",
            "SN":"Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              'Ids':row.Id
            }
          }
          that.MIX_send(obj);
        }).catch((error) => {
          console.log(row);
        });
    },

    // 删除
    deletedata(row){
      let that = this;
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
			"SN":"Organization",
            "MN": "RemoveJobs",
            "SN":"Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              'Ids':row.Id
            }
          }
          that.MIX_send(obj);
        }).catch(() => {
        });
    },

    // 停用
    stop(row){
      let that = this;
      this.$confirm('此操作将停用该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
			"SN":"Organization",
            "MN": "CancelJobs",
            "SN":"Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              'Ids':row.Id
            }
          }
          that.MIX_send(obj);
        }).catch(() => {
        });

    },
    // 页面Siz切换
    pageSizeToggle(data) {
       this.pageSize = pageSize;
       this.getlistdata();
    },
    // 页面切换
    pageToggle(data){
      this.page = data;
      this.getlistdata();
    },
    // 添加岗位
    // addgroup() {
    //   this.$refs.postmain.dialogFormVisible = true;
    //   let data = this.removechild(this.menus);
    //   console.log(data);
    //   this.$refs.postmain.menus = this.menus;
    //   this.$refs.postmain.formtype = 1;
    // },

    //获取列表数据
    getlistdata() {
      // if (this.checked) {
      //   this.listfrom.IsStop = '';
      // } else {
      //   this.listfrom.IsStop = '1';
      // }

      let obj = {
        "MN": "QueryJobs",
        "SN":"Organization",
        //  MN: "AssetsTypeGetList",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          OrganizationId:this.currentId,
          PageSize: this.pageSize,
          PageIndex: this.page,
          Status: this.checkData,
          KeyWord: this.KeyWord
        }
      }
      this.MIX_send(obj);
    },

    //获取组织树数据
    getOrganizationTree() {
      let objor = {
        "MN": "QueryOrganizationTree",
        "SN":"Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
           SType:1
        }
      }
      this.MIX_send(objor);
    },

    rowClick(data) { },

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
    getId(str,array,arr){
        for (let index = 0; index < array.length; index++) {
          const item = array[index];
          if (item.Id == str) {
            arr.push(item.Id)
            // console.log(arr)
            this.arr = arr
            return
          }
          if (item.Children && item.Children.length > 0) {
            let arr01 = JSON.parse(JSON.stringify(arr))
            arr01.push(item.Id);
            this.getId(str,item.Children,arr01);
          }
        }
      },
    // 点击分页
    // handleCurrentChange(data) {
    //   this.listfrom.PageIndex = data;
    //   this.getlistdata();
    // },

    // 直接跳转到哪一页
    // handleSizeChange(data) {
    //   this.listfrom.PageSize = data;
    //   this.getlistdata();
    // },
    handleButton(data) { },
    cellClick(data) { },
    handleSortChange(data) { },
    handleSelectionChange(data) { },

    //通过部门类型筛选
    GetTableId(value) {
      this.listfrom.PageIndex = 1;
      this.listfrom.OrganizationId = value[0];
      this.getlistdata();
      // console.log(data);
    },

    // 重新加载列表数据
    Toreload() {
      this.listfrom = {
        "Id": '',
        "KeyWord": '',
        "IsStop": '',
        "PageSize": 10,
        "PageIndex": 1
      }
      this.getlistdata();
    },

    // 搜索
    search() {
      this.getlistdata();
    },

    // 表格上方筛选slot的事件回调
    add() {
      console.log("表格上方筛选slot的事件回调");
    },
    addNew(){

      this.$refs.postmain.dialogFormVisible = true;
      this.$refs.postmain.formtype = 1;
    },
    // 取消新增或者取消编辑
    closeMask(data) {
      // this.showMask = false;
    },
    // 新增或者编辑
    addMateria(data) {
      // this.addMateriaType(data);
    },
  refreshPage(){

  },
  inputChange( data){
    this.KeyWord = data;
    this.getlistdata();
  },
  statusChange( data){
    this.checkData = data;
    this.getlistdata();
  },
  pageNext(data){
    this.page = data;
    this.getlistdata();
  },
  pagePrev(data){
    this.page = data;
      this.getlistdata();
  },

  },
  
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getlistdata();
    this.getOrganizationTree();
    
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
#postmain {
   width:100%;
  height: 100%;
  padding:20px;
  box-sizing: border-box;
  background-color: #F8FAFF;
  border-radius: 5px;
  overflow-y: auto;
}
.materiaType{
  padding: 0px 20px;
  width:100%;
  /* height:100%; */
  border-radius: 5px;
  background-color:#fff;
}
.el-button--text{
	color: #0060A0;
	font-size: 14px;
}
</style>
