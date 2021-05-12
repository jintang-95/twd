<template>
	<el-card shadow="always">
		<div slot="header">
			<span>{{this.title}}</span>
		</div>
		<div class="text">
			<div class="items" v-for="items in TaskListData" :key="items.ID" @click="showInfo(items)">
				<el-progress :text-inside="true" :stroke-width="26" :percentage="parseInt(items.Percentage)" :color="customColors"></el-progress>
				<div class="item-text">
					<span class="lefts">{{items.TaskName}}</span>
					<span class="right" v-if="items.Grade==0"><el-tag type="info" size="small">普通</el-tag></span>
					<span class="right" v-if="items.Grade==1"><el-tag type="warning" size="small">重要</el-tag></span>
					<span class="right" v-if="items.Grade==2"><el-tag type="danger" size="small">紧急</el-tag></span>
				</div>
			</div>
		</div>
	</el-card>
</template>

<script>
	export default {
	  name: 'Tasks',
	  data() {
	    return {
	        TaskList:"",
			TaskListData:{},
			customColors: [
			          {color: '#f56c6c', percentage: 30},
			          {color: '#e6a23c', percentage: 70},
			          {color: '#5cb87a', percentage: 90}
			        ]
	    };
	  },
	  props: {
	      title:"",
	  },
	  watch: {
		 TaskList:function(){
		 	//alert(this.NeedNum);
			this.TaskListData = JSON.parse(this.TaskList);
			// alert(JSON.stringify(this.TaskListData));
		 }
	  },
	  methods: {
	      showInfo(item){
			this.$router.push({
					path: '/PlaningTask/PlanTask/center',
					query: {
						row:item
					}
				});
		  }
	  },
	}
</script>

<style>
	.el-card__body{
		padding: 0!important;
		height: calc(100% - 52px)!important;
	}
	.text{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		overflow-y: auto;
	}
	.text .items{
		width: 100%;
		margin:15px 0;
	}
	.text .items .item-text{
		width: 100%;
		font-size: 1rem;
		padding: 0.25rem;
		box-sizing: border-box;
	}
	.text .items .item-text span{
		display: block;
	}
	.lefts{
		float: left;
		background: none!important;	
	}
	.right{
		float: right;
	}
</style>
