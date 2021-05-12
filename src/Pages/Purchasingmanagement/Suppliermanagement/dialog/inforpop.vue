<template>
	<div>
		<el-dialog :title="formtype==1?'新增扩展信息':'编辑扩展信息'" width='460px' :visible.sync="dialogFormVisible">
			<el-form :model="formData" ref='form' label-position='left' :rules='rules'>
				<el-form-item label="拓展属性名" :label-width="formLabelWidth" prop="Name">
					<el-input class="input_border_bottom" v-model="formData.Name" placeholder="请输入属性名" :validate-event="false"></el-input>
				</el-form-item>
				<el-form-item label="拓展属性值" :label-width="formLabelWidth" prop="Attribute">
					<el-input class="input_border_bottom" v-model="formData.Attribute" placeholder="请输入属性值" :validate-event="false"></el-input>
				</el-form-item>
				<el-form-item label="拓展内容" :label-width="formLabelWidth" prop="Info">
					<el-input class="textarea_border_bottom" v-model="formData.Info" placeholder="请输入备注" type="textarea" auto-complete="off"></el-input>
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
				dialogFormVisible: false,
				formtype: 1,
				formLabelWidth: '100px',
				form: {

				},
				formData: {

				},
				rules: {
					Name: [{
						required: true,
						message: '请输入属性名',
					}],
					Attribute: [{
						required: true,
						message: '请输入属性值',
					}],
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
