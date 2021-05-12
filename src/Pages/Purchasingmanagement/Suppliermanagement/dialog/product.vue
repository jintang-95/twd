<template>
  <div>
    <el-dialog :title="formtype==1?'新增产品库':'编辑产品库'" width='460px' :visible.sync="dialogFormVisible">
  <el-form :model="form" label-position='left'>
    <el-form-item label="名称" :label-width="formLabelWidth">
      <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入名称" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="隶属部门" :label-width="formLabelWidth">
      <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择部门">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述" :label-width="formLabelWidth">
      <el-input class="textarea_border_bottom" v-model="form.name" type="textarea" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="commit">确 定</el-button>
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
        formLabelWidth:'100px',
        form:{
          
        },
        formData:{
        	
        }
      }
    },
  	watch:{
  		form:function(data){
  			this.formData = JSON.parse(data);
  		}
  	},
    methods: {
      commit(){
  		this.$emit("dataSubmit", this.formData);
  		this.formData={};
        this.dialogFormVisible=false
      },
  	  close(){
  		  this.formData={};
  		  this.dialogFormVisible=false
  	  }
    },
  }
</script>

<style lang="less" scoped>

</style>