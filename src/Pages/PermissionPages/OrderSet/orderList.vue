<template>
	<div id="orderList">
		<div class="content">
			<pageTop :title="title"></pageTop>
			<div class="operation">
				<!-- <el-input placeholder="搜索" suffix-icon="el-icon-search">
				</el-input> -->
			</div>
			<!--       表格-->
			<template>
				<el-table v-loading="loading" element-loading-text="加载更多" element-loading-spinner="el-icon-loading"
				 element-loading-background="rgba(0, 0, 0, 0.8)" ref="table" height="75%" :data="tableData" style="width: 100%;"
				 :header-cell-style="{background:'rgba(240,247,251,1)',borderRadius:'2px 2px 0px 0px',color:'#5C87A4'}">
					<el-table-column label="单据名称" min-width="15%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.BillName }}</span>
						</template>
					</el-table-column>
					<el-table-column label="单据标识" min-width="15%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.BillCode }}</span>
						</template>
					</el-table-column>
					<el-table-column label="出库单号设置" min-width="15%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.Desc }}</span>
						</template>
					</el-table-column>
					<el-table-column label="规则" min-width="40%" align="center">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.Norule }}</span>
						</template>
					</el-table-column>
					<el-table-column prop label="操作" min-width="15%" align="center">
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
							<div class="name">入库单 单号设置规则</div>
							<div class="closeIcon"><i class="el-icon-close" @click="closeDialog"></i></div>
						</div>
						<div class="orderType">
							<div>
								<div>单据名称：{{BillName}}</div>
								<div>单据标识：{{BillCode}}</div>
							</div>
							<div class="addButton" @click="addRules" v-if="this.dialogFormVisibleType == 1"><i class="el-icon-plus"></i></div>
						</div>
						<div class="formWrap">
							<el-table :data="listData" style="width: 100%" row-key="ID" id="formWrapTable">
								<el-table-column label="规则类型" width="180" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.RoleType==0">自定义规则</span>
										<span v-if="scope.row.RoleType==1">日期时间规则</span>
										<span v-if="scope.row.RoleType==2">流水号规则</span>
									</template>
								</el-table-column>
								<el-table-column label="规则内容" align="center">
									<template slot-scope="scope">
										<span v-if="scope.row.RoleType==0">{{ scope.row.RoleValue }}</span>
										<span v-if="scope.row.RoleType==1">{{ scope.row.RoleValue }}</span>
										<span v-if="scope.row.RoleType==2&&scope.row.Cycle==0">规则长度：{{ scope.row.RoleValue }}  清零规则：不清零</span>
										<span v-if="scope.row.RoleType==2&&scope.row.Cycle==1">规则长度：{{ scope.row.RoleValue }}  清零规则：按年</span>
										<span v-if="scope.row.RoleType==2&&scope.row.Cycle==2">规则长度：{{ scope.row.RoleValue }}  清零规则：按月</span>
										<span v-if="scope.row.RoleType==2&&scope.row.Cycle==3">规则长度：{{ scope.row.RoleValue }}  清零规则：按日</span>
									</template>
								</el-table-column>
								<el-table-column label="排序" width="180" align="center">
									<template slot-scope="scope">
										<span>{{ scope.row.RoleOrder }}</span>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="180" v-if="this.dialogFormVisibleType == 1">
									
									<template slot-scope="scope">
										<span v-if="scope.row.Isdel==1">已删除</span>
										<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.Isdel==0"><i class="iconfont icon-iconbianji"></i>编辑</el-button>
										<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.Isdel==0"><i class="iconfont icon-iconshanchu"></i>删除</el-button>
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
					<div class="name">编辑规则</div>
					<div class="closeIcon"><i class="el-icon-close" @click="closeDialog2"></i></div>
				</div>
				<div class="dialogContentWrap" id="ruleDialogContentWrap">
					<div class="dialogContent" style="padding: 20px 70px;box-sizing: border-box;">
						<el-form ref="form" :model="form" label-width="100px" width="100%" :rules="rules">
							<el-form-item label="规则类型:" width="220px">
								<el-select v-model="ruleData.RoleType" placeholder="请选择" @change="changeRoleType">
									<el-option v-for="item in ruleOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="规则内容:" v-if="ruleData.RoleType == 0" width="220px" prop="RoleValue">
								<el-input v-model="ruleData.RoleValue"></el-input>
							</el-form-item>
							<el-form-item label="选择范围:" v-if="ruleData.RoleType == 1" width="220px">
								<el-select v-model="ruleData.RoleValue" placeholder="请选择">
									<el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="流水号长度:" v-if="ruleData.RoleType == 2" width="220px">
								<el-input v-model="ruleData.RoleValue"></el-input>
							</el-form-item>
							<el-form-item label="清零规则:" v-if="ruleData.RoleType == 2" width="220px">
								<el-select v-model="ruleData.Cycle" placeholder="请选择" width="220px">
									<el-option v-for="item in CycleOptions" :key="item.value" :label="item.label" :value="item.value">
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
		name: "orderList",
		data() {
			return {
				rules:{
					RoleValue:[
		            { required: true, message: '请输入规则内容', trigger: 'blur' },
		          ],
				  RoleValue2:[
				    { required: true, message: '请选择范围', trigger: 'blur' },
				  ],
				  RoleValue3:[
				    { required: true, message: '请输入流水号长度', trigger: 'blur' },
				  ],
				  Cycle:[
		            { required: true, message: '选择清零规则', trigger: 'change' },
		          ],
				},
				title: "单号规则",
				tableData: [], //表格数据
				loading: false,
				dialogFormVisible: false, //弹窗状态
				dialogFormVisible2: false,
				dialogFormVisibleType: 1, //1编辑  2查看
				dialogFormVisible2Type: 1, //1编辑  2添加
				listData: [],
				BillIDs: "",
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				BillName: null, //单号名称
				BillCode: null, //单号标识
				ruleOptions: [{
					value: '0',
					label: '自定义规则'
				}, {
					value: '1',
					label: '日期时间规则'
				}, {
					value: '2',
					label: '流水号规则'
				}],
				CycleOptions: [{
					value: '0',
					label: '不清零'
				}, {
					value: '1',
					label: '按年'
				}, {
					value: '2',
					label: '按月'
				}, {
					value: '3',
					label: '按日'
				}],
				dateOptions: [{
					value: 'YYYY',
					label: 'YYYY(年)'
				}, {
					value: 'YYYYMM',
					label: 'YYYYMM(年月)'
				}, {
					value: 'YYYYMMDD',
					label: 'YYYYMMDD(年月日)'
				}, {
					value: 'HH',
					label: 'HH(小时)'
				}, {
					value: 'HHMM',
					label: 'HHMM(时分)'
				}, {
					value: 'HHMMSS',
					label: 'HHMMSS(时分秒)'
				}, {
					value: 'Week',
					label: 'Week(周2位)'
				}],
				ruleData: {
					ID: "0",
					BillID: "0",
					RoleType: "0",
					RoleValue: "",
					Cycle: "0",
					Isdel: "0",
					RoleOrder:"0"
				},

			};
		},
		methods: {
			// 获取列表
			getList() {
				let json = {
					MN: "BillTypeGetList",
					SN: "SystemSetting",
					DataContent: {

					}
				};
				this.MIX_send(json);
			},
			//保存数据
			sendData() {
				let json = {
					MN: "BillNoRoleSave",
					SN: "SystemSetting",
					DataContent: {
						BillID: this.BillIDs,
						Data: this.listData,
					},
				};
				this.MIX_send(json);
			},
			//刷新
			Toreload() {
				this.$router.go(0);
			},
			//进入设置
			async setOrder(rowData) {
				this.dialogFormVisibleType=1;
				this.dialogFormVisible = true;
				this.BillName = rowData.BillName;
				this.BillCode = rowData.BillCode;
				this.BillIDs = rowData.ID;
				this.getBillNoRoleByBillId(rowData.ID);
				await this.rowDrop();
			},
			showOrder(rowData){
				this.dialogFormVisibleType=2;
				this.dialogFormVisible = true;
				this.BillName = rowData.BillName;
				this.BillCode = rowData.BillCode;
				this.BillIDs = rowData.ID;
				this.getBillNoRoleByBillId(rowData.ID);
			},
			//获取类型
			getBillNoRoleByBillId(id) {
				let json = {
					MN: "BillNoRoleByBillId",
					SN: "SystemSetting",
					DataContent: {
						BillID: id
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
				}
			},
			//关闭弹窗
			closeDialog() {
				this.BillName = null; //单号名称
				this.BillCode = null; //单号标识
				this.listData = [];
				this.dialogFormVisible = false;
			},
			//关闭弹窗2
			closeDialog2() {
				this.ruleData = {
					ID: "0",
					BillID: "0",
					RoleType: "0",
					RoleValue: "",
					Cycle: "0"
				};
				this.dialogFormVisible2 = false;
			},
			//新增规则
			addRules() {
				this.dialogFormVisible2Type = 2;
				this.dialogFormVisible2 = true;
			},
			//保存规则
			saveRule() {
				if (this.dialogFormVisible2Type == 1) {
					for (var i = 0; i < this.listData.length; i++) {
						if (this.listData[i].ID == this.ruleData.ID&&this.listData[i].RoleType == 2) {
							this.$set(this.listData, i, this.ruleData);
						}else if(this.listData[i].ID == this.ruleData.ID&&this.listData[i].RoleType != 2&&this.ruleData.RoleType!=2){
							this.$set(this.listData, i, this.ruleData);
						}else if(this.listData[i].ID != this.ruleData.ID&&this.listData[i].RoleType==2&&this.ruleData.RoleType==2){
							this.$message({
								type: 'error',
								message: "无法添加两条流水号规则！"
							});
							return;
						}
					}
				} else {
					for (var i = 0; i < this.listData.length; i++) {
						 if(this.listData[i].RoleType==2&&this.ruleData.RoleType==2){
							this.$message({
								type: 'error',
								message: "无法添加两条流水号规则！"
							});
							return;
						}
					}
					this.ruleData.BillID = this.BillIDs;
					this.ruleData.RoleOrder = this.listData.length+1;
					this.listData.push(this.ruleData);
				}
				this.ruleData = {
					ID: "0",
					BillID: "0",
					RoleType: "0",
					RoleValue: "",
					Cycle: "0",
					Isdel: "0",
					RoleOrder:"0"
				};
				this.dialogFormVisible2 = false;
			},
			handleEdit(index, row) {
				this.dialogFormVisible2Type = 1;
				let rowData = JSON.stringify(row);
				this.ruleData = JSON.parse(rowData);
				this.dialogFormVisible2 = true;
			},
			handleDelete(index, row){
				row.Isdel=1;
				for (var i = 0; i < this.listData.length; i++) {
					if (this.listData[i].ID == row.ID) {
						this.$set(this.listData, i, row);
						this.orderBy();
					}
				}
			},
			changeRoleType() {
				this.ruleData.RoleValue = "";
			},
			//行拖拽
			rowDrop() {
				const tbody = document.querySelector('#formWrapTable .el-table__body-wrapper tbody')
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
			orderBy(){
				const _this = this
				let j = 1;
				for(var i = 0 ;i<_this.listData.length;i++){
					if(_this.listData[i].Isdel==0){
						_this.listData[i].RoleOrder = j;
						_this.$set(_this.listData, i, _this.listData[i]);
						j++;
					}
				}
			}
		},
		async created() {
			// 获取数据
			this.getList();
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
			// 单据类型列表
			"$store.state.Permission.MNvalue.BillTypeGetList": function(data) {
				if (data.ReturnData.Data.length > 0) {
					let orderList = data.ReturnData.Data;
					this.tableData = (this.tableData).concat(orderList)
				}
			},
			// 单号类型
			"$store.state.Permission.MNvalue.BillNoRoleByBillId": function(data) {
				if (data.ReturnData.Data.length > 0) {
					this.filterListData(data.ReturnData.Data);
				}
			},
			// 新增规则
			"$store.state.Permission.MNvalue.BillNoRoleSave": function(data) {
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
		}
	};
</script>

<style scoped>
	#orderList {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content {
		width: 100%;
		height: 100%;
		background: #fff;
		/*overflow-y: scroll;*/
	}

	.content>div {
		width: 96% !important;
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
	#orderList {
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
			height: 300px !important;
		}
		
	}
	#ruleDialogContentWrap .el-form-item__content{
		width: 100%;
	}
</style>
