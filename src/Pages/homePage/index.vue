<!-- 主页管理 -->
<template>
<div class="white">
	<div id="contentBox">
		<div class="box-card box-card-top">
			<fastNav ref="fastNav" :title="fastNavTitle"></fastNav>
		</div>
		<!-- 代办事项 -->
		<div class="box-card box-card-top">
			<toDoProject ref="toDoProject" :title="toDoProjectTitle"></toDoProject>
		</div>
		<!-- 执行任务进度 -->
		<div class="box-card box-card-top">
			<Tasks ref="Tasks" :title="TasksTitle"></Tasks>
		</div>
		<!-- 设备情况统计走势图 -->
		<div class="box-card">
			<device ref="device" :title="deviceTitle"></device>
		</div>
		<div class="box-card">
			<!-- 工单汇总 -->
			<orders ref="orders" :title="ordersTitle"></orders>
			<!-- 任务情况 -->
			<orderType ref="orderType" :title="orderTypeTitle"></orderType>
		</div>
	</div>
</div>
</template>

<script>
import toDoProject from "./dialog/toDoProject.vue";
import Tasks from "./dialog/Tasks.vue";
import device from "./dialog/device.vue";
import orders from "./dialog/orders.vue";
import orderType from "./dialog/orderType.vue";
import fastNav from "./dialog/fastNav.vue";
import { mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
		toDoProjectTitle:"代办事项",
		TasksTitle:"执行任务进度",
		deviceTitle:"设备情况统计走势图",
		ordersTitle:"工单汇总",
		orderTypeTitle:"工单执行情况",
		fastNavTitle:"快捷方式"
	};
  },
  components:{
	  toDoProject,
	  Tasks,
	  device,
	  orders,
	  orderType,
	  fastNav
  },
  async created() {
	await this.GetHomeDatas();
  },
  methods:{
	  GetHomeDatas(){
		const StaffIds = JSON.parse(sessionStorage.getItem("UserDetial")).Id;
		// alert(StaffIds);
		let obj = {
		  	SN:"SystemHome",
		  	MN: "GetHomeData",
		  	DataContent: {
				StaffId: StaffIds,
			}
		}
		  this.MIX_send(obj);
	  }
  },
  computed: {
    ...mapGetters(["GetHomeData"])
  },
  watch:{
	  GetHomeData:function(data){
		  console.log(JSON.stringify(data))
		  this.$refs.toDoProject.NeedNum=JSON.stringify(data.ReturnData.NeedNum);
		  this.$refs.Tasks.TaskList=JSON.stringify(data.ReturnData.TaskList);
		  this.$emit('func',JSON.stringify(data.ReturnData.TopMsg));
		  this.$refs.device.deviceList=JSON.stringify(data.ReturnData.WorkOrderTren);
		  this.$refs.orders.ordersList=JSON.stringify(data.ReturnData.TaskData);
		  this.$refs.orderType.orderTypeList=JSON.stringify(data.ReturnData.WorkOrderStatus);
	  }
  },
  mounted() {}
};
</script>
<style scoped lang="less">
.white {
  height: calc(100vh - 75px);
  overflow-y: auto;
  background:#EEF3FE!important;
  box-sizing: border-box;
	padding: 0.625rem;
}

#contentBox{
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: stretch;
}
#contentBox .box-card{
	width:33.33%;
	box-sizing: border-box;
	height: 60%;
	padding:0.625rem;
	margin: 0!important;
}
#contentBox .box-card:nth-child(4){
	width: 66.6%;
}
#contentBox .box-card:last-child{
	display: flex;
	// flex-wrap: wrap;
	flex-direction: column;
}

#contentBox .box-card .el-card{
	height: 100%;
	box-sizing: border-box;
	padding: 0 15px;
}

#contentBox .box-card-top{
	height: 40%;
}

#contentBox .box-card:last-child .el-card{
	height: calc(50% - 10px);
}
#contentBox .box-card:last-child .el-card:last-child{
	margin-top: 20px
}
</style>