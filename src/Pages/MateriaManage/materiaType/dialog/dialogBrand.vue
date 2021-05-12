<template>
  <el-dialog
    @close="cancelSubmit" custom-class="classdialog"
    :title="type == 1 ? '新增品牌' : '编辑品牌'"
    :visible.sync="show"
    width="500px"
  >
    <el-form :rules="rules" ref="form" :model="form" label-width="80px" label-position="left">
      <el-form-item label="品牌名称" prop="Name" label-position="left">
        <el-input v-model="form.Name" placeholder="请输入品牌名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"  style="  margin-left: 12.1rem;" class="dialog-footer">
      <button @click="cancelSubmit"  style="width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;outline: none;">取 消</button>
      <button   style="width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;outline: none;" @click="submitData">确 定</button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "classify",
  data() {
    return {
      rules: {
          Name: [
            { required: true, message: '请输入品牌名称', trigger: 'change' },
          ],},
      show: false,
      form: {
        Name: "",
        Status:'3',
      },
      statusList:[
        {
        Name:"启用",
        Id:2,
      },
      {
        Name:"禁用",
        Id:1,
      },
      ],
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
    };
  },
  props: {
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
    ...mapGetters([
      "SaveBrand",
    ]),
  },
  watch: {
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.form = newVal;
    },
    SaveBrand(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        this.$refs.form.resetFields()
        this.$emit("addMateria")
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "fail",
        });
      }
  },
  },
  methods: {
    GetTableId(val){
      console.log(val[val.length-1])
      this.form.ParentId=val[val.length-1]
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.$refs.form.resetFields()
    },
    // 新增或者编辑
    addBrand(data) {
      console.log(data);
      let json = {
        MN: "SaveBrand",
        SN: "Materiel",
        DataContent: data,
      };
      this.MIX_send(json);
    },
    //确定时间
    submitData() {
      this.$refs.form.validate((vaild)=>{
        if(vaild){
      this.form["AutoCode"] = this.form["AutoCode"] ? "1" : "0";
      this.form["UnitConvert"] = this.form["UnitConvert"] ? "1" : "0";
      this.form["OperationStandard"] = this.form["OperationStandard"]
        ? "1"
        : "0";
      this.form["MaterielBOM"] = this.form["MaterielBOM"] ? "1" : "0";
      this.form["ParentId"] = !this.form["ParentId"]
        ? "0"
        : this.form["ParentId"];
        this.form.Stype=4
        this.addBrand(this.form)
        // this.$emit("addMateria", this.form)
        
        }else{
          return false
        }
      })
    },
  },
}
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
}
/deep/ .el-form-item__label {
  color: #4d6474;
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
border-color: #0060A0 ;
background:  #0060A0;
}
/deep/ .el-checkbox__label{
  color: #4D6474;
}
/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #4D6474;
}
.classdialog{
  border-radius: 4px;
}
button:hover {
  cursor: pointer;
}
</style>