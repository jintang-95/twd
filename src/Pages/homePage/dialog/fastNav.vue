<template>
	<el-card shadow="always">
		<div slot="header">
			<span>{{this.title}}</span>
		</div>
		<div class="text" id="fastNav">
			<div>
				<router-link to="/PlaningTask/PlanWork/Program">
					<img src="../../../assets/images/icon-jh.png" alt="">
					<span>计划</span>
				</router-link>
			</div>
			<div>
				<router-link to="/PlaningTask/PlanTask/center">
					<img src="../../../assets/images/icon-rw.png" alt="">
					<span>任务</span>
				</router-link>
			</div>
			<div>
				<router-link to="/WorkManage/index">
					<img src="../../../assets/images/icon-gd.png" alt="">
					<span>工单</span>
				</router-link>
			</div>
			<div>
				<router-link to="/approvalRecord/approvalRecord">
					<img src="../../../assets/images/icon-sp.png" alt="">
					<span>审批</span>
				</router-link>
			</div>
			<div>
				<router-link to="/managewhite/apply/apply">
					<img src="../../../assets/images/icon-wlsl.png" alt="">
					<span>物料申领</span>
				</router-link>
			</div>
			<div>
				<router-link to="/managewhite/apply/apply">
					<img src="../../../assets/images/icon-bjsl.png" alt="">
					<span>备件申领</span>
				</router-link>
			</div>
			<div>
				<router-link to="/managewhite/apply/apply">
					<img src="../../../assets/images/icon-gjsl.png" alt="">
					<span>工具申领</span>
				</router-link>
			</div>
			<div>
				<router-link to="/Purchasingmanagement/Ordermanagement/Purchaserequisition">
					<img src="../../../assets/images/icon-qg.png" alt="">
					<span>请购</span>
				</router-link>
			</div>
			<div>
				<router-link to="/Purchasingmanagement/Ordermanagement/Purchaseorder">
					<img src="../../../assets/images/icon-cg.png" alt="">
					<span>采购</span>
				</router-link>
			</div>
			<div>
				<router-link to="/managewhite/input/receivingnot">
					<img src="../../../assets/images/icon-rk.png" alt="">
					<span>入库</span>
				</router-link>
			</div>
			<div>
				<router-link to="/managewhite/output/receivingnot">
					<img src="../../../assets/images/icon-ck.png" alt="">
					<span>出库</span>
				</router-link>
			</div>
			<div>
				<router-link to="/managewhite/allot/apply">
					<img src="../../../assets/images/icon-db.png" alt="">
					<span>调拨</span>
				</router-link>
			</div>

		</div>
	</el-card>
</template>

<script>
	export default {
		name: 'fastNav',
		data() {
			return {

			};
		},
		props: {
			title: "",
		},
		watch: {

		},
		methods: {

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

	.text .items {
		width: 100%;
		margin: 15px 0;
	}

	.text .items .item-text {
		width: 100%;
		font-size: 1rem;
		padding: 0.25rem;
		box-sizing: border-box;
	}

	.text .items .item-text span {
		display: block;
	}

	.lefts {
		float: left;
		background: none !important;
	}

	.right {
		float: right;
	}

	#fastNav {
		width: 100%;
		height: 100%;
	}

	#fastNav div {
		width: 25%;
		height: 31%;
		text-align: center;
		margin-top: 6px;
		line-height: 2;
		font-size: 14px;
	}
	#fastNav div a{
		text-decoration: none;
		color:#333;
	}

	#fastNav div img {
		display: block;
		margin: 0 auto;
	}
</style>
