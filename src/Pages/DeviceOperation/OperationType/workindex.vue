<template>
  <div id="user">
    <pageTop :title="title"></pageTop>
    <div class="operation">
      <div class="buttons">
        <el-button type="primary" @click="ClickAdd">新增</el-button>
        <!-- <el-button type="primary">配置</el-button> -->
      </div>
      <div class="inputs">
        <div style="margin-right:13px;">
          <el-select v-model="selectValue" placeholder="状态:选择状态" @change="isdelchange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="check" style="margin-right:10px;">
          <el-input v-model="input_one" placeholder="请输入搜索" maxlength="15" style="width:274px;"></el-input>
          <i class="iconfont icon-sousuo" @click="getTableData"></i>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      style="margin-top:20px;width:100%"
      show-overflow-tooltip
    >
      <!-- <el-table-column label="设备停用日志记录ID" align="center" width="150" >
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="记录编号" align="center"  prop="LogNO">
        <template slot-scope="{row}">
          <span>{{ row.LogNO }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" align="center"  prop="DeviceNO">
        <template slot-scope="{row}">
          <span>{{ row.DeviceNO }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停工日期" align="center"  prop="Sdate">
        <template slot-scope="{row}">
          <span>{{ row.Sdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="恢复日期" align="center" width="150" prop="Edate">
        <template slot-scope="{row}">
          <span>{{ row.Edate }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="停工原因" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.Reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.Addtime }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="登记人ID" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.StaffID }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" align="center" >
       
        <template slot-scope="scope">
           <el-dropdown @command="handleCommand" v-model="scope.row.Status">
          <span class="el-dropdown-link" v-if="scope.row.Status==0">待停工<i class="el-icon-arrow-down el-icon--right"></i></span>
          <span class="el-dropdown-link" v-else-if="scope.row.Status==1">停工中<i class="el-icon-arrow-down el-icon--right"></i></span>
          <span class="el-dropdown-link" v-else-if="scope.row.Status==2">已恢复<i class="el-icon-arrow-down el-icon--right"></i></span>
          <span class="el-dropdown-link" v-else-if="scope.row.Status==3">取消<i class="el-icon-arrow-down el-icon--right"></i></span>
          
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="beforeHandleCommand(scope.$index, scope.row,commandOne)">待停工</el-dropdown-item>
            <el-dropdown-item :command="beforeHandleCommand( scope.$index,scope.row,commandTwo)">停工中</el-dropdown-item>
            <el-dropdown-item :command="beforeHandleCommand( scope.$index,scope.row,commandThree)">已恢复</el-dropdown-item>
            <el-dropdown-item :command="beforeHandleCommand( scope.$index,scope.row,commandFour)">取消</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.DeviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录人名称" align="center"  >
        <template slot-scope="{row}">
          <span>{{ row.StaffName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="240" align="center">
        <template slot-scope="scope">
          <!-- <div v-if="scope.row.IsDel == '0'"> -->
            <el-button type="text" size="small" @click="edit(scope.row)">
              <img src="../../../assets/images/edit_icon.png" alt />
              编辑
            </el-button>
             <span class="line"></span>
            <el-button type="text" size="small" @click="see(scope.row)">
              <img src="../../../assets/images/edit_icon.png" alt />
              查看
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="Pages">
      <el-pagination
        @size-change="pageSizeToggle"
        @current-change="pageToggle"
        @prev-click="pagePrev"
        @next-click="pageNext"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 新增停工单 -->
    <el-dialog center :visible.sync="dialogReqOrder" width="950px" :before-close="clickNo">
      <div v-if="this.dialogtype==1">
        <div class="titleName">新增停工单</div>
      </div>
       <div v-if="this.dialogtype==2">
         <div class="titleName">编辑停工单</div>
      </div>
      <div class="line"></div>
      <el-form label-width="auto" label-position="left" :model="formone" :rules="rules" ref="formone">        
        <el-row :span='20'>
          <!-- <el-col :span="8">
            <el-form-item label="记录编号:" prop="LogNO">
              <el-input placeholder="请输入内容" v-model="formone.LogNO" style="width:200px"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8 ">
            <el-form-item label="登记人:" prop="StaffName">
              <el-input placeholder="请输入内容" v-model="formone.StaffName" style="width:200px" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8 ">
            <el-form-item label="设备编号:" prop="DeviceNO">
              <el-input placeholder="请输入内容" v-model="formone.DeviceNO" style="width:200px" ref='formone' v-show="dialogtype=='3'" disabled></el-input>
              
              <el-input placeholder="请输入内容" @focus="open()" v-model="formone.DeviceNO" style="width:200px" ref='formone' v-show="dialogtype=='1'||dialogtype=='2'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停工日期:" prop="Sdate">
              <el-input placeholder="请输入内容" v-model="formone.Sdate" style="width:200px" ref='formone' v-show="dialogtype=='3'" disabled></el-input>
              
              <el-date-picker
              v-show="dialogtype=='1'||dialogtype=='2'"
              style="width:200px"
              v-model="formone.Sdate"
              type="datetime"
              value-format="yyyy/MM/dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span='20'>
           <el-col :span="8">
            <el-form-item label="恢复日期:" prop="Edate">
              <el-input placeholder="请输入内容" v-model="formone.Edate" style="width:200px" ref='formone' v-show="dialogtype=='3'" disabled></el-input>

                <el-date-picker
                v-show="dialogtype=='1'||dialogtype=='2'"
                style="width:200px"
                v-model="formone.Edate"
                type="datetime"
                value-format="yyyy/MM/dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="记录时间:">
              <el-input placeholder="请输入内容" v-model="formone.Addtime" style="width:200px" ref='formone'  disabled></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态:" prop="Status" v-show="dialogtype=='1'||dialogtype=='2'">
              <el-select v-model="formone.Status" placeholder="请选择状态" style="width:200px" >
                <el-option
                  v-for="item in Status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="停工原因" prop="Reason">
          <el-input v-model="formone.Reason" type="textarea" placeholder="请输入停工原因" v-show="dialogtype=='1'||dialogtype=='2'"></el-input>
          <el-input v-model="formone.Reason" type="textarea" placeholder="请输入停工原因" disabled v-show="dialogtype=='3'"></el-input>

        </el-form-item>
      </el-form>

      <div style="text-align:right;margin-top:10px;">
        <el-button type="primary" @click="ClickYes('formone')" v-show="dialogtype=='1'||dialogtype=='2'">确定</el-button>
        <el-button type="info" @click="clickNo">取消</el-button>
      </div>
    </el-dialog>
      <!-- 
    @closePropMask //关闭模态框
    @PopFormInit01 //关闭模态框，清空输入值
    @addMaterielTable="addTable" //接收单选框
    @addCheck="addCheck"//传递多选框数组 
    check//是否多选，1为多选,
    visible//模态框显示隐藏
    title//模态框抬头
  -->
   <equipmentTable 
      @closePropMask="closePropMask"
      @PopFormInit01='PopFormInit01'
      @addMaterielTable="addTable"
     :check="sbcheck"
     :visible.sync="sbshow"
     :title='sbtitle'
    ></equipmentTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pageTop from "@/components/pageTop.vue";
import equipmentTable from "@/components/equipmentTable.vue";
import moment from 'moment'
export default {
  name: "User",
  data() {
    return {
      sbcheck:2,
      sbtitle:'设备明细',
      sbshow:false,
      commandOne:{value:"0",dec:"待停工"},
      commandTwo:{value:"1",dec:"已停工"},
      commandThree:{value:"2",dec:"已恢复"},
      commandFour:{value:"3",dec:"取消"},
      someone:"请选择状态",
      total: 0,
      currentPage: 1,
      loading: false,
      pageSize: 10,
      page: 1,
      dialogtype: 1,
      Status:[
        {
          value: "0",
          label: "待停工",
        },
        {
          value: "1",
          label: "停工中",
        },
        {
          value: "2",
          label: "已恢复",
        },
        {
          value: "3",
          label: "取消",
        }
      ],
      rules: {
        LogNO: [{ required: true, message: "请输入记录编号", trigger: "blur" },],
        // StaffID:[{ required: true, message: "请输入登记人ID", trigger: "blur" },],
        Edate: [{ required: true, message: "请选择恢复日期", trigger: "change" },],
        Reason: [{ required: true, message: "请输入停工原因", trigger: "blur" }],
        Status:[{required: true, message: "请选择状态", trigger: "change"}],
        Sdate: [{ required: true, message: "请选择停工日期", trigger: "change" },],
        // DeviceNO: [{ required: true, message: "请输入设备编号", trigger: "blur" },],
        // Addtime:[{ required: true, message: "请选择记录时间", trigger: "change" },]
      },
      InputDisabled: true, //禁用Input框
      InputNoDisabled: false, //启用Input框
      tableData: [
        //表格数据
      ],
      formone: {
        //新增请购单from表单死数据
      },
      Formtable: [], //购买明细表数据源
      dialogAddMX: false, //新增购买明细弹窗
      formtwo: {}, //新增购买明细弹窗表单绑定数据
      date1: "", //新增请购单时间变量
      title: "", //页面名称
      dialogReqOrder: false, //新增请购单
      dialogExit: false, //编辑请购单
      dialogReady: false, //查看请购单
      dialogTwo: false,
      dialogThree: false,
      form_one: {
        UName: "",
        PassWord: "",
        Description: "",
      },
      groupvalue_one: "",
      rolevalue_one: "",
      groupdata: [],
      roledata: [],
      form_two: {
        UName: "",
        PassWord: "",
        Description: "",
        ResouresType: "",
        UId: "",
        AppId: "",
      },
      groupvalue_two: "",
      rolevalue_two: "",
      form_three: {
        UState: "",
        UName: "",
        PassWord: "",
        ResouresType: "",
        GName: "",
        RName: "",
        Description: "",
      },
      input_one: "",
      selectValue: "-1",
      options: [
        {
          value: "-1",
          label: "全部",
        },
        {
          value: "0",
          label: "待停工",
        },
        {
          value: "1",
          label: "停工中",
        },
        {
          value: "2",
          label: "已恢复",
        },
        {
          value: "3",
          label: "取消",
        }
      ],
     
    };
  },
  components: {
    pageTop,
    equipmentTable
  },
  computed: {
    ...mapGetters([
      "GetListDeviceStopLog", //列表
      "GetSingleDeviceStopLog", //单条数据
      "SaveDeviceStopLog", //新增修改啊
      "UpdateDeviceStopStatus", //状态修改
    ]),
  },
  methods: {
      //组件
      addTable(data){
        // console.log(data)
        this.formone.DeviceNO=data.DeviceNum
      },
    closePropMask(){
      this.sbshow=false
    },
    PopFormInit01(){
      this.sbshow=false
      
    },
   
    //设备弹窗
    open(){
      this.sbshow=true
    },
    //clik
    beforeHandleCommand(index, row,command){
            return {
                'index': index,
                'row': row,
                'command':command
            }
        },
    //状态选择事件
    handleCommand(val){
      this.changeStatus(val.row,val.command.value);
    },
    changeStatus(val,status){
      // console.log(val,status)
      let json_one = {
        MN: "UpdateDeviceStopStatus",
        SN: "Inspectionline",
        DataContent: {
          Id:val.Id,
          Status:status
        },
      };
      this.MIX_send(json_one);
    },
    //取消
    clickNo(){
      this.dialogReqOrder=false
      this.$refs.formone.clearValidate()
      // location.reload()
      this.formone={}
    },
    //默认数据
    MRdata(){
      let date = new Date()
      // this.form.VoucherTime=moment(date).format('YYYY-MM-DD  HH:mm:ss'),
      // this.form.Voucher=JSON.parse(sessionStorage.getItem("UserDetial")).Id
      this.formone.StaffName=JSON.parse(sessionStorage.getItem("UserDetial")).Name
      this.formone.StaffID=JSON.parse(sessionStorage.getItem("UserDetial")).Id
      this.formone.Addtime=moment(date).format('YYYY-MM-DD  HH:mm:ss')
    },
  
    //下拉框状态选择
    isdelchange(val) {
      this.selectValue = val;
      this.getTableData();
    },
    // 页面Size切换
    pageSizeToggle(data) {
      this.pageSize = data;
      this.getTableData();
    },
    // 页面切换
    pageToggle(data) {
      this.page = data;
      this.getTableData();
    },
    // 上一页回调
    pagePrev(data) {
      this.page = data;
      this.getTableData();
    },
    //下一页回调
    pageNext(data) {
      this.page = data;
      this.getTableData();
    },
    //列表数据请求
    getTableData() {
      let json_one = {
        MN: "GetListDeviceStopLog",
        SN: "Inspectionline",
        DataContent: {
          KeyWord: this.input_one,
          PageSize: this.pageSize,
          PageIndex: this.page,
          Status: this.selectValue,
        },
      };
      this.MIX_send(json_one);
    },
    //编辑
    edit(data) {
      this.dialogtype = 2;
      // console.log(data);
      // this.formone = { ...data };
      
       let json_one = {
        MN: "GetSingleDeviceStopLog",
        SN: "Inspectionline",
        DataContent: { Id:data.Id },
      };
      this.MIX_send(json_one);
      this.dialogReqOrder = true;
    },
    //查看
    see(data){
       this.dialogtype = 3;
      this.formone = { ...data };
      this.dialogReqOrder = true;
    },
    sendinput() {
     
    },
    //点击表单确定
    ClickYes(formName) {
      if(!this.formone.DeviceNO){
        this.$message.error('请填写设备编号')
        return
      }
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let adddata={}
      if(this.dialogtype==1){
        adddata={...this.formone,Id:0,LogNO:""}
      }else if(this.dialogtype==2){
        adddata={...this.formone}
      }
      let json_one = {
        MN: "SaveDeviceStopLog",
        SN: "Inspectionline",
        DataContent: { ...adddata },
      };
      this.MIX_send(json_one);

          } else {
           this.$message.error('请填入表单数据')
            return false;
          }
        });
     
    },
    ClickAdd() {
      // this.formone={}
      this.dialogtype = 1;
      this.dialogReqOrder = true;
      this.MRdata()
    },
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.getTableData();
    },
  watch: {
    //单条数据获取
    GetSingleDeviceStopLog(newVal,oldVal){
      this.formone=newVal.ReturnData
    },
    //监听获取表格信息
    GetListDeviceStopLog: function (data) {
      if (data.Code == "0") {
        this.tableData = data.ReturnData.Data;
        this.total = data.ReturnData.DataCount;
      } else {
        this.$message({
          // showClose: true,
          message: data.Message,
        });
      }
    },
    //新增
    SaveDeviceStopLog: function (data) {
      if (data.Code == "0") {
        this.$message.success(data.Message);
        this.dialogReqOrder = false;
        this.formone = {};
        this.getTableData();
      } else {
        this.$message.error(data.Message);
      }
    },
    //停用
    UpdateDeviceStopStatus:function(data){
       if (data.Code == "0") {
        this.$message.success('成功');
        this.getTableData();
      } else {
        this.$message.error('失败');
      }
    }
  },
  created() {
  },
};
</script>

<style lang="less" scoped>
.line {
  margin: 0 10px;
  height: 12px;
  width: 0px;
  border-left: 1px solid #d4def3;
}
/deep/.el-form-item__label {
  font-size: 16px;
  color: rgba(77, 100, 116, 1);
}
/deep/.has-gutter {
  color: rgba(92, 135, 164, 1);
}
/deep/.el-dialog__body .el-input__inner,
/deep/.el-dialog__body .el-textarea__inner {
  font-size: 15px;
}
#user {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 0 1.1875rem;
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
.foottable {
  position: relative;
  width: 100%;
}
.tablecontent {
  width: 100%;
  height: 200px;
}
.titleName {
  font-size: 20px;
  color: rgba(77, 100, 116, 1);
  font-weight: 600;
  display: block;
  margin-bottom: 20px;
  margin-top: -35px;
}
.line {
  width: 100%;
  height: 1px;
  background-color: #e9e9e9;
  margin-bottom: 20px;
}
.linest {
  margin: 0 10px;
  height: 12px;
  width: 0px;
  border-left: 1px solid #d4def3;
}
.addIcon {
  width: 100%;
  height: 74px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 96, 160, 1);
    border-radius: 5px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
  label {
    font-size: 20px;
    color: rgba(77, 100, 116, 1);
    font-weight: 600;
  }
  label::before {
    content: "";
    height: 20px;
    display: inline-block;
    background-color: rgba(0, 96, 160, 1);
    width: 4px;
    margin-right: 5px;
    position: relative;
    top: 3px;
  }
}
</style>
