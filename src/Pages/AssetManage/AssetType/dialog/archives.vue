<template>
<div>
  <el-dialog
    custom-class="classdialog"
    @close="cancelSubmit"
    :title="type == 1 ? '新增资产档案' : '编辑资产档案'"
    :visible.sync="show"
    width="950px"
    :before-close="cancelSubmit"
  >
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        class="formContainer"
        label-position="left"
        :rules='rules'
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="资产编号" label-width="100px" label-position="left" prop="AssetsNo">
              <el-input-number :controls='false' v-model="form.AssetsNo" placeholder="请输入资产编号"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产名称" label-width="100px" label-position="left" prop="Name">
              <el-input v-model="form.Name" placeholder="请输入资产名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产单位" label-width="100px" label-position="left" prop="Unit">
              <el-input v-model="form.Unit" placeholder="请输入资产单位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属物料" label-position="left" label-width="100px" prop="MaterielName">
              <el-input v-model="form.MaterielName" placeholder="请输入物料"  @focus="focusfns"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人" label-position="left" label-width="100px" >
              <!-- <el-input v-model="form.BuyUser" placeholder="请输入经办人" @focus="focuspeople"></el-input> -->
              <chooseStaff class="chooseStaff"  :isCustomer='true' style="width: 190px" :isMultipleChoice="false" @getToFather="getToId"></chooseStaff>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="增长数量" label-position="left" label-width="100px" prop="BuyNum">
              <el-input-number v-model="form.BuyNum" placeholder="请输入增长数量" :controls='false'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="初始价值" label-position="left" label-width="100px" prop="Price">
              <el-input-number v-model="form.Price" placeholder="请输入初始价值" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="折旧方式" label-position="left" label-width="100px" prop="depreciationType">
              <el-select v-model="form.depreciationType" placeholder="请选择折旧方式">
                <el-option
                  v-for="item in depreciationType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="残值率" label-position="left" label-width="100px" prop="ratio">
              <el-input-number :controls='false' v-model="form.ratio" placeholder="请输入残值率"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="残值" label-position="left" label-width="100px" prop="ResidualValue">
              <el-input-number v-model="form.ResidualValue" placeholder="请输入残值" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="资产状态" label-position="left" label-width="100px">
              <el-input v-model="form.Status" placeholder="请输入资产状态"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="8">
            <el-form-item label="规格" label-width="100px" label-position="left" prop="Spec">
              <el-input v-model="form.Spec" placeholder="请输入规格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="增加日期" label-width="100px" prop="BuyDate">
              <el-date-picker
                v-model="form.BuyDate"
                type="date"
                placeholder="选择增加日期"
                value-format="yyyy-MM-dd"
                style="width: 190px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="创建人" label-position="left" label-width="100px">
              <el-input-number v-model="form.CreatedUser" placeholder="请输入创建人" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="增加方式" label-width="100px" prop="Addtype">
              <el-select v-model="form.Addtype" placeholder="请选择增加方式">
                <el-option
                  v-for="(item, index) in addway"
                  :label="item.TypeName"
                  :key="index"
                  :value="item.Id"
                >{{item.TypeName}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属分类" label-width="100px" prop="AssetsType">
              <el-cascader
                :options="treeData"
                :props="optionProps"
                clearable
                filterable
                v-model="form.AssetsType"
                style="width:190px;"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="8" :offset="7">
            <el-form-item label="创建时间" label-position="left" label-width="100px">
              <el-date-picker
                v-model="form.CreatedTime"
                type="datetime"
                placeholder="选择创建时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="资产描述" label-position="left" label-width="100px" prop="Desc">
              <el-input v-model="form.Desc" placeholder="请输入资产描述" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        @click="submitData('form')"
      >确 定</button>
    </span>
  </el-dialog>
  <replace-table
      :selectOptionList="selectOptionList"
      :visible="showReplace"
      :typeNum="1"
      :check="2"
      :title='title'
      :typeList="wltree"
      :showType="false"
      @closePropMask="closePropMask"
      @PopFormInit01="PopFormInit01"
      @addMaterielTable="addTable"
      @addCheck="addCheck"
    ></replace-table>
  
    </div>
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
import replaceTable from "@/components/replaceTable.vue";
import chooseStaff from "@/components/chooseStaff.vue"
import unitTransfor from "./unitTransfor.vue";
import operationStandard from "./operationStandard.vue";
import extendAttr from "./extendAttr.vue";
import materielBom from "./materielBom.vue";
import { mapGetters } from "vuex";
export default {
  name: "archives",
  data() {
    return {
      unitType: "1",
      extendType: "1",
      standardType: "1",
      formType: "1",
      currentIndex: "",
      show: false,
      title:'资产分类',
      wltree:[],
      changetreedata:[],
      selectOptionList:[
        {
          title: "全部状态",
          statu: -1,
        },
        {
          title: "启用",
          statu: 2,
        },
        {
          title: "停用",
          statu: 3,
        },
      ],
      showReplace: false,
      showStaff:false,
      depreciationType: [
        {
          label: "按年折旧",
          value: "2",
        },
        {
          label: "按月折旧",
          value: "1",
        }
      ],
      form: {},
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath:false
      },
      rules:{
          AssetsNo:[ { required: true, message: '请输入资产编号', trigger: 'blur' ,type:'number' },],
           Name:[ { required: true, message: '请输入资产名称', trigger: 'blur' },],
           Unit:[ { required: true, message: '请输入资产单位', trigger: 'blur' },],
           Spec:[ { required: true, message: '请输入规格', trigger: 'blur' },],
           Addtype:[ { required: true, message: '请选择增加方式', trigger: 'change' },],
           BuyDate:[ { required: true, message: '请选择增加日期', trigger: 'change' },],
           MaterielId:[ { required: true, message: '请输入物料ID', trigger: 'blur',type:'number' },],
            BuyUser:[ { required: true, message: '请输入经办人', trigger: 'blur',type:'number'}],
            BuyNum:[ { required: true, message: '请输入增长数量', trigger: 'blur' },],
            Pric:[ { required: true, message: '请输入初始价值', trigger: 'change' },],
            depreciationType:[ { required: true, message: '请选择折旧方式', trigger: 'blur' },],
            ratio:[ { required: true, message: '请输入残值率', trigger: 'blur' },],
            Desc:[ { required: true, message: '请输入资产描述', trigger: 'blur' },],
            ResidualValue:[ { required: true, message: '请输入残值', trigger: 'blur' },], 
            AssetsType:[{required: true, message: '请选择所属分类', trigger: 'change'}] 
    },
    };
  },
  props: {
    checkList:{
      type: Array,
      default() {
        return [];
      },
    },
    addway: {
      type: Array,
      default() {
        return [];
      },
    },
    treeData: {
      type: Array,
      default() {
        return [];
      },
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
    ...mapGetters([
      'GetMaterielCategoryTree'
    ]),
  },
  watch: {
    GetMaterielCategoryTree(newVal,oldVal){
      this.wltree=newVal.ReturnData
    },
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.form = newVal;
    },
    treeData(newVal, oldVal){
      
    }
  },
  created() {
    that = this;
    this.gettree()
  },
  methods: {
     //获取员工Id
    getToId(val) {
      this.form.BuyUser = val.keyId*1;
    },
    focuspeople(){
      this.showStaff=true
    },
    gettree(){
      let json = {
        SN: "Materiel",
        MN: "GetMaterielCategoryTree",
        DataContent: {
          // "IsAssets": '1'
          SType:'1'
        },
      };
      this.MIX_send(json);
    },
     //替代件
    AddMateriels() {
      this.PopFormInit01();
    },
    PopFormInit01() {
      this.showReplace = false;
    },
    closePropMask(data) {
      this.showReplace = false;
    },
    addTable(row) {
      this.form.MaterielId=row.Id;
      this.form.MaterielName=row.Name
    },
    addCheck(val) {
      console.log(val)
      this.form.ReplaceMaterielDetail = val;
    },
    //
    focusfns(){
      this.showReplace=true
    },
    choice(val) {
     
      this.form.AssetsType=val[0]
    },
    selectChange(Id) {
      let Name = "";
      this.supplierList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.DefaultSupplierName = Name;
      this.form.DefaultSupplierId = Id;
    },

    // dataSubmit(data) {
    //   if (this.currentIndex === "") {
    //     this.form.ReplaceMaterielDetail.push(data);
    //   } else {
    //     this.form.ReplaceMaterielDetail[this.currentIndex] = data;
    //     this.currentIndex = "";
    //   }
    //   this.maskData = {};
    //   this.showReplace = false;
    // },

    handleClick(data) {},
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.form={}
       this.$refs.form.clearValidate()
      this.activeName = "replace";
      // this.form
    },
    submitData(formName) {
        if(!this.form.BuyUser){
          this.$message.error('请选择经办人')
          return
        }
       this.$refs[formName].validate((valid) => {
          if (valid) {
            
      this.$emit("addMateria", this.form);
       this.$refs.form.resetFields();
          } else {
           
            return false;
          }
        });
     
    },
  },
  components: {
    replaceTable,
    chooseStaff
  },
};
</script>
<style scoped lang="less">
.chooseStaff{
 margin-top: -.5rem;
 width: 190px;
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
<style >
.chooseStaff{
 margin-top: -.5rem;
 width: 190px;
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