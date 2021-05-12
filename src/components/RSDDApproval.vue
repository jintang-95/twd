<template>
  <el-dialog
    class="QJ"
    :title="title"
    width="800px"
    @open="openEvent"
    :visible.sync="dialogFormVisible"
  >
    <div class="approval_content">
      <div class="main_info">
        <div class="tip">
          <span
            :class="[formData.Status == '0' ? 'needSubmit' : formData.Status == '1' ? 'needSP' : formData.Status == '2' ? 'hasPass' : formData.Status == '3' ? 'hasReject' : formData.Status == '4' ? 'hasCancel' : 'hasCancel']"
          >{{ status[formData.Status] }}</span>
        </div>
        <div class="applyPerson">
          <div class="person">
            <span>申请人：</span>
            <span>{{ formData.Name }}</span>
          </div>
          <div class="time">
            <span>申请时间：</span>
            <span>{{ formData.Addtime }}</span>
          </div>
        </div>
        <div class="main_detail">
          <div class="detail_content">
            <div class="detail_row">
              <span>调动人：</span>
              <span>{{ formData.Name }}</span>
            </div>
            <div class="detail_row">
              <span>当前部门：</span>
              <span>{{ formData.OrganizationName }}</span>
            </div>
            <div class="detail_row">
              <span>当前岗位：</span>
              <span>{{ formData.JobsName }}</span>
            </div>
          </div>
          <div class="detail_content">
            <div class="detail_row"></div>
            <div class="detail_row">
              <span>调动至部门：</span>
              <span>{{ formData.MOrganizationName }}</span>
            </div>
            <div class="detail_row">
              <span>调动至岗位：</span>
              <span>{{ formData.MJobsName }}</span>
            </div>
          </div>
        </div>
        <div class="reason">
          <span>调动原因：</span>
          <span>{{ formData.Abstracts }}</span>
        </div>
      </div>
      <div class="node_info">
        <div class="item" v-for="(item, index) in nodeData" :key="index">
          <div class="img">
            <div class="img">
              <img src="@/assets/images/img_shenpi/head_img.jpg" alt />
            </div>
            <div class="intro">
              <div class="name">{{ item.StaffName }}</div>
              <div class="detail">
                <span>批注：</span>
                <span>{{ item.Remark }}</span>
              </div>
            </div>
          </div>
          <div class="approval">
            <span
              v-if="item.Status != '0'"
              :class="[item.Status == '0' ? 'needSubmit' : item.Status == '1' ? 'needSP' : item.Status == '2' ? 'hasPass' : item.Status == '3' ? 'hasReject' : 'hasCancel']"
            >{{ status[item.Status] }}</span>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" v-if="noSpCenter">
      <div
        style="margin-bottom: 10px;"
        v-if="formData.Status == '1' &&  currentNeedSpId == currentUserStaffId"
      >
        <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="formData.Remark"></el-input>
      </div>
      <el-button
        @click="clickCancel"
        v-if="formData.Status != '2' && currentUserStaffId == currentApplyId"
      >撤销</el-button>
      <el-button
        @click="clickReject"
        v-if="formData.Status == '1' &&  currentNeedSpId == currentUserStaffId"
      >拒绝</el-button>
      <el-button
        @click="clickReturn"
        v-if="showWithdraw && formData.Status == '1' &&  currentNeedSpId == currentUserStaffId"
      >撤回</el-button>
      <el-button
        type="primary"
        @click="clickAgree"
        v-if="formData.Status == '1' &&  currentNeedSpId == currentUserStaffId"
      >同意</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      title: '',
      dialogFormVisible: false,
      ProcessCode: 'RSDD',
      noSpCenter: true,
      BillNum: '',
      status: ['待提交', '待审批', '已同意', '已拒绝', '已取消', '已执行'],
      nodeData: [], // 节点信息
      formData: {
        Name: '',
        Addtime: '',
        Abstracts: '',
        JobsName: '',
        OrganizationName: '',
        MJobsName: '',
        MOrganizationName: '',
        Remark: ''
      },
      currentApplyId: '', // 当前提交申请单的人员Id
      currentNeedSpId: '', //当前待审批节点人员Id
      formId: '', // 请假单Id
      showWithdraw: true,
      nodeId: '', //待审批人员的节点ID
      currentUserStaffId: JSON.parse(sessionStorage.getItem("UserDetial")).Id, //当前登录人员Id
      // Statusdata: ["事假", "病假", "调休"],
    };
  },
  created () {

  },
  computed: {
    ...mapGetters([
      'ApprovalProcessOrderRecordLogGet',
      'GetStaffMoveByNo',
      'ApprovedPass',
      'ApprovedRefused',
      'ApprovedWithdraw',
      'ApprovedCancel',
      'UpdateStaffMoveStatus'
    ])
  },
  watch: {
    ApprovalProcessOrderRecordLogGet (newVal, oldVal) {
      console.log(newVal)
      if (newVal.Code == 0) {
        this.nodeData = newVal.ReturnData.NodeList
        if (this.nodeData.length > 0) {
          let new_arr = this.nodeData.filter(item => item.Status == '1')
          if (new_arr.length > 0) {
            this.currentNeedSpId = this.nodeData.filter(item => item.Status == '1')[0].StaffID
            this.nodeId = this.nodeData.filter(item => item.Status == '1')[0].ID
          }
          let arr = this.nodeData.filter(item => item.Status == '2')
          this.showWithdraw = arr.length != 0
        }
      }
    },
    ApprovedPass (newVal, oldVal) {
      this.dialogFormVisible = false
      if (newVal.Code == 0) {
        this.$message.success('审批成功')
        if (newVal.ReturnData.OperateBusinessStatus) {
          this.currentFormStatus = 2
          this.updateStatus()
        }
        this.$parent.getCardData()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    UpdateStaffMoveStatus (newVal, oldVal) {
      // this.dialogFormVisible = false
      if (newVal.Code == 0) {
      } else {
        this.$message.error(newVal.Message)
      }
    },
    ApprovedRefused (newVal, oldVal) {
      this.dialogFormVisible = false
      if (newVal.Code == 0) {
        this.$message.success('操作成功')
        this.currentFormStatus = 3
        this.updateStatus()
        this.$parent.getCardData()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    ApprovedWithdraw (newVal, oldVal) {
      this.dialogFormVisible = false
      if (newVal.Code == 0) {
        this.$message.success('操作成功')
        if (newVal.ReturnData.OperateBusinessStatus) {
          this.currentFormStatus = 2
          this.updateStatus()
        }
        this.$parent.getCardData()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    ApprovedCancel (newVal, oldVal) {
      this.dialogFormVisible = false
      if (newVal.Code == 0) {
        this.$message.success('操作成功')
        this.currentFormStatus = 4
        this.updateStatus()
        this.$parent.getCardData()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    GetStaffMoveByNo (newVal, oldVal) {
      if (newVal.Code == 0) {
        this.formData.JobsName = newVal.ReturnData.JobsName
        this.formData.JobsId = newVal.ReturnData.JobsId
        this.formData.OrganizationName = newVal.ReturnData.OrganizationName
        this.formData.MJobsId = newVal.ReturnData.MJobsId
        this.formData.MJobsName = newVal.ReturnData.MJobsName
        this.formData.MOrganizationName = newVal.ReturnData.MOrganizationName
        this.currentApplyId = newVal.ReturnData.StaffId
        this.formId = newVal.ReturnData.Id
        this.title = newVal.ReturnData.StaffName + '的人事调动审批'
        // this.formData.Name = newVal.ReturnData.StaffName
        this.formData.Name = newVal.ReturnData.StaffName
        this.formData.Addtime = newVal.ReturnData.ApplyDate
        // this.formData.Abstracts = newVal.ReturnData.Desc
      }
    }
  },
  props: {
    BillNO: {
      type: String,
      default: ''
    }
  },
  methods: {
    openEvent () {
      this.getNodeData()
      this.getFormDetail()
    },
    getNodeData () {
      let json = {
        MN: "ApprovalProcessOrderRecordLogGet",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          ProcessCode: this.ProcessCode,
          BillNum: this.BillNum
        }
      }
      this.MIX_send(json)
    },
    getFormDetail () {
      let json = {
        MN: "GetStaffMoveByNo",
        SN: "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          No: this.BillNum
        }
      }
      this.MIX_send(json)
    },
    clickAgree () {
      let json = {
        MN: "ApprovedPass",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          ProcessLogId: this.nodeId,
          StaffID: this.currentNeedSpId,
          Status: 2,
          Remark: this.formData.Remark
        }
      }
      this.MIX_send(json)
    },
    clickReject () {
      let json = {
        MN: "ApprovedRefused",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          ProcessLogId: this.nodeId,
          StaffID: this.currentNeedSpId,
          Status: 3,
          Remark: this.formData.Remark
        }
      }
      this.MIX_send(json)
    },
    clickReturn () {
      let json = {
        MN: "ApprovedWithdraw",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          ProcessLogId: this.nodeId,
          StaffID: this.currentNeedSpId,
          Status: 4,
          Remark: this.formData.Remark
        }
      }
      this.MIX_send(json)
    },
    clickCancel () {
      let json = {
        MN: "ApprovedCancel",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          StaffID: this.currentApplyId,
          ProcessCode: 'RSDD',
          BillNum: this.BillNum,
          Status: 5
        }
      }
      this.MIX_send(json)
    },
    updateStatus () {
      let json = {
        MN: "UpdateStaffMoveStatus",
        SN: "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          Id: this.formId,
          Status: this.currentFormStatus,
          UpdateOrganization: this.formData.JobsId == this.formData.MJobsId
        }
      }
      this.MIX_send(json)
    }
  }
};
</script>

<style scoped lang="less">
.approval_content {
  width: 100%;
  height: 420px;
  overflow-y: scroll;
  overflow-x: hidden;
  .main_info {
    position: relative;
    background: #fafbfc;
    padding: 20px;
    color: #6d7983;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    border-radius: 4px;
    .tip {
      position: absolute;
      right: 0;
      top: 0;
      width: 70px;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      background: rgba(48, 137, 246, 0.11);
      color: #3089f6;
      text-align: center;
      border-radius: 0 2px;
    }
    .applyPerson {
      border-bottom: 1px dashed rgba(135, 145, 154, 0.37);
      padding-bottom: 10px;
      .person {
        margin-bottom: 6px;
        font-size: 16px;
        font-weight: bold;
        color: #4d6474;
      }
    }
    .reason {
      margin-top: 10px;
    }
  }
  .main_detail {
    padding-top: 8px;
    display: flex;
    .detail_content {
      width: 50%;
      border-bottom: 1px dashed rgba(135, 145, 154, 0.37);
      div {
        margin-bottom: 6px;
        height: 20px;
      }
    }
  }
  .node_info {
    margin-top: 10px;
    .item {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 32px;
      padding-top: 10px;
      .img {
        display: flex;
        img {
          display: inline-block;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 17px;
        }
      }
      .intro {
        color: #798b97;
        .name {
          margin-bottom: 6px;
          font-size: 16px;
          color: #1d2f3b;
        }
        .detail {
          display: flex;
          .detail_content {
            flex: 1;
          }
        }
      }
      .approval {
        width: 80px;
        text-align: right;
      }
    }
    .item::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 32px;
      bottom: -32px;
      left: 18px;
      border-left: 1.5px dashed #dfe7ea;
    }
    .item:last-child {
      margin-bottom: 0;
    }
    .item:last-child::after {
      display: none;
    }
  }
  .needSubmit {
    color: #798b97;
  }
  .needSP {
    color: #3089f6;
  }
  .hasPass {
    color: #93c07d;
  }
  .hasReject {
    color: #eb7171;
  }
}
</style>
