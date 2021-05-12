<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增供应商分类' : '编辑供应商分类'"
    :visible.sync="show"
    width="460px"
    center>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="分类名称:" label-position="left" prop="Name">
                <el-input v-model="form.Name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="所属分类:">
				<el-cascader
					class="group"
					v-model="form.ParentId_" 
					placeholder="请选择所属分类"
				    :options="treeData_"
				    :props="{ checkStrictly: true,value:'Id',label:'Name',children:'Children',emitPath:false}"
				    clearable></el-cascader>
            </el-form-item>
            <el-form-item label="描述:" prop="Desc">
                <el-input type="textarea" v-model="form.Desc" placeholder="请输入分类描述"></el-input>
            </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitData" style="background-color: rgb(0, 96, 160);">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'application',
  data() {
    return {
        show: false,
        form: {
            Id: "0",
            Name: '',
            ParentId: 0,
            IsDel: '0',
            Desc: '',
            Status: '2',
            CreatedUser: "",
        },
		treeData_:[],
		rules: {
		         Name: [
		           { required: true, message: '请输入分类名称', trigger: 'blur' },
		         ],
		         // ParentID: [
		         //   { required: true, message: '请选择所属分类', trigger: 'change' }
		         // ],
						  Desc: [
						    { required: true, message: '请输入分类描述', trigger: 'blur' },
						  ],
		       }
    };
  },
  props: {
      visible: {
          type: Boolean,
          default: false
      },
      type: {
          type: String,
          default: '1'
      },
      typeList: {
        type: Array,
        default() {
            return []
        }
      },
	  treeData:{
		type: Array,
		default() {
		    return []
			}
	  },
      formData: {
          type: Object,
          default () {
              return {}
          }
      }
  },
  watch: {
      visible(newVal, oldVal) {
        this.show = newVal
      },
      formData(newVal, oldVal) {
        this.form = JSON.parse(JSON.stringify(newVal));
		this.form.ParentId_ =Number(this.form.ParentId);
      },
	  treeData(newVal, oldVal) {
        this.treeData_ = JSON.parse(JSON.stringify(newVal));
		let arr = {
			CreatedTime: "2020-05-20T00:00:00",
			CreatedUser: 1,
			DelTime: null,
			DelUser: null,
			Desc: "无",
			Id: -1,
			IsDel: 0,
			Name: "无",
			ParentId: 0,
			Status: 2,
		}
		this.treeData_.unshift(arr);
		console.log(this.treeData_)
      },
  },
  methods: {
      cancelSubmit () {
		this.form={
		      Id:'0',
		      Name: '',
		      ParentId: "0",
		      IsDel: '0',
		      Desc: '',
		      Status: '2',
		      CreatedUser: "",
		  }
          this.$emit('closeMask', false)
      },
      submitData () {
		  this.$refs.form.validate((valid)=>{
		    if(valid){ 
		  	  this.form.CreatedUser = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
		  	  this.form.ParentID = this.form.ParentID_
		  	  if(this.form.ParentID == -1){
		  	  			  this.form.ParentID=0;
		  	  }
		  	  this.$emit('addMateria', this.form)
		    }
		  })
      }
  },
}
</script>
<style>
.group .el-input{
	width: 308px!important;
}
</style>