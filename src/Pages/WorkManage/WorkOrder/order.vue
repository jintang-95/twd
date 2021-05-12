<template>
  <div class="materiaType">
    <pageTop :title="title"></pageTop>
      <div class="operation">
          <div class="buttons">
          </div>
          <div class="inputs">
          <div style="margin-right:13px;">
          </div>
          <div class="check">
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
              <span>{{ row.OrderNo }}</span>
          </template>
          </el-table-column>
          <el-table-column label="处理人员" align="center">
            <template slot-scope="{row}">
              <span>{{ row.ExecName }}</span>
            </template>
          </el-table-column>
            <el-table-column label="是否确认" align="center">
            <template slot-scope="{row}">
              <span v-if="row.Confirm==0">待确认</span>
              <span v-if="row.Confirm==1">确认</span>
              <span v-if="row.Confirm==2">无效</span>
            </template>
          </el-table-column>
          <el-table-column label="确认人" align="center">
            <template slot-scope="{row}">
              <span>{{ row.CreatedName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.CreatedTime | Ctime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="处理结果" align="center">
            <template slot-scope="{row}">
              <span v-if="row.State==0">未完成</span>
              <span v-if="row.State==1">已完成</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
          <template slot-scope="{row}">
              <el-button  type="text"  @click="editdetail(row)">
              <img src="../../../assets/images/look.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">查看</span> 
              </el-button>
              <el-button  type="text" v-if="row.Confirm !=1" @click="remove(row)">
                <!-- <img src="../../../assets/images/delete.png" style="vertical-align:middle"  alt="">  -->
                <span style="vertical-align:middle">确认</span> 
              </el-button>
          </template>
          </el-table-column>
      </el-table>
      <!-- 查看工单弹出框 -->
      <el-dialog
        title="工单日志"
        :visible.sync="dialogVisible"
        width="650px"
        :before-close="handleClose">
        <div class="orderType">
          <div class="Logdea">日志详情:
            <div class="Figure"></div>
          </div>
          <el-row>
            <el-col :span="12"><span >工单编号：<span style="font-weight: 400">{{OrderNO}}</span></span></el-col>
            <el-col :span="12"><span >确认状态：<span style="font-weight: 400">{{Confirm}}</span></span></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><span >确认人姓名：<span style="font-weight: 400">{{ConfirmName}}</span></span></el-col>
            <el-col :span="12"><span >执行人姓名：<span style="font-weight: 400">{{ExecName}}</span></span></el-col>
          </el-row>
            <el-row>
            <el-col :span="12"><span >创建人姓名：<span style="font-weight: 400">{{CreatedName}}</span></span></el-col>
            <el-col :span="12"><span >执行状态：<span style="font-weight: 400">{{State}}</span></span></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><span >问题描述：<span style="font-weight: 400">{{Question}}</span></span></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><span >处理方式：<span style="font-weight: 400">{{TreatmentMethod}}</span></span></el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" v-if="row.Confirm !=1"  @click="commit">确认工单</el-button>
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
var that;
export default {
  components: {
     pageTop,
  },
  name: "holidayefin",
  data() {
    return {
      title:'',
      dialogVisible: false,
      loading: false,
      OrderNO:'',
      row:'',     // 定义变量保存
      OrderType:'',
      formtype:'1',
      ConfirmName:'',
      ExecName:'',
      Confirm:'',
      CreatedName:'',
      State:'',
      Question:'',
      TreatmentMethod:'',
      PageIndex:1,
      PageSize:10,
      total:0,
      KeyWord:'',
      IsStop: '',
      rowOrder:'',
      tableData: [],
      formData: {
        name:'',
        region :'',
      },
      rowId:'',   //定义变量保存
      Confirm:1,
    };
  },
  created() {
    that = this;
    this.rowOrder=localStorage.getItem('getset')
     this.getlistdata();
  },
  filters: {
      Ctime(CreatedTime) {
      return moment(CreatedTime).format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  methods: {
    // 搜索
    sendinput() {
        this.getlistdata();
    },
    // 查看
    editdetail(row){
      this.row = row;    // 保存row
      this.rowId = row.Id;  // 保存id
      this.dialogVisible = true;
        let json = {
          "MN":'GetSingleWorkOrderLog',
          "SN":"WorkOrderManage",
          "RequestId": 1,
          "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
          "DataContent" :{
            Id:row.Id
          }
        }
      this.MIX_send(json);
    },
    // 确认
    remove(row) {
      this.$confirm('此操作将确认状态, 是否确认继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {  
            "MN": "UpdateWorkOrderConfirm",
            "SN":'WorkOrderManage',
            "RequestId": 1,
            "UserId": 1,
            "DataContent": {
              ConfirmUser:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
              Id: row.Id,
              Confirm:'1' 
              }
          }
          this.MIX_send(obj);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认'
          });          
        });
      
    },
    // 提交确认
    commit(){
      // if(this.Confirm =='确认'){
      //   this.Confirm = '1'
      // }else{
      //   this.Confirm = '2'
      // }
      // if(this.Confirm =='确认'){
      //    this.Confirm = '1'
      // }else if(this.Confirm =='确认'){
      //    this.Confirm = '1'
      // }else{ 
      //    this.Confirm = '2'   
      // }
      let obj = {  
         "MN": "UpdateWorkOrderConfirm",
        "SN":'WorkOrderManage',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          ConfirmUser:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
          Id: this.rowId,
          Confirm:'1' 
        }
      }
      this.MIX_send(obj);
      this.dialogVisible = false;
    },
    // 查询列表数据
    getlistdata() {
      let obj = {
        "MN": "GetListWorkOrderLog",
        "SN":'WorkOrderManage',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          KeyWord: this.KeyWord,
          IsStop: this.IsStop,
          PageSize: this.PageSize,
          PageIndex: this.PageIndex,
          rowOrder: this.rowOrder
        }
      }
      this.MIX_send(obj);
    },
    // 分页
    handleCurrentChange(PageIndex) {
       this.PageIndex = PageIndex;
       this.getlistdata();
    },
    // 分页
    handleSizeChange(PageSize) {
       this.PageSize = PageSize;
       this.getlistdata();
    },
    // 关闭弹框
    handleClose() {
      this.dialogVisible = false;
    }
  },
  watch: {
    "$store.state.Humanmanage.GetListWorkOrderLog": function (data) {
      this.total = data.ReturnData.Count;
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.GetSingleWorkOrderLog": function (data) {
        this.OrderNO = data.ReturnData.OrderNo;
        // if(data.ReturnData.OrderType==0){
        //   this.OrderType = '保养工单'
        // }else if(data.ReturnData.OrderType==1){
        //   this.OrderType = '维修工单'
        // }else if(data.ReturnData.OrderType==2){
        //   this.OrderType = '检测'
        // }else if(data.ReturnData.OrderType==3){
        //   this.OrderType = '其他'
        // }
        if(data.ReturnData.Confirm ==0){
          this.Confirm = '待确认'
        }else if(data.ReturnData.Confirm ==1){
          this.Confirm = '确认'
        }else{
          this.Confirm = '无效'
        }
        this.TreatmentMethod = data.ReturnData.TreatmentMethod;
        this.Question = data.ReturnData.Question;
        this.ConfirmName = data.ReturnData.ConfirmName;
        this.ExecName = data.ReturnData.ExecName;
        this.CreatedName = data.ReturnData.CreatedName;
        if(data.ReturnData.State ==0){
          this.State = '未完成'
        }else if(data.ReturnData.State ==1){
          this.State = '已完成'
        }
    },
    "$store.state.Humanmanage.UpdateWorkOrderConfirm": function (data) {
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
.materiaType{
  background-color:#FFF;
	border-radius: 5px;
  padding:0 20px;
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
    height:350px;
    padding:20px 20px 0 20px;
    overflow-y: auto;
    background-color:#FAFBFC;
}
/deep/ .el-textarea__inner{
    height:150px;
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
.Logdea{
  width:80px;
  color: #0060A0;
  font-size:18px;
  font-weight: bold;
  line-height: 20px;
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
    line-height:40px;
    font-weight: 500;
  }
}
</style>
