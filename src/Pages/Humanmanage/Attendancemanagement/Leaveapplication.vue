<template>
  <div id="applyleave">
    <pageTop :title="title"></pageTop>
    <div class="top">
      <el-button type="primary" @click="ClickAdd">新增</el-button>
      <div class="Inputs">
        <div class="checks">
          <el-date-picker
            style="margin-right:20px"
            v-model="TimeValue"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-select
            v-model="TypeValue"
            placeholder="选择类型"
            style="width:200px;margin-right:20px"
            clearable
          >
            <el-option
              v-for="item in Statusdata"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-input
            placeholder="请输入搜索关键字"
            v-model="InputValue"
            style="width:250px"
            clearable
            @keyup.enter.native="GetValue"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      style="margin-top:20px;"
      show-overflow-tooltip
    >
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div>
            <span v-if="item.tableprop == 'Status'">{{ type[scope.row[item.tableprop]] }}</span>
            <span v-else>{{ scope.row[item.tableprop] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClickfive(scope.row)" type="text" size="small">
            <img src="../../../assets/images/look.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">查看</span>
          </el-button>
          <el-button
            @click="handleClickone(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.Status == '0' || scope.row.Status == '3' || scope.row.Status == '4'"
          >
            <!-- v-if="scope.row.Status == '0'" -->
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">编辑</span>
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="commit(scope.row)"
            v-if="scope.row.Status == '0'"
          >
            <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">提交</span>
          </el-button>
          <!-- <el-button
            size="small"
            type="text"
            @click="reCommit(scope.row)"
            v-if="scope.row.Status == '3' || scope.row.Status == '4'"
          >
            <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">重新提交</span>
          </el-button>-->
          <el-button
            @click="handleClicktwo(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.Status == '1' || scope.row.Status == '2'"
          >
            <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">取消</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="Pages">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="pagesize"
        :pager-count="9"
        :total="total"
        layout="prev, pager, next"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <!-- 新增弹出框 -->
    <el-dialog title="请假申请单" left :visible.sync="dialogtwo" width="30%">
      <el-form label-width="110px" :model="formone" :rules="ruleS" ref="formone">
        <el-form-item label="申请时间:" prop="TimeOne">
          <el-date-picker
            v-model="formone.TimeOne"
            type="date"
            placeholder="请选择日期"
            :disabled="LookType"
            value-format="yyyy-MM-dd"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开始休假时间:" prop="TimeTwo">
          <el-date-picker
            v-model="formone.TimeTwo"
            type="date"
            placeholder="请选择日期"
            :disabled="LookType"
            value-format="yyyy-MM-dd"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="请假天数:" prop="Num">
          <el-input v-model="formone.Num" :disabled="LookType" placeholder="请输入请假天数"></el-input>
        </el-form-item>
        <el-form-item label="请假类型:" prop="Type">
          <el-select
            placeholder="请选择类型:"
            v-model="formone.Type"
            :disabled="LookType"
            style="width:100%"
            clearable
          >
            <el-option
              v-for="item in Statusdata"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input v-model="formone.Des" type="textarea" :disabled="LookType" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;margin-top:10px;">
        <el-button @click="Canclematerial">取消</el-button>
        <el-button type="primary" @click="ClickYes">确定</el-button>
      </div>
    </el-dialog>
    <go-approval ref="goApproval"></go-approval>
  </div>
</template>

<script>
import pageTop from "../../../components/pageTop.vue";
import goApproval from "../../../components/QJApproval.vue";
import { mapGetters } from 'vuex'
export default {
  name: "ApplyLeave",
  data () {
    return {
      title: "请假记录",
      LookType: false,
      TimeValue: [],
      InitId: "",
      InitStatus: "",
      TypeValue: 0,
      isAdd: false,
      Statusdata: [
        { label: "事假", value: 0 },
        { label: "病假", value: 1 },
        { label: "调休", value: 2 },
      ],
      type: ['待提交', '待审批', '已通过', '已拒绝', '已取消'],
      InputValue: "",
      tableTitle: [
        { name: "员工名称", tableprop: "StaffName" },
        { name: "请假类型", tableprop: "LeaveTypes" },
        { name: "申请时间", tableprop: "ApplyDate" },
        { name: "请假天数", tableprop: "LeaveDayCount" },
        { name: "审批状态", tableprop: "Status" },
        { name: "描述", tableprop: "Desc" },
      ],
      tableData: [],
      PageIndex: "1",
      pagesize: 8,
      total: 8,
      dialogtwo: false,
      formone: {
        TimeOne: "",
        Type: 0,
        Des: "",
        Num: "",
        TimeTwo: "",
      },
      DepartType: [
        { Id: "1", Name: "电子维保组" },
        { Id: "2", Name: "电器维修组" },
      ],
      ruleS: {
        TimeOne: [
          { required: true, message: "请输入申请时间", trigger: "blur" },
        ],
        TimeTwo: [
          { required: true, message: "请输入开始休假时间", trigger: "blur" },
        ],
        Num: [{ required: true, message: "请输入请假天数", trigger: "blur" }],
        Type: [
          { required: true, message: "请选择请假类型", trigger: "change" },
        ],
      },
      hasReSubmit: false,
      hasFirst: false
    };
  },
  computed: {
    ...mapGetters([
      'ApprovalProcessOrderRecordCreate',
      'ApprovedRefusedRedo',
      'UpdateLeaveStatus'
    ])
  },
  methods: {
    //查询数据
    GetValue () {
      let obj = {
        SN: "Attendance",
        MN: "GetLeavePages",
        RequestId: 1,
        UserId: 1,
        DataContent: {
          StaffName: this.InputValue,
          OrganizationId: "",
          LeaveType: this.TypeValue,
          Status: "",
          BeginTime:
            this.TimeValue && this.TimeValue.length > 0
              ? this.TimeValue[0]
              : "",
          EndTime:
            this.TimeValue && this.TimeValue.length > 0
              ? this.TimeValue[1]
              : "",
          PageIndex: this.PageIndex,
          PageSize: 8,
        },
      };
      this.MIX_send(obj);
    },
    //点击新增
    ClickAdd () {
      this.dialogtwo = true;
      this.LookType = false;
      this.isAdd = true
      this.formone = {
        TimeOne: "",
        Type: 0,
        Des: "",
        Num: "",
        TimeTwo: "",
      };
    },
    //点击编辑
    handleClickone (r) {
      this.isAdd = false
      this.InitId = r.Id;
      this.InitStatus = r.Status
      this.dialogtwo = true;
      this.LookType = false;
      //填充数据
      this.formone.TimeOne = r.ApplyDate;
      this.formone.TimeTwo = r.LeaveDate;
      this.formone.Num = r.LeaveDayCount;
      this.formone.Type = Number(r.LeaveType);
      this.formone.Des = r.Desc;
      this.formone.No = r.No;
      this.formone.StaffId = r.StaffId;
      this.formone.Status = r.Status;
      if (r.Status == '3' || r.Status == '4') {
        this.hasReSubmit = true
        this.hasFirst = false
      }
    },
    // 点击提交
    commit (r) {
      this.isAdd = false
      this.InitId = r.Id;
      this.formone.No = r.No
      console.log(r)
      let json = {
        MN: "ApprovalProcessOrderRecordCreate",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        DataContent: {
          ProcessCode: 'QJ',
          StaffID: r.StaffId,
          Abstracts: r.Desc,
          BillNum: r.No
        }
      }
      this.MIX_send(json)
    },
    // 点击重新提交
    reCommit (r) {
      this.isAdd = false
      this.hasReSubmit = true
      this.hasFirst = false
      console.log(r)
      this.handleClickone(r)
    },
    reCommitData () {
      console.log(this.formone)
      // this.hasFirst = true
      let json = {
        MN: "ApprovedRefusedRedo",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        DataContent: {
          ProcessCode: 'QJ',
          StaffID: this.formone.StaffId,
          Abstracts: this.formone.Des,
          BillNum: this.formone.No,
          No: this.formone.No
        }
      }
      this.MIX_send(json)
    },
    updateStatus () {
      let json = {
        MN: "UpdateLeaveStatus",
        SN: "Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          Id: this.InitId,
          Status: "1",
          No: this.formone.No
        }
      }
      this.MIX_send(json)
    },
    //点击删除
    handleClicktwo (r) {
      this.isAdd = false
      this.$confirm("是否删除此条请假申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let obj = {
            SN: "Attendance",
            MN: "DeleteLeave",
            RequestId: 1,
            UserId: 1,
            DataContent: {
              Id: r.Id,
            },
          };
          this.MIX_send(obj);
        })
        .catch(() => { });
    },
    //点击查看
    handleClickfive (r) {
      this.isAdd = false
      // this.dialogtwo = true;
      // this.LookType = true;
      console.log(r)
      this.$refs.goApproval.formData = r;
      this.$refs.goApproval.BillNum = r.No;
      this.$refs.goApproval.noSpCenter = false;
      this.$refs.goApproval.dialogFormVisible = true;
      //填充数据
      // this.formone.TimeOne = r.ApplyDate;
      // this.formone.TimeTwo = r.LeaveDate;
      // this.formone.Num = r.LeaveDayCount;
      // this.formone.Type = Number(r.LeaveType);
      // this.formone.Des = r.Desc;
    },
    //分页
    current_change (currentPage) {
      console.log(currentPage);
      this.PageIndex = currentPage;
    },
    //点击表单确定
    ClickYes () {
      console.log(this.isAdd)
      if (this.hasReSubmit) {
        this.reCommitData()
        return
      } else {
        if (this.LookType) {
          this.dialogtwo = false;
          this.$refs.formone.resetFields();
        } else {
          this.$refs.formone.validate((valid) => {
            if (valid) {
              let obj = {
                SN: "Attendance",
                MN: "AddOrUpdateLeave",
                RequestId: 1,
                UserId: 1,
                DataContent: {
                  Id: this.InitId == "" ? "0" : this.InitId,
                  No: "",
                  StaffId: JSON.parse(sessionStorage.getItem("UserDetial")).Id,
                  ApplyDate: this.formone.TimeOne,
                  OrganizationId: "1",
                  LeaveType: this.formone.Type,
                  LeaveDayCount: this.formone.Num,
                  LeaveDate: this.formone.TimeTwo,
                  Resuores: "1",
                  Status: "0",
                  Desc: this.formone.Des,
                  CreatedUser: JSON.parse(sessionStorage.getItem("UserDetial")).Id,
                },
              };
              this.MIX_send(obj);
            } else {
              return false;
            }
          });
        }
      }

    },
    //点击表单取消
    Canclematerial () {
      this.InitId = "";
      this.dialogtwo = false;
      if (!this.LookType) {
        this.$refs.formone.resetFields();
      }

    },
  },
  components: {
    pageTop,
    goApproval
  },
  mounted () {
    this.GetValue();
  },
  watch: {
    // 监听时间
    TimeValue: function () {
      this.GetValue();
    },
    //监听类型
    TypeValue: function () {
      this.GetValue();
    },
    //分页
    PageIndex: function () {
      this.GetValue();
    },
    // 数据列表回调
    "$store.state.Attendance.MNvalue.GetLeavePages": function (data) {
      if (data.Code == "0") {
        this.total = data.ReturnData.DataCount;
        if (data.ReturnData.Data && data.ReturnData.Data.length > 0) {
          let arr = data.ReturnData.Data;
          arr.forEach((item, index) => {
            item.LeaveTypes =
              item.LeaveType == "0"
                ? "事假"
                : item.LeaveType == "1"
                  ? "病假"
                  : item.LeaveType == "2"
                    ? "调休"
                    : "调休";
          });
          this.tableData = arr;
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //新增回调
    "$store.state.Attendance.MNvalue.AddOrUpdateLeave": function (data) {
      if (data.Code == "0") {
        this.dialogtwo = false;
        this.InitId = "";
        this.GetValue();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //删除回调
    "$store.state.Attendance.MNvalue.DeleteLeave": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "删除成功",
        });
        this.GetValue();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //提交回调
    ApprovalProcessOrderRecordCreate (data) {
      if (data.Code == "0") {
        this.$message({
          type: 'success',
          showClose: true,
          message: "提交成功",
        });
        this.updateStatus()
        // this.GetValue()
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: data.Message,
        });
      }
    },
    UpdateLeaveStatus (newVal, oldVal) {
      // this.dialogFormVisible = false
      if (newVal.Code == 0) {
        this.$message({
          type: 'success',
          showClose: true,
          message: "提交成功",
        });
        // this.ClickYes()
        this.dialogtwo = false;
        this.GetValue()
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
};
</script>

<style scoped lang="less">
#applyleave {
  width: 100%;
  height: 100%;
  background: white;
  padding: 0 20px;
  box-sizing: border-box;
  background: #fff;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
}
.top {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-top: 10px;
}
.Inputs {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.Inputs > div {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.Pages {
  position: absolute;
  margin-top: 50px;
  right: 50px;
}
.checks {
  height: 40px;
  line-height: 40px;
}
.el-button--primary {
  color: #fff;
  background-color: #0060a0;
  border-color: #0060a0;
  width: 6.8125rem;
  height: 2.6875rem;
}
.el-button--text {
  color: #0060a0;
}
/deep/ .el-dialog__header {
  margin: 0 2rem;
  padding: 20px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    margin-left: 20px;
    color: #4d6474;
    font-size: 18px;
    font-weight: 400;
  }
}
</style>