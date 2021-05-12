<template>
	<!--
    formSearch:{type:object}筛选结果
	isMultipleChoice:{type:boolean}//是否多选
	checkedList：[] 选中供应商ID集合  多选可通过父级传值默认选中 ["1","2""3"]
	SupplierId：string 选中供应商ID  单选可通过父级传值默认选中   "1"
	@getToFather //获取数据
 -->
	<div class="selectL">
		<div class="selectL_r">
			<el-popover v-model="tabs.popoverShow" placement="bottom-end" :width="popverWidth" trigger="click">
				<div slot="reference" class="selectL_r_input">
					<el-input placeholder="请选择" v-model="form.keyValue" clearable readonly>
					</el-input>
					<i class="el-icon-close" @click.stop="clearable"></i>
				</div>
				<div class="seletHome">
					<div class="tab_connect">
						<div class="tab_connect_r">
							<div class="formTop" v-if="isMultipleChoice">
								<button class="el-button el-button--primary choseCheckbox" size="small" @click="getSupplier">确定</button>
							</div>
							<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="tabConnect.searchSupplier" @keyup.native.enter="searchSupplierBtn()">
							</el-input>
							<el-cascader style="width:240px" @change="depSearchSupplier" placeholder="请选择筛选分类" :options="depTree" clearable :props="{ checkStrictly: true,label:'Name',value:'Id',children:'Children',emitPath:false}"
							 :show-all-levels="false"></el-cascader>
							<div class="userList-scorll" v-if="!isMultipleChoice">
								<el-radio-group v-model="SupplierId_" class="userList" v-for="(item, index) in selectList.supplierList" :key="index">
									<el-radio class="userList_item" border @change="getSupplier(item)" :label="item.Id">{{ item.Name }}</el-radio>
								</el-radio-group>
							</div>
							<div class="userList-scorll" v-if="isMultipleChoice">
								<el-checkbox-group class="userList" v-model="checkedList_" @change="checkSuppliers" v-for="(item, index) in selectList.supplierList" :key="index">
									<el-checkbox class="userList_item" border :label="item.Id" :key="item.Id">{{ item.Name }}</el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
					</div>
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		name: 'chooseSupplier',
		props: {
			isDep: {
				type: Boolean,
				default: true
			},
			value: {
				type: [Number, String],
				default: ''
			},
			formSearch: Object,
			//是否多选
			isMultipleChoice: {
				type: Boolean,
				default: true
			},
			//供应商多选选中的index集合  可通过父级传Id组来默认，
			checkedList:{
				type: Array,
				default: ()=>[]
			},
			//供应商单选值  可通过父级传Id组来默认
			SupplierId: {
				type: [Number, String],
				default: ''
			},
		},
		computed: {
			keyValue: {
				get() {
					return this.form.keyValue
				}
			}
		},
		data() {
			return {
				SupplierId_:"",
				checkedList_:[],
				//popver 宽带
				popverWidth: 220,
				// 下拉数据
				selectList: {
					Letter: ["A"],
					type: [{
						value: 0,
						label: '协同'
					}, {
						value: 1,
						label: '负责'
					}],
					// 供应商列表
					supplierList: [],
					// 部门列表
					depList: [],
					// 员工offset
					userOffset: [],
				},
				allData:[],
				// tree 数据格式
				defaultProps: {
					children: 'Children',
					label: 'Name',
					value: "Id",
					emitPath: false
				},
				// tab 搜索框
				tabConnect: {
					searchDep: '', // 本地筛选
					searchSupplier: '', // 供应商
					depId: '', // 分类id
					letterActive: 0, // 当前活动字母
					scrollTop: 0, // 当前滚动距离
					searchDepShow: false // 是否显示分类列表
				},
				// 分类 树状
				depTree: [],
				tabs: {
					active: '0',
					tabPosition: 'right',
					popoverShow: false
				},
				// 反馈数据
				form: {
					type: 1,
					keyValue: '',
					keyId: -1
				},
				QuerySupplierFrom: {
					"KeyWord": '',
					"PageSize": 1000,
					"PageIndex": 1,
					"TypeId": "",
					"IsDel": "0",
				},
				//多选已选中集合
				choseData:[],
			}
		},
		computed: {
			...mapGetters([
				"GetListSupplierGroupTree",
				"GetListSupplier",
			]),
		},
		watch: {
			GetListSupplier: function(data) {
				this.selectList.supplierList = JSON.parse(JSON.stringify(data.ReturnData.Data));
				if(this.QuerySupplierFrom.TypeId==""){
					this.allData =JSON.parse(JSON.stringify(data.ReturnData.Data));
				}
			},
			GetListSupplierGroupTree: function(data) {
				this.depTree = JSON.parse(JSON.stringify(data.ReturnData.Data));
			},
			'tabs.acitve': {
				deep: true,
				handler: function(val) {
					if (val == '0' && this.tabs.popoverShow) {
						this.addUserListScorll()
					}
				}
			},
			'tabs.popoverShow': {
				deep: true,
				handler: function(newVal) {
					if (newVal) {
						this.addUserListScorll()
					} 
					else{
						this.init();
					}
				}
			},
			'SupplierId': {
				deep: true,
				immediate: true,
				handler: function(newVal) {
					this.SupplierId_ = newVal;
					if (this.SupplierId_!="") {
						for(var i=0;i<this.allData.length;i++){
							if(this.allData[i].Id==this.SupplierId_){
								this.form.keyValue=this.allData[i].Name;
							}
						}
					}
				}
			},
			'checkedList':{
				deep: true,
				immediate: true,
				handler: function(newVal) {
					this.checkedList_ = newVal;
					if (this.checkedList_.length>0){
						this.form.keyValue=this.checkedList_.length;
					}
				}
			},
		},
		methods: {
			//初始化
			init(){
				this.checkedList_ = [];
				this.SupplierId_ = "";
				this.choseData = [];
				this.QuerySupplierFrom={
					"KeyWord": '',
					"PageSize": 1000,
					"PageIndex": 1,
					"TypeId": "",
					"IsDel": "0",
					};
				this.tabConnect={
					searchDep: '', // 本地筛选
					searchSupplier: '', // 员工
					depId: '', // 分类id
					letterActive: 0, // 当前活动字母
					scrollTop: 0, // 当前滚动距离
					searchDepShow: false // 是否显示分类列表
				};
			},
			//获取width
			setPopver() {
				this.$nextTick(() => {
					let tag = document.getElementsByClassName('selectL')[0]
					this.popverWidth = tag.offsetWidth
				})
			},
			// clear 清空选择的数据
			clearable() {
				this.form = {
					type: this.form.type,
					keyValue: '',
					keyId: ''
				}
				this.keyValue = ''
			},
			// 移除监听
			removeUserListScorll() {
				const scroll = document.getElementsByClassName('userList-scorll')[0]
				scroll.removeEventListener('scroll', () => {
					this.userListScorll()
				})
			},
			// 添加监听
			addUserListScorll() {
				const scroll = document.getElementsByClassName('userList-scorll')[0]
				scroll.addEventListener('scroll', () => {
					this.userListScorll(scroll.scrollTop)
				})
			},
			// 员工滚动事件
			userListScorll(val) {
				const num = this.selectList.userOffset
				for (let i = 0; i < num.length; i++) {
					if (val > num[i].min && val <= num[i].max) {
						this.tabConnect.letterActive = i
						return
					}
				}
			},
			// 搜索员工
			searchSupplierBtn() {
				this.QuerySupplierFrom.KeyWord= this.tabConnect.searchSupplier;
					this.getSupplierList()
			},
			// 部门筛选员工
			depSearchSupplier(val) {
				this.QuerySupplierFrom.TypeId = val;
					this.getSupplierList()
			},
			// 选择员工
			getSupplier(user) {//可在此方法中向父级传值
				if(!this.isMultipleChoice){
					//单选则显示当前选中名称
					console.log(user);
					const obj = {
						keyValue: user.Name,
						keyId: user.Id,
						type: this.form.type
					}
					this.form = obj
					this.$emit('getToFather',user)
				}
				else{
					//多选则显示已选中数量
					console.log(this.choseData);
					const obj = {
						keyValue: this.choseData.length,
						keyId: "",
						type: this.form.type
					}
					this.form = obj
					this.$emit('getToFather',this.choseData)
				}
				this.tabs.popoverShow = false
			},
			// 模糊查询部门列表
			searchDep(val) {
				if (
					this.tabConnect.searchDep == '' ||
					this.tabConnect.searchDep == null
				) {
					return true
				}
				if (val.indexOf(this.tabConnect.searchDep) == -1) {
					return false
				} else {
					return true
				}
			},
			// list 获取列表
			getSupplierList(req) {
				let json = {
					SN: 'Purchase',
					MN: "GetListSupplier",
					DataContent: this.QuerySupplierFrom
				};
				this.MIX_send(json);
			},
			// tree 获取分类树状
			getDepTree() {
				let json = {
					SN: "Purchase",
					MN: "GetListSupplierGroupTree",
					DataContent: {
						IsDel: -1,
					},
				};
				this.MIX_send(json);
			},
			//监听员工/岗位多选
			checkSuppliers(e){
				this.choseData = [];
				for(var i = 0;i<e.length;i++){
					for( var j = 0;j<this.allData.length;j++){
						if(e[i]==this.allData[j].Id){
							this.choseData.push(this.allData[j]);
						}
					}
				}
			}
		},
		created() {
			this.getSupplierList({}) // 获取员工列表
			this.getDepTree() // 获取部门树状
			this.setPopver() //设置popver宽度
		}
	}
</script>

<style lang="less">
	*{
		box-sizing: border-box;
	}
	.el-popover {
		padding: 0;

		.popover-pd {
			padding: 12px;
		}
	}
	.formTop{
		width: 100%;
		height: 35px;
		padding: 0 10px;
		box-sizing: border-box;
		.choseCheckbox{
			float: right;
			width: 60px;
			padding: 5px 15px;
			line-height: 1.2;
			height: 30px;
		}
	}
	.selectL {
		width: 260px;
		padding:10px 0;
		.el-select>.el-input {
			width: 100%;
		}

		.el-input {
			width: 100%;
		}

		.selectL_l {
			width: 82px;

			.el-select {

				textarea,
				input[type='password'],
				input[type='text'] {
					color: #909399;
					box-shadow: 0 0 0px 1000px #f5f5f5 inset;
					-webkit-box-shadow: 0 0 0px 1000px #f5f5f5 inset;
				}
			}

			.el-input__inner {
				border-radius: 4px 0 0 4px;
			}
		}

		.selectL_r {
			>span:first-child {
				width: 100%;
			}

			.el-icon-close {
				position: absolute;
				right: 5px;
				top: 8px;
				color: #c7bbbb;
				cursor: pointer;
				display: none;
			}

			.selectL_r_input {
				width: 100%;
				position: relative;
			}

			.el-input__inner {
				width: 190px;
				border-radius: 0 4px 4px 0;
			}
		}

		.selectL_radious {
			.el-input__inner {
				width: 240px;
				border-radius: 4px;
			}
		}

		.selectL_r:hover {
			.el-icon-close {
				display: inline-block;
			}
		}
	}

	.seletHome {
		.el-tabs__content {
			height: 100%;
		}

		.el-tab-pane {
			height: 100%;
		}

		.el-tabs--right .el-tabs__header.is-right {
			margin-left: 0;
		}

		.el-tabs {
			width: 100%;
		}

		.el-tabs__nav {
			white-space: normal;
		}

		.el-tabs--right.el-tabs--border-card .el-tabs__header.is-right {
			border-left: none;
		}

		.el-tabs--right.el-tabs--border-card .el-tabs__item.is-right {
			border: none;
		}

		.el-tabs__item {
			line-height: 1.2;
			color: #4e617c;
			cursor: pointer;
			padding: 9px;
			font-size: 13px;
			height: auto;
			width: 32px;
		}

		.el-tabs--border-card>.el-tabs__content {
			padding: 0;
		}

		.tab_connect_r {
			width: 100%;
			.el-input {
				width: calc(100% - 11px);
				margin: 0 10px 10px;
			}
		}
	}
</style>
<style lang="less" scoped>
	.selectL {
		display: flex;
	}

	.seletHome {
		.tab_connect {
			display: flex;
			justify-content: flex-start;

			.tab_connect_l {
				width: 32px;
				overflow-y: scroll;
				height: 410px;
				padding: 5px 10px;

				p {
					color: #ccc;
					text-align: center;
					cursor: pointer;
				}

				p:hover {
					font-size: 16px;
					color: #ff7c35;
				}

				.isActive {
					font-size: 16px;
					color: #ff7c35;
				}
			}

			::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}

			.tab_connect_r {
				border-left: 1px solid #eceff5;
				padding: 9px 0;
				height: 420px;

				.userList-scorll {
					height: 327px;
					overflow-y: scroll;
				}

				::-webkit-scrollbar {
					width: 0;
					height: 0;
					color: transparent;
				}

				.userList {
					width: 100%;
					padding:0 10px;
					box-sizing: border-box;
					p {
						background-color: #f5f9ff;
						height: 24px;
						line-height: 24px;
						font-weight: 700;
						padding-left: 10px;
					}
					.el-radio{
						width: 100%;
						margin: 5px auto;
					}
					.el-checkbox {
						width: 100%;
						margin: 5px auto;
					}
					div {
						cursor: pointer;
						padding: 5px 10px;
						display: flex;
						justify-items: center;

						img {
							width: 24px;
							height: 24px;
							border-radius: 50%;
							margin-right: 10px;
						}

						span {
							line-height: 24px;
						}
					}

					div:hover {
						background-color: #73acff;
						color: #fff;
					}
				}

				.depList {
					padding: 5px 10px;
					cursor: pointer;
				}

				.depList:hover {
					background: #f5f5f5;
				}
			}
		}
	}
</style>
