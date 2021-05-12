<template>
 <div class="app-container">
    <pageTop :title="title"></pageTop>
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addgroup">
        新增
      </el-button>

      <el-button class="filter-item" type="primary" style="float: right;" icon="el-icon-search" @click="search">
        搜索
      </el-button>

      <!-- 搜索框 -->
      <el-input placeholder="请输入关键词" clearable style="width: 200px;float: right;" class="filter-item" v-model="listfrom.KeyWord"/>

      <!-- 选择部门多级下拉 -->
      <el-cascader
      placeholder="选择部门"
      :props="optionProps"
      :options="menus"
      @change="GetTableId"
      filterable
      clearable
      style="width: 200px;float: right;margin-right: 20px;"
      ></el-cascader>

      <!-- `checked` 为 true 或 false  是否显示停用-->
      <el-checkbox style="float:right;line-height: 36px;margin-right: 20px;" v-model="checked">已离职</el-checkbox>

    </div>

    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      class="tableBox"
      @handleButton="handleButton"
      @rowClick="rowClick"
      @cellClick="cellClick"
      @handleSortChange="handleSortChange"
      @handleSelectionChange="handleSelectionChange"
    >

      <el-table-column label="状态" sortable="custom" align="center" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag v-if="row.Status=='0'" :type="row.Status | statusFilter">
            草稿
          </el-tag>

          <el-tag v-if="row.Status=='1'" :type="row.Status | statusFilter">
            待审批
          </el-tag>

          <el-tag v-if="row.Status=='2'" :type="row.Status | statusFilter">
            在职
          </el-tag>

          <el-tag v-if="row.Status=='3'" :type="row.Status | statusFilter">
            离职
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="工号" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.No }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.Sex == 1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column label="隶属部门" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.OrganizationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在职岗位" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.JobsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.EntryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="{row}">
          <span>{{ row.Desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.Status!='0'" type="primary" size="mini" @click="dyapiDetail(row)">
            编辑
          </el-button>
          <el-button v-if="row.Status =='3'" size="mini" type="success" @click="start(row)">
            启用
          </el-button>
          <el-button v-if="row.Status=='2'" size="mini" @click="stop(row)">
            停用
          </el-button>
          <el-button v-if="row.Status=='3'||row.Status=='0'" size="mini" type="danger" @click="remove(row)">
            删除
          </el-button>
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

    <!-- 新增岗位维护 -->
    <employpop ref="employpop"></employpop>
  </div>
</template>
<script>
var that;
import employpop from "./dialog/employpop";
// import pageTop from '@/components/pageTop.vue'
export default {
  name: "",
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
      tableKey: 0,
      modal12: false,
      loading: false,
      checked: true,
      tatolpage: 0,
      tableData: [],
      listfrom: {
        "Status": '',
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
    employpop,
  },
  watch: {
    "checked":function (params) {
      this.getlistdata();
    },
    "$store.state.Humanmanage.QueryStaff": function (data) {
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
        this.menus = data.ReturnData;
        this.menus = this.removechild(this.menus);
    },
  },
  methods: {
    dyapiDetail(row){
      this.$refs.employpop.dialogFormVisible = true;
      this.$refs.employpop.formtype = 2;
      this.$refs.employpop.getstaff(row.Id);
    },
    // 添加组
    addgroup() {
      this.$refs.employpop.dialogFormVisible = true;
      this.$refs.employpop.formtype = 1;
    },
    getlistdata() {
      if (this.checked) {
        delete this.listfrom.IsStop;
      } else {
        this.listfrom.IsStop = '1';
      }
      let obj = {
        "MN": "QueryStaff",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);
    },
     getOrganizationTree() {
      let objor = {
        "MN": "QueryOrganizationTree",
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
    removechild(data){
      data.forEach((item,index) => {
        if (item.Children && item.Children.length > 0) {
          this.removechild(item.Children);
        } else {
          delete item.Children;
        }
      });
      return data;
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    that = this;
    this.getlistdata();
    this.getOrganizationTree();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() { }
};
</script>