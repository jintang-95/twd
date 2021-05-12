<template>
	<el-card shadow="always">
		<div slot="header">
			<span>{{this.title}}</span>
		</div>
		<div class="text" ref="chart" id="echart">

		</div>
	</el-card>
</template>

<script>
	import echarts from "echarts"
	export default {
		name: 'device',
		data() {
			return {
				deviceList: "",
				deviceData: {},
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
			deviceList: function(data) {
				//alert(this.NeedNum);
				this.deviceData = JSON.parse(this.deviceList);
				this.data1 = this.deviceData.TypeList;
				let key;
				for(var i = 0 ; i<this.data1.length;i++){
					for (let index in this.deviceData.DataList[i]){
							key = index;
						}
					if(this.data1[i]==key){
						this.data2.push(this.deviceData.DataList[i][key]);
					}
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
				let myEchart = echarts.init(that.$refs.chart);
				const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#aaaa00', '#00ff00']
				let option = {
					backgroundColor: '',
					title: {
						text: '',
						textStyle: {
							fontSize: 12,
							fontWeight: 400
						},
						left: 'center',
						top: '5%'
					},
					legend: {
						icon: 'circle',
						top: '5%',
						right: '5%',
						itemWidth: 6,
						itemGap: 20,
						textStyle: {
							color: '#556677'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							label: {
								show: true,
								backgroundColor: '#fff',
								color: '#556677',
								borderColor: 'rgba(0,0,0,0)',
								shadowColor: 'rgba(0,0,0,0)',
								shadowOffsetY: 0
							},
							lineStyle: {
								width: 0
							}
						},
						backgroundColor: '#fff',
						textStyle: {
							color: '#5c6c7c'
						},
						padding: [10, 10],
						extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
					},
					grid: {
						top: '15%'
					},
					xAxis: [{
						type: 'category',
						data: that.deviceData.DateList,
						axisLine: {
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							interval: 0,
							textStyle: {
								color: '#556677'
							},
							// 默认x轴字体大小
							fontSize: 12,
							// margin:文字到x轴的距离
							margin: 15
						},
						axisPointer: {
							label: {
								fontSize: 12,
								backgroundColor: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#fff' // 0% 处的颜色
									}, {
										offset: 0.86,
										color: '#fff' // 0% 处的颜色
									}, {
										offset: 0.86,
										color: '#33c0cd' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#33c0cd' // 100% 处的颜色
									}],
									global: false // 缺省为 false
								}
							}
						},
						boundaryGap: false
					}],
					yAxis: [{
						type: 'value',
						axisTick: {
							show: false
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#556677'
							}
						},
						splitLine: {
							show: false
						}
					}, {
						type: 'value',
						show:false,
						position: 'right',
						axisTick: {
							show: false
						},
						axisLabel: {
							textStyle: {
								color: '#556677'
							},
							formatter: '{value}'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						splitLine: {
							show: false
						}
					}],
					series: [{
							name: that.data1[0],
							type: 'line',
							data: that.data2[0],
							symbolSize: 1,
							symbol: 'circle',
							smooth: true,
							yAxisIndex: 0,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
										offset: 0,
										color: '#9effff'
									},
									{
										offset: 1,
										color: '#9E87FF'
									}
								]),
								shadowColor: 'rgba(158,135,255, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: colorList[0],
									borderColor: colorList[0]
								}
							}
						}, {
							name: that.data1[1],
							type: 'line',
							data: that.data2[1],
							symbolSize: 1,
							symbol: 'circle',
							smooth: true,
							yAxisIndex: 0,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
										offset: 0,
										color: '#73DD39'
									},
									{
										offset: 1,
										color: '#73DDFF'
									}
								]),
								shadowColor: 'rgba(115,221,255, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: colorList[1],
									borderColor: colorList[1]
								}
							}
						},
						{
							name: that.data1[2],
							type: 'line',
							data: that.data2[2],
							symbolSize: 1,
							yAxisIndex: 1,
							symbol: 'circle',
							smooth: true,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
										offset: 0,
										color: '#fe9a'
									},
									{
										offset: 1,
										color: '#fe9a8b'
									}
								]),
								shadowColor: 'rgba(254,154,139, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: colorList[2],
									borderColor: colorList[2]
								}
							}
						},
						{
							name: that.data1[3],
							type: 'line',
							data: that.data2[3],
							symbolSize: 1,
							yAxisIndex: 1,
							symbol: 'circle',
							smooth: true,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
										offset: 0,
										color: '#aa5500'
									},
									{
										offset: 1,
										color: '#aa5500'
									}
								]),
								shadowColor: 'rgba(85, 255, 127, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: colorList[3],
									borderColor: colorList[3]
								}
							}
						}
					]
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

	#echart {
		height: 100%;
	}
</style>
