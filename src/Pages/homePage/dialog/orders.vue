<template>
	<el-card shadow="always">
		<div slot="header">
			<span>{{this.title}}</span>
		</div>
		<div class="text" ref="chart1" id="echart2">

		</div>
	</el-card>
</template>

<script>
	import echarts from "echarts"
	export default {
		name: 'orders',
		data() {
			return {
				ordersList: "",
				ordersData: {},
				customColors: [{
						color: '#f56c6c',
						Percentage: 30
					},
					{
						color: '#e6a23c',
						Percentage: 70
					},
					{
						color: '#5cb87a',
						Percentage: 90
					}
				],
				data1:[],
				data2:[]
			};
		},
		props: {
			title: "",
		},
		watch: {
			ordersList: function(data) {
				//alert(this.NeedNum);
				this.ordersData = JSON.parse(this.ordersList);
				for(var i = 0 ; i< this.ordersData.StypeList.length;i++){
					let item = {
				            'name': this.ordersData.StypeList[i],
				            'value': this.ordersData.DataList[i]
				        }
					this.data1.push(item);
				}
				this.showChart();
				//alert(JSON.stringify(this.TaskListData));
			}
		},
		mounted() {
			
		},
		methods: {

			showChart() {
				var that = this;
				let myEchart1 = echarts.init(that.$refs.chart1);
				let index = 0;
				var colorList = ['#73DDFF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
				function fun() {
				        var timer = setInterval(function() {
				         myEchart1.dispatchAction({
				            type: 'hideTip',
				            seriesIndex: 0,
				            dataIndex: index
				        });
				        // 显示提示框
				        myEchart1.dispatchAction({
				            type: 'showTip',
				            seriesIndex: 0,
				            dataIndex: index
				        });
				        // 取消高亮指定的数据图形
				        myEchart1.dispatchAction({
				            type: 'downplay',
				            seriesIndex: 0,
				            dataIndex: index == 0? 5 : index -1
				        });
				         myEchart1.dispatchAction({
				            type: 'highlight',
				            seriesIndex: 0,
				            dataIndex: index
				        });
				        index++;
				        if (index > 5) {
				            index = 0;
				        }
				    },3000)
				}
				
				    fun()
				setTimeout(function() {fun()}, 5000);
				let option = {
				    title: {
				        text: '',
				        x: 'center',
				        y: 'center',
				        textStyle: {
				            fontSize: 20
				        }
				    },
				    tooltip: {
				        trigger: 'item'
				    },
				    series: [{
				        type: 'pie',
				        center: ['50%', '50%'],
				        radius: ['24%', '65%'],
				        clockwise: true,
				        avoidLabelOverlap: true,
				        hoverOffset: 15,
				        itemStyle: {
				            normal: {
				                color: function(params) {
				                    return colorList[params.dataIndex]
				                }
				            }
				        },
				        label: {
				            show: true,
				            position: 'outside',
				            formatter: '{a|{b}：{d}%}\n{hr|}',
				            rich: {
				                hr: {
				                    backgroundColor: 't',
				                    borderRadius: 3,
				                    width: 3,
				                    height: 3,
				                    padding: [3, 3, 0, -12]
				                },
				                a: {
				                    padding: [-30, 15, -20, 15]
				                }
				            }
				        },
				        labelLine: {
				            normal: {
				                length: 20,
				                length2: 30,
				                lineStyle: {
				                    width: 1
				                }
				            }
				        },
				        data: that.data1,
				    }]
				};
				myEchart1.setOption(option);
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

	#echart2 {
		height: 100%;
		overflow: hidden;
	}
</style>
