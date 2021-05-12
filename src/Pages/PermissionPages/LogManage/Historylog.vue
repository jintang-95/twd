<template>
  <div id="historylog">
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
            <el-input v-model="KeyWord" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div> 
      </div>
    <!-- <div class="top">
      <el-button type="primary" @click="ClickFound">高级查询</el-button>
      <div class="inputs">
        <div style="margin-right:30px;">
          <input type="checkbox" :checked="Checkdata_one" @click="ClickCheck_one" /> 系统日志
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" :checked="Checkdata_two" @click="ClickCheck_two" /> 操作日志
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" :checked="Checkdata_three" @click="ClickCheck_three" /> 设备日志
        </div>
        时间选择器
        <div style="margin-right:30px;">
          <el-date-picker v-model="ChooseTime" type="month" placeholder="选择时间查看"></el-date-picker>
        </div>
        <div class="check" style="margin-right:10px;position:relative">
          <el-input v-model="inputvalue" placeholder="请输入搜索关键字" maxlength="15" style="width:330px;"></el-input>
          <i class="iconfont icon-sousuo" @click="CheckValue"></i>
        </div>
        <div>
          <i class="iconfont icon-shuaxin" @click="Toload"></i>
        </div>
      </div>
    </div>
    <div class="SeniorCheck" v-if="senior">
      <div class="CheckInput">
        <div style="margin-left:30px;margin-top:30px">类型:</div>
        <div style="margin-left:30px;margin-top:30px">
          <input type="checkbox" :checked="Checkdata_one" @click="ClickCheck_one" /> 系统日志
        </div>
        <div style="margin-left:30px;margin-top:30px">
          <input type="checkbox" :checked="Checkdata_two" @click="ClickCheck_two" /> 操作日志
        </div>
        <div style="margin-left:30px;margin-top:30px">
          <input type="checkbox" :checked="Checkdata_three" @click="ClickCheck_three" /> 设备日志
        </div>
      </div>
      <div class="Timer">
        <div style="margin-left:30px;margin-top:30px">对象:</div>
        <div style="margin-left:30px;margin-top:20px">
          <el-input placeholder="请输入对象" v-model="ObjectValue" clearable></el-input>
        </div>
      </div>
      <div class="Timer">
        <div style="margin-left:30px;margin-top:30px">时间日期:</div>
        <div style="margin-left:30px;margin-top:20px">
          <el-date-picker
            v-model="ChooseTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <div style="margin-top:30px;margin-left:500px;">
        <el-button type="primary" size="mini" @click="CheckYes">搜索</el-button>
        <el-button type="primary" size="mini" @click="CloseCheck">关闭</el-button>
      </div>
    </div> -->
    <el-table
      :data="tableData"
      style="margin-top:20px;"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
       fit
      show-overflow-tooltip>
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true">
      </el-table-column>
       <el-table-column label="是否处理" align="center">
        <template slot-scope="{row}">
          <span v-if="row.IsHandle ==0">未处理</span>
          <span v-if="row.IsHandle ==1">已处理</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
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
      title="错误日志详情"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
        <div class="orderType">
            <!-- <div class="Logdea">日志详情:</div> -->
            <el-row>
              <el-col :span="12"><span >MN：<span style="font-weight: 100">{{MN}}</span></span></el-col>
              <el-col :span="12"><span >SN：<span style="font-weight: 100">{{SN}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span >是否处理：<span style="font-weight: 100">{{IsHandle}}</span></span></el-col>
              <el-col :span="12"><span >是否忽略：<span style="font-weight: 100">{{Ignore }}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span >请求数据：<span style="font-weight: 100">{{RequestData}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span >错误详情：<span style="font-weight: 100">{{ErrContent}}</span></span></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span >错误描述：<span style="font-weight: 100">{{ErrName}}</span></span></el-col>
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
      PageIndex:1,
      PageSize: 10,
      total: 0,
      IsHandle:'',
      Ignore:'',
      RequestData:'',
      ErrContent :'',
      ErrName :'',
      MN:'',
      SN:'',
      dialogVisible: false,
      tableData: [],
      tableTitle: [
        { name: "错误详情", tableprop: "ErrContent" },
        { name: "错误描述", tableprop: "ErrName" },
        { name: "MN", tableprop: "MN" },
        { name: "SN", tableprop: "SN" },
      ],
    };
  },
  created(){
    this.getlistdata();
  },
  methods: {
    // 关键字搜索
    sendinput() {
      this.getlistdata();
    },
    // 获取列表数据
    getlistdata() {
       let json = {
        "MN": "QuerySystemErrorLogPages",
        "SN":'SystemErrorLog',
        "RequestId": 1,
        "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        DataContent: {
          // Id:'0',
          "MN": "",
          "SN":'',
          IsHandle: this.IsHandle,
          Ignore:this.Ignore,
          PageSize:this.PageSize,
          PageIndex:this.PageIndex,
          KeyWord: this.KeyWord,
        }
      };
      this.MIX_send(json);
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
    // 查看
    handleClick(row) {
      this.dialogVisible = true;
      this.ErrName = row.ErrName;
      this.ErrContent = row.ErrContent;
      this.RequestData = row.RequestData;
      this.SN = row.SN;
      this.MN = row.MN;
      if(row.IsHandle == '0'){
        this.IsHandle = '未处理'
      }else if(row.IsHandle == '1'){
        this.IsHandle = '已处理'
      }
      if(row.Ignore == '0'){
        this.Ignore = '不可忽略'
      }else if(row.Ignore =='1'){
        this.Ignore ='可忽略'
      }
    },
    //关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  watch: {
     "$store.state.Humanmanage.QuerySystemErrorLogPages": function (data) {
      this.total = data.DataCount;
      this.tableData = data.Data;
    },
  }
};
</script>

<style lang="less" scoped>
#historylog {
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
  .el-button--primary {
      color: #FFF;
      background-color: #0060A0;
      border-color: #0060A0;
    width: 4.815rem;
    height:2.685rem;
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
    height:400px;
    overflow-y: auto;
    background-color:#FAFBFC;
}
</style>