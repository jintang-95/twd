<template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增资产方式' : '编辑资产方式'"
    :visible.sync="show"
     :before-close="cancelSubmit"
    width="420px"
    center
    style="border-radius:'10px'"
  >
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
      <el-form-item label="方式名称" label-position="left" prop="TypeName">
        <el-input v-model="form.TypeName" placeholder="请输入方式名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入方式描述" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit">取 消</el-button>
      <el-button type="primary" @click="submitData('form')" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "classify",
  data() {
    return {
      show: false,
      form: {},
      radio: "1",
      rules:{
        TypeName:[{ required: true, message: '请输入方式名称', trigger: 'blur' }],
        remark:[{ required: true, message: '请输入描述', trigger: 'blur' }]
      }
    };
  },
  props: {
    
    treeData:{
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
      this.form = newVal;
    },
  },
  methods: {
    
    handleNodeClick(data) {
      console.log(data);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
       this.$refs.form.clearValidate()
       this.form={}
    },
   
    submitData(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
           console.log(this.form);
      this.$emit("addMateria", this.form);
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
.el-dialog{
  border-radius:4px;
}
.el-cascader{
  width: 290px;
}
</style>