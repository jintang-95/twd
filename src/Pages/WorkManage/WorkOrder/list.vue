<template>
    <div class="holifin">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
        </div>
        <div class="inputs">
          <div class="check" >
            <el-input v-model="KeyWord" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
        style="margin-top:20px;"
        show-overflow-tooltip
        fit
        highlight-current-row>
        <el-table-column label="工单编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderNO }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单类型" align="center">
          <template slot-scope="{row}">
           <span v-if="row.OrderType==0">保养工单</span>
           <span v-if="row.OrderType==1">维修工单</span>
           <span v-if="row.OrderType==2">检测</span>
           <span v-if="row.OrderType==3">其他</span>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.DeviceNo }}</span>
          </template>
        </el-table-column>
         <el-table-column label="创建人姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.AddStaffName }}</span>
          </template>
        </el-table-column>
          <el-table-column label="创建时间" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.CreatedTime | filterCtime}}</span> 
              </template>        
          </el-table-column>
         <el-table-column label="执行人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ExecName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" align="center">
          <template slot-scope="{row}">
           <span v-if="row.State==0">待分配</span>
           <span v-if="row.State==1">待执行</span>
           <span v-if="row.State==2">执行中</span>
           <span v-if="row.State==3">执行完成</span>
          <span v-if="row.State==4">已作废</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button   type="text" @click="remove(row)">
            <!-- <img src="../../../assets/images/delete.png" style="vertical-align:middle"  alt="">  -->
             <span style="vertical-align:middle">指派</span> 
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 指派弹框 -->
      <el-dialog
        title="工单指派"
        :visible.sync="dialogVisible"
        width="650px"
        :before-close="handleClose">
          <div class="orderType">
            <el-row>
              <el-col :span="12"><span >工单编号：<span style="font-weight: 400">{{OrderNO}}</span></span></el-col>
              <el-col :span="12"><span >工单类型：<span style="font-weight: 400">{{OrderType}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span >设备：<span style="font-weight: 400">{{DeviceNo}}</span></span></el-col>
              <el-col :span="12"><span >创建人名称：<span style="font-weight: 400">{{AddStaffName}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span >状态：<span style="font-weight: 400">{{State}}</span></span></el-col>
              <el-col :span="12"><span >执行人名称：<span style="font-weight: 400">{{ExecName}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span >计划内容：<span style="font-weight: 400">{{Remark}}</span></span></el-col>
            </el-row>
                <div class="orderassign">工单指派:
                  <div class="Figure"></div>
                </div>
                <el-form ref="form" :model="formData" label-position="left"  label-width="80px">
                  <el-form-item label="执行人">
                    <choose-staff @getToFather="chooseStaff1" :isCustomer="true" :isMultipleChoice="false"></choose-staff>
                  </el-form-item>
                </el-form>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="commints">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 分页 -->
        <el-pagination
          style="margin-top:10px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="PageIndex"
          :page-size="PageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          align="right"
          class="pagination">
        </el-pagination>
    </div>
</template>

<script>
 import pageTop from '@/components/pageTop.vue'
 import moment from 'moment'
 import chooseStaff from '@/components/chooseStaff.vue'
var that;
export default {
  components: {
    pageTop,
    chooseStaff
  },
  name: "holidayefin",
  data() {
    return {
      isCustomer: true,
      isMultipleChoice: false,
      title:'',
      // ExecName:'',
      ExecUser:'',
      PageIndex:1,
      total: 0,
      PageSize:10,
      KeyWord:'',
      IsStop:'',
      loading: false,
      dialogVisible: false,
      tableData: [],
      // listfrom: {
      //   "Id": '',
      //   "KeyWord": '',
      //   "IsStop": '',
      //   "PageSize": 10,
      //   "PageIndex": 1
      // },
      OrderNO:'',
      OrderType:'',
      DeviceNo:'',
      Remark:'',
      ExecName:'',
      AddStaffName:'',
      State:'',
      formData:{},
    };
  },
  created() {
    that = this;
    this.getlistdata();
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  filters:{
    filterCtime(CreatedTime){
      return moment(CreatedTime).format('YYYY-MM-DD')
    }
  },
  methods: {
     chooseStaff1(data) {
      this.formData.ExecUser = data.keyId
    },
    // 搜索
    sendinput() {
      this.getlistdata();
    },
    // 指派
    remove(row) {
      this.dialogVisible = true;
        let obj = {
          "MN": "GetSingleWorkOrder",
          "SN":"WorkOrderManage",
          "RequestId": 1,
          "UserId": 1,
          "DataContent":{
            "Id":row.Id,
          }
        }
        this.MIX_send(obj);
    },
    // 指派 保存
    commints() {
        this.formData.ID = 0;
        // if(this.State =='待执行'){
        //   this.State ='0'
        // }else if(this.State =='执行中'){
        //   this.State ='1'
        // }else if(this.State =='已完成'){
        //   this.State ='2'
        // }else if(this.State =='已取消'){
        //   this.State ='3'
        // }
        let obj = {
        "MN": "SaveWorkOrderDis",
        "SN":"WorkOrderManage",
        "RequestId": 1,
        "UserId": 1,
        "DataContent":{
          Id: this.formData.ID,
          OrderNO: this.OrderNO,
          CreatedUser:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
          ExecUser:this.formData.ExecUser,
          State:this.formData.ExecUser?'1':'0',
        }
       }
        this.MIX_send(obj);
        this.dialogVisible = false;
    },
    // 查询列表数据
    getlistdata() {
      let obj = {
        "MN": "GetListWorkOrder",
        "SN":"WorkOrderManage",
        "RequestId": 1,
        "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        "DataContent": {
          PageIndex: this.PageIndex,
          PageSize: this.PageSize,
          KeyWord:  this.KeyWord,
        }
      }
      this.MIX_send(obj);
    },
     // 页面Size切换
    handleSizeChange(PageSize) {
      this.PageSize = PageSize;
      this.getlistdata();
    },
    // 页面切换
    handleCurrentChange(PageIndex) {
      this.PageIndex = PageIndex;
      this.getlistdata();
    },
    // 关闭弹框
    handleClose() {
      this.formData = {};
      this.dialogVisible = false;
    }
  },
  watch: {
    "$store.state.Humanmanage.GetListWorkOrder": function (data) {
        this.total = data.ReturnData.DataCount;
        this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.GetSingleWorkOrder": function (data) {
        this.OrderNO = data.ReturnData.OrderNO;
         if(data.ReturnData.OrderType==0){
          this.OrderType = '保养工单'
        }else if(data.ReturnData.OrderType==1){
          this.OrderType = '维修工单'
        }else if(data.ReturnData.OrderType==2){
          this.OrderType = '检测'
        }else if(data.ReturnData.OrderType==3){
          this.OrderType = '其他'
        }
        if(data.ReturnData.State ==0){
          this.State = '待分配'
        }else if(data.ReturnData.State ==1){
          this.State = '待执行'
        }else if(data.ReturnData.State ==2){
          this.State = '执行中'
        }else if(data.ReturnData.State ==3){
          this.State ='已完成'
        }else if(data.ReturnData.State ==4){
          this.State = '已作废'
        };
        this.AddStaffName = data.ReturnData.AddStaffName;
        this.ExecName = data.ReturnData.ExecName;
        this.Remark = data.ReturnData.Remark;
        this.DeviceNo = data.ReturnData.DeviceNo;
    },
    "$store.state.Humanmanage.SaveWorkOrderDis": function (data) {
      this.$message({
        message: '恭喜你,操作成功',
        type: 'success'
      });
        this.getlistdata();
    },
  },
};
</script>

<style lang="less" scoped>
.holifin{
	// height: 100%;
  background-color:#FFF;
	border-radius: 5px;
  padding:0 20px;
  overflow-y: auto;
}
.operation {
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.buttons {
  width: 310px;
  height: 40px;
  display: flex;
  justify-content: space-between;
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
.el-button--primary {
  color: #FFF;
  background-color: #0060A0;
  border-color: #0060A0;
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
.orderType{
  height:300px;
}
/deep/ .el-dialog__body {
    margin: 20px 20px 10px;
    height:400px;
     padding:20px 20px 0 20px;
    overflow-y: auto;
    background-color:#FAFBFC;
}
/deep/ .el-textarea__inner{
    height:140px;
}
/deep/ .el-dialog__header{
  margin: 0 20px;
  padding: 20px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    color:#4D6474;
    font-size: 18px;
    font-weight: bold;
  }
}
/deep/ .selectL {
    padding-top:3px;
  }
.Figure{
  margin:12px 0px;
  width: 35px;
  height: 3px;
  background: #0060A0;
}
.el-col {
  line-height:50px;
  span{
    font-size:16px;
    color:#4D6474;
    // margin:10px;
    line-height:40px;
    font-weight: 550;
  }
}
.orderassign{
  margin-top:20px;
  width:80px;
  color: #0060A0;
  font-size:18px;
  font-weight: bold;
  line-height: 20px;
}
/deep/ .el-form-item__label{
  color:#4D6474;
  font-size: 16px;
  font-weight: 550;
}
</style>
