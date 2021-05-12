<template>
  <el-dialog
    custom-class="classdialog"
    @close="cancelSubmit"
    :title="type == 1 ? '新增物料档案' : '编辑物料档案'"
    :visible.sync="show"
    width="75%"
  >
    <div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="formContainer"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="物料编码" prop="No" label-position="left">
              <el-input v-model="form.No" placeholder="请输入物料编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="Name" label-width="100px" label-position="left">
              <el-input v-model="form.Name" placeholder="请输入物料名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料分类" prop="CategoryId" label-width="100px">
              <el-cascader
                placeholder="请选择所属分类"
                v-model="form.CategoryId"
                :options="typeList"
                :props="optionProps"
                filterable
                clearable
                style="width:100%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="标准单位"
              prop="StandardUnitId"
              label-width="100px"
              label-position="left"
            >
              <el-input v-model="form.StandardUnitId" placeholder="请输入标准单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="默认仓库" prop="DefaultWarehouseId" label-width="100px">
              <!-- <el-select v-model="form.DefaultWarehouseId" placeholder="请选择默认仓库">
                <el-option
                  v-for="(item, index) in wareHouse"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>-->
              <el-cascader
                placeholder="请选择默认仓库"
                v-model="form.DefaultWarehouseId"
                :options="wareHouse"
                :props=" {
        value: 'Id',
        label: 'Name',
        children: 'ChildNodes',
        checkStrictly: true,
        expandTrigger: 'hover',
        emitPath:false,
      }"
                filterable
                clearable
                style="width:100%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="DefaultSupplierName" label="默认供应商" label-width="100px">
              <chooseSupplier
                :isMultipleChoice="false"
                :SupplierId="SupplierId"
                @getToFather="getToFather"
                style="width=300px;margin-top:-.5rem;"
              ></chooseSupplier>
              <!-- <el-select
                disabled
                v-model="form.DefaultSupplierName"
                @change="selectChange"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteMethod"
                placeholder="请选择默认供应商"
              >
                <el-option
                  v-for="(item, index) in supplierList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="Spec" label="规格" label-position="left" label-width="100px">
              <el-input v-model="form.Spec" placeholder="请输入规格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="Model" label="型号" label-position="left" label-width="100px">
              <el-input v-model="form.Model" placeholder="请输入型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              prop="ValidityTime"
              label="有效期"
              label-position="left"
              label-width="100px"
              class="FormItem"
            >
              <el-input v-model="form.ValidityTime" type="number" placeholder="请输有效期"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              prop="ValidityTimeUnit"
              label="有效期单位"
              label-position="left"
              label-width="100px"
              class="FormItem"
            >
              <el-select v-model="form.ValidityTimeUnit" placeholder="单位" class="Unit">
                <el-option
                  v-for="(item, index) in timeList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{ item.Name }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="BrandId" label="品牌" label-width="100px">
              <el-select v-model="form.BrandId" placeholder="请选择品牌">
                <el-option
                  v-for="(item, index) in brands"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input type="textarea" v-model="form.Desc" placeholder="请输入分类描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tabs">
        <button
          style="float: right;z-index: 100;position: absolute;right: 20px;width:24px;
height:24px; color:#fff;border:none;font-size:13px; outline: none;
background:rgba(0,96,160,1);
border-radius:2px;"
          @click="addNew"
        >+</button>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="替代件" name="replace">
            <div class="replaceList">
              <el-table
                :data="form.ReplaceMaterielDetail"
                fit
                :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
                style="width: 100%;height:200px;overflow:scroll;"
              >
                <el-table-column align="center" prop="Name" label="物料名称"></el-table-column>
                <el-table-column align="center" prop="No" label="物料编号"></el-table-column>
                <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
                <el-table-column align="center" prop="Model" label="型号"></el-table-column>
                <el-table-column align="center" prop="StandardUnitId" label="单位"></el-table-column>
                <el-table-column align="center" label="操作">
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
          <el-tab-pane label="单位换算" name="unit">
            <table-cmp
              style="width:100%"
              class="table_cmp"
              :loading="loading"
              :table-data="form.UnitConvertDetail"
              height="166px"
              :table-label="unit_tableLabel"
              @handleButton="handleButton"
              @rowClick="rowClick"
              @cellClick="cellClick"
              @handleSortChange="handleSortChange"
              @handleSelectionChange="handleSelectionChange"
            ></table-cmp>
          </el-tab-pane>
          <el-tab-pane label="图片库" name="imgs">
            <!-- <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/> -->
          <div v-if="form.MaterielImageDetail!=''"  v-for="(item, index) in form.MaterielImageDetail" :key="index" >
              <img width="200" :src="item.Address" alt="">
            </div>
            <div>
              <el-upload
            action="http://47.108.200.243:8200/api/FileManger/UploadSingleFiles"
            ref="upload"
            auto-upload
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-success="onSuccess"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
            </div>
            <!-- <el-upload
              class="upload-demo"
              action="http://47.108.200.243:8200/api/FileManger/UploadSingleFiles"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload> -->
            <!-- <div class="imgList">
              <el-upload
                action="http://47.108.200.243:8200/api/FileManger/UploadSingleFiles"
                list-type="picture-card"
                multiple
                :file-list="form.MaterielImageDetail"
                :on-change="handleChange"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :headers="myHeaders"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </div>-->
          </el-tab-pane>
          <el-tab-pane label="物料清单" name="materielList">
            <table-cmp
              style="width:100%"
              class="table_cmp"
              :loading="loading"
              :table-data="form.MaterielBOMDetail"
              height="166px"
              :table-label="materiel_tableLabel"
              @handleButton="handleButton"
              @rowClick="rowClick"
              @cellClick="cellClick"
              @handleSortChange="handleSortChange"
              @handleSelectionChange="handleSelectionChange"
            ></table-cmp>
          </el-tab-pane>
          <el-tab-pane label="作业标准" name="standard">
            <table-cmp
              style="width:100%"
              class="table_cmp"
              :loading="loading"
              :table-data="form.OperationStandardDetail"
              height="166px"
              :table-label="standard_tableLabel"
              @handleButton="handleButton"
              @rowClick="rowClick"
              @cellClick="cellClick"
              @handleSortChange="handleSortChange"
              @handleSelectionChange="handleSelectionChange"
            ></table-cmp>
          </el-tab-pane>
          <el-tab-pane label="扩展属性" name="extend">
            <table-cmp
              width="100%"
              class="table_cmppx"
              :loading="loading"
              :table-data="form.ExPropertyDetail"
              height="166"
              :table-label="extend_tableLabel"
              @handleButton="handleButton"
              @rowClick="rowClick"
              @cellClick="cellClick"
              @handleSortChange="handleSortChange"
              @handleSelectionChange="handleSelectionChange"
            ></table-cmp>
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
      >确 定</button>
    </span>
    <!-- <myTable :visible="showReplace"></myTable> -->
    <replace-prop
      :selectOptionList="selectOptionList"
      :visible="showReplace"
      :typeNum="1"
      :check="2"
      :title="'新增物料替代件'"
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
// import replaceProp from "./replaceProp.vue";
import chooseSupplier from "@/components/chooseSupplier";
import replaceProp from "@/components/replaceTable.vue";
import unitTransfor from "./unitTransfor.vue";
import operationStandard from "./operationStandard.vue";
import extendAttr from "./extendAttr.vue";
import materielBom from "./materielBom.vue";
import { mapGetters } from "vuex";
import myTable from "@/components/table";
import axios from 'axios'
export default {
  name: "archives",
  data() {
    return {
      imgTrue:'',
      imgSrc:"",
      token: "",
      myHeaders: {
        "Content-Type": "application/problem+json; charset=utf-8",
        //"Content-Disposition": "form-data",

        //"Content-Type": "multipart/form-data"
        //"Content-Type":"application/x-www-form-urlencoded"
      },
      SupplierId: "",
      rules: {
        No: [
          { required: true, message: "请输入物料编码", trigger: "blchangeur" },
        ],
        Name: [
          { required: true, message: "请输入物料名称", trigger: "change" },
        ],
        CategoryId: [
          { required: true, message: "请输入物料分类", trigger: "change" },
        ],
        ValidityTimeUnit: [
          { required: true, message: "请选择单位", trigger: "bchangelur" },
        ],
        StandardUnitId: [
          { required: true, message: "请输入标准单位", trigger: "change" },
        ],
        DefaultWarehouseId: [
          { required: true, message: "请输入默认仓库", trigger: "change" },
        ],
        // DefaultSupplierName: [
        //   { required: true, message: "请选择默认供应商", trigger: "blur" },
        // ],
        Spec: [{ required: true, message: "请输入规格", trigger: "change" }],
        Model: [{ required: true, message: "请输入型号", trigger: "change" }],
        ValidityTime: [
          { required: true, message: "请输入有效期", trigger: "change" },
        ],
        ValidityTimeUnit: [
          { required: true, message: "请选择品牌", trigger: "change" },
        ],
        BrandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
      },
      // 默认供应商
      supplierList: [],
      // 远程物料
      optionList: [],
      // 文件上传
      currentFile: null,
      // 弹框内表格编辑弹框
      materielTable: [],
      keyWord: "",
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
        emitPath: false,
      },
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
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      form: {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        CategoryId: "",
        IsReplaceMateriel: false,
        IsTool: false,
        IsAssets: false,
        StandardUnitId: "",
        DefaultWarehouseId: "",
        Grade: "0",
        BrandId: "",
        DefaultSupplierId: 0, //默认供应商
        ManageStyle: 0,
        Spec: "",
        Model: "",
        ValidityTime: "",
        ValidityTimeUnit: "",
        ReplaceMaterielDetail: [],
        UnitConvertDetail: [],
        MaterielBOMDetail: [],
        OperationStandardDetail: [],
        ExPropertyDetail: [],
        MaterielImageDetail: [],
        SType: 1,
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
    currentId:{
      type:Number,
      default:0
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
    ...mapGetters(["ULFB", "ULFE", "imgUrl", "QuerySupplier", "GetMateriels"]),
  },
  watch: {
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.form = newVal;
      console.log(newVal)
      if(newVal.MaterielImageDetail){
        console.log(newVal.MaterielImageDetail)
      }
      // if(newVal.No != ""){
      // this.form = newVal;
      // //this.form.CategoryId=
      // // this.imgSrc=this.form.MaterielImageDetail[0].Address
      // console.log(JSON.stringify(newVal))
      // this.SupplierId = newVal.DefaultSupplierId;
      // }else{

      // }
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
        this.form.MaterielImageDetail.push({
          Address: newVal.ReturnData.FilePath,
          url: this.imgUrl + newVal.ReturnData.FilePath,
        });
        console.log(this.form.MaterielImageDetail);
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
  },
  created() {
    that = this;
    this.getTableData();
    console.log(this.form.ReplaceMaterielDetail);
    //if(this.)
    let t = JSON.parse(sessionStorage.getItem("UserInfor"));
    this.token = t.Token;
  },
  mounted() {
    console.log(this.wareHouse);
  },
  methods: {
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    //获取选择员工信息
    getToFather(val) {
      console.log(val);
      this.form.DefaultSupplierName = val.Name;
      this.form.DefaultSupplierId = val.Id;
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
    //下拉改变
    selectChange(Id) {
      console.log(Id);
      let Name = "";
      this.supplierList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.DefaultSupplierName = Name;
      this.form.DefaultSupplierId = Id;
    },
    //移除
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
        this.form.OperationStandardDetail.push(data);
      } else {
        this.form.OperationStandardDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showStandard = false;
    },
    //   物料清单
    dataMaterielSubmit(data) {
      console.log(data);
      if (this.currentIndex === "") {
        this.form.MaterielBOMDetail.push(data);
      } else {
        this.form.MaterielBOMDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showMaterielList = false;
    },
    //   扩展属性
    dataExtendSubmit(data) {
      if (this.currentIndex === "") {
        this.form.ExPropertyDetail.push(data);
      } else {
        this.form.ExPropertyDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showExtend = false;
    },
    //   单位换算
    dataUnitSubmit(data) {
      if (data.IsBase == "1") {
        for (let i = 0; i < this.form.UnitConvertDetail.length; i++) {
          this.form.UnitConvertDetail[i].IsBase = "0";
        }
      }
      if (this.currentIndex === "") {
        this.form.UnitConvertDetail.push(data);
      } else {
        this.form.UnitConvertDetail[this.currentIndex] = data;
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
        this.form.ReplaceMaterielDetail.push(data);
      } else {
        this.form.ReplaceMaterielDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showReplace = false;
    },
    //返回
    AddMateriels() {
      this.PopFormInit01();
    },
    //物料选择单选添加
    addTable(row) {
      //this.newTableData.push(row);
      console.log(row);
      this.form.ReplaceMaterielDetail = [row];
      // console.log(this.newTableData);
    },
    //物料选择多选添加
    addCheck(val) {
      this.form.ReplaceMaterielDetail = val;
      console.log(this.form.ReplaceMaterielDetail);
    },
    //物料搜索值
    searchFun(val) {
      console.log(val);
      this.keyWord = val;
      this.getTableData();
      // this.getTableData();
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
      row.Price == "" ? (row.Price = 0) : (row.Price = row.Price);
      row.Amount = Number(row.Number) * Number(row.Price);
    },
    //价格改变
    priceChange(row) {
      console.log(row);
      row.Number == "" ? (row.Number = 0) : (row.Number = row.Number);
      row.Amount = Number(row.Number) * Number(row.Price);
    },
    // 物料删除
    delMateriels(val) {
      for (
        let index = 0;
        index < this.form.ReplaceMaterielDetail.length;
        index++
      ) {
        const element = this.form.ReplaceMaterielDetail[index];
        if (element.Name == val.Name) {
          this.form.ReplaceMaterielDetail.splice(index, 1);
        }
      }
    },
    PopFormInit01() {
      // this.remotevalue = "";
      // this.$refs.PopForm01.$refs.ruleForm.resetFields();
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
          this.form.ReplaceMaterielDetail.splice(this.currentIndex, 1);
          console.log(this.form.ReplaceMaterielDetail);
          break;
        case "unit":
          this.form.UnitConvertDetail.splice(this.currentIndex, 1);
          break;
        case "materielList":
          this.form.MaterielBOMDetail.splice(this.currentIndex, 1);
          break;
        case "standard":
          this.form.OperationStandardDetail.splice(this.currentIndex, 1);
          break;
        case "extend":
          this.form.ExPropertyDetail.splice(this.currentIndex, 1);
          break;
        default:
          break;
      }
    },
    handleClick(data) {},
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.activeName = "replace";
      this.$refs.form.resetFields();
      // this.form
    },
    submitData() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.form["IsTool"] = this.form["IsTool"] ? "1" : "0";
          this.form["IsReplaceMateriel"] = this.form["IsReplaceMateriel"]
            ? "1"
            : "0";
          this.form["IsAssets"] = this.form["IsAssets"] ? "1" : "0";
          this.form.SType = 1;
          this.form.Grade = "0";
          this.form.ManageStyle = 0;
          this.$emit("addMateria", this.form);
          this.$refs.form.resetFields();
          // this.form = {}
        } else {
          return false;
        }
      });
    },
    handleRemove(file) {
      //删除
      console.log(file);
      this.form.MaterielImageDetail = this.form.MaterielImageDetail.filter(
        (item) => item.url != file.url
      );
      console.log(file);
      //console.log(this.form.MaterielImageDetail);
    },
    //图片上传成功
    onSuccess(response) {
      console.log(response);
      let obj = {
        Id :0,
        ParentId :0,
        Address :response.imgpath
      }
      this.form.MaterielImageDetail.push(obj)
    },
    onError(err, file, fileList) {
      console.log(err);
    },
    handlePictureCardPreview(file) {
      //图片预览
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
      console.log(file);
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
      console.log(file);

      //this.MIX_send(json);
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
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  width: 14px;
  vertical-align: middle;
}
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
</style>