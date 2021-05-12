<template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增仓库' : '编辑仓库'"
    :visible.sync="show"
    width="897px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="名称" prop="Name" label-position="left">
            <el-input v-model="form.Name" placeholder="请输入仓库名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="隶属仓库" prop="ParentId">
            <!-- <el-select v-model="form.ParentId" :disabled="disable" placeholder="请选择隶属仓库">
              <el-option
                v-for="(item, index) in typeList"
                :label="item.Name"
                :key="index"
                :value="item.Id"
              >{{ item.Name }}</el-option>
            </el-select> -->
            <el-cascader
                placeholder="请选择默认仓库"
                v-model="form.ParentId"
                :options="typeList"
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
            <!-- <el-cascader
                placeholder="请选择默认仓库"
                v-model="form.ParentId"
                :options="typeList"
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
              ></el-cascader> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="Category" label-position="left">
            <el-radio-group v-model="form.Category">
              <el-radio :label="0">虚拟仓</el-radio>
              <el-radio :label="1">实体仓</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="仓库管理员" prop="StaffName">
            <chooseStaff class="chooseStaff"  :isCustomer="true" :isMultipleChoice="false" @getToFather="getToId" ></chooseStaff>
            <!-- <el-select
              v-model="form.StaffName"
              @change="selectChange"
              filterable
              remote
              :remote-method="searchNoticer"
              placeholder="请输入仓库管理员姓名搜索"
            >
              <el-option
                v-for="(item,index) in staffList"
                :key="index"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.Desc" placeholder="请输入仓库描述"></el-input>
      </el-form-item>
    </el-form>
    <div class="tabs">
      <button
        class="addTab"
        @click="addShelevs"
        style="float: right;z-index: 100;position: absolute;right: 20px;width:24px;
height:24px; color:#fff;border:none;font-size:13px; outline: none;
background:rgba(0,96,160,1);
border-radius:2px;"
      >+</button>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="| 货架明细" name="goodsShelves">
          <table-cmp
            style="width:100%"
            class="table_cmp"
            :table-data="form.ShelfDetail"
            height="166"
            :table-label="shelevsLabel"
          ></table-cmp>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer" style="  margin-left: 30rem;">
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
    <Shelevs
      :visible="showMask"
      :type="formType"
      :allData="form.ShelfDetail"
      :addData="maskData"
      @closePropMask="closePropMask"
      @dataSubmit="dataSubmit"
    ></Shelevs>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import chooseStaff from '@/components/myStaff'
import Shelevs from "./shelevs.vue";
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
export default {
  name: "classify",
  data() {
    return {
      stuffId:'',
      rules: {
        Name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        Category: [{ required: true, message: "类型", trigger: "blur" }],
        ParentId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        // StaffName: [
        //   { required: true, message: "请选择仓库管理员", trigger: "change" },
        // ],
      },
      formType: "1",
      currentIndex: "",
      show: false,
      showMask: false,
      maskData: {},
      staffList: [],
      disable: false,
      form: {
        Name:'',
        Category:'',
        ParentId:"0",
        ShelfDetail:[],
      },
      activeName: "goodsShelves",
      shelevsLabel: [
        { label: "货架名称", param: "Name", align: "center", sortable: false },
        { label: "描述", param: "Desc", align: "center", sortable: false },
        { label: "操作", align: "center", width: "300", component: process },
      ],
    };
  },
  props: {
    WarehouseCheckId:{
      default: "0",
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
  },
  computed: {
    ...mapGetters(["QueryStaff"]),
  },
  watch: {
    WarehouseCheckId(newVal, oldVal) {
      this.form.ParentId=newVal
    },
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      if(newVal.ManagerId != ''){
        this.form = newVal;
        this.stuffId=newVal.Category
      }else{
        this.form.ParentId=this.WarehouseCheckId
      }
      
    },
    QueryStaff(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.staffList = newVal.ReturnData.Data;
      }
    },
  },
  created() {
    that = this;
    if(this.formData.ManagerId != ''){
        this.form = this.formData;
        this.stuffId=this.formData.Category
      }else{
        this.form.ParentId=this.WarehouseCheckId
      }
    console.log(this.form)

    // console.log(this.WarehouseCheckId)
    // this.form.ParentId=this.WarehouseCheckId
    // console.log(this.form.ParentId)
    //console.log(this.typeList)
  },
  methods: {
    changeP(){
      console.log(this.form.ParentId)
    },
    //获取员工Id
    getToId(val){
      console.log(val)
      this.form.ManagerId = val.keyId;
      this.form.StaffName = val.keyValue;
    },
    // categoryChange(value) {
    //   if (value == 0) {
    //     //this.form.ParentId = "";
    //     this.disable = true;
    //   } else {
    //     this.disable = false;
    //   }
    // },
    searchNoticer(keyword) {
      this.getStaffList(keyword);
    },
    selectChange(Id) {
      let Name = "";
      this.staffList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.ManagerId = Id;
      this.form.StaffName = Name;
    },
    getStaffList(keyword) {
      console.log(keyword);
      let json = {
        MN: "QueryStaff",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.$refs.form.resetFields()
    },

    submitData() {
      this.$refs.form.validate((vaild)=>{
        if(vaild){
      this.form["ParentId"] = !this.form["ParentId"]
        ? "0"
        : this.form["ParentId"];
      this.form["IsReplaceMateriel"] = "0";
      this.form["IsTool"] = "0";
      this.form["IsAssets"] = "0";
      this.$emit("addMateria", this.form);
      this.$refs.form.resetFields()
        }
        else{
          return false
        }
      })
    },
    addShelevs() {
      this.showMask = true;
    },
    closePropMask(data) {
      this.showMask = false;
    },
    dataSubmit(data) {
      if (this.currentIndex === "") {
        this.form.ShelfDetail.push(data);
      } else {
        this.form.ShelfDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.showMask = false;
      this.maskData = {};
    },
    //  点击货架编辑
    clickEdit(row, index) {
      this.currentIndex = index;
      this.formType = "2";
      this.maskData = row;
      this.showMask = true;
    },
    clickDel(row, index) {
      this.currentIndex = index;
      this.form.ShelfDetail.splice(this.currentIndex, 1);
      console.log(this.form.ShelfDetail);
    },
  },
  components: {
    Shelevs,
    chooseStaff
  },
};
</script>
<style scoped lang="less">
.el-select {
  width: 100% !important;
}
.addTab {
  position: absolute;
  right: 20px;
  z-index: 100;
}
.dialog-footer {
  text-align: right;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474 !important;
}
/deep/ .el-dialog {
  border-radius: 4px;
}
button:hover {
  cursor: pointer;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
  color: #4d6474 !important;
}
/deep/
  .el-tabs--top.el-tabs--card
  > .el-tabs__header
  .el-tabs__item:last-child {
  color: #4d6474 !important;
  font-size: 16px;
}
</style>