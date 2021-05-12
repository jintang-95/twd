<template>
  <el-dialog
    @close="cancelSubmit"
    :before-close="cancelSubmit"
    title="查看资产报废"
    :visible.sync="showck"
    width="420px"
    center
    style="border-radius:'10px'"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="报废单号" label-position="left">
        <el-input v-model="form.ScrapNo" placeholder="请输入报废单号" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-input v-model="form.applyDate" placeholder="请输入报废单号" disabled></el-input>
      </el-form-item>
      <el-form-item label="经办人" label-position="left">
        <el-input v-model="form.Agent" placeholder="请输入经办人" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input  v-model="form.Remarks" placeholder="请输入方式备注" disabled></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit">取 消</el-button>
      <el-button type="primary" @click="submitData" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "retireCK",
  data() {
    return {
      showck: false,
      radio: "1",
      dj:[{name:'草稿',id:0},{name:'待审批',id:1},{name:'审批结束',id:2},{name:'停用',id:3},{name:'已删除',id:4}]
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
    form: {
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
     form(newVal, oldVal) {
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
   
    submitData() {
      console.log(this.form);
      this.$emit("addMateria", this.form);
      
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