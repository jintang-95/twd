<template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增工具分类' : '编辑工具分类'"
    :visible.sync="show"
    width="460px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
      <el-form-item label="分类编码" prop="No" label-position="left">
        <el-input v-model="form.No" placeholder="请输入分类编码"></el-input>
      </el-form-item>
      <el-form-item label="分类名称" prop="Name" v-model="form.Name" label-position="left">
        <el-input v-model="form.Name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="所属分类">
        <el-cascader
          v-model="form.ParentId"
          placeholder="请选择所属分类"
          :options="typeList"
          :props="optionProps"
          filterable
          clearable
          style="width:100%;"
        ></el-cascader>
        <!-- <el-select v-model="form.ParentId" placeholder="请选择所属分类">
                    <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id"></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item label="通用设置">
        <el-checkbox label="自动编码" name="type" v-model="form.AutoCode"></el-checkbox>
        <el-checkbox label="单位换算" name="type" v-model="form.UnitConvert"></el-checkbox>
        <el-checkbox label="作业标准" name="type" v-model="form.OperationStandard"></el-checkbox>
        <el-checkbox label="BOM清单" name="type" v-model="form.MaterielBOM"></el-checkbox>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.Desc" placeholder="请输入分类描述"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" style="  margin-left: 10.1rem;">
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
  </el-dialog>
</template>

<script>
export default {
  name: "classify",
  data() {
    return {
      rules: {
        No: [{ required: true, message: "请输入分类编码", trigger: "change" }],
        Name: [{ required: true, message: "请输入分类名称", trigger: "change" }],
        ParentId: [{ required: true, message: "请输入分类名称", trigger: "change" }],
      },
      show: false,
      form: {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        AutoCode: "",
        UnitConvert: "",
        OperationStandard: "",
        MaterielBOM: "",
        SType: 3,
      },
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
    };
  },
  props: {
    currentId:{
      default:"0"
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
        if(newVal.No !=''){
        this.form = newVal;
      }else{
        this.form.ParentId=this.currentId
      }
    },
    currentId(newVal, oldVal){
      this.form.ParentId=newVal
    },
  },
  methods: {
    //新增赋值
    assignment(){
      this.form.ParentId=this.currentId
    },
    //获取表格id
    GetTableId(val) {
      console.log(val[val.length - 1]);
      this.form.ParentId = val[val.length - 1];
    },
    //取消事件
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.$refs.form.resetFields()
    },
    //提交事件
    submitData() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.form["AutoCode"] = this.form["AutoCode"] ? "1" : "0";
          this.form["UnitConvert"] = this.form["UnitConvert"] ? "1" : "0";
          this.form["OperationStandard"] = this.form["OperationStandard"]
            ? "1"
            : "0";
          this.form["MaterielBOM"] = this.form["MaterielBOM"] ? "1" : "0";
          this.form["ParentId"] = !this.form["ParentId"]
            ? "0"
            : this.form["ParentId"];
            this.form.SType = 3
          this.$emit("addMateria", this.form);
          this.$refs.form.resetFields()
        } else {
          return false
        }
      });
    },
  },
  async created(){ 
    await this.assignment()
  },
};
</script>
<style scoped lang="less">
/deep/ .el-dialog__header {
  /* width: 79%;
    margin-left: 7%; */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474;
}
/deep/ .el-dialog__title {
  color: #4d6474;
  margin-left: 3%;
}
/deep/ .el-form-item__label {
  color: #4d6474;
}
/* /deep/ .el-checkbox__inner::after{
  background-color: #0060A0;
} */
/* /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
/*       // background-color: #fff; */
/*       border-color:#fdb122;
      background:#fdb122; */
/*     } */
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #0060a0;
  background: #0060a0;
}
/deep/ .el-checkbox__label {
  color: #4d6474;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4d6474;
}
</style>