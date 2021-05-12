<template>
  <div id="nowlog">
    <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <!-- <el-button type="primary" @click="addNew">新增</el-button> -->
        </div>
        <div class="inputs">
          <!-- <el-select v-model="value" placeholder="状态:请选择" @change="statusChange" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.TypeName"
              :value="item.ID">
            </el-option>
          </el-select> -->
          <div class="check">
            <el-input v-model="KeyWord" placeholder="请输入搜索关键字"  maxlength="15">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div> 
      </div>
    <el-table
      :data="tableData"
      style="margin-top:20px;"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      show-overflow-tooltip
      fit
      highlight-current-row>
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="登陆类型" align="center">
        <template slot-scope="{row}">
          <span v-if="row.OperationType =='1'">登陆</span>
          <span v-if="row.OperationType =='2'">操作</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button @click="handleClick(row)" type="text">
            <img src="../../../assets/images/look.png" alt="" style="vertical-align:middle">
            <span style="vertical-align:middle">查看</span>
            </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 详情弹出框 -->
    <el-dialog
      title="操作日志详情"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
        <div class="orderType">
            <!-- <div class="Logdea">日志详情:</div> -->
            <el-row>
              <el-col :span="12"><span >操作类型： <span style="font-weight: 100">{{OperType}}</span></span></el-col>
              <el-col :span="12"><span  >IP：<span style="font-weight: 100">{{IP}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span >员工：<span style="font-weight: 100">{{WorkId}}</span></span></el-col>
              <!-- <el-col :span="12"><span >执行人姓名：<span style="font-weight: 100">{{ExecName}}</span></span></el-col> -->
            </el-row>
            <el-row>
              <el-col :span="24"><span >请求数据：<span type="textarea" style="font-weight: 100">{{RequestData}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span >操作描述：<span style="font-weight: 100">{{Remarks}}</span></span></el-col>
            </el-row>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 import pageTop from '@/components/pageTop.vue'
export default {
  name: "Nowlog",
  components:{
    pageTop
  },
  data() {
    return {
      title:'',
      options:[],
      value:'',
      KeyWord:"",
      dialogVisible: false,
      PageIndex:1,
      PageSize: 10,
      total: 0,
      OperType:'',
      Remarks:'',
      IP:'',
      RequestData:'',
      WorkId:'',
      OperationType:'',
      WorkerId:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
      tableData: [],
      tableTitle: [
        { name: "IP", tableprop: "IP" },
        { name: "员工名称", tableprop: "StaffName" },
      ],
    };
  },
  created(){
    this.getlistdata();
  },
  methods: {
    // 下拉选项框
    statusChange() {

    },
    // 搜索
    sendinput() {
      this.getlistdata();
    },
    // 获取列表数据
    getlistdata() {
       let json = {
        "MN": "QueryOperationLogPages",
        "SN":'OperationLog',
        "RequestId": 1,
        "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        DataContent: {
          Id:'0',
          OperationType: this.OperationType,
          WorkerId:this.WorkerId,
          PageSize:this.PageSize,
          PageIndex:this.PageIndex,
          KeyWord: this.KeyWord,
        }
      };
      this.MIX_send(json);
    },
    // 页面跳转
     handleCurrentChange(PageIndex) {
        this.PageIndex = PageIndex;
        this.getlistdata();
    },
    // 页面跳转
    handleSizeChange(PageSize) {
      this.PageSize = PageSize;
      this.getlistdata();
    },
    // 查看
    handleClick(row) {
      this.dialogVisible = true;
      if(row.OperationType == '1'){
        this.OperType ='登陆'
      }else if(row.OperationType == '2'){
        this.OperType ='操作'
      }
      this.IP = row.IP;
      this.WorkId = row.StaffName;
      this.Remarks = row.Remarks;
      this.RequestData = row.RequestData;
    },
    //关闭弹窗
    handleClose(){
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  watch: {
    "$store.state.Humanmanage.QueryOperationLogPages": function (data) {
      this.total = data.DataCount;
      this.tableData = data.Data;
      //  this.getTableData();
    },
  }
};
</script>

<style lang="less"  scoped>
#nowlog {
  width: 100%;
  background-color:#FFF;
	border-radius: 5px;
  padding:0 20px;
	box-sizing: border-box;
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
  .el-button--text{
    color: #0060A0;
    font-size: 14px;
  }
  .el-button--text img{
    display: inline-block;
    margin-right: 5px;
    width: 13px;
  }
  .el-button--primary {
      color: #FFF;
      background-color: #0060A0;
      border-color: #0060A0;
    width: 4.815rem;
    height:2.685rem;
  }
  .orderType{
    height:200px;
  }
  .Logdea{
    font-size:18px;
    font-weight: bold;
    line-height: 20px;
  }
  .el-col {
    line-height:50px;
    span{
      font-size:16px;
      color:#4D6474;
      margin:10px;
      line-height:40px;
      font-weight: 500;
    }
  }
  /deep/ .el-dialog__header{
    margin: 0 20px;
    padding: 20px 0 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    span {
      color:#4D6474;
      font-size: 18px;
      font-weight: 520;
    }
  }
  /deep/ .el-dialog__body {
      margin: 10px 20px 0;
      padding:20px 20px 0 20px;
      overflow-y: auto;
      height:400px;
      background-color:#FAFBFC;
  }
</style>