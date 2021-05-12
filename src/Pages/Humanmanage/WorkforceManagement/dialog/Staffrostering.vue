<template>
	<div>
		<el-dialog title="编辑排班" @close='cancel' class="el_dialog_pro1" width='90%' :visible.sync="dialogFormVisible">
			<div style="padding:20px">
				<div slot="operation" class="Head_Top">
					<div class="Top_one">
						<el-button @click="addgroup" size="" type="primary">批量排班</el-button>
						<el-date-picker v-model="monthdata" type="month" value-format="yyyy-MM" placeholder="选择月">
						</el-date-picker>
					</div>
					<div class="Top_two">
						<div class="Top_two_radio">
							<el-button size="small" style="background:#009900" type="primary">已排班</el-button>
							<el-button size="small" style="background:#CCCCCC" type="primary">已结束</el-button>
							<el-button size="small" style="background:#55aaff;" type="primary">未排班/休息</el-button>
						</div>
						<div class="Top_two_one">
							<el-input placeholder="请输入内容" v-model="listfrom.KeyWord">
								<i slot="suffix" @click="getlistdata" class="el-input__icon el-icon-search"></i>
							</el-input>
						</div>
						<div class="Top_two_two1">
							<el-button icon="el-icon-refresh" size="small" class="refresh" @click="getlistdata"></el-button>
						</div>
					</div>
				</div>
				<div slot="table">
					<tablezd class="table_cmp" :loading="loading" ref="tablezd" :table-label="tableLabel" @newdata="cellClick"></tablezd>
					<div style="text-align: right;">
						<el-pagination v-if="tatolpage < 10" @size-change="handleSizeChange" @current-change="handleCurrentChange"
						 :current-page.sync="listfrom.PageIndex" layout=" prev, pager, next" :total="tatolpage">
						</el-pagination>
					</div>
				</div>
				<!-- <rosterre ref="rosterre"></rosterre> -->
			</div>
			<div slot="footer" class="dialog-footer">
			  <el-button @click="cancel">取 消</el-button>
			  <el-button type="primary" @click="Commit">确 定</el-button>
			</div>
		</el-dialog>
		<manual ref="manual" @manualChange = "manualChange"></manual>
	</div>
</template>

<script>
	var that
	// import rosterre from "./rosterre";
	import tablezd from "./tabel";
	import manual from "./ManualMakeUp";
	import Mymixin from "../js/minxin";
	export default {
		name: "",
		mixins: [Mymixin],
		data() {
			return {
				dialogFormVisible: false,
				rowId: "",
				modal12: false,
				loading: false,
				tatolpage: 0,
				monthdata: '',
				tableData: [],
				listfrom: {
					"ScheduleId": '',
					"Date": '',
				},
				tableLabel: [],
				columns: [],
				menus: [],
				FrequencysData:[],
				formData:[],
			};
		},
		components: {
			tablezd,
			manual
		},
		watch: {
			"monthdata": function(params) {
				// console.log(params);
				this.listfrom.Date = params
				this.getmonth(params);
				this.getlistdata()
				// this.getdata(this.data)
			},
			"$store.state.Humanmanage.GetAttendanceScheduleDetail": function(datas) {
				let data = JSON.parse(JSON.stringify(datas));
				this.FrequencysData = data.ReturnData.Frequencys;
				this.formData = JSON.parse(JSON.stringify(datas.ReturnData));
				let Frequency = {
					Id:"0",
					Name:"休息"
				}
				this.FrequencysData.push(Frequency);
				this.getdata(data.ReturnData.StaffAttendanceScheduleItems,data.ReturnData.Frequencys);
				this.$refs.tablezd.tableDatas = JSON.parse(JSON.stringify(this.tableData));
			},
			"$store.state.Humanmanage.UpdateAttendanceScheduleDetail": function(datas) {
				if (datas.Code === 0) {
					this.$message({
						showClose: true,
						message: "操作成功",
						type: "success",
					});
					this.cancel();
				} else {
					// 失败
					this.$message({
						showClose: true,
						message: "失败",
						type: "fail",
					});
				}
			},
			async rowId(data){
				if(data!=""){
					that = this;
					var date = new Date();
					let month = date.getMonth() + 1;
					let year = date.getFullYear();
					if (month < 10) {
						month = '0' + month;
					}
					this.monthdata = year + '-' + month;
					console.log(this.monthdata);
					this.listfrom.ScheduleId = data;
				}
			},
			async dialogFormVisible(data){
				if(data == true){
					this.getlistdata();
				}
			}
		},
		created() {
		},
		mounted() {

		},
		methods: {
			cancel() {
				this.formData=[];
				this.dialogFormVisible = false;
				this.$refs.tablezd.tableDatas=[];
				//this.$refs.tablezd.tableDatas=JSON.parse(JSON.stringify(this.tableData));
				this.$refs.tablezd.datas=[];
				// this.tableData=[];
			},
			// 添加组
			addgroup() {
				this.$refs.rosterre.dialogFormVisible = true;
			},
			getlistdata() {
				let obj = {
					"SN": "Attendance",
					"MN": "GetAttendanceScheduleDetail",
					"RequestId": 1,
					"UserId": 1,
					"DataContent": this.listfrom
				}
				this.MIX_send(obj);
			},
			rowClick(data) {},
			handleCurrentChange(data) {
				this.listfrom.PageIndex = data;
				this.getlistdata();
			},
			handleSizeChange(data) {
				this.listfrom.PageSize = data;
				this.getlistdata();
			},
			handleButton(data) {},
			cellClick(data,index) {
				if (!this.CompareDate(data.NewData)) {
					return
				}
				this.$refs.manual.form = JSON.parse(JSON.stringify(data));
				this.$refs.manual.options = this.FrequencysData;
				this.$refs.manual.dialogFormVisible = true;
				console.log(data);
			},
			manualChange(data){
				var i = data.index;
				delete data.index;
				for(var index in this.tableData){
					for(var index2 in this.tableData[index]){
						if(this.tableData[index][index2].StaffId==data.StaffId && this.tableData[index][index2].NewData==data.NewData){
							this.$set(this.tableData[index],index2,data);
							this.$refs.tablezd.datas = data;
						}
					}
				}
			},
			handleSortChange(data) {},
			handleSelectionChange(data) {},
			GetTableId(data) {
				console.log(data);
			},
			search() {
				this.getlistdata();
			},
			// 表格上方筛选slot的事件回调
			add() {
				console.log("表格上方筛选slot的事件回调");
			},
			// 弹出框表单提交
			Commit() {
				console.log(this.formData);
				console.log("---1");
				let array =[];
				this.formData.Date = this.monthdata;
				delete this.formData.ScheduleName;
				delete this.formData.Frequencys;
				
				for(var index in this.tableData){
					var arr = [];
					for(var index2 in this.tableData[index]){
						arr.push(this.tableData[index][index2])
					}
					this.formData.StaffAttendanceScheduleItems[index].AttendanceScheduleItem =arr;
				}
				
				console.log(this.formData);
				console.log(this.formData +"---2");
				let obj = {
					"SN": "Attendance",
					"MN": "UpdateAttendanceScheduleDetail",
					"RequestId": 1,
					"UserId": 1,
					"DataContent": this.formData
				}
				this.MIX_send(obj);
			},
			// 弹出框底部标签页组件事件的回调
			edit(val) {
				console.log(val);
			}
		},
	}
</script>

<style lang='less' scoped>
	.Head_Top {
		width: 100%;
		height: 51px;
		// overflow: hidden;
		display: flex;
		justify-content: space-between;

		.Top_one {
			width: 350px;
		}

		.Top_two {
			// flex: 1;
			display: flex;

			.Top_two_two {
				padding: 10px;
			}
		}

		.Top_three {
			width: 50px;
		}
	}
</style>
