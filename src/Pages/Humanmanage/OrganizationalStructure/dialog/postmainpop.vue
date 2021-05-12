<template>
  <div>
    <el-dialog :title="formtype==1?'新增岗位职责':'编辑岗位职责'" center width='460px' :visible.sync="dialogFormVisible">
  <el-form :model="form" label-position='left'>
    <el-form-item label="管理类型" :label-width="formLabelWidth">
      <el-select class="select_border_bottom" v-model="form.Type" placeholder="请选择管理类型">
        <el-option label="部门" value="1"></el-option>
        <el-option label="项目组" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述" :label-width="formLabelWidth">
      <el-input class="textarea_border_bottom" v-model="form.Desc" type="textarea" placeholder="请输入描述"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="commit">提 交</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible:false,
        formtype:1,
        formLabelWidth:'80px',
        form:{
          Type:'',
          Desc:''
        }
      }
    },
    methods: {
      commit(){
        this.$emit("dataChange",this.form);
        this.dialogFormVisible=false
        this.form = {
          Type:'',
          Desc:''
        };
      },
      cancel() {
        this.form = {
          Type:'',
          Desc:''
        };
        this.dialogFormVisible = false;
      },
    },
  }
</script>

<style lang="less" scoped>

</style>
