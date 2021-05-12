<template>
	<!-- <div class='rightbox'> -->
	<div class="materiaType">
		<!-- <right-head
    ></right-head>-->
		<right-container @selectType="selectType" @pageSizeToggle="pageSizeToggle" @pageToggle="pageToggle" @pagePrev="pagePrev"
		 @pageNext="pageNext" @statusChange="statusChange" @inputChange="inputChange" @refreshPage="refreshPage" @addNew="addNew"
		 :page="page" :pageSize="pageSize" :total="total" :checkList="checkList" :process="process" :menuList="treeData"
		 title="全部供应商分类">
			<el-table :data="tableData" stripe header-row-class-name="headerClass" slot="table" align="center" cell-class-name="elliplise"
			 style="width: 100%">
				<el-table-column align="center" v-for="(item, index) in columns" :width="item.width" :prop="item.prop" :label="item.label"
				 :key="index"></el-table-column>
				<el-table-column label="状态" align="center" class-name="status-col" width="100">
					<template slot-scope="{row}">
						<div class="success" v-if="row.IsDel=='0'">
							<img src="../../../assets/images/img/green.png" alt /> 已启用
						</div>
						<div class="danger" v-if="row.IsDel=='1'||row.IsDel==''">
							<img src="../../../assets/images/img/red.png" alt /> 已停用
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.IsDel == '0'">
							<el-button type="text" size="small" style="margin-left: 0;" class="operationTtn" @click="showDetial(scope.row)">
								<img src="../../../assets/images/edit_icon.png" alt />
								<span>查看</span>
							</el-button>
							<el-button type="text" size="small" style="margin-left: 0;" class="operationTtn" @click="stop(scope.row)">
								<img src="../../../assets/images/stop_icon.png" alt />
								<span>停用</span>
							</el-button>
						</div>
						<div v-if="scope.row.IsDel == '1'||scope.row.IsDel==''">
							<el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
								<img src="../../../assets/images/edit_icon.png" alt />
								<span>编辑</span>
							</el-button>
							<el-button type="text" size="small" style="margin-left: 0;" class="operationTtn" @click="start(scope.row)">
								<img src="../../../assets/images/stop_icon.png" alt />
								<span>启用</span>
							</el-button>
							<el-popconfirm icon="el-icon-info" iconColor="red" title="确定删除吗？" @onConfirm="del(scope.row)">
								<el-button slot="reference" type="text" class="operationTtn" size="small">
									<img src="../../../assets/images/del_icon.png" alt />
									<span>删除</span>
								</el-button>
							</el-popconfirm>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</right-container>

		<Dialog :visible="showMask" :typeList="typeList" :formtype="formType" :title="Dialogtitle" :treeData='treeData' :formData="formData"
		 @closeMask="closeMask" @addMateria="addMateria"></Dialog>
	</div>
	<!-- </div> -->
</template>

<script>
	import RightContainer from "@/components/rightContainer.vue";
	import Dialog from "./dialog/profile.vue";
	import {
		treeToArray
	} from "@/util/util.js";
	import {
		mapGetters
	} from "vuex";
	import {
		Message
	} from 'element-ui';
	export default {
		name: "", 
		data() {
			return {
				Dialogtitle:"",
				pageSize: 10,
				page: 1,
				currentId: 0,
				total: 0,
				showMask: false,
				typeList: [],
				formData: {},
				formType: "1",
				process: ["Add", "check"],
				checkData: -1,
				lastData: [],
				keyWord: "",
				tableData: [],
				checkList: [{
						title: "全部状态",
						statu: -1,
					},
					{
						title: "启用",
						statu: 0,
					},
					{
						title: "停用",
						statu: 1,
					},

				],
				treeData: [],
				columns: [{
						label: "编号",
						prop: "No",
						width:"120px"
					},
					{
						label: "供应商名称",
						prop: "Name",
					},
					{
						label: "简称",
						prop: "Abbreviation",
						width:"150px"
					},
					{
						label: "等级",
						prop: "Grade",
						width:"100px"
					},
					{
						label: "所属分类",
						prop: "SupplierTypeName",
						width:"150px"
					},
					{
						label: "描述",
						prop: "Desc_",
					},
				],
				UserId: "",
				formData:{
					Id:"0",
					No:"0",
					Name:"",
					Grade:"0",
					SupplierGroupId:"0",
					Abbreviation:"",
					Province:'',
					City:'',
					Area:'',
					Address:'',
					FaxNumber:'',
					AccountBank:'',
					AccountOpening:'',
					CorporateTaxNumber:'',
					Desc:'',
					CreatedUser:'',
					IsDel:'0',
				}
			};
		},
		async created() {
			await this.getTreeData();
			this.UserId = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
			this.getTableData();
		},
		computed: {
			...mapGetters([
				"GetListSupplierGroupTree",
				"GetListSupplier",
				"DelSupplier",
				"SaveSupplierBatch",
				"GetSingleSupplier",
			]),
		},
		watch: {
			GetListSupplierGroupTree: {
				handler(newValue, oldValue) {
					// console.log(11111,newValue,oldValue);
					if (newValue.Code === 0) {
						this.treeData = this.removechild(newValue.ReturnData.Data);
						this.lastData = newValue.ReturnData.Data;
						this.typeList = treeToArray(newValue.ReturnData.Data, []);
					} else {
						// 失败
					}
				},
				immediate: true,
				deep: true,
			},

			GetListSupplier: {
				handler(newValue, oldValue) {
					if (newValue.Code === 0) {
						this.tableData = newValue.ReturnData.Data;
						this.total = newValue.ReturnData.DataCount;
						for(var index in this.tableData){
							if(this.tableData[index].Desc==""||!this.tableData[index].Desc){
								this.tableData[index].Desc_="未添加描述";
							}
							else{
								this.tableData[index].Desc_=this.tableData[index].Desc;
							}
						}
					} else {
						// 失败
					}
				},
				immediate: true,
				deep: true,
			},
			async DelSupplier(newValue, oldValue) {
				if (newValue.Code === 0) {
					this.$message({
						showClose: true,
						message: "操作成功",
						type: "success",
					});
					await this.getTableData();
				} else {
					// 失败
					this.$message({
						showClose: true,
						message: "失败",
						type: "fail",
					});
				}
			},
			async SaveSupplierBatch(newValue, oldValue) {
				// alert(JSON.stringify(newValue));
				if (newValue.Code === 0) {
					this.$message({
						showClose: true,
						message: "保存成功",
						type: 'success'
					});
					// this.formData={}
					await this.getTableData()
					this.getTreeData()
					this.showMask = false
				} else {
					// 失败
					this.$message({
						showClose: true,
						message: newValue.Message,
						type: 'fail'
					});
				}
			},

			GetSingleSupplier: {
				handler(newValue, oldValue) {
					if (newValue.Code === 0) {
						console.log(newValue, oldValue)
						this.formData = JSON.parse(JSON.stringify(newValue.ReturnData));
					} else {

						// 失败
					}
				},
				immediate: true,
				deep: true,
			},
		},
		methods: {
			relod() {
				this.getTableData();
			},
			selectType(data) {
				this.currentId = data;
				// this.treeData = []
				this.treeData = this.lastData;
				this.getTableData();
			},
			// 获取树形结构数据
			getTreeData() {
				let json = {
					SN: "Purchase",
					MN: "GetListSupplierGroupTree",
					DataContent: {
						// "IsAssets": '1'
						IsDel: -1,
					},
				};
				this.MIX_send(json);
			},
			// 获取表格数据
			getTableData() {
				let json = {
					SN: 'Purchase',
					MN: "GetListSupplier",
					DataContent: {
						"TypeId": this.currentId,
						"IsDel": this.checkData,
						"KeyWord": this.keyWord,
						"PageSize": this.pageSize,
						"PageIndex": this.page
					}
				};
				this.MIX_send(json);
			},
			// 停用
			stopMateria(id) {
				let json = {
					SN: "Purchase",
					MN: "DelSupplier",
					DataContent: {
						Id: id,
						IsDel: "1",
						UserId: this.UserId,
					},
				};
				this.MIX_send(json);
			},
			// 启用
			startMateria(id) {
				let json = {
					SN: "Purchase",
					MN: "DelSupplier",
					DataContent: {
						Id: id,
						IsDel: "0",
						UserId: this.UserId,
					},
				};
				this.MIX_send(json);
			},

			// 新增/编辑供应商
			addMateriaType(data) {
				let json = {
					SN: "Purchase",
					MN: "SaveSupplierBatch",
					DataContent: data,
				};
				this.MIX_send(json);
			},
			// 页面Size切换
			pageSizeToggle(data) {
				this.pageSize = pageSize;
				this.getTableData();
			},
			// 页面切换
			pageToggle(data) {
				this.page = data;
				this.getTableData();
			},
			// 上一页回调
			pagePrev(data) {
				this.page = data;
				this.getTableData();
			},
			// 下一页回调
			pageNext(data) {
				this.page = data;
				this.getTableData();
			},
			// 顶部复选框过滤
			statusChange(data) {
				this.checkData = data;
				this.getTableData();
			},
			// 输入框回车键
			inputChange(data) {
				this.keyWord = data;
				console.log(data);
				this.getTableData();
			},
			// 刷新回调
			async refreshPage() {
				await this.getTreeData();
				this.getTableData();
			},
			/**
			 * 表格处理函数
			 * */
			// 编辑
			edit(row) {
				this.formType = "2";
				this.showMask = true
				this.Dialogtitle="编辑供应商档案";
				let json = {
					SN: "Purchase",
					MN: "GetSingleSupplier",
					DataContent: {
						Id: row.Id,
					},
				};
				this.MIX_send(json);
			},
			//查看
			showDetial(row){
				this.formType = "3";
				this.showMask = true
				this.Dialogtitle="查看供应商档案";
				let json = {
					SN: "Purchase",
					MN: "GetSingleSupplier",
					DataContent: {
						Id: row.Id,
					},
				};
				this.MIX_send(json);
			},
			// 停用
			stop(row) {
				this.stopMateria(row.Id);
			},
			// 删除
			del(row) {
				this.removeMateria(row.Id);
			},
			// 启用
			start(row) {
				this.startMateria(row.Id);
			},
			// 清除
			clear(row) {},
			// 新增
			addNew() {
				this.formType = "1";
				this.showMask = true;
				this.Dialogtitle="新增供应商档案";
				this.formData = {
					Id:"0",
					No:"",
					Name:"",
					Grade:"0",
					SupplierGroupId:[0],
					Abbreviation:"",
					Province:'',
					City:'',
					Area:'',
					Address:'',
					FaxNumber:'',
					AccountBank:'',
					AccountOpening:'',
					CorporateTaxNumber:'',
					Desc:'',
					CreatedUser:'',
					IsDel:'0',
				}
			},
			// 取消新增或者取消编辑
			closeMask(data) {
				this.showMask = false;
			},
			// 新增或者编辑
			addMateria(data) {
				this.addMateriaType(data);
			},
			removechild(data){
			  data.forEach((item,index) => {
			    if (item.Children && item.Children.length > 0) {
			      this.removechild(item.Children);
			    } else {
			      delete item.Children;
			    }
			  });
			  return data;
			}
		},
		components: {
			RightContainer,
			Dialog,
		},
	};
</script>

<style scoped lang="less">
	.rightbox {
		height: 100%;
		width: 100%;
		padding: 100px 20px 20px 20px;
		// background: rosybrown;
	}

	.processBtn {
		display: flex;
	}

	.line {
		margin: 0 10px;
		height: 12px;
		width: 0px;
		border-left: 1px solid #d4def3;
	}

	.el-button--text {
		color: #0060a0;
		font-size: 14px;
	}

	.el-button--text img {
		display: inline-block;
		margin-right: 5px;
		width: 13px;
	}

	.el-tag img {
		display: inline-block;
		margin-right: 5px;
	}

	.materiaType {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #fff;
		border-radius: 5px;
		padding: 0 1.1875rem;
		box-sizing: border-box;
	}

	.success {
		color: #8cd16b;
	}

	.danger {
		color: #f56262;
	}

	.danger img {
		display: inline-block;
		margin-right: 5px;
	}

	.success img {
		display: inline-block;
		margin-right: 5px;
	}

	.el-select {
		width: 220px;
	}
</style>
