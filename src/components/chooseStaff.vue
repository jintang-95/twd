<template>
	<!--
    formSearch:{type:object}筛选结果
    labelShow：{type:boolean}是否显示 负责人/协调下拉
	isDep:{type:boolean}是否显示岗位
	isCustomer:{type:boolean}是否显示员工
	isMultipleChoice:{type:boolean}//是否多选
	checkedList：[] 选中员工/岗位ID集合  多选可通过父级传值默认选中 ["1","2""3"]
	stuffId：string 选中员工/岗位ID  可通过父级传值默认选中   "1"
	@getToFather //获取数据
 -->
	<div class="selectL">
		<div class="selectL_r" :class="!labelShow ? 'selectL_radious' : ''">
			<el-popover v-model="tabs.popoverShow" placement="bottom-end" :width="popverWidth" trigger="click">
				<div slot="reference" class="selectL_r_input">
					<el-input placeholder="请选择" v-model="form.keyValue" clearable readonly>
					</el-input>
					<i class="el-icon-close" @click.stop="clearable"></i>
				</div>
				<div class="seletHome">
					<el-tabs :tab-position="tabs.tabPosition" style="height: 420px;" type="border-card" v-model="tabs.active">
						<el-tab-pane v-if="isCustomer" label="员工" name="0">
							<div class="tab_connect">
								<!-- <div class="tab_connect_l">
									员工选择
								</div> -->
								<div class="tab_connect_r">
									<div class="formTop" v-if="isMultipleChoice">
										<button class="el-button el-button--primary choseCheckbox" size="small" @click="getUser">确定</button>
									</div>
									<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="tabConnect.searchUser" @keyup.native.enter="searchUserBtn()">
									</el-input>
									<el-cascader @change="depSearchUser" placeholder="请选择筛选部门" :options="depTree" clearable :props="{ checkStrictly: true,label:'Name',value:'Id',children:'Children',emitPath:false}"
									 :show-all-levels="false"></el-cascader>
									<div class="userList-scorll" v-if="!isMultipleChoice">
										<el-radio-group v-model="stuffId_" class="userList" v-for="(item, index) in selectList.userList" :key="index">
											<el-radio class="userList_item" border @change="getUser(item)" :label="item.Id">{{ item.Name }}</el-radio>
										</el-radio-group>
									</div>
									
									<div class="userList-scorll" v-if="isMultipleChoice">
										<el-checkbox-group class="userList" v-model="checkedList_" @change="checkUsers" v-for="(item, index) in selectList.userList" :key="index">
											<el-checkbox class="userList_item" border :label="item.Id" :key="item.Id">{{ item.Name }}</el-checkbox>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane v-if="isDep" label="岗位" name="1">
							<div class="tab_connect">
								<!-- <div class="tab_connect_l">
									岗位选择
								</div> -->
								<div class="tab_connect_r">
									<div class="formTop" v-if="isMultipleChoice">
										<button class="el-button el-button--primary choseCheckbox" size="small" @click="getUser">确定</button>
									</div>
									<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="tabConnect.searchUser" @keyup.native.enter="searchUserBtn()">
									</el-input>
									<el-cascader @change="depSearchUser" placeholder="请选择筛选部门" :options="depTree" clearable :props="{ checkStrictly: true,label:'Name',value:'Id',children:'Children',emitPath:false}"
									 :show-all-levels="false"></el-cascader>
									<div class="userList-scorll" v-if="!isMultipleChoice">
										<el-radio-group v-model="stuffId_" class="userList" v-for="(item, index) in selectList.jobsList" :key="index">
											<el-radio class="userList_item" border @change="getUser(item)" :label="item.Id">{{ item.Name }}</el-radio>
										</el-radio-group>
									</div>
									
									<div class="userList-scorll" v-if="isMultipleChoice">
										<el-checkbox-group class="userList" v-model="checkedList_" @change="checkUsers" v-for="(item, index) in selectList.jobsList" :key="index">
											<el-checkbox class="userList_item" border :label="item.Id" :key="item.Id">{{ item.Name }}</el-checkbox>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'chooseStaff',
		props: {
			//是否显示员工
			isCustomer:{
				type: Boolean,
				default: false
			},
			// 是否显示岗位
			isDep: {
				type: Boolean,
				default: false
			},
			value: {
				type: [Number, String],
				default: ''
			},
			formSearch: Object,
			labelShow: {
				type: Boolean,
				default: false
			},
			//是否多选
			isMultipleChoice: {
				type: Boolean,
				default: true
			},
			//员工/岗位多选选中的index集合  可通过父级传Id组来默认，
			checkedList:{
				type: Array,
				default: ()=>[]
			},
			//员工/岗位单选值  可通过父级传Id组来默认
			stuffId: {
				type: [Number, String],
				default: ''
			},
		},
		data() {
			return {
				stuffId_:"",
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
					// 员工列表
					userList: [],
					// 岗位列表
					jobsList: [],
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
					searchDep: '', // 部门本地筛选
					searchUser: '', // 员工
					depId: '', // 部门id
					letterActive: 0, // 当前活动字母
					scrollTop: 0, // 当前滚动距离
					searchDepShow: false // 是否显示部门列表
				},
				// 部门 树状
				depTree: [],
				tabs: {
					active: '',
					tabPosition: 'right',
					popoverShow: false
				},
				// 反馈数据
				form: {
					type: 1,
					keyValue: '',
					keyId: -1
				},
				QueryStaffFrom: {
					OrganizationId: "",
					"Status": '',
					"KeyWord": '',
					"IsStop": '0',
					"PageSize": 1000,
					"PageIndex": 1
				},
				//多选已选中集合
				choseData:[],
			}
		},
		watch: {
			"$store.state.Humanmanage.QueryJobs": function (data) {
			  this.selectList.jobsList = JSON.parse(JSON.stringify(data.ReturnData.Data));
			  if(this.QueryStaffFrom.OrganizationId==""){
			  	this.allData =JSON.parse(JSON.stringify(data.ReturnData.Data));
			  }
			},
			"$store.state.Humanmanage.QueryStaff": function(data) {
				this.selectList.userList = JSON.parse(JSON.stringify(data.ReturnData.Data));
				if(this.QueryStaffFrom.OrganizationId==""){
					this.allData =JSON.parse(JSON.stringify(data.ReturnData.Data));
				}
			},
			"$store.state.Humanmanage.QueryOrganizationTree": function(data) {
				this.depTree = JSON.parse(JSON.stringify(data.ReturnData));;
			},
			isCustomer(val) {
				if (!val) {
					this.tabs.active = '1'
				}
			},
			isDep(val) {
				if (!val) {
					this.tabs.active = '0'
				}
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
						if(this.isDep){
							this.tabs.active = "1"
						}
						if(this.isCustomer){
							this.tabs.active = "0"
						}
						this.addUserListScorll()
					} 
					else{
						this.init();
					}
				}
			},
			'stuffId': {
				deep: true,
				immediate: true,
				handler: function(newVal) {
					this.stuffId_ = newVal;
					if (this.stuffId_!="") {
						for(var i=0;i<this.allData.length;i++){
							if(this.allData[i].Id==this.stuffId_){
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
				this.stuffId_ = "";
				this.choseData = [];
				this.QueryStaffFrom={
					OrganizationId: "",
					"Status": '',
					"KeyWord": '',
					"IsStop": '0',
					"PageSize": 1000,
					"PageIndex": 1,
					};
				this.tabConnect={
					searchDep: '', // 部门本地筛选
					searchUser: '', // 员工
					depId: '', // 部门id
					letterActive: 0, // 当前活动字母
					scrollTop: 0, // 当前滚动距离
					searchDepShow: false // 是否显示部门列表
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
			searchUserBtn() {
				this.QueryStaffFrom.KeyWord= this.tabConnect.searchUser;
				if(this.tabs.active == "0"){
					this.getUserList()
				}
				else{
					this.getJobslist()()
				}
			},
			// 部门筛选员工
			depSearchUser(val) {
				this.QueryStaffFrom.OrganizationId = val;
				if(this.tabs.active == "0"){
					this.getUserList()
				}
				else{
					this.getJobslist()()
				}
			},
			// 选择员工
			getUser(user) {//可在此方法中向父级传值
				if(!this.isMultipleChoice){
					//单选则显示当前选中名称
					console.log(user);
					const obj = {
						keyValue: user.Name,
						keyId: user.Id,
						type: this.form.type,
						OrganizationId:user.OrganizationId,
						OrganizationName:user.OrganizationName,
					}
					this.form = obj
					this.$emit('getToFather',obj)
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
			// list 获取员工列表
			getUserList(req) {
				let obj = {
					"SN":"Organization",
					"MN": "QueryStaff",
					"RequestId": 1,
					"UserId": 1,
					"DataContent": this.QueryStaffFrom
				}
				this.MIX_send(obj);
			},
			// list 获取部门列表
			getJobslist() {
			  this.QueryStaffFrom.IsStop = '';
			  let obj = {
				"SN":"Organization",
			    "MN": "QueryJobs",
			    "RequestId": 1,
			    "UserId": 1,
			    "DataContent": this.QueryStaffFrom
			  }
			  this.MIX_send(obj);
			},
			// tree 获取部门树状
			getDepTree() {
				let objor = {
					"SN":"Organization",
					"MN": "QueryOrganizationTree",
					"RequestId": 1,
					"UserId": 1,
					"DataContent": {}
				}
				this.MIX_send(objor);
			},
			//监听员工/岗位多选
			checkUsers(e){
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
		async created() {
			if(this.isCustomer){
				this.getUserList({}) // 获取员工列表
			}
			else if(this.isDep){
				this.getJobslist() // 获取部门列表
			}
			await this.getDepTree() // 获取部门树状
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
				width: 240px;
				border-radius: 0 4px 4px 0;
			}
		}

		.selectL_radious {
			.el-input__inner {
				width: 190px;
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
