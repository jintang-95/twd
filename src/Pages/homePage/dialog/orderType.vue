<template>
	<el-card shadow="always">
		<div slot="header">
			<span>{{this.title}}</span>
		</div>
		<div class="text" ref="chart3" id="echart3">

		</div>
	</el-card>
</template>

<script>
	import echarts from "echarts"
	export default {
		name: 'orderType',
		data() {
			return {
				orderTypeList: "",
				orderTypeData: {},
				customColors: [{
						color: '#f56c6c',
						percentage: 30
					},
					{
						color: '#e6a23c',
						percentage: 70
					},
					{
						color: '#5cb87a',
						percentage: 90
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
			orderTypeList: function(data) {
				//alert(this.NeedNum);
				this.orderTypeData = JSON.parse(this.orderTypeList);
				for(var i = 0 ; i< this.orderTypeData.StypeList.length;i++){
					let item = {
				            'name': this.orderTypeData.StypeList[i],
				            'value': this.orderTypeData.DataList[i]
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
				let myEchart = echarts.init(that.$refs.chart3);
				let dashedPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAAOBAMAAAB6G1V9AAAAD1BMVEX////Kysrk5OTj4+TJycoJ0iFPAAAAG0lEQVQ4y2MYBaNgGAMTQQVFOiABhlEwCugOAMqzCykGOeENAAAAAElFTkSuQmCC';
				let color = ['#FF8700', '#ffc300', '#00e473', '#009DFF', '#0034ff'];
				let chartData = that.data1;
				let arrName = [];
				let arrValue = [];
				let sum = 0;
				let pieSeries = [],
				    lineYAxis = [];
				
				// 数据处理
				chartData.forEach((v, i) => {
				    arrName.push(v.name);
				    arrValue.push(v.value);
				    sum = sum + v.value;
				})
				
				// 图表option整理
				chartData.forEach((v, i) => {
				    pieSeries.push({
				        name: '',
				        type: 'pie',
				        clockWise: false,
				        hoverAnimation: false,
				        radius: [75 - i * 15 + '%', 67 - i * 15 + '%'],
				        center: ["30%", "50%"],
				        label: {
				            show: false
				        },
				        data: [{
				            value: v.value,
				            name: v.name
				        }, {
				            value: sum - v.value,
				            name: '',
				            itemStyle: {
				                color: "rgba(0,0,0,0)"
				            }
				        }]
				    });
				    pieSeries.push({
				        name: '',
				        type: 'pie',
				        silent: true,
				        z: 1,
				        clockWise: false, //顺时加载
				        hoverAnimation: false, //鼠标移入变大
				        radius: [75 - i * 15 + '%',67 - i * 15 + '%'],
				        center: ["30%", "50%"],
				        label: {
				            show: false
				        },
				        data: [{
				            value: 7.5,
				            itemStyle: {
				                color: "#E3F0FF"
				            }
				        }, {
				            value: 2.5,
				            name: '',
				            itemStyle: {
				                color: "rgba(0,0,0,0)"
				            }
				        }]
				    });
				    v.percent = (v.value / sum * 100).toFixed(1) + "%";
				    lineYAxis.push({
				        value: i,
				        textStyle: {
				            rich: {
				                circle: {
				                    color: color[i],
				                    padding: [0, 5]
				                }
				            }
				        }
				    });
				})
				
				let option = {
				    backgroundColor: '#fff',
				    color: color,
				    grid: {
				        top: '12%',
				        bottom: '54%',
				        left: "30%",
				        containLabel: false
				    },
				    yAxis: [{
				        type: 'category',
				        inverse: true,
				        axisLine: {
				            show: false
				        },
				        axisTick: {
				            show: false
				        },
				        axisLabel: {
				            formatter: function(params) {
				                let item = chartData[params];
				                console.log(item)
				                return '{line|}{circle|●}{name|'+ item.name +'}{bd||}{percent|'+item.percent+'}{value|'+ item.value+'}'
				            },
				            interval: 0,
				            inside: true,
				            textStyle: {
				                color: "#333",
				                fontSize: 14,
				                rich: {
				                    line: {
				                        width: 170,
				                        height: 10,
				                        backgroundColor: {image: dashedPic}
				                    },
				                    name: {
				                        color: '#666',
				                        fontSize: 14,
				                    },
				                    bd: {
				                        color: '#ccc',
				                        padding: [0, 5],
				                        fontSize: 14,
				                    },
				                    percent:{
				                        color: '#333',
				                        fontSize: 14,
				                    },
				                    value: {
				                        color: '#333',
				                        fontSize: 16,
				                        fontWeight: 500,
				                        padding: [0, 0, 0, 20]
				                    },
				                    unit: {
				                        fontSize: 14
				                    }
				                }
				            },
				            show: true
				        },
				        data: lineYAxis
				    }],
				    xAxis: [{
				        show: false
				    }],
				    series: pieSeries
				};
				myEchart.setOption(option);
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

	#echart3 {
		height: 100%;
		overflow: hidden;
	}
</style>
