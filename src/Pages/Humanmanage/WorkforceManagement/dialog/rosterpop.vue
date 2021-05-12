<template>
	<div>
		<el-dialog :title="formtype==1?'新增覆盖职员':'编辑覆盖职员'" @close='cancel' width='560px' :visible.sync="dialogFormVisible">
			<div class="tree_body EditCMBox">
				<tree-transfer :title="title" :from_data='data2' :to_data='toDatas' :defaultProps="{label:'Name',children:'Children'}" :id="Id" :pid="PId" @addBtn='add'
				 @removeBtn='remove' :mode='mode' height='540px' filter openAll>

				</tree-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import treeTransfer from 'el-tree-transfer' // 引入
	var that
	export default {
		data() {
			return {
				Id:"Id",
				PId:'PId',
				title: ["考勤人员", "已选择"],
				mode: "addressList", // transfer addressList
				dialogFormVisible: false,
				formtype: 1,
				formLabelWidth: '80px',
				defaultProps: {
					children: 'Children',
					label: 'Name'
				},
				data2: [],
				treedata: [],
				toDatas: [],
				form: {
					name: '',
					region: '',
				}
			}
		},
		created() {
			// this.getlistdata()
			that = this;
		},
		watch: {},
		methods: {
			checkchange(data, e, q) {
				console.log(data, e, q);
			},
			cancel() {
				this.data2 = [];
				this.dialogFormVisible = false
			},
			setkeystwo(arr) {
				if (arr.length) {
					setTimeout(() => {
						that.$refs.tree2.setCheckedKeys(arr);
					}, 10)
				}
			},
			commit() {
				// this.dialogFormVisible=false
				let data = this.$refs.tree2.getCheckedKeys()
				let dataarr = [];
				if (data.length) {
					data.forEach((item, index, arr) => {
						if (item) {
							dataarr.push(item);
						}
					});
				}
				this.$parent.setkey(dataarr);
				this.cancel();
				console.log(dataarr);
			},
			// 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList


			// 监听穿梭框组件添加

			add(fromData, toData, obj) {

				// 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象

				// 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
				this.toDatas = fromData;
				console.log("fromData:", fromData);
				alert(JSON.stringify(this.toDatas))
				console.log("toData:", toData);

				console.log("obj:", obj);

			},

			// 监听穿梭框组件移除

			remove(fromData, toData, obj) {

				// 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象

				// 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表

				console.log("fromData:", fromData);
				console.log("toData:", toData);

				console.log("obj:", obj);

			}
		},
		components:{
			treeTransfer 
		}
	}
</script>

<style lang="less" scoped>
	.tree_body {
		max-height: 50vh;
		overflow-y: scroll;
	}
</style>
