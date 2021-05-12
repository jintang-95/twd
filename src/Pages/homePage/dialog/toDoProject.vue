<template>
	<el-card shadow="always">
		<div slot="header">
			<span>{{this.title}}</span>
		</div>
		<div class="text">
			<el-card class="box-card bg-dj">
				<div slot="header" class="clearfix">
					<span>待审批单据</span>
				</div>
				<div class="text item" @click="go1">
					<span v-if="this.NeedNumData.NeedtApprovalNum">{{this.NeedNumData.NeedtApprovalNum}}</span>
					<span v-else>0</span>
				</div>
			</el-card>
			<el-card class="box-card bg-rw">
				<div slot="header" class="clearfix">
					<span>待执行任务</span>
				</div>
				<div class="text item" @click="go2">
					<span v-if="this.NeedNumData.TastNeedExeNum">{{this.NeedNumData.TastNeedExeNum}}</span>
					<span v-else>0</span>
				</div>
			</el-card>
			<el-card class="box-card bg-rw">
				<div slot="header" class="clearfix">
					<span>执行中任务</span>
				</div>
				<div class="text item" @click="go2">
					<span v-if="this.NeedNumData.TastNeedExeingNum">{{this.NeedNumData.TastNeedExeingNum}}</span>
					<span v-else>0</span>
				</div>
			</el-card>
			<el-card class="box-card bg-gd">
				<div slot="header" class="clearfix">
					<span>待分配工单</span>
				</div>
				<div class="text item" @click="go3">
					<span v-if="this.NeedNumData.NeedDistributionNum">{{this.NeedNumData.NeedDistributionNum}}</span>
					<span v-else>0</span>
				</div>
			</el-card>
			<el-card class="box-card bg-gd">
				<div slot="header" class="clearfix">
					<span>待处理工单</span>
				</div>
				<div class="text item" @click="go3">
					<span v-if="this.NeedNumData.WoNeedExeNUm">{{this.NeedNumData.WoNeedExeNUm}}</span>
					<span v-else>0</span>
				</div>
			</el-card>
			<el-card class="box-card bg-gd">
				<div slot="header" class="clearfix">
					<span>处理中工单</span>
				</div>
				<div class="text item" @click="go3">
					<span v-if="this.NeedNumData.WoNeedExeingNUm">{{this.NeedNumData.WoNeedExeingNUm}}</span>
					<span v-else>0</span>
				</div>
			</el-card>
		</div>
	</el-card>
</template>

<script>
	export default {
		name: 'toDoProject',
		data() {
			return {
				NeedNum: "",
				NeedNumData: {}
			};
		},
		props: {
			title: "",
		},
		watch: {
			NeedNum: function() {
				//alert(this.NeedNum);
				this.NeedNumData = JSON.parse(this.NeedNum);
			}
		},
		methods: {
			go1() {
				this.$router.push("/approvalCenter/approvalRecord");
			},
			go2() {
				this.$router.push("/PlaningTask/PlanTask/center");
			},
			go3() {
				this.$router.push("/WorkManage/index");
			}
		},
	}
</script>

<style>
	.el-card__body {
		padding: 0 !important;
		height: calc(100% - 52px) !important;
	}

	.text {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		overflow-y: auto;
	}

	.text .el-card {
		width: 48%;
		margin: 0.3125rem auto;
		font-size: 0.875rem !important;
		box-shadow: none;
		/* height: 33%!important; */
	}

	.text .el-card .el-card__header {
		padding: 0.625rem 0.9375rem 0.4375rem 0.9375rem !important;
		border: none !important;
	}

	.text .el-card .el-card__body {
		padding: 0 0.9375rem 0.3125rem 0.9375rem !important;
		font-size: 2rem !important;
	}

	/* .text .el-card:nth-child(1){
		background:rgba(234,241,251,1);
	}
	.text .el-card:nth-child(2){
		background:rgba(246,245,240,1);
	}
	.text .el-card:nth-child(3){
		background:rgba(248,243,246,1);
	}
	.text .el-card:nth-child(4){
		background:rgba(240,247,245,1);
	}
	.text .el-card:nth-child(5){
		background:rgba(246,245,240,1);
	}
	.text .el-card:nth-child(6){
		background:rgba(234,241,251,1);
	} */
	.bg-rw {
		background: url(../../../assets/images/bg-rw.png) no-repeat center center;
		background-size: 100% 100%;
	}

	.bg-gd {
		background: url(../../../assets/images/bg-gd.png) no-repeat center center;
		background-size: 100% 100%;
	}

	.bg-dj {
		background: url(../../../assets/images/bg-dj.png) no-repeat center center;
		background-size: 100% 100%;
	}

	@media screen and (max-width: 1910px) {
		.text .el-card .el-card__body {
			padding: 0 0.9375rem 0.3125rem 0.9375rem !important;
			font-size: 2rem !important;
		}

		.text .el-card {
			width: 30%;
			height: 48%;
			/* height: 33%!important; */
		}
	}
</style>
