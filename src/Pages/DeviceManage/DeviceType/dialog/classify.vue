<template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增设备分类' : '编辑设备分类'"
    :visible.sync="show"
    width="420px"
    center
    style="border-radius:'10px'"
    :before-close="cancelSubmit"
  >
    <el-form ref="form" :model="form" label-width="90px" :rules="rules" >
      <el-form-item label="所属分类"  prop="ParentID">
        <el-cascader :options="typeList" :props="optionProps" clearable filterable v-model="form.ParentID"  style="width:270px"></el-cascader>
      </el-form-item>
      <el-form-item label="分类名称" label-position="left" prop="TypeName">
        <el-input v-model="form.TypeName" placeholder="请输入分类名称" style="width:270px"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="Remark">
        <el-input type="textarea" v-model="form.Remark" placeholder="请输入分类描述" style="width:270px"></el-input>
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
      rules:{
        // ParentID:[{ required: true, message: '请选择所属分类', trigger: 'blur' }],
        Remark:[{ required: true, message: '请输入分类描述', trigger: 'change' }],
        TypeName:[{ required: true, message: '请输入分类名称', trigger: 'change' }],
      },
      show: false,
      form: {},
      radio: "1",
       optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath:false,
      },
       changetreedata:[]
    };
  },
  props: {
    currentId:{
      default:'0'
    },
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
    currentId(newVal, oldVal){
      this.form.ParentID=newVal
    },
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.form = newVal;
      this.form.ParentID=newVal.ParentID*1
      console.log(typeof this.form.ParentID)
      console.log(this.form.ParentID)
      // this.form.Name=newVal.Name
    },
    treeData(newVal, oldVal){
    //  let arr=[]
    //   arr=[{Id:"0",IsDel: 0,Name: "无",ParentID: 0,ParentName: "",Remark: "3",Children:[]}]
    //   newVal.forEach(item => {
    //       arr.push(item)
    //   });
    //   this.changetreedata=arr
    }

  },
  methods: {
    
    handleNodeClick(data) {
      console.log(data);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.form={}
       this.$refs.form.clearValidate()
    },
    choice(val){
      // console.log(val)
      // console.log(val[val.length-1])
      this.form.ParentID=val[val.length-1]
    },
    submitData(formName) {
      if(!this.form.ParentID){
        this.$message.error('请输入所属分类')
        return
      }
      this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form);
      // if(!this.form.Name||!this.form.ParentID||!this.form.Remark){
      //   this.$message.error('数据不能为空')
      //   return 
      // }
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
.el-dialog{
  border-radius:4px;
}
.el-cascader{
  width: 290px;
}
</style>