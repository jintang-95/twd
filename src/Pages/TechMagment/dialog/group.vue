<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增技术分类' : '编辑技术分类'"
    :visible.sync="show"
    width="460px"
    center>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="分类名称:" label-position="left" prop="TypeName">
                <el-input v-model="form.TypeName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="所属分类:">
				<el-cascader
					class="group"
					v-model="form.ParentID_" 
					placeholder="请选择所属分类"
				    :options="treeData_"
				    :props="{ checkStrictly: true,value:'Id',label:'Name',children:'Children',emitPath:false}"
				    clearable></el-cascader>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input type="textarea" v-model="form.Desc" placeholder="请输入分类描述"></el-input>
            </el-form-item>
        </el-form>
		<span slot="footer" class="dialog-footer">
		    <el-button @click="cancelSubmit">取 消</el-button>
		    <el-button type="primary" @click="submitData">确 定</el-button>
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
            Id: '0',
            Name: '',
			TypeName:"",
            ParentID: 0,
            IsDel: '0',
            Desc: '',
            Status: '2',
            CreatedUser: "",
        },
		treeData_:[],
		 rules: {
		          TypeName: [
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
		this.form.ParentID_ =Number(this.form.ParentID);
      },
	  treeData(newVal, oldVal) {
        this.treeData_ = JSON.parse(JSON.stringify(newVal));
		let arr = {
			Id: -1,
			IsDel: 0,
			Name: "无",
			ParentID: 0,
			ParentName: "",
		}
		this.treeData_.unshift(arr);
      },
  },
  methods: {
      cancelSubmit () {
		this.form={
		      Id:'0',
		      Name: '',
			  TypeName:"",
		      ParentID: "0",
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
				  this.form.Name = this.form.TypeName;
				  this.form.ParentId = this.form.ParentID_;
				  if(this.form.ParentId == -1){
				  			this.form.ParentId=0;
				  }
				  delete this.form.ParentID;
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