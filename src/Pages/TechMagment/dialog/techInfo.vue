<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增技术' : '编辑技术'"
    :visible.sync="show"
    width="50%"
    center>
        <el-form ref="form" :model="form" label-width="120px" id="tech" :rules="rules">
            <el-form-item label="标题:" label-position="left" prop = "Title">
                <el-input v-model="form.Title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="所属分类:" prop = "TypeId">
				<el-cascader
					class="group"
					v-model="form.TypeId" 
					placeholder="请选择所属分类"
				    :options="treeData"
				    :props="{ checkStrictly: true,value:'Id',label:'Name',children:'Children',emitPath:false}"
				    clearable></el-cascader>
            </el-form-item>
			<el-row>
			  <el-col :span="12">
				  <el-form-item label="周期:" label-position="left">
				      <el-input v-model="form.Cycle" placeholder="请输入周期"></el-input>
				  </el-form-item>
			  </el-col>
			  <el-col :span="12">
				  <el-form-item label="周期单位:" label-position="left" >
				      <el-radio-group v-model="form.CycleUnit">
				        <el-radio :label="0">无</el-radio>
				        <el-radio :label="1">年</el-radio>
						<el-radio :label="2">月</el-radio>
						<el-radio :label="3">天</el-radio>
				      </el-radio-group>
				  </el-form-item>
			  </el-col>
			</el-row>
			<el-row>
			  <el-col :span="12">
				  <el-form-item label="是否关联设备:" label-position="left">
				      <template>
				        <el-radio v-model="isEquip" label="1">否</el-radio>
				        <el-radio v-model="isEquip" label="2">是</el-radio>
				      </template>
				  </el-form-item>
			  </el-col>
			  <el-col :span="12">
				  <el-form-item label="关联设备:" label-position="left" v-if="isEquip=='2'">
				      <el-input v-model="form.DeviceName" placeholder="请选择关联设备" @focus="choseDevice"></el-input>
				  </el-form-item>
			  </el-col>
			</el-row>
            <el-form-item label="内容:" prop = "Content">
                <quill-editor ref="myTextEditor" v-model="form.Content" @change="onEditorChange" :options="editorOption" style="height:300px;"></quill-editor>
            </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitData" style="background-color: rgb(0, 96, 160);">确 定</el-button>
    </span>
	
	<equipmentTable :visible="show2" @addMaterielTable="addDevice" @closePropMask="closePropMask" :check = "2"></equipmentTable>
	
	
    </el-dialog>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import equipmentTable from "@/components/equipmentTable.vue"
export default {
  name: 'application',
  data() {
    return {
		editorOption: {
		               placeholder: '编辑技术内容'
		             },
        show: false,
		show2: false,
		isEquip:"1",
        form: {
            Id:'0',
            TypeId:'0',
            TypeName:"",
            DeviceId: "0",
            DeviceName: '',
            Title: '',
            Cycle: '',
            CycleUnit: "0",
            Content:"",
            IsDel:"0",
        },
		rules: {
		         Title: [
		           { required: true, message: '请输入标题', trigger: 'blur' },
		         ],
		         TypeId: [
		            { required: true, message: '请选择所属分类', trigger: 'change' }
		         ],
				  Content: [
					{ required: true, message: '请输入内容:', trigger: 'blur' },
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
		// this.form.TypeId =[Number(this.form.TypeId)];
		this.form.CycleUnit = Number(this.form.CycleUnit);
		if(this.form.DeviceId=="0"){
			this.isEquip= "1";
		}
		else{
			this.isEquip= "2";
		}
      }
  },
  methods: {
      cancelSubmit () {
		this.form={
		      Id:'0',
		      TypeId:'0',
		      TypeName:"",
		      DeviceId: "0",
		      DeviceName: '',
		      Title: '',
		      Cycle: '',
		      CycleUnit: "",
		      Content:"",
		      IsDel:"0"
		  }
          this.$emit('closeMask', false)
      },
      submitData () {
		  this.$refs.form.validate((valid)=>{
			  if(valid){ 
				  this.form.CreatedUser = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
				  this.$emit('addMateria', this.form)
			  }
		  })
      },
	  onEditorChange({ editor, html, text }) {
		  this.form.Content = html;
	  },
	  choseDevice(){
		  this.show2 = true;
	  },
	  addDevice(data){
		  let newData = JSON.parse(JSON.stringify(data))
			this.form.DeviceId = newData.Id;
			this.form.DeviceName = newData.DeviceName;
	  },
	  closePropMask(){
		  this.show2 = false;
	  }
  },
  components: {
      quillEditor,
	  equipmentTable
    }
}
</script>
<style>

#tech .el-cascader{
	width: 100%!important;
}
#tech .el-dialog__footer{
	text-align: right;
}
.ql-container{
	height: calc(100% - 80px)!important;
}
</style>