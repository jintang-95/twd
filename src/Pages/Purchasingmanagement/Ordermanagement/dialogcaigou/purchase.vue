<template>
  <el-dialog
    custom-class="classdialog"
    @close="cancelSubmit"
    :title="type == 1 ? '新增采购单' : '新增采购单'"
    :visible.sync="show"
    width="75%"
  >
    <div>
      <el-form
        ref="formes"
        :model="formes"
        label-width="100px"
        class="formContainer"
        label-position="left"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item label="采购日期" prop="PurchaseDate" >
                <el-date-picker
                
                  v-model="formes.PurchaseDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="源单类型" label-width="100px" prop="ResoureType">
              <el-select v-model="formes.ResoureType" placeholder="请选择源单类型" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="供应商" label-position="left" label-width="100px" prop="Supplier" >
              <chooseSupplier  style="width: 190px;    margin-top: -10px;" :isMultipleChoice="false" @getToFather="getSupplier" ></chooseSupplier>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row :gutter="20">
          
          <el-col :span="8">
            <el-form-item label="采购员" label-position="left" label-width="100px">
              <el-input v-model="formes.Name" :placeholder="SessionUser.Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应付金额" label-position="left" label-width="100px" prop="AmountPayable">
              <el-input v-model="formes.AmountPayable" placeholder="请输入应付金额" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实付金额" label-width="100px" prop="AmountActually">
              <el-input v-model="formes.AmountActually" placeholder="请输入实付金额" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24">
            <el-form-item label="采购备注" prop="Remark">
              <el-input type="textarea" v-model="formes.Remark" placeholder="请输入采购备注" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tabs">
        <button
          
          style="float: right;z-index: 100;position: absolute;right: 20px;width:24px;height:24px; color:#fff;border:none;font-size:13px; outline: none;background:rgba(0,96,160,1);border-radius:2px;"
          @click="addNew"
        >+</button>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="采购单明细" name="replace">
            <div class="replaceList">
              <el-table :data="formes.BuyInfoList" fit :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}" style="width: 100%" class="goumai">
                <el-table-column align="center" prop="MName" label="物料名称" ></el-table-column>
                <el-table-column align="center" prop="MNo" label="物料编号"></el-table-column>
                <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
                <el-table-column align="center" prop="MModel" label="型号" ></el-table-column>
                <el-table-column align="center" prop="Number" label="数量" width="220" >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.Number"
                      @input="numberChange(scope.row)"
                      placeholder="请输入数量"
                      
                    />
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" >
                  <template slot-scope="scope">
                    <el-button
                      
                      type="text"
                      size="small"
                      class="operationTtn"
                      @click="delMateriels(scope.row)"
                    >
                        <span>删除</span>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <span slot="footer" style="  margin-left: 25.6rem;" class="dialog-footer">
      <button
        @click="cancelSubmit"
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
      >取 消</button>
      <button
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
        @click="submitData"
      >提 交</button>
    </span>
    <!-- <myTable :visible="showReplace"></myTable> -->
        <replace-prop
      :selectOptionList="selectOptionList"
      :visible="showReplace"
      :typeNum="1"
      :check="2"
      :title="'新增采购单'"
      :typeList="typeList"
      :showType="false"
      @closePropMask="closePropMask"
      @PopFormInit01="PopFormInit01"
      @addMaterielTable="addTable"
      @addCheck="addCheck"
    ></replace-prop>
    <unit-transfor
      :visible="showUnit"
      :addData="maskData"
      :type="formType"
      @closePropMask="closePropMask"
      @dataSubmit="dataUnitSubmit"
    ></unit-transfor>
    <operation-standard
      :visible="showStandard"
      :addData="maskData"
      :type="formType"
      @closePropMask="closePropMask"
      @dataSubmit="dataStandardSubmit"
    ></operation-standard>
    <extend-attr
      :visible="showExtend"
      :addData="maskData"
      :type="formType"
      @closePropMask="closePropMask"
      @dataSubmit="dataExtendSubmit"
    ></extend-attr>
    <materiel-bom
      :visible="showMaterielList"
      :addData="maskData"
      :type="formType"
      @closePropMask="closePropMask"
      @dataSubmit="dataMaterielSubmit"
    ></materiel-bom>
  </el-dialog>
</template>

<script>
var that;
var process = {
  template: `<div>
            <el-button type="text" size="small" @click="edit()">编辑</el-button>
            <el-button type="text" size="small" @click="del()">删除</el-button>
  
  </div>`,
  props: ["row", "keyindex"],
  methods: {
    edit() {
      that.clickEdit(this.row, this.keyindex);
    },
    del() {
      that.clickDel(this.row, this.keyindex);
    },
  },
};
import chooseSupplier from "@/components/chooseSupplier.vue"
// import replaceProp from "./replaceProp.vue";
import replaceProp from "@/components/replaceTable.vue";
import unitTransfor from "./unitTransfor.vue";
import operationStandard from "./operationStandard.vue";
import extendAttr from "./extendAttr.vue";
import materielBom from "./materielBom.vue";
import { mapGetters } from "vuex";
import myTable from "@/components/table";
import moment from 'moment'
export default {
  name: "purchase",
  data() {
    return {
      rules :{
        AmountPayable:[{ required: true, message: '请输入应付金额', trigger: 'blur' },],
        AmountActually:[{ required: true, message: '请输入实付金额', trigger: 'blur' },],
      },
      supplierId:[],
      PageSize:100,
          PageIndex:1,
          IsDel:-1,
          KeyWord:'',
          ApplyType:'',
      options: [{
          value: 0,
          label: '请购单'
        }, ],
        value: '',
      BillCode:'CGDH',//获取请购编码
      SessionUser:[],//sessionuser
      CGNoCoding:'',
      //时间选择器
      value1: '',
      // 默认供应商
      supplierList: [],
      // 远程物料
      optionList: [],
      // 文件上传
      currentFile: null,
      // 弹框内表格编辑弹框
      materielTable: [],
      suppilMaterielTable: [],
      keyWord: "",
      PleaseBuyId:'',
      showReplace: false,
      showMaterielList: false,
      showExtend: false,
      showStandard: false,
      showUnit: false,
      replaceType: "1",
      unitType: "1",
      extendType: "1",
      standardType: "1",
      formType: "1",
      currentIndex: "",
      maskData: {},
      //
      show: false,
      activeName: "replace",
      loading: false,
      dialogVisible: false, // 图片展示
      dialogImageUrl: "",
      selectOptionList: [
        {
          title: "全部",
          statu: "",
        },
        {
          title: "已启用",
          statu: 2,
        },
        {
          title: "已停用",
          statu: 3,
        },
      ],
      timeList: [
        {
          Name: "年",
          Id: "1",
        },
        {
          Name: "月",
          Id: "2",
        },
        {
          Name: "日",
          Id: "3",
        },
      ],
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath:false,
      },
      CgCoding:'',
      formes:{
        Id:0,
        No:'',
        PurchaseDate:'',
        ResoureType:'',
        ResoureNumber:'',
        Supplier:'',
        ContactPerson:'',
        Buyer:'',
        AmountPayable:'',
        AmountActually:'',
        Currency:0,
        Remark:'',
        DelTime:'',
        DelUser:'',
        IsDel:0,
        BuyInfoList:[],
        PEList:[],
        
      },
      replace_tableLabel: [
        { label: "优先级", param: "Level", align: "center", sortable: false },
        {
          label: "物料编码",
          param: "MaterielNo",
          align: "center",
          sortable: false,
        },
        {
          label: "物料名称",
          param: "MaterielName",
          align: "center",
          sortable: false,
        },
        { label: "备注", param: "Remark", align: "center", sortable: false },
        { label: "操作", align: "center", width: "300", component: process },
      ],
      unit_tableLabel: [
        { label: "序号", type: "index", align: "center", sortable: false },
        { label: "单位名称", param: "Name", align: "center", sortable: false },
        {
          label: "换算数量",
          param: "Number",
          align: "center",
          sortable: false,
        },
        {
          label: "是否标准单位",
          param: "IsBase",
          align: "center",
          sortable: false,
          render: (row) => {
            if (row.IsBase == "1") {
              return "是";
            } else {
              return "否";
            }
          },
        },
        { label: "备注", param: "Remark", align: "center", sortable: false },
        { label: "操作", align: "center", width: "300", component: process },
      ],
      materiel_tableLabel: [
        {
          label: "物料编码",
          param: "MaterielNo",
          align: "center",
          sortable: false,
        },
        {
          label: "物料名称",
          param: "MaterielName",
          align: "center",
          sortable: false,
        },
        { label: "数量", param: "Number", align: "center", sortable: false },
        { label: "单位", param: "UnitName", align: "center", sortable: false },
        {
          label: "是否必须",
          param: "Required",
          align: "center",
          sortable: false,
          render: (row) => {
            if (row.Required == "1") {
              return "是";
            } else {
              return "否";
            }
          },
        },
        { label: "操作", align: "center", width: "300", component: process },
      ],
      standard_tableLabel: [
        { label: "序号", type: "index", align: "center", sortable: false },
        { label: "周期", param: "Period", align: "center", sortable: false },
        {
          label: "单位",
          param: "Unit",
          align: "center",
          sortable: false,
          render: (row) => {
            if (row.Unit == 1) {
              return "年";
            } else if (row.Unit == 2) {
              return "月";
            } else {
              return "日";
            }
          },
        },
        { label: "动作", param: "Action", align: "center", sortable: false },
        { label: "标准", param: "Standard", align: "center", sortable: false },
        { label: "操作", align: "center", width: "300", component: process },
      ],
      extend_tableLabel: [
        { label: "属性名", param: "Name", align: "center", sortable: false },
        { label: "属性值", param: "Value", align: "center", sortable: false },
        { label: "备注", param: "Remark", align: "center", sortable: false },
        { label: "操作", align: "center", width: "300", component: process },
      ],
    };
  },
  props: {
    seeTableData:{
        type:Array,
        default() {
            return [];
        }
    },
    QGNobainhao:{
        type:String,
        default() {
            return [];
        }
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "1",
    },
    typeList: {
      type: Array,
      default() {
        return [];
      },
    },
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    wareHouse: {
      type: Array,
      default() {
        return [];
      },
    },
    editTable: {
      type: Array,
      default() {
        return [];
      },
    },
    brands: {
      type: Array,
      default() {
        return [];
      },
    },
    manageStyle: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters(["ULFB", "ULFE", "imgUrl", "QuerySupplier", "GetMateriels","GetListPurchaseDetail"]),
  },
  watch: {
      //获取单条数据
    seeTableData(newVal,oldVal){
      console.log(newVal)
      this.formes.BuyInfoList=JSON.parse(JSON.stringify(newVal))
      this.formes.PEList = this.formes.BuyInfoList
      console.log(this.formes.BuyInfoList,"222222222")
      console.log(this.formes.PEList,"3333")
    },
    //获取请购单页面单挑编码
    QGNobainhao(newVal,oldVal){
      
      this.formes.ResoureNumber = newVal
      console.log(this.formes.ResoureNumber,"0099")
    },
    editTable(newVal,oldVal){
      console.log(newVal)
      this.formes.PEList=JSON.parse(JSON.stringify(newVal))
    },
    GetMateriels(newValue, oldValue) {
      this.materielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
    },
    ///////
    GetListPurchaseDetail(newValue, oldValue) {
      this.suppilMaterielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
      
    },
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.formes = newVal;
    },
    ULFB(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.$message({
          showClose: true,
          type: "info",
          message: "开始上传",
        });
        this.upload();
      } else {
        this.$message({
          showClose: true,
          type: "fail",
          message: "上传失败",
        });
      }
    },
    ULFE(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.$message({
          showClose: true,
          type: "success",
          message: "上传成功",
        });
        this.formes.MaterielImageDetail.push({
          Address: newVal.ReturnData.FilePath,
          url: this.imgUrl + newVal.ReturnData.FilePath,
        });
        console.log(this.formes.MaterielImageDetail);
      } else {
        this.$message({
          showClose: true,
          type: "fail",
          message: "上传失败",
        });
      }
    },
    QuerySupplier(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.supplierList = newVal.ReturnData.Data;
        console.log(this.supplierList);
      }
    },
    //采购单编码
    "$store.state.Purchasingmanagement.CreateBillNOByBillTypeCode": function (data) {
      this.CGNoCoding = data.ReturnData.BillNo
      this.CgCoding = data.ReturnData.BillNo
      console.log(this.CGNoCoding,"////")
      // this.submitData()
    },
  },
  created() {
    that = this;
    this.getTableData();
    this.getSessionUser()
    this.getCoding()
    this.getSuppTableData()
    this.getNowTime()
  },
  methods: {
    //当前时间
      getNowTime() {
        let data = new Date()
        let year = data.getFullYear()
        let month = data.getMonth()+1
        let day = data.getDate()
       this.formes.PurchaseDate = year+"-"+month+"-"+day
       console.log(this.formes.PurchaseDate,"ppp-----")
   },

    //获取供应商ID
    getSupplier(val) {
      this.formes.Supplier = val.Id;
    },
    
    //获取本地用户信息
    getSessionUser(){
      this.SessionUser = JSON.parse(sessionStorage.getItem("UserDetial"));

    },
    //获取请购单编码
    getCoding(){
      let json = {
        MN: "CreateBillNOByBillTypeCode",
        SN: "SystemSetting",
        DataContent: {
          BillCode:this.BillCode
        },
      };
      this.MIX_send(json);
    },



    GetTableId(val) {
      console.log(val[val.length - 1]);
      this.formes.CategoryId = val[val.length - 1];
    },
    //获取筛选表格
    getTableData() {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: 0,
          Status: 2,
          KeyWord: this.keyWord,
          PageSize: 9999,
          PageIndex: 1,
          SType: 1,
        },
      };
      this.MIX_send(json);
    },
    //获取筛选表格
    getSuppTableData() {
      let json = {
        MN: "GetListPurchaseDetail",
        SN: "Purchase",
        DataContent: {
          PleaseBuyId:this.PleaseBuyId,
          KeyWord: this.keyWord,
          PageSize: 9999,
          PageIndex: 1,
        },
      };
      this.MIX_send(json);
    },
    selectChange(Id) {
      console.log(Id);
      let Name = "";
      this.supplierList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.formes.DefaultSupplierName = Name;
      this.formes.DefaultSupplierId = Id;
    },

    remoteMethod(keyword) {
      let json = {
        MN: "QuerySupplier",
        SN: "Purchase",
        DataContent: {
          KeyWord: keyword,
          IsStop: "",
          SupplierGroupId: "",
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    //   作业标准
    dataStandardSubmit(data) {
      if (this.currentIndex === "") {
        this.formes.OperationStandardDetail.push(data);
      } else {
        this.formes.OperationStandardDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showStandard = false;
    },
    //   物料清单
    dataMaterielSubmit(data) {
      console.log(data);
      if (this.currentIndex === "") {
        this.formes.MaterielBOMDetail.push(data);
      } else {
        this.formes.MaterielBOMDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showMaterielList = false;
    },
    //   扩展属性
    dataExtendSubmit(data) {
      if (this.currentIndex === "") {
        this.formes.ExPropertyDetail.push(data);
      } else {
        this.formes.ExPropertyDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showExtend = false;
    },
    //   单位换算
    dataUnitSubmit(data) {
      if (data.IsBase == "1") {
        for (let i = 0; i < this.formes.UnitConvertDetail.length; i++) {
          this.formes.UnitConvertDetail[i].IsBase = "0";
        }
      }
      if (this.currentIndex === "") {
        this.formes.UnitConvertDetail.push(data);
      } else {
        this.formes.UnitConvertDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showUnit = false;
    },
    //   替代件
    closePropMask(data) {
      this.showReplace = false;
      this.showUnit = false;
      this.showStandard = false;
      this.showMaterielList = false;
      this.showExtend = false;
    },
    dataSubmit(data) {
      if (this.currentIndex === "") {
        this.formes.PEList.push(data);
      } else {
        this.formes.PEList[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showReplace = false;
    },
    AddMateriels() {
      this.PopFormInit01();
    },
    addTable(row) {
      let rows = JSON.parse(JSON.stringify(row));
      rows.MaterielId = rows.Id
      rows.MName = rows.Name;
	    rows.MNo = rows.No;
	    rows.MModel = rows.Model;
	    rows.MUnitId = rows.UnitId;
      this.formes.PEList.push(rows)
    },
    addCheck(val){
      this.formes.PEList=val;
      console.log(this.formes.PEList)
    },
    searchFun(val) {
      console.log(val);
      this.keyWord = val;
      this.getTableData();
      // this.getTableData();
      this.getSuppTableData()
    },
    //   新增替代件等等
    addNew() {
      this.formType = "1";
      this.addContent();
    },
    addContent() {
      switch (this.activeName) {
        case "replace":
          if (this.formType == "1") {
            this.maskData = {
              Level: "",
              MaterielName: "",
              MaterielNo: "",
              Remark: "",
            };
          }
          this.showReplace = true;
          break;
        case "unit":
          if (this.formType == "1") {
            this.maskData = {
              Name: "",
              Number: "",
              IsBase: false,
              Remark: "",
            };
          } else {
            this.maskData.IsBase = this.maskData.IsBase == "1";
          }
          this.showUnit = true;
          break;
        case "materielList":
          if (this.formType == "1") {
            this.maskData = {
              MaterielName: "",
              MaterielNo: "",
              Number: "",
              Name: "",
              Required: false,
            };
          } else {
            this.maskData.Required = this.maskData.Required == "1";
          }
          this.showMaterielList = true;
          break;
        case "standard":
          if (this.formType == "1") {
            this.maskData = {
              Period: "",
              Unit: "",
              Action: "",
              Standard: "",
            };
          }
          this.showStandard = true;
          break;
        case "extend":
          if (this.formType == "1") {
            this.maskData = {
              Name: "",
              Value: "",
              Remark: "",
            };
          }
          this.showExtend = true;
          break;
        default:
          break;
      }
    },
    //数量改变
    numberChange(row) {
      console.log(row);
      row.Amount = Number(row.Number) * Number(row.Price);
      console.log(this.formes.PEList[0].Number,"yyyy")
      for(let i in this.formes.PEList){
          if(this.formes.PEList[i].PDetailId == row.Id){
          this.formes.PEList[i].Number = row.Number
        }
        }

    },
    //价格改变
    priceChange(row) {
      console.log(row);
      row.Amount = Number(row.Number) * Number(row.Price);
      for(let i in this.formes.PEList){
	  		  if(this.formes.PEList[i].Id == row.Id){
	  			  this.formes.PEList[i].Price = row.Price;
	  		  }
	    }
      console.log(this.formes.PEList,"pppp")
    },
    // 物料删除
    delMateriels(val) {
      for (
        let index = 0;
        index < this.formes.PEList.length;
        index++
      ) {
        const element = this.formes.PEList[index];
        if (element.MaterielId == val.MaterielId) {
          element.OperateType = 2
          console.log(element.OperateType,"kkkk")
        }
      }
    },
    PopFormInit01() {
      this.showReplace = false;
    },
    //   点击表格编辑
    clickEdit(data, index) {
      this.currentIndex = index;
      this.formType = "2";
      this.maskData = data;
      console.log(this.maskData);
      this.addContent();
    },
    // 点击表格删除
    clickDel(data, index) {
      this.currentIndex = index;
      switch (this.activeName) {
        case "replace":
          this.formes.PEList.splice(this.currentIndex, 2);
          console.log(this.formes.PEList);
          break;
        case "unit":
          this.formes.UnitConvertDetail.splice(this.currentIndex, 1);
          break;
        case "materielList":
          this.formes.MaterielBOMDetail.splice(this.currentIndex, 1);
          break;
        case "standard":
          this.formes.OperationStandardDetail.splice(this.currentIndex, 1);
          break;
        case "extend":
          this.formes.ExPropertyDetail.splice(this.currentIndex, 1);
          break;
        default:
          break;
      }
    },
    handleClick(data) {},
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.activeName = "replace";
      // this.formes
    },
    //确定提交
    submitData() {  
      this.formes.Id = 0
      this.formes.IsDel = 0
      this.formes.Currency = 0
      this.getSessionUser()//获取本地用户信息
      this.getCoding()//获取请购单编码
      this.getSuppTableData()//获取表格采购单明细
      this.formes.Buyer = this.SessionUser.Id
      this.formes.Name = this.SessionUser.Name
      this.formes.BuyInfoList = this.formes.PEList
      this.formes.No = this.CGNoCoding;
      if(this.formes.No.substring(0,2) == "CG"){
        
        this.$emit("addPQ",this.formes);
      }else{
        // this.formes.No++
      }
      console.log(this.formes,"nnn")
    },
    handleRemove(file) {
      //删除
      console.log(file);
      this.formes.MaterielImageDetail = this.formes.MaterielImageDetail.filter(
        (item) => item.url != file.url
      );
      console.log(this.formes.MaterielImageDetail);
    },
    handlePictureCardPreview(file) {
      //图片预览
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    handleChange(file) {
      const isJPG = file.raw.type.indexOf("image") !== -1;
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error("只能上传图片");
        return;
      }
      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
        return;
      }
      this.currentFile = file.raw;
      let json = {
        MN: "ULFB",
        DataContent: { FileName: file.name, FileLength: file.size },
      };
      this.MIX_send(json);
    },
    upload() {
      this.MIX_send(this.currentFile, true);
    },
    handleButton() {},
    rowClick() {},
    cellClick() {},
    handleSortChange() {},
    handleSelectionChange() {},
  },
  components: {
    replaceProp,
    unitTransfor,
    operationStandard,
    extendAttr,
    materielBom,
    myTable,
    chooseSupplier,
  },
};
</script>
<style scoped lang="less">
.formContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-row {
  width: 100% !important;
}
.replaceList {
  width: 100%;
  height: 166px;
}
.imgList {
  width: 100%;
  height: 166px;
}
.Unit {
  width: 100px !important;
  margin-left: 10px !important;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474;
}
/deep/ .el-dialog__title {
  color: #4d6474;
}
/deep/ .el-form-item__label {
  color: #4d6474;
}

/deep/ .el-checkbox__label {
  color: #4d6474 !important;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4d6474 !important;
}
</style>
<style lang="less" >
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474;
}
/deep/ .el-dialog__title {
  color: #4d6474;
}
/deep/ .el-form-item__label {
  color: #4d6474;
}
/deep/ .el-checkbox__label {
  color: #4d6474 !important;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4d6474 !important;
}
.FormItem .el-form-item__content {
  display: flex !important;
}
.el-input__inner {
  padding-left: 10px;
}
button:hover {
  cursor: pointer;
}
/deep/ .classdialog {
  border-radius: 4px !important;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  color: #4d6474 !important;
}
/deep/ .el-tabs__item {
  color: #4d6474 !important;
}
.goumai{
  overflow: auto!important;
  height: 170px;
}
</style>