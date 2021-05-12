<template>
	<div>
		<el-dialog :title="title" class="el_dialog_pro" width='70%' style="top:10%" :visible.sync="dialogFormVisible"
		 @close="cancelSubmit">
			<!-- <div class="dialog_body"> -->
			<el-form ref="dataForm" :model="form" label-position='left' :rules="rules">
				<el-row>
					<el-col :span="8" class="el_col ">
						<el-form-item label="编号:" :label-width="formLabelWidth" prop="No">
							<el-input class="input_border_bottom" v-model="form.No" placeholder="请输入编号" auto-complete="off" :disabled="formtype=='3'?true:false"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="等级:" :label-width="formLabelWidth" prop="Grade">
							<el-select class="select_border_bottom" v-model="form.Grade" placeholder="请选择等级" :disabled="formtype=='3'?true:false">
								<el-option v-for="(item, index) in typeList" :label="item.label" :key="index" :value="item.value">{{item.label}}</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="所属分类:" :label-width="formLabelWidth" prop="SupplierGroupId_">
							<el-cascader class="group select_border_bottom" v-model="form.SupplierGroupId_" placeholder="请选择所属分类" :options="treeData"
							 :props="{value:'Id',label:'Name',children:'Children',emitPath:false}" :show-all-levels="false" clearable :disabled="formtype=='3'?true:false" ></el-cascader>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="el_col ">
						<el-form-item label="全称:" :label-width="formLabelWidth" prop="Name">
							<el-input class="input_border_bottom" v-model="form.Name" placeholder="请输入全称" auto-complete="off" :disabled="formtype=='3'?true:false" :validate-event="false"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="简称:" :label-width="formLabelWidth" prop="Abbreviation">
							<el-input class="input_border_bottom" v-model="form.Abbreviation" placeholder="请输入简称" auto-complete="off" :disabled="formtype=='3'?true:false" :validate-event="false"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="传真号码:" :label-width="formLabelWidth" prop="FaxNumber">
							<el-input class="input_border_bottom" v-model="form.FaxNumber" placeholder="请输入传真号码" auto-complete="off" :disabled="formtype=='3'?true:false" :validate-event="false"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16" class="el_col ">
						<el-form-item label="地区:" :label-width="formLabelWidth" prop="Area">
							<v-distpicker :province="form.Province" :city="form.City" :area="form.Area" @selected="onSelected" :disabled="formtype=='3'?true:false" :validate-event="false">
							</v-distpicker>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="地址:" :label-width="formLabelWidth" prop="Address">
							<el-input class="input_border_bottom" v-model="form.Address" placeholder="请输入地址" auto-complete="off" :disabled="formtype=='3'?true:false" :validate-event="false"></el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col :span="8" class="el_col">
						<el-form-item label="开户银行:" :label-width="formLabelWidth">
							<el-input class="input_border_bottom" :disabled="formtype=='3'?true:false" v-model="form.AccountOpening" placeholder="请输入开户银行" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="开户账号:" :label-width="formLabelWidth">
							<el-input class="input_border_bottom" :disabled="formtype=='3'?true:false" v-model="form.AccountBank" placeholder="请输入开户账号" auto-complete="off" :validate-event="false"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" class="el_col pad_left">
						<el-form-item label="企业税号:" :label-width="formLabelWidth">
							<el-input class="input_border_bottom" :disabled="formtype=='3'?true:false" v-model="form.CorporateTaxNumber" placeholder="请输入企业税号" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="el_col ">
						<el-form-item label="描述:" :label-width="formLabelWidth">
							<el-input class="textarea_border_bottom" :disabled="formtype=='3'?true:false" v-model="form.Desc" type="textarea" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div class="el_tabs_pro">
				<el-button type="primary" v-if="formtype == 2||formtype ==1" @click="add" class="add_btn" size="small">+</el-button>
				<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
					<el-tab-pane label="联系方式" name="first">
						<div class="contact_list">
							<table-cmp style="width:100%" class="table_cmp" :loading="loading" :table-data="tableData" Height='166'
							 :table-label="tableLabel" @handleButton="handleButton" @rowClick="rowClick" @cellClick="cellClick"
							 @handleSortChange="handleSortChange" @handleSelectionChange="handleSelectionChange"></table-cmp>
						</div>
					</el-tab-pane>
					<el-tab-pane label="扩展信息" name="second">
						<div class="contact_list">
							<table-cmp style="width:100%" class="table_cmp" :loading="loading" :table-data="infor_tableData" Height='166'
							 :table-label="infor_tableLabel" @handleButton="handleButton" @rowClick="rowClick" @cellClick="cellClick"
							 @handleSortChange="handleSortChange" @handleSelectionChange="handleSelectionChange"></table-cmp>
						</div>
					</el-tab-pane>
					<el-tab-pane label="产品库" name="third">
						<div class="contact_list">
							<table-cmp style="width:100%" class="table_cmp" :loading="loading" :table-data="product_tableData" Height='166'
							 :table-label="product_tableLabel" @handleButton="handleButton" @rowClick="rowClick" @cellClick="cellClick"
							 @handleSortChange="handleSortChange" @handleSelectionChange="handleSelectionChange"></table-cmp>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div slot="footer" class="dialog-footer" v-if="formtype!=3">
				<el-button @click="cancelSubmit" style="outline: none;text-align: center; border: 1px solid #D1DDF5;
font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;">取
					消</el-button>
				<el-button type="primary" @click="commit" style="outline: none;text-align: center; border: 1px solid #D1DDF5;
font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;">确
					定</el-button>
			</div>
			<!-- </div> -->
		</el-dialog>
		<contactpop ref="contactpop" @dataSubmit="dataExtendSubmit"></contactpop>
		<inforpop ref="inforpop" @dataSubmit="dataExtendSubmit"></inforpop>
		<myTable
		  :selectOptionList="selectOptionList"
		  :visible="showReplace"
		  :typeNum="1"
		  :check="1"
		  :title="'入库物料选择'"
		  :typeList="typeList2"
		  :showType="false"
		  @closePropMask="closePropMask"
		  @PopFormInit01="PopFormInit01"
		  @addCheck="addCheck"
		></myTable>
	</div>
</template>

<script>
	var that;
	var occupancyDisplay = {	
		  template: `<div>
					<el-button type="text" size="small" @click="del()" v-if="row.IsDel==0">删除</el-button>
					<span v-if="row.IsDel==1">已删除</span>
		  </div>`,
		  props: ["row", "keyindex"],
		  methods: {
			edit() {
			  that.add(this.row, this.keyindex);
			},
			del() {
			  that.clickDel(this.row, this.keyindex);
			},
		  },
		};
	
	import VDistpicker from 'v-distpicker'
	import contactpop from './contactpop'
	import inforpop from './inforpop'
	import myTable from "@/components/replaceTable";
	import {
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
				rules: {
				 No: [
				   { required: true, message: '请输入编号'},
				 ],
				  Grade: [
				    { required: true, message: '请选择等级'}
				  ],
				  SupplierGroupId_: [
					{ required: true, message: '请选择分类'}
				  ],
				  Name: [
				   { required: true, message: '请输入全称'},
				 ],
				 Abbreviation: [
				   { required: true, message: '请输入简称'},
				 ],
				 FaxNumber: [
				   { required: true, message: '请输入传真号码'},
				 ],
				 Area:[
					{ required: true, message: '请选择地区'}
				  ],
				Address:[
				   { required: true, message: '请输入地址'},
				 ],
			   },
				dialogFormVisible: false,
				loading: false,
				tbasindex: 0,
				listfrom: {
					"Status": '',
					"KeyWord": '',
					"Status": '',
					"PageSize": 10,
					"PageIndex": 1
				},
				tableData: [],
				tableLabel: [{
						label: '职务',
						param: 'Duties',
						width: '100',
						align: 'center',
						sortable: false
					},
					{
						label: '姓名',
						param: 'Name',
						align: 'center',
						width: '200',
						sortable: false
					},
					{
						label: '联系电话',
						param: 'Phone',
						align: 'center',
						width: '150'
					},
					{
						label: '负责事项',
						param: 'Matter',
						align: 'center'
					},
					{
						label: '操作',
						align: 'center',
						width: '300',
						component: occupancyDisplay,
					}
				],
				infor_tableData: [],
				infor_tableLabel: [{
						label: '拓展属性名',
						param: 'Name',
						width: '100',
						align: 'center',
						sortable: false
					},
					{
						label: '拓展属性值',
						param: 'Attribute',
						align: 'center',
						sortable: false
					},
					{
						label: '拓展属性内容',
						param: 'Info',
						align: 'center',
					},
					{
						label: '操作',
						align: 'center',
						width: '300',
						component: occupancyDisplay,
					}
				],
				product_tableData: [],
				product_tableLabel: [{
						label: '编码',
						param: 'MNo',
						align: 'center',
						sortable: false
					},
					{
						label: '名称',
						param: 'MName',
						align: 'center',
						sortable: false
					},
					{
						label: '操作',
						align: 'center',
						width: '300',
						component: occupancyDisplay,
					}
				],
				activeName2: 'first',
				formLabelWidth: '100px',
				form: {

				},
				contactForm:{
					
				},
				typeList: [{
						value: '0',
						label: '一级供应商'
					}, {
						value: '1',
						label: '二级供应商	'
					},
					{
						value: '2',
						label: '三级供应商	'
					},
					{
						value: '3',
						label: '四级供应商	'
					},
					{
						value: '4',
						label: '五级供应商	'
					}
				],
				currIndex:"",
				typeList2:[],
				showReplace: false,
				selectOptionList: [
				  {
				    title: "全部",
				    statu: "",
				  },
				  {
				    title: "已启用",
				    statu: 2,
				  },
				  {
				    title: "已停用",
				    statu: 3,
				  },
				],
				sendData:{},
			}
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			formData: {
				type: Object,
				default () {
					return {}
				}
			},
			treeData: {
				type: Array,
				default () {
					return {}
				}
			},
			formtype: "",
			title:"",
		},
		computed: {
			...mapGetters([
				"GetListSupplierContacts",
				"GetListSupplierExtend",
				"GetListSupplierProduct",
				"GetMaterielCategoryTree"
			])
		},
		watch: {
			GetMaterielCategoryTree(newValue, oldValue) {
			    console.log(newValue)
			    this.typeList2 = JSON.parse(JSON.stringify(newValue.ReturnData));
			},
			visible(newVal, oldVal) {
				this.dialogFormVisible = newVal
			},
			async formData(newVal, oldVal) {
				this.form = newVal;
				this.form.SupplierGroupId_ = Number(this.form.SupplierGroupId);
				if(this.form.Id!=0){
					await this.getContacts(this.form.Id);
						  this.getInfors(this.form.Id);
						  this.getProducts(this.form.Id);
				}
			},
			GetListSupplierContacts(newVal, oldVal) {
				this.tableData = newVal.ReturnData.Data;
			},
			GetListSupplierExtend(newVal, oldVal) {
				this.infor_tableData = newVal.ReturnData.Data;
			},
			GetListSupplierProduct(newVal, oldVal) {
				this.product_tableData = newVal.ReturnData.Data;
			},
		},
		components: {
			VDistpicker,
			contactpop,
			myTable,
			inforpop,
		},
		created() {
			that = this;
			this.getMaterieTreeData();
			// console.log(citys);
		},
		methods: {
			closePropMask() {
			  this.showReplace = false;},
			  PopFormInit01() {
			  // this.remotevalue = "";
			  // this.$refs.PopForm01.$refs.ruleForm.resetFields();
			  // this.showMask = false;
			  //this.showType=false
			},
			//多选事件
			addCheck(val){
			  for(let i = 0;i<val.length;i++){
			    val[i].MaterielId=val[i].Id
				val[i].MNo=val[i].No;
				val[i].MName=val[i].Name;
				val[i].Id = 0;
				val[i].IsDel = 0;
				val[i].SupplierId = this.form.Id;
			  }
			  this.product_tableData=val;
			},
			//table选中物料事件
			addTable(row) {
			  row.Ids = 0;
			  row.MaterielId = row.Id;
			  this.product_tableData.push(row);
			},
			commit() {
				this.$refs.dataForm.validate((valid)=>{
				  if(valid){ 
					  this.form.CreatedUser = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
					  this.form.SupplierGroupId = this.form.SupplierGroupId_ +"";
					  this.sendData = this.form;
					  this.sendData.SEList = this.infor_tableData;
					  this.sendData.SPList = this.product_tableData;
					  this.sendData.SCList = this.tableData;
					  console.log(JSON.stringify(this.sendData));
					  this.$emit('addMateria', this.sendData)
				  }
				})
				
			},
			cancelSubmit() {
				this.form = {}
				this.tableData=[];
				this.product_tableData=[];
				this.infor_tableData=[];
				this.sendData=[];
				this.$emit('closeMask', false)
			},
			onSelected(data) {
				// this.dialogFormVisible=false
				console.log(data);
				this.form.Province = data.province.value;
				this.form.City = data.city.value;
				this.form.Area = data.area.value;
			},
			handleClick(data) {
				this.tbasindex = data.index;
			},
			add(row,index) {
				if (this.tbasindex == 0) {
					if(row.Id){
						this.currIndex = index;
						this.contactForm = row;
						this.$refs.contactpop.form = JSON.stringify(row);
						this.$refs.contactpop.formtype = 2;
					}
					else{
						this.$refs.contactpop.formtype = 1;
					}
					this.$refs.contactpop.dialogFormVisible = true;
				} else if (this.tbasindex == 1) {
					if(row.Id){
						this.currIndex = index;
						this.contactForm = row;
						this.$refs.inforpop.form = JSON.stringify(row);
						this.$refs.inforpop.formtype = 2;
					}
					else{
						this.$refs.inforpop.formtype = 1;
					}
					this.$refs.inforpop.dialogFormVisible = true;
				} else {
					this.showReplace=true;
				}
			},
			clickDel(row,index){
				if(this.tbasindex == 0){
					if(row.Id == 0){
						this.tableData.splice(index,1);
					}
					else{
						this.tableData[index].IsDel="1"
						this.$set(this.tableData,index,this.tableData[index]);
						// this.tableData.splice(index,1);
					}
				}
				else if(this.tbasindex == 1){
					if(row.Id == 0){
						this.infor_tableData.splice(index,1);
					}
					else{
						this.infor_tableData[index].IsDel="1"
						this.$set(this.infor_tableData,index,this.infor_tableData[index]);
						// this.infor_tableData.splice(index,1);
					}
				}
				else{
					if(row.Id == 0){
						this.product_tableData.splice(index,1);
					}
					else{
						this.product_tableData[index].IsDel="1"
						this.$set(this.product_tableData,index,this.product_tableData[index]);
						// this.product_tableData.splice(index,1); 
					}
				}
				
			},
			getContacts(id) {
				let json = {
					SN: "Purchase",
					MN: "GetListSupplierContacts",
					DataContent: {
						// "IsAssets": '1'
						IsDel: -1,
						PageSize: 1000,
						PageIndex: 1,
						SupplierId: id
					},
				};
				this.MIX_send(json);
			},
			getInfors(id) {
				let json = {
					SN: "Purchase",
					MN: "GetListSupplierExtend",
					DataContent: {
						// "IsAssets": '1'
						IsDel: -1,
						PageSize: 1000,
						PageIndex: 1,
						SupplierId: id
					},
				};
				this.MIX_send(json);
			},
			getProducts(id) {
				let json = {
					SN: "Purchase",
					MN: "GetListSupplierProduct",
					DataContent: {
						// "IsAssets": '1'
						IsDel: -1,
						PageSize: 1000,
						PageIndex: 1,
						SupplierId: id
					},
				};
				this.MIX_send(json);
			},
			// 获取物料分类树形结构数据
			getMaterieTreeData() {
			  let json = {
			    MN: "GetMaterielCategoryTree",
			    SN: "Materiel",
			    DataContent: {
			      SType: 1,
			    },
			  };
			  this.MIX_send(json);
			},
			dataExtendSubmit(data){
				data.SupplierId = this.form.Id;
				if (this.tbasindex == 0) {
					if(data.Id){
						this.$set(this.tableData, this.currIndex, data);
					}
					else{
						data.Id = 0;
						data.IsDel = 0;
						let Ids = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
						data.CreatedUser = Ids;
						this.tableData.push(data);
					}
				} else if (this.tbasindex == 1) {
					if(data.Id){
						this.$set(this.infor_tableData, this.currIndex, data);
					}
					else{
						data.Id = 0;
						data.IsDel = 0;
						let Ids = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
						data.CreatedUser = Ids;
						this.infor_tableData.push(data);
					}
				}
			},
			handleButton() {
			},
			rowClick() {},
			cellClick() {},
			handleSortChange() {},
			handleSelectionChange() {},
		},
	}
</script>

<style lang="less" scoped>
	.group .el-input {
		width: 330px !important;
	}

	.dialog_body {
		width: 100%;

	}

	.pad_left {
		padding-left: 15px;
	}

	.el_tabs_pro {
		margin-top: 10px;
		width: 100%;
		position: relative;
	}

	.add_btn {
		float: right;
		z-index: 100;
		position: absolute;
		right: 20px;
		color: rgb(255, 255, 255);
		border: none;
		font-size: 14px;
		outline: none;
		background: rgb(0, 96, 160);
		border-radius: 2px;
		width: 38px;
		height: 38px;
	}

	.contact_list {
		width: 100%;
		height: 165px;
	}
</style>
