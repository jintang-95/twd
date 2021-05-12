<template>
  <div class="user_body">
    <div class="user_title">
      <div class="user_title_btn">
        <el-date-picker
          v-model="KeyWord"
          align="right"
          type="datetimerange"
          placeholder="选择日期"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions1"
        >
        </el-date-picker>
      </div>
    </div>
    <div ref="chart1" style="width:100%;height:376px"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      SelectCall: [],
      BlurValue: '',
      optiondata: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['总人数', '出勤人数', '出勤率']
        },
        xAxis: [
          {
            type: 'category',
            data: ['技术部', '研发部', '行政部', '财务部', '销售部', '运维部'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '出勤率',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '总人数',
            type: 'bar',
            data: [20, 49, 70, 232, 256, 767, 1356]
          },
          {
            name: '出勤人数',
            type: 'bar',
            data: [26, 59, 90, 264, 287, 707, 1756]
          },
          {
            name: '出勤率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]
          }
        ]
      },
      pickerOptions1: {
        disabledDate(time) {
          if (time.getTime() > Date.now()) {
            return true;
          }
          if (time.getTime() < (Date.now() - 2592000000)) {
            return true;
          }
          // return (time.getTime() > Date.now())&&(time.getTime() < (Date.now() -2592000000));
        }
      },
      "KeyWord": [],
      listfrom: {
        "ApiIds": '',
        "ApiName": '',
        "StartTime": '',
        "EndTime": '',
      }
    }
  },
  watch: {
  },
  created() {
    var dateTime = new Date();
    dateTime.setTime(dateTime.getTime() - 3600 * 1000 * 24 * 29);
    console.log(dateTime);

    this.KeyWord = [dateTime, new Date()]
    // this.getlistdata();
  },
  methods: {
    AddUser() {
      console.log(this.listfrom);
      if (this.KeyWord.length) {
        this.listfrom.StartTime = this.KeyWord[0];
        this.listfrom.EndTime = this.KeyWord[1];
      }
      if (!this.listfrom.ApiName) {
        this.listfrom.ApiIds = '';
      }
      let obj = {
        "MN": "GetRequestNumber",
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);

    },
    inputblur() {
      this.listfrom.ApiName = this.BlurValue
    },
    exportdata() { },
    search() { },
    getlistdata() {
      let obj = {
        "MN": "GetApis",
        "DataContent": {
          "KeyWord": '',
          "PageSize": 10000,
          "PageIndex": 1
        }
      }
      this.MIX_send(obj);
    },
    handleSelect(data) {
      this.listfrom.ApiIds = data.Id;
      this.listfrom.ApiName = data.Name;
      this.BlurValue = data.Name;
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.SelectCall;
      var results = [];
      restaurants.forEach((item, index) => {
        if (item.Name.indexOf(queryString) >= 0) {
          results.push(item);
        }
      });
      cb(results);
    },
    getEchartData1() {
      const chart1 = this.$refs.chart1;
      if (chart1) {
        const myChart = this.$echarts.init(
          chart1
        );
        var option = this.optiondata;
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getEchartData1();
      // this.AddUser()
    });
  },
}
</script>

<style lang="less" scoped>
.user_body {
  padding: 0 10px 0 10px;
  max-height: calc(100vh - 51px);
  .user_title {
    display: flex;
    padding-top: 5px;
    justify-content: space-between;
  }
}
</style>