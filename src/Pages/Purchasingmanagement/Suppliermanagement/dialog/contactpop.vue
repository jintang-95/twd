<template>
	<div>
		<el-dialog :title="formtype==1?'新增联系人':'编辑联系人'" width='460px' :visible.sync="dialogFormVisible">
			<el-form :model="formData" ref="form" label-position='left' :rules='rules'>
				<el-form-item label="职务" :label-width="formLabelWidth" prop="Duties">
					<el-input class="input_border_bottom" v-model="formData.Duties" placeholder="请输入职务" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" :label-width="formLabelWidth" prop="Name">
					<el-input class="input_border_bottom" v-model="formData.Name" placeholder="请输入姓名" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" :label-width="formLabelWidth" prop="Phone">
					<el-input class="input_border_bottom" v-model="formData.Phone" placeholder="请输入联系电话" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="负责事项" :label-width="formLabelWidth" prop="Matter">
					<el-input class="input_border_bottom" v-model="formData.Matter" placeholder="请输入负责事项" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisible: false,
				formtype: 1,
				formLabelWidth: '80px',
				form: {

				},
				formData: {

				},
				rules: {
					Duties: [{
						required: true,
						message: '请输入职务',
						trigger: 'blur'
					}, ],
					Name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}, ],
					Phone: [{
						required: true,
						message: '请输入联系电话',
						trigger: 'blur'
					}, ],
					Matter: [{
						required: true,
						message: '请输入负责事项',
						trigger: 'blur'
					}, ],
				}
			}
		},
		watch: {
			form: function(data) {
				this.formData = JSON.parse(data);
			}
		},
		methods: {
			commit() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$emit("dataSubmit", this.formData);
						this.formData = {};
						this.dialogFormVisible = false
					}
				})
			},
			close() {
				this.formData = {};
				this.dialogFormVisible = false
			}
		},
	}
</script>

<style lang="less" scoped>

</style>
