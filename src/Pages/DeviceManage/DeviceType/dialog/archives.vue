<template>
<div>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增设备档案' : '编辑设备档案'"
    :visible.sync="show"
    width="1000px"
    center
    style="border-radius:'10px'"
    :before-close="cancelSubmit"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-row :span="20">
        <el-col :span="8">
          <el-form-item label="设备编号" label-position="left" prop="DeviceNum">
            <el-input v-model="form.DeviceNum" placeholder="请输入设备编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称" label-position="left" prop="DeviceName">
            <el-input v-model="form.DeviceName" placeholder="请输入设备名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属分类" prop="DeviceType" >
            <el-cascader
            @change="changetree"
            v-model="form.DeviceType"
              style="width:195px"
              :options="treeData"
              :props="optionProps"
              clearable
              filterable
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="8">
          <el-form-item label="供应商" label-position="left" >
            <chooseSupplier :isMultipleChoice="false" @getToFather='getToFather'   :SupplierId="SupplierId" style="width=190px"></chooseSupplier>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌" label-position="left" prop="Brand">
            <!-- <el-input v-model="form.Brand" placeholder="请选择品牌"></el-input> -->
            <el-select v-model="form.Brand" placeholder="请选择品牌">
                <el-option
                  v-for="(item, index) in brands"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格" label-position="left" prop="Spec">
            <el-input v-model="form.Spec" placeholder="请输入规格"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :span="20">
        <el-col :span="8">
          <el-form-item label="有效期" label-position="left" prop="ValidityTime">
            <el-input-number
              style="width:195px"
              v-model="form.ValidityTime"
              :controls="false"
              placeholder="请输入有效期"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效期单位" label-position="left" prop="ValidityTimeUnit">
            <el-select v-model="form.ValidityTimeUnit" placeholder="请输入有效期单位">
              <el-option
                v-for="item in ValidityTimeUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="初始使用时间" label-position="left" prop="OnlineTIme">
              <el-date-picker
                v-model="form.OnlineTIme"
                type="date"
                placeholder="选择初始使用时间"
                value-format="yyyy-MM-dd"
                style="width: 195px"
              ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <!-- <el-col :span="8">
          <el-form-item label="物料" label-position="left" prop="MaterielID">
            <el-input v-model="form.MaterielID" placeholder="请选择物料"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="物料名称" label-position="left" prop="MaterielName">
            <el-input v-model="form.MaterielName" placeholder="请输入物料名称" @focus="focusfns"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="型号" label-position="left" prop="Model">
            <el-input v-model="form.Model" placeholder="请输入型号"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row :span="20">
        <el-form-item label="描述" prop="Desc">
          <el-input type="textarea" v-model="form.Desc" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit">取 消</el-button>
      <el-button type="primary" @click="submitData('form')">确 定</el-button>
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
import replaceTable from "@/components/replaceTable.vue";
import chooseSupplier from '@/components/chooseSupplier'
export default {
  name: "classify",
  data() {
    return {
      SupplierId:"",
      DefaultSupplierId: 0, //默认供应商
      showReplace:false,
      title:'设备分类明细',
      wltree:[],
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
      rules: {
        DeviceNum: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
        ],
        DeviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        DeviceType: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        SupplierId: [
          { required: true, message: "请选择供应商", trigger: "change" },
        ],
        Brand: [{ required: true, message: "请选择品牌", trigger: "change" }],
        Spec:[ { required: true, message: "请输入规格", trigger: "blur" },],
        Model:[ { required: true, message: "请输入型号", trigger: "blur" },],
        ValidityTime:[ { required: true, message: "请输入有效期", trigger: "blur" },],
        ValidityTimeUnit:[ { required: true, message: "请输入有效期单位", trigger: "blur" },],
        MaterielID: [
          { required: true, message: "请选择物料ID", trigger: "change" },
        ],
        MaterielName: [
          { required: true, message: "请选择物料名称", trigger: "change" },
        ],
        OnlineTIme:[{ required: true, message: "请选择初始使用日期", trigger: "change" }]
      },
      // changetreedata:[],
      show: false,
      form: {
        MaterielID:"",
        MaterielName:'',
        DefaultSupplierId: 0, //默认供应商
        },
      radio: "1",
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath:false
      },
      ValidityTimeUnit:[
        {label:'年',value:0},
        {label:'月',value:1},
        {label:'日',value:2},
      ]
    };
  },
  async created(){
  },
  props: {
    brands: {
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

  },
  watch: {
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      if(newVal){
        this.form = newVal;
      console.log(this.form)
      this.form.ValidityTimeUnit=this.form.ValidityTimeUnit*1
      this.form.DeviceType=this.form.DeviceType*1
      this.SupplierId=this.form.SupplierId
      console.log(typeof (this.SupplierId))
      }
    },
    treeData(newVal, oldVal){
    }
  },
  components: {
    replaceTable,
    chooseSupplier
  },
  methods: {
    //供应商选择
    getToFather(data){
      console.log(data)
      this.form.SupplierId=data.Id
      // this.SupplierId=data.Id*1
    },
    //物料选择
    focusfns(){
    this.showReplace=true
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
      console.log(row);
      this.form.MaterielID=row.Id;
      this.form.MaterielName=row.Name
    },
    addCheck(val) {
      this.form.ReplaceMaterielDetail = val;
      console.log(this.form.ReplaceMaterielDetail);
    },
    //
    //改变树的结构
    changetree(val){
      console.log(111,val)
    },
    handleNodeClick(data) {
      console.log(data);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.form={}
      this.$refs.form.clearValidate()
    },
    choice(val) {
      // console.log(val)
      // console.log(val[val.length-1])
      this.form.DeviceType = val[val.length - 1];
    },
    submitData(formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form["DeviceType"] = !this.form["DeviceType"]? "0": this.form["DeviceType"];
      console.log(this.form);
      this.$emit("addMateria", this.form);
       this.$refs.form.resetFields();
          } else {
            
            return false;
          }
        });
      
    },
  },
};
</script>
<style scoped lang='less'>
.dialog-footer .ownbutton {
  width: 170px;
}
</style>
<style >
.el-dialog {
  border-radius: 4px;
}
.el-cascader {
  width: 290px;
}
</style>