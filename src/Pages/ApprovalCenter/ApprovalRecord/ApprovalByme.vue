<template>
	<div id="ApprovalByme">
		<div class="content">
			<pageTop :title="title"></pageTop>
			<div class="operation">
				<!-- <el-input placeholder="搜索" suffix-icon="el-icon-search">
				</el-input> -->
				<div class="inputs">
					<!-- <div class="check" >
						<el-input v-model="input_one" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
						</el-input>
						<i class="iconfont icon-sousuo" @click="sendinput"></i>
					</div> -->
				</div>
			</div>
			<!--       表格-->
			<template>
				<el-table v-loading="loading" element-loading-text="加载更多" element-loading-spinner="el-icon-loading"
				 element-loading-background="rgba(0, 0, 0, 0.8)" ref="table" height="75%" :data="tableData" style="width: 100%;"
				 :header-cell-style="{background:'rgba(240,247,251,1)',borderRadius:'2px 2px 0px 0px',color:'#5C87A4'}">
					<el-table-column label="流程编号" min-width="20%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.ProcessNum }}</span>
						</template>
					</el-table-column>
					<el-table-column label="流程名称" min-width="20%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.ProcessName }}</span>
						</template>
					</el-table-column>
					<el-table-column label="描述" min-width="40%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.Describe }}</span>
						</template>
					</el-table-column>
					<el-table-column prop label="操作" min-width="20%" align="center">
						<template slot-scope="scope">
							<div class="setButton" @click="showOrder(scope.row)">
								<i class="el-icon-edit"></i><span class="setText">查看</span>
							</div>
							<div class="setButton" @click="setOrder(scope.row)">
								<i class="el-icon-edit"></i><span class="setText">设置</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<!--       弹窗-->
			<el-dialog :visible.sync="dialogFormVisible" width="57%" :showClose="false" @close="closeDialog">
				<div class="dialogContentWrap">
					<div class="dialogContent">
						<div class="dialogTitle">
							<div class="name">审批节点设置</div>
							<div class="closeIcon"><i class="el-icon-close" @click="closeDialog"></i></div>
						</div>
						<div class="orderType">
							<div>
								<div>流程编号：{{ProcessNum}}</div>
								<div>流程名称：{{ProcessName}}</div>
							</div>
							<div class="addButton" @click="addRules" v-if="this.dialogFormVisibleType == 1"><i class="el-icon-plus"></i></div>
						</div>
						<div class="formWrap">
							<el-table :data="listData" style="width: 100%;height:450px;overflow-y: auto;" row-key="ID" id="formWrapTable2">
								<el-table-column label="节点类型" width="100" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.Stype==0">直属部门</span>
										<span v-if="scope.row.Stype==1">指定部门</span>
									</template>
								</el-table-column>
								<el-table-column label="审批员工类型" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.StaffStype==0">部门负责人</span>
										<span v-if="scope.row.StaffStype==1">各级负责人</span>
										<span v-if="scope.row.StaffStype==2">特定人员</span>
										<span v-if="scope.row.StaffStype==''">未知</span>
									</template>
								</el-table-column>
								<el-table-column label="部门" width="100" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.DepName==''">未指定</span>
										<span v-else>{{scope.row.DepName}}</span>
									</template>
								</el-table-column>
								<el-table-column label="审批员工" width="180" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.StaffName==''">未指定</span>
										<span v-else>{{scope.row.StaffName}}</span>
									</template>
								</el-table-column>
								<el-table-column label="排序" width="100" align="center">
									<template slot-scope="scope">
										<span>{{ scope.row.Order }}</span>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="180" v-if="this.dialogFormVisibleType == 1">
									<template slot-scope="scope">
										<span v-if="scope.row.Isdel==1">已删除</span>
										<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.Isdel==0"><i class="iconfont icon-iconbianji"></i>编辑</el-button>
										<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.Isdel==0"><i
											 class="iconfont icon-iconshanchu"></i>删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<div class="dialogFooter" v-if="this.dialogFormVisibleType == 1">
						<button @click="sendData"><span>保存</span></button>
					</div>
				</div>
			</el-dialog>

			<!-- 添加单号规则弹框 -->

			<el-dialog :visible.sync="dialogFormVisible2" id="el-dialog2" width="30%" height="200px" :showClose="false" @close="closeDialog2">
				<div class="dialogTitle">
					<div class="name">编辑节点</div>
					<div class="closeIcon"><i class="el-icon-close" @click="closeDialog2"></i></div>
				</div>
				<div class="dialogContentWrap" id="ruleDialogContentWrap">
					<div class="dialogContent" style="padding: 20px 70px;box-sizing: border-box;">
						<el-form label-width="100px" width="100%">
							<el-form-item label="节点类型:" width="220px">
								<el-select v-model="ruleData.Stype" placeholder="请选择" @change="changeRoleType">
									<el-option v-for="item in StypeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="审批员工类型:" width="220px">
								<el-select v-model="ruleData.StaffStype" placeholder="请选择" @change="changeStaffStype">
									<el-option v-for="item in CycleOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="部门:" width="220px" v-if="ruleData.Stype =='1'">
								<el-cascader 
								ref="myCascader"
								placeholder="选择部门" 
								v-model="ruleData.DepID" 
								@change="getStaffListData"
								:options="menus" 
								:props="optionProps" 
								:show-all-levels="false"
								 filterable 
								 cleartable 
								 style="width: 220px;">
								</el-cascader>
							</el-form-item>

							<el-form-item label="审批员工:" width="220px" v-if="ruleData.StaffStype =='2'&&ruleData.Stype =='1'">
								<el-select v-model="ruleData.StaffID" placeholder="请选择" width="220px" ref="myselection">
									<el-option v-for="item in StaffData" :key="item.Id" :label="item.Name" :value="item.Id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</div>
					<div class="dialogFooter">
						<button @click="saveRule"><span>保存</span></button>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Sortable from 'sortablejs'
	import pageTop from '@/components/pageTop.vue'
	export default {
		name: "ApprovalByme",
		data() {
			return {
				title: "审批定义",
				tableData: [], //表格数据
				loading: false,
				dialogFormVisible: false, //弹窗状态
				dialogFormVisible2: false,
				dialogFormVisibleType: 1, //1编辑  2查看
				dialogFormVisible2Type: 1, //1编辑  2添加
				listData: [],
				ProcessIDs: "",
				input_one:'',
				ProcessName: null, //单号名称
				ProcessNum: null, //单号标识
				StypeOptions: [{
					value: '0',
					label: '直属部门'
				}, {
					value: '1',
					label: '指定部门	'
				}],
				CycleOptions: [{
					value: '0',
					label: '部门负责人'
				}, {
					value: '1',
					label: '各级负责人'
				}, {
					value: '2',
					label: '特定人员'
				}],
				ruleData: {
					ID: "0",
					ProcessNum: "0",
					Order: "0",
					Stype: "0",
					StaffStype: "0",
					DepID: "0",
					DepName:"",
					StaffID: "0",
					StaffName:"",
					Isdel: "0",
				},
				menus: [],
				optionProps: {
					value: 'Id',
					label: 'Name',
					children: 'Children',
					checkStrictly: true,
					expandTrigger: 'hover',
					emitPath:false
				},
				StaffListData: {
				  "Status": '2',
				  "KeyWord": '',
				  "IsStop": '0',
				  "PageSize": 1000,
				  "PageIndex": 1
				},
				StaffData:[]
			};
		},
		methods: {


			// 搜索
			sendinput() {
			this.getList();
			},
			// 获取列表
			getList() {
				let obj = {
					SN: "ApprovalCenter",
					MN: "ApprovalProcessGetList",
					DataContent: {}
				}
				this.MIX_send(obj);
			},
			sendData() {
				let json = {
					MN: "ApprovalProcessEdit",
					SN: "ApprovalCenter",
					DataContent: {
						ProcessID: this.ProcessIDs,
						nodeList: this.listData,
					},
				};
				this.MIX_send(json);
			},
			
			//刷新
			Toreload() {
				this.$router.go(0);
			},
			//进入设置
		    setOrder(rowData) {
				
				
				console.log(rowData);
				this.dialogFormVisibleType = 1;
				this.dialogFormVisible = true;
				this.ProcessName = rowData.ProcessName;
				this.ProcessNum = rowData.ProcessNum;
				this.ProcessIDs = rowData.ProcessID;
				this.getApprovalProcess(rowData.ProcessID);
				
			},
			showOrder(rowData) {
				this.dialogFormVisibleType = 2;
				this.dialogFormVisible = true;
				this.ProcessName = rowData.ProcessName;
				this.ProcessNum = rowData.ProcessNum;
				this.ProcessIDs = rowData.ProcessID;
				this.getApprovalProcess(rowData.ProcessID);
			},
			//获取节点
			getApprovalProcess(id) {
				let json = {
					MN: "ApprovalProcessGetInfo",
					SN: "ApprovalCenter",
					DataContent: {
						ProcessID: id
					}
				};
				this.MIX_send(json);
			},
			//数据过滤
			filterListData(data) {
				this.listData = [];
				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].Isdel && data[i].Isdel == 0) {
							this.listData.push(data[i]);
						}
					}
					this.rowDrop();
				}
			},
			//关闭弹窗
			closeDialog() {
				this.ProcessNum = null;
				this.ProcessName = null;
				this.listData = [];
				this.dialogFormVisible = false;
			},
			//关闭弹窗2
			closeDialog2() {
				this.ruleData = {
					ID: "0",
					ProcessNum: "0",
					Order: "0",
					Stype: "0",
					StaffStype: "0",
					DepID: "0",
					DepName:"",
					StaffID: "0",
					StaffName:"",
					Isdel: "0",
				};
				this.dialogFormVisible2 = false;
			},
			//新增节点
			addRules() {
				this.dialogFormVisible2Type = 2;
				this.dialogFormVisible2 = true;
			},
			//保存节点
			saveRule() {
				
				if (this.dialogFormVisible2Type == 1) {
					for (var i = 0; i < this.listData.length; i++) {
						if (this.listData[i].ID == this.ruleData.ID) {
							if (this.ruleData.Stype == 0 && this.ruleData.StaffStype == 2) {
								this.$message({
									type: 'error',
									message: "直属部门无法选择特定人员！"
								});
								return;
							} else {
								this.$set(this.listData, i, this.ruleData);
							}
						}
					}
					console.log(this.listData);
				} else {
					if (this.ruleData.Stype == 0) {
						// this.$message({
						// 	type: 'error',
						// 	message: "直属部门无法选择特定人员！"
						// });
						// return;
						this.ruleData.ProcessNum = this.ProcessNum;
						this.ruleData.Order = this.listData.length+1;//修改添加排序+1
						this.listData.push(this.ruleData);
					} 
					else if(this.ruleData.Stype !=0 && this.ruleData.StaffStype!= 2){
						let DepName=this.$refs['myCascader'].getCheckedNodes()[0].pathLabels[this.$refs['myCascader'].getCheckedNodes()[0].pathLabels.length-1];
						this.ruleData.DepName=DepName;
						this.ruleData.ProcessNum = this.ProcessNum;
						this.ruleData.Order = this.listData.length+1;//修改添加排序+1
						this.listData.push(this.ruleData);
					}else if(this.ruleData.Stype != 0 && this.ruleData.StaffStype==2){
						let DepName=this.$refs['myCascader'].getCheckedNodes()[0].pathLabels[this.$refs['myCascader'].getCheckedNodes()[0].pathLabels.length-1];
						this.ruleData.DepName=DepName;
						this.ruleData.ProcessNum = this.ProcessNum;
						let StaffName=this.$refs['myselection'].selectedLabel;
						this.ruleData.StaffName=StaffName;
						this.ruleData.Order = this.listData.length+1;//修改添加排序+1
						this.listData.push(this.ruleData);
						console.log(StaffName);
					}
					console.log(this.listData);
				}
				this.ruleData = {
					ID: "0",
					ProcessNum: "0",
					Order: "0",
					Stype: "0",
					StaffStype: "0",
					DepID: "0",
					DepName:"",
					StaffID: "0",
					StaffName:"",
					Isdel: "0",
				};
				this.dialogFormVisible2 = false;
			},
			handleEdit(index, row) {
				this.dialogFormVisible2Type = 1;
				let rowData = JSON.stringify(row);
				this.ruleData = JSON.parse(rowData);
				this.dialogFormVisible2 = true;
			},
			handleDelete(index, row) {
				row.Isdel = 1;
				for (var i = 0; i < this.listData.length; i++) {
					if (this.listData[i].ID == row.ID) {
						this.$set(this.listData, i, row);
						this.orderBy();
					}
				}
			},
			changeRoleType() {
				this.ruleData.DepID = "0";
				this.ruleData.StaffID = "0";
			},
			changeStaffStype(){
				this.ruleData.DepID = "0";
				this.ruleData.StaffID = "0";
			},
			//行拖拽
			rowDrop() {
				const tbody = document.querySelector('#formWrapTable2 .el-table__body-wrapper tbody')
				const _this = this
				Sortable.create(tbody, {
					onEnd({
						newIndex,
						oldIndex
					}) {
						const currRow = _this.listData.splice(oldIndex, 1)[0]
						_this.listData.splice(newIndex, 0, currRow)
						_this.orderBy();
					}
				})
			},
			//重新排序
			orderBy() {
				const _this = this
				let j = 1;
				for (var i = 0; i < _this.listData.length; i++) {
					if (_this.listData[i].Isdel == 0) {
						_this.listData[i].Order = j;
						_this.$set(_this.listData, i, _this.listData[i]);
						j++;
					}
				}
			},
			removechild(data) {
				data.forEach((item, index) => {
					if (item.Children && item.Children.length > 0) {
						this.removechild(item.Children);
					} else {
						delete item.Children;
					}
				});
				return data;
			},
			//获取组织树数据
			getOrganizationTree() {
			  let objor = {
				"SN":"Organization",
			    "MN": "QueryOrganizationTree",
			    "RequestId": 1,
			    "UserId": 1,
			    "DataContent": {}
			  }
			  this.MIX_send(objor);
			},
			//根据部门ID获取当前部门下的员工；
			getStaffListData() {
			
			this.ruleData.StaffID="0";
			  let obj = {
				"SN":"Organization",
			    "MN": "QueryStaff",
			    "RequestId": 1,
			    "UserId": 1,
				"OrganizationId":this.ruleData.StaffID,
			    "DataContent": this.StaffListData
			  }
			  this.MIX_send(obj);
			},
		},
		mounted() {
			
			// 滚动懒加载
			this.dom = this.$refs.table.bodyWrapper;
			this.dom.addEventListener('scroll', () => {
				// 滚动距离
				let scrollTop = this.dom.scrollTop
				// 变量windowHeight是可视区的高度
				let windowHeight = this.dom.clientHeight || this.dom.clientHeight
				// 变量scrollHeight是滚动条的总高度
				let scrollHeight = this.dom.scrollHeight || this.dom.scrollHeight
				if (scrollTop + windowHeight + 1 > scrollHeight) {
					// this.loading=true;
					// 分页？
					// this.getList()
				}
			})
		},
		watch: {
			// 流程列表
			"$store.state.ApprovalCenter.ApprovalProcessGetList": function(data) {
				if (data.ReturnData.Data.length > 0) {
					let dataList = data.ReturnData.Data;
					this.tableData = (this.tableData).concat(dataList)
				}
			},
			// 单个流程
			"$store.state.ApprovalCenter.ApprovalProcessGetInfo": function(data) {
				if (data.ReturnData.NodeList.length > 0) {
					this.filterListData(data.ReturnData.NodeList);
				}
			},
			//获取组织树
			"$store.state.Humanmanage.QueryOrganizationTree": function(data) {
				let DataContent = data.ReturnData.DataCount;
				this.menus = data.ReturnData;
				this.menus = this.removechild(this.menus);
				console.log(this.menus);
			},
			//根据部门ID获取员工
			"$store.state.Humanmanage.QueryStaff": function (data) {
				this.StaffData = [];
				this.StaffData = data.ReturnData.Data;
			},
			// 新增规则
			"$store.state.ApprovalCenter.ApprovalProcessEdit": function(data) {
				console.log(data, 55555)
				this.$message({
					type: 'success',
					message: data.Message
				});
				this.dialogFormVisible = false;
				this.tableData = [];
				this.getList();
			}
		},
		components: {
			pageTop
		},
		async created() {
			// 获取数据
			await this.getList();
			await this.getOrganizationTree();
		}
	};
</script>

<style scoped>
	#ApprovalByme {
		position: relative;
		height: 95%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.inputs {
		height: 40px;
		display: flex;
		justify-content: space-between;
	}
	.inputs > div {
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.check {
		width: 274px;
		height: 38px !important;
		border: 1px solid rgba(90%, 90%, 90%, .5);
		position: relative;
	}
    .check > input {
		height: 38px;
		border: none;
		line-height: 40px;
		width: 250px;
		border: 1px solid gray;
	}
	.check > i {
		position: absolute;
		right: 20px;
		color: #5C87A4;
	}
	.content {
		width: 100%;
		height: 100%;
		background: #fff;
		padding: 20px;
		/*overflow-y: scroll;*/
	}

	.content>div {
		width: 100% !important;
		margin: 0 auto;
	}

	.contentTitle {
		width: 96%;
		height: 7%;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.titleName {
		display: inline-flex;
		height: 100%;
		align-items: center;
		color: #4D6474;

	}

	.operation {
		width: 18%;
		height: 9%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.el-icon-edit,
	.setText {
		color: #0060A0;
	}

	.el-table .cell span {
		margin: 0 !important;
	}

	.icon-shuaxin:before {
		color: rgba(92, 135, 164, 1);
	}

	.el-input.el-input--suffix {
		height: 44%;
		width: 18%;
		background: rgba(255, 255, 255, 1);
		border-radius: 2px;
		border: 1px solid rgba(221, 228, 241, 1);
	}

	.setButton {
		cursor: pointer;
		display: inline-block;
		margin: 0 5px;
	}

	.dialogTitle {
		display: flex;
		align-content: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		padding-bottom: 2%;
	}

	.closeIcon {
		cursor: pointer;
	}

	.orderType {
		margin-top: 3%;
		display: flex;
		justify-content: space-between;
	}

	.orderType>div:first-child {
		display: flex;
		width: 50%;
		justify-content: space-between;
	}

	.addButton {
		background-color: #0060A0;
		width: 3%;
		padding: 3% 0 0;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.addButton i {
		position: absolute;
		top: 0;
		margin: auto;
		bottom: 0;
		display: flex;
		align-items: center;
	}

	.formRow {
		margin-top: 3%;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.formRow>div {
		display: flex;
		align-items: center;
	}

	.dialogFooter {
		position: absolute;
		bottom: 4%;
		display: flex;
		/* width: 100%; */
		left: 5%;
		right: 5%;
		margin: auto;
		justify-content: flex-end;
	}

	.dialogFooter button {
		background-color: #0060A0;
		width: 9%;
		padding-top: 4.5%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border: none;
		outline: none;
		cursor: pointer;
	}

	.dialogFooter span {
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 0;
		/* display: inline-block; */
		display: flex;
		align-items: center;
	}

	.dialogContentWrap {
		color: #4D6474;
		
	}

	.formWrap button {
		border: none;
		background: none;
		color: #0060A0;
	}

	.formWrap {
		margin-top: 20px;
	}

	.formWrap th {
		color: #0060A0;
	}

	.el-select {
		width: 220px;
		margin: 0 auto;
	}

	#ruleDialogContentWrap .el-form-item {
		margin: 20px 0;
		width: 220px;
	}
</style>
<style lang="less">
	#ApprovalByme {
		.operation {
			.el-input__inner {
				font-size: 92%;
				height: 100% !important;
				border: none;
				color: #5C87A4;
			}

			.el-input__suffix {
				display: flex;
				align-items: center;
			}
		}

		input::-webkit-input-placeholder {
			/* WebKit browsers */
			color: #5C87A4;
		}

		input:-moz-placeholder {
			/* Mozilla Firefox 4 to 18 */
			color: #5C87A4;
		}

		input::-moz-placeholder {
			/* Mozilla Firefox 19+ */
			color: #5C87A4;
		}

		input:-ms-input-placeholder {
			/* Internet Explorer 10+ */
			color: #5C87A4;
		}

		.el-icon-search:before {
			color: #5C87A4;
		}

		.el-loading-mask {
			top: 94%;
			background-color: rgba(0, 0, 0, 0) !important;
		}

		.el-loading-spinner {
			height: 100%;
			top: 0;
			margin-top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.el-loading-spinner i,
		.el-loading-spinner .el-loading-text {
			color: #92B3C9;
		}

		.el-dialog__body {
			padding: 2% 5%;
		}

		.el-dialog__header {
			padding: 0;
		}

		.addButton {
			cursor: pointer;

			.el-icon-plus:before {
				content: "\E6D9";
				color: white;
			}
		}

		.el-form-item {
			margin-bottom: 0;
			margin-right: 4%;
			margin-left: 2%;
			width: 22%;
		}

		.formRow .el-form-item:first-child {
			margin-left: 0;
		}

		.resetType.el-form-item,
		.runLength.el-form-item {
			width: 15%;
		}

		.el-dialog {
			height: 72%;
		}

		#el-dialog2 .el-dialog {
			height: 370px !important;
		}
	}
</style>
