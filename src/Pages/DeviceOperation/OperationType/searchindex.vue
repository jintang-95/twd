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
      style="margin-top:20px;"
      show-overflow-tooltip
    >
      <el-table-column label="线路编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.LineNO }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线路名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.LineName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检周期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Cycle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检周期单位" align="center">
        <template slot-scope="{row}">
          <span v-if="row.CycleUnit==1">天</span>
          <span v-if="row.CycleUnit==2">周</span>
          <span v-if="row.CycleUnit==3">月</span>
          <span v-if="row.CycleUnit==4">年</span>

        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        sortable="custom"
        align="center"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <div type="success" v-if="row.IsDel=='0'" class="success">
            <img src="../../../assets/images/圆点-绿色.png" alt />已启用
          </div>
          <div type="dangger" v-if="row.IsDel=='1'" class="danger">
            <img src="../../../assets/images/圆点-红色.png" alt />已停用
          </div>
        </template>
      </el-table-column>

      <el-table-column prop label="操作" width="240" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.IsDel == '0'">
            <el-button type="text" size="small" @click="edit(scope.row)">
              <img src="../../../assets/images/edit_icon.png" alt />编辑
            </el-button>
            <span class="linest"></span>
            <el-button type="text" size="small" style="margin-left: 0;" @click="stop(scope.row)">
              <img src="../../../assets/images/stop_icon.png" alt />停用
            </el-button>
            <!-- <span class="linest"></span>
              <el-button type="text" @click="open(scope.row)">
                <img src="../../../assets/images/del_icon.png" alt />删除
            </el-button>-->
          </div>
          <div v-if="scope.row.IsDel == '1'">
            <!-- <el-button type="text" size="small" @click="edit(scope.row)">
              <img src="../../../assets/images/edit_icon.png" alt />编辑
            </el-button>
            <span class="linest"></span> -->
            <el-button type="text" size="small" style="margin-left: 0;" @click="start(scope.row)">
              <img src="../../../assets/images/start_icon.png" alt />启用
            </el-button>
            <!-- <span class="linest"></span>
              <el-button type="text" @click="open(scope.row)">
                <img src="../../../assets/images/del_icon.png" alt />删除
            </el-button>-->
          </div>
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
    <!-- 新增巡检线路 -->
    <el-dialog center :visible.sync="dialogReqOrder" width="900px" :before-close='cancelSubmit'>
      <div v-if="this.dialogtype==1">
         <div class="titleName">新增线路</div>
      </div>
      <div v-if="this.dialogtype==2">
         <div class="titleName">编辑线路</div>
      </div>
      <div class="line"></div>
      <el-form label-width="auto" label-position="left" :model="formone" :rules="rules" ref="formone">
       
        <el-row :span='20'>
          <el-col :span="12">
            <el-form-item label="线路编号:" prop="LineNO">
              <el-input placeholder="请输入内容" v-model="formone.LineNO" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12 ">
            <el-form-item label="线路名称:" prop="LineName">
              <el-input placeholder="请输入内容" v-model="formone.LineName" style="width:200px"></el-input>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row :span='20'>
           <el-col :span="12">
            <el-form-item label="巡检周期:" prop="Cycle">
              <el-input-number placeholder="请输入内容" v-model="formone.Cycle" :controls="false" style="width:200px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检周期单位:" prop="CycleUnit">
              <el-select v-model="formone.CycleUnit" placeholder="请选择巡检周期单位" style="width:200px">
                <el-option
                  v-for="item in CycleUnit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="线路描述" prop="Desc">
          <el-input v-model="formone.Desc" type="textarea" placeholder="请输入线路描述"></el-input>
        </el-form-item>
      </el-form>
      <div class="addIcon">
          <label>线路设备明细</label>
          <span @click="AddAddShopMX">+</span>
        </div>
      <div class="foottable">
            <div class="tablecontent">
              <el-table
                :data="Formtable"
                :header-cell-style="{background:'rgba(240, 247, 251, 1)'}"
                show-overflow-tooltip
                style="width:100%"
                max-height="200px"
              >
                <el-table-column
                  v-for="(item,index) in Formtabletitle"
                  :key="index"
                  :prop="item.tableprop"
                  :label="item.name"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                 <el-table-column label="描述" width="150" align="center">
                  <template slot-scope="{row}">
                    <el-input v-model="row.Remark"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                  <template slot-scope="{row}">
                    <!-- <el-button @click="Clickredact(row)" type="text" size="small">编辑</el-button> -->
                    <el-button @click="RemoveMateriels(row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
      </div>
      <div style="text-align:right;margin-top:10px;">
        <el-button type="primary" @click="ClickYes('formone')">确定</el-button>
        <el-button type="info" @click="cancelSubmit">取消</el-button>
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
      @addCheck="addCheck"
     :check="sbcheck"
     :visible.sync="sbshow"
     :title='sbtitle'
    ></equipmentTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pageTop from "@/components/pageTop.vue";
import equipmentTable from "@/components/equipmentTable";
// import rightContainer '@/components/rightContainer.vue'
export default {
  name: "searchindex",
  data() {
    return {
      newFormtable:[],
      suredel:1, //删除标识符
      sbcheck:1,
      sbtitle:'设备明细',
      sbshow:false,
      devicedata:[],
      total: 0,
      currentPage: 1,
      loading: false,
      deviceTC:false,
      pageSize: 10,
      page: 1,
      dialogtype: 1,
      rules: {
        LineNO: [
          { required: true, message: "请输入线路编号", trigger: "blur" },
        ],
        LineName: [
          { required: true, message: "请输入线路名称", trigger: "blur" },
        ],
        Cycle: [
          { required: true, message: "请输入巡检周期", trigger: "blur" },
          { type: "number", message: "周期必须为数字值" },
        ],
        Desc: [{ required: true, message: "请输入线路描述", trigger: "blur" }],
        CycleUnit:[{required: true, message: "请选择巡检周期单位", trigger: "change"}]
      },
      rulestwo:{
         LineId: [
          { required: true, message: "请输入线路ID", trigger: "blur" },
        ],
         DeviceId: [
          { required: true, message: "请输入设备ID", trigger: "blur" },
        ],
         Remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
        ],
      },
     CycleUnit:[
       {label:'天',value:1},
       {label:'周',value:2},
       {label:'月',value:3},
       {label:'年',value:4}
     ],
      tableData: [
        //表格数据
      ],
      formone: {
        //新增请购单from表单死数据
      },
    
      Formtabletitle: [
        //新增请购单弹出框表格表头死数据
        // { name: "线路明细ID", tableprop: "ID" },
        // { name: "线路ID", tableprop: "LineId" },
        { name: "设备ID", tableprop: "DeviceId" },
        { name: "设备名", tableprop: "DeviceName" },
        { name: "规格", tableprop: "Spec" },
        { name: "型号", tableprop: "Model" },
        { name: "品牌", tableprop: "BrandName" },
        { name: "供应商", tableprop: "SupplierName" },

        // { name: "排序号", tableprop: "OrderID" },
        // { name: "备注", tableprop: "Remark" },
      ],
      tabelTitle:[
        //新增ID弹出框表格表头死数据
        { name: "ID", tableprop: "Id" },
        { name: "品牌", tableprop: "BrandName" },
        { name: "供应商", tableprop: "SupplierName" },
        { name: "规格", tableprop: "DeviceName" },
        // { name: "单位", tableprop: "ValidityTimeUnit" },
      ],
      Formtable: [], //购买明细表数据源
      dialogAddMX: false, //新增购买明细弹窗
      formtwo: {
        DeviceId:null,
        OrderID:null,
        Remark:'',
        
      }, //新增购买明细弹窗表单绑定数据
      date1: "", //新增请购单时间变量
      title: "", //页面名称
      dialogReqOrder: false, //新增请购单
      dialogExit: false, //编辑请购单
      dialogReady: false, //查看请购单
      dialogTwo: false,
      dialogThree: false,
      groupdata: [],
      roledata: [],
      input_one: "",
      selectValue: "-1",
      options: [
        {
          value: "-1",
          label: "全部",
        },
        {
          value: "1",
          label: "停用",
        },
        {
          value: "0",
          label: "启用",
        },
      ],
    };
  },
  components: {
    pageTop,
    equipmentTable
  },
  computed: {
    ...mapGetters([
      "InspectionlineGetList", //巡检列表
      "GetSingleInspectionline", //单条数据
      "SaveInspectionline", //新增修改啊
      "DelInspectionline", //停用启用
    ]),
  },
  methods: {
    //取消和x
    cancelSubmit(){
      this.dialogReqOrder=false
      this.$refs.formone.clearValidate()
      this.formone={}
      this.Formtable=[]
    },
   
    //组件
    closePropMask(){
      this.sbshow=false
    },
    PopFormInit01(){
      this.sbshow=false
      
    },
    addCheck(datas){
      let arr=[]
      let LineId=this.formone.LineNO
      // if(this.dialogtype == 1){
         for (var i=0;i<datas.length;i++){
          arr.push({DeviceId:"",BrandName:"",SupplierName:"",OrderID:0,Id:0,LineId:LineId,Remark:"",OperateType:0})
         }
      for (var j=0;j<datas.length;j++){
           arr[j].DeviceId=datas[j].Id*1
          arr[j].BrandName=datas[j].BrandName
          arr[j].SupplierName=datas[j].SupplierName
          // arr[j].Id=arr[j].Id*1
          arr[j].DeviceName=datas[j].DeviceName
          arr[j].Model=datas[j].Model
          arr[j].Spec=datas[j].Spec
          // arr[j].LineId=arr[j].LineId-0
      }
      console.log(arr)
      this.Formtable.push(...arr)
      arr=[]
    },
    //编辑弹窗新增
    Clickredact(row){
      this.formtwo=row
      this.dialogAddMX=true
    },
    //删除列表数据
    RemoveMateriels(val) {
      this.suredel=2
      if(this.dialogtype==1){
      for (let index = 0; index < this.Formtable.length; index++) {
        const element = this.Formtable[index];
        if (element.ID == val.ID) {
          this.Formtable.splice(index, 1);
        }
      }
      }else if(this.dialogtype==2){
        this.newFormtable.push(val)
        this.newFormtable.forEach(item=>{
          item.OperateType=2
        })
        console.log(val,val.ID ,this.newFormtable,this.Formtable)
        for (let i = 0; i < this.Formtable.length; i++) {
        const element = this.Formtable[i];
        if (element.ID == val.ID) {
          this.Formtable.splice(i, 1);
        }
      }
      }
      
    },
    
    //停用
    stop(data) {
      let json_one = {
        MN: "DelInspectionline",
        SN: "Inspectionline",
        DataContent: {
          Id:data.Id,
          IsDel:1
        },
      };
      this.MIX_send(json_one);
    },
    //启用
    start(data) {
      let json_one = {
        MN: "DelInspectionline",
        SN: "Inspectionline",
        DataContent: {
          Id:data.Id,
          IsDel:0
        },
      };
      this.MIX_send(json_one);
    },
    //下拉框状态选择
    isdelchange(val) {
      this.selectValue = val;
      this.getTableData();
    },
    // 页面Size切换
    pageSizeToggle(data) {
      console.log(data);
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
        MN: "InspectionlineGetList",
        SN: "Inspectionline",
        DataContent: {
          LineNO: "",
          LineName: this.input_one,
          PageSize: this.pageSize,
          PageIndex: this.page,
          IsDel: this.selectValue,
        },
      };
      this.MIX_send(json_one);
    },
  
    //编辑
    edit(data) {
      this.dialogtype = 2;
      let json_one = {
        MN: "GetSingleInspectionline",
        SN: "Inspectionline",
        DataContent: { Id:data.Id },
      };
      this.MIX_send(json_one);
      
    },
   

    //打开请购单审批弹出窗
    openApproval() {
      this.$refs.ApprovalReqShop.dialogFormVisible = true;
    },
    //点击新增购买明细
    AddAddShopMX() {
      this.sbshow = true;
    },
    //新增购买明细却确认
    btnAddShopMXOK() {
      this.formtwo={...this.formtwo,OrderID:0,}
      this.Formtable.push(this.formtwo)
      this.formtwo={}
      this.dialogAddMX = false;
    },
    //新增购买明细却取消
    CancleAddShopMX() {
      this.dialogAddMX = false;
      this.formtwo={}
    },
    //点击表单确定

    ClickYes(formName) {
      this.suredel=1
       this.$refs[formName].validate((valid) => {
          if (valid) {
        let adddata={}
        if(this.dialogtype==1){
        adddata={...this.formone,Id:0,IDEList:this.Formtable}
        }else if(this.dialogtype==2){
          this.Formtable=[...this.Formtable,...this.newFormtable]
          adddata={...this.formone,IDEList:this.Formtable}
        }
      console.log(adddata)
      let json_one = {
        MN: "SaveInspectionline",
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

    
    //点击表单取消
    Canceltwo() {
      // this.dialog = false;
      // this.LookType = false;
    },
    //物料名称远程搜索
    remoteMethod(r) {
      if (r !== "") {
        this.loading = true;
        //添加数据请求
      } else {
        this.options = [];
      }
    },
    ClickAdd() {
      this.dialogtype = 1;
      this.formone={}
      this.Formtable=[]
      this.dialogReqOrder = true;
    },
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.getTableData();
    },
  watch: {
    //编辑数据获取（单条数据）
    GetSingleInspectionline:function(data){
      if (data.Code == "0") {
        console.log(data)
        this.formone = data.ReturnData;
        this.Formtable=data.ReturnData.IDEList
        this.formone.CycleUnit=this.formone.CycleUnit*1
        this.dialogReqOrder = true;
      } else {
        this.$message({
          message: data.Message,
        });
      }
    },
   
    //监听获取表格信息
    InspectionlineGetList: function (data) {
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
    SaveInspectionline: function (data) {
      if (data.Code == "0") {
        this.$message.success(data.Message);
        this.dialogReqOrder = false;
        this.formone = {};
        this.Formtable=[]
        this.getTableData();
      } else {
        this.$message.error(data.Message);
      }
    },
    //停用
    DelInspectionline:function(data){
       if (data.Code == "0") {
        this.$message.success('成功');
        this.getTableData();
      } else {
        this.$message.error('失败');
      }
    }
  },
 
  created() {},
};
</script>

<style lang="less" scoped>
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
