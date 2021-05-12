<!-- 调动申请 start -->
<template>
  <div id="app-container">
    <pageTop :title="title"></pageTop>
    <div class="operation">
      <div class="buttons">
        <el-button type="primary" @click="addgroup">新增</el-button>
        <!-- <el-button type="primary">导入</el-button>
        <el-button type="primary">配置</el-button>-->
      </div>
      <div class="inputs">
        <div style="margin-right:13px;">
          <el-select v-model="typeValue" placeholder="状态:选择状态" @change="currentSel">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.Status"
            ></el-option>
          </el-select>
        </div>
        <div class="check">
          <el-input
            v-model="listfrom.KeyWord"
            placeholder="请输入搜索关键字"
            maxlength="15"
            style="width:274px;"
          ></el-input>
          <i class="iconfont icon-sousuo" @click="sendinput"></i>
        </div>
      </div>
    </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      fit
      highlight-current-row
      style="margin-top:20px;"
      class="tableBox"
      @handleButton="handleButton"
      @rowClick="rowClick"
      @cellClick="cellClick"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      @handleSortChange="handleSortChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column label="申请单号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.No }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ApplyDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center">
        <template slot-scope="{row}">
          <span>{{row.ApplyStaffName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前部门" align="center">
        <template slot-scope="{row}">
          <span>{{ row.OrganizationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在岗位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.JobsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调动至部门" align="center">
        <template slot-scope="{row}">
          <span>{{ row.MOrganizationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调动至岗位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.MJobsName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        sortable="custom"
        align="center"
        class-name="status-col"
        width="120"
      >
        <template slot-scope="{row}">
          <div v-if="row.Status=='0'" :type="row.Status | statusFilter">
            <span>草稿</span>
          </div>
          <div v-if="row.Status=='1'" :type="row.Status | statusFilter">
            <span>待审批</span>
          </div>
          <div v-if="row.Status=='2'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">已通过</span>
          </div>
          <div v-if="row.Status=='3'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle;color: red;">已拒绝</span>
          </div>
          <div v-if="row.Status=='4'" :type="row.Status | statusFilter">
            <span>已取消</span>
          </div>
          <div v-if="row.Status=='5'" :type="row.Status | statusFilter">
            <span>已执行</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="lookup(row)">
            <img src="../../../assets/images/look.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">查看</span>
          </el-button>
          <el-button
            v-if="row.Status ==0 || row.Status ==3 || row.Status==4"
            type="text"
            size="mini"
            @click="aditDetail(row)"
          >
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">编辑</span>
          </el-button>
          <el-button v-if="row.Status ==0" size="mini" type="text" @click="commit(row)">
            <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">提交</span>
          </el-button>
          <!-- <el-button
            v-if="row.Status=='3' || row.Status=='4'"
            size="mini"
            type="text"
            @click="reCommit(row)"
          >
            <img src="../../../assets/images/eliminate_icon.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">重新提交</span>
          </el-button>-->
          <el-button
            v-if="row.Status ==0 || row.Status ==1"
            size="mini"
            type="text"
            @click="remove(row)"
          >
            <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">取消</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right;position: absolute;bottom: 20px;right: 10px;">
      <el-pagination
        background
        v-if="tatolpage > 5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listfrom.PageIndex"
        layout=" total,prev, pager, next"
        :total="tatolpage"
      ></el-pagination>
    </div>

    <!-- 新增岗位维护 -->
    <application ref="application" @getlistdata="getlistdata" @reCommitData="reCommitData"></application>
    <goApproval ref="goApproval"></goApproval>
  </div>
</template>

<script>
var that
import application from "./dialog/application";
import goApproval from "../../../components/RSDDApproval.vue";
import pageTop from '@/components/pageTop'
import { mapGetters } from 'vuex'
// import RightContainer from "@/components/rightContainer.vue";
export default {
  name: "Transferapplication",
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'info',
        1: 'warn',
        2: 'success',
        3: 'danger',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      title: "",
      tableKey: 0,
      input_one: '',
      modal12: false,
      loading: false,
      tatolpage: 0,
      PageSize: 10,
      Status: '',
      PageIndex: 1,
      checked: true,
      checked1: true,
      checked2: true,
      checked3: true,
      tableData: [],
      listfrom: {
        "Status": '',
        "KeyWord": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      typeValue: '',
      options: [
        {
          label: '全部',
          Status: '',
        },
        {
          label: '草稿',
          Status: 0,
        },
        {
          label: '待审批',
          Status: 1,
        },
        {
          label: '未通过审批',
          Status: 2,
        },
        {
          label: '已通过审批',
          Status: 3,
        }
      ],
      fromData: {},
      columns: [],
      BillCode: '',
      menus: [],
      optionProps: {
        value: 'Id',
        label: 'Name',
        children: 'Children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      formone: {
        ApplyStaffId: '',
        Reason: '',
        No: ''
      },
      hasResetStatus: false,
      InitId: ''
    };
  },
  components: {
    application,
    pageTop,
    goApproval
    // RightContainer RightContainer
  },
  watch: {
    // "checked":function(){
    //   this.getlistdata();
    // },
    // "checked1":function(){
    //   this.getlistdata();
    // },
    // "checked2":function(){
    //   this.getlistdata();
    // },
    // "checked3":function(){
    //   this.getlistdata();
    // },
    "$store.state.Humanmanage.QueryStaffMove": function (data) {
      this.tatolpage = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    RemoveStaffMoveById (data) {
      if (data.Code == '0') {
        this.$message.success('删除成功')
        this.getlistdata()
      } else {
        this.$message.error(data.Message)
      }
    },
    ApprovalProcessOrderRecordCreate (data) {
      if (data.Code == "0") {
        this.$message({
          type: 'success',
          showClose: true,
          message: "提交成功",
        });
        this.updateStatus()
        // this.getlistdata()
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: data.Message,
        });
      }
    },
    UpdateStaffMoveStatus (newVal, oldVal) {
      // this.dialogFormVisible = false
      if (newVal.Code == 0) {
        this.$message({
          type: 'success',
          showClose: true,
          message: "提交成功",
        });
        // this.ClickYes()
        this.$refs.application.dialogFormVisible = false
        this.getlistdata()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    ApprovedRefusedRedo (data) {
      if (data.Code == "0") {
        if (data.ReturnData.OperateBusinessStatus) {
          // 
          this.updateStatus()
        }
        // this.GetValue()
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: data.Message,
        });
      }
    }
  },
  computed: {
    ...mapGetters([
      'ApprovalProcessOrderRecordCreate',
      'RemoveStaffMoveById',
      'UpdateStaffMoveStatus',
      'ApprovedRefusedRedo'
    ])
  },
  methods: {
    sendinput () {
      this.getlistdata();
    },
    currentSel (Status) {
      this.listfrom.Status = Status;
      this.getlistdata();
    },
    remove (r) {
      console.log(r)
      this.$confirm("是否删除此条人事调动申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let obj = {
          SN: "Organization",
          MN: "RemoveStaffMoveById",
          RequestId: 1,
          UserId: 1,
          DataContent: {
            Id: r.Id,
          },
        };
        this.MIX_send(obj);
      }).catch(() => { });
    },
    reCommit (r) {
      this.InitId = r.Id;
      this.$refs.application.hasResetStatus = true
      console.log(r)
      this.formone.ApplyStaffId = r.ApplyStaffId
      this.formone.Reason = r.Reason
      this.formone.No = r.No
      this.$refs.application.formtype = 2;
      this.$refs.application.dialogFormVisible = true;
      this.$refs.application.getlistdata(r);
    },
    reCommitData () {
      console.log(this.formone)
      let json = {
        MN: "ApprovedRefusedRedo",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        DataContent: {
          ProcessCode: 'RSDD',
          StaffID: this.formone.ApplyStaffId,
          Abstracts: this.formone.Reason,
          BillNum: this.formone.No,
          No: this.formone.No
        }
      }
      this.$refs.application.dialogFormVisible = false;
      this.MIX_send(json)
    },
    updateStatus () {
      let json = {
        MN: "UpdateStaffMoveStatus",
        SN: "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          Id: this.InitId,
          Status: 1,
          No: this.formone.No
        }
      }
      this.MIX_send(json)
    },
    commit (r) {
      console.log(r)
      this.InitId = r.Id
      this.formone.No = r.No
      let json = {
        MN: "ApprovalProcessOrderRecordCreate",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        DataContent: {
          ProcessCode: 'RSDD',
          StaffID: r.ApplyStaffId,
          Abstracts: r.Reason,
          BillNum: r.No,
          Status: '1'
        }
      }
      this.MIX_send(json)
    },

    aditDetail (row) {
      if (row.Status == 0) {
        this.$refs.application.formtype = 2;
        this.$refs.application.dialogFormVisible = true;
        this.$refs.application.getlistdata(row);
      } else if (row.Status == 3 || row.Status == 4) {
        this.reCommit(row)
      }
    },
    lookup (r) {
      // this.$refs.application.formtype = 3;
      // this.$refs.application.dialogFormVisible = true;
      // this.$refs.application.getlistdata(row);
      console.log(r)
      this.$refs.goApproval.formData = r;
      this.$refs.goApproval.formData.Abstracts = r.Reason;
      this.$refs.goApproval.BillNum = r.No;
      this.$refs.goApproval.noSpCenter = false;
      this.$refs.goApproval.dialogFormVisible = true;
    },
    // 添加组
    addgroup () {
      this.$refs.application.formtype = 1;
      this.$refs.application.dialogFormVisible = true;
      let obj = {
        "MN": "CreateBillNOByBillTypeCode",
        "SN": "SystemSetting",
        DataContent: {
          'BillCode': ''
        }
      }
    },
    getlistdata () {
      // this.listfrom.Status = this.Status();
      let obj = {
        "SN": "Organization",
        "MN": "QueryStaffMove",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          PageIndex: this.PageIndex,
          PageSize: this.PageSize,
          KeyWord: this.KeyWord,
          Status: this.Status,
        }
      }
      this.MIX_send(obj);
      console.log(obj, '!!!!!!!!!!!!!!')
    },
    // getStatus(){
    //   let arr= [];
    //   if (this.checked) {
    //     arr.push('0')
    //   }
    //   if (this.checked1) {
    //     arr.push('1')
    //   }
    //   if (this.checked2) {
    //     arr.push('2')
    //   }
    //   if (this.checked3) {
    //     arr.push('3')
    //   }
    //   return arr.toString();
    // },
    rowClick (data) { },
    handleCurrentChange (data) {
      this.listfrom.PageIndex = data;
      this.getlistdata();
    },
    handleSizeChange (data) {
      // console.log(data,'handleSizeChange');
      this.listfrom.PageSize = data;
      this.getlistdata();
    },
    handleButton (data) { },
    cellClick (data) { },
    handleSortChange (data) { },
    handleSelectionChange (data) { },
    GetTableId (data) {
      console.log(data);
    },
    Toreload () {
      this.listfrom = {
        "Status": '',
        "KeyWord": '',
        "Status": '',
        "PageSize": 10,
        "PageIndex": 1
      }
      this.getlistdata();
    },
    sendinput () {
      this.getlistdata();
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created () {
    that = this;
    this.getlistdata();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted () {
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
#app-container {
  position: relative;
  height: 100%;
  /* overflow-y: auto; */
  background-color: #fff;
  border-radius: 5px;
  padding: 0 20px;
  box-sizing: border-box;
}
.apply {
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
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
  color: #5c87a4;
}
.Pages {
  margin-top: 20px;
  position: absolute;
  right: 100px;
}
.el-button--primary {
  color: #fff;
  background-color: #0060a0;
  border-color: #0060a0;
  width: 6.8125rem;
  height: 2.6875rem;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
.info {
  color: #dfe4ed;
}
.warn {
  color: #ffba00;
}
.el-tag {
  border: none;
  background: none !important;
  font-size: 14px;
}
.el-tag img {
  display: inline-block;
  margin-right: 5px;
}
.el-button--text {
  color: #0060a0;
  font-size: 14px;
}
.el-button--text img {
  display: inline-block;
  margin-right: 5px;
  width: 13px;
}
/* .pagetop {
  width: 100%;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  line-height: 3.125rem;
  position: relative;
  font-weight: 600;
}
#reLode {
    width: 1.125rem;
		height: 1.125rem;
		background: url(../assets/images/img/shauxin.png) no-repeat center center;
		background-size: 100% 100%;
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -0.5625rem;
		cursor: pointer
} */
</style>
