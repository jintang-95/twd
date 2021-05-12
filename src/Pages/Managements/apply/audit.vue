<!-- 出库下架单 -->
<template>
  <div class="Scheduling">
    <pageTop :title="pageTitle"></pageTop>
    <el-table :data="tabledatas" @cell-dblclick="aaa"  :header-cell-style="{padding:0,margin:0,background:'#F0F7FB',color:'#5C87A4'}">
      <template v-for="(item,index) in datas">
        <el-table-column :key="index" align="center" width="48">
          <template slot="header">
            <div style="font-size: 10px;">{{item.day}}</div>
            <div style="font-size: 10px;">{{item.week}}</div>
          </template>
          <template slot-scope="scope">
            <div
              @click="aaa(scope.row[item.key])"
              class="status01"
              :style="scope.row[item.key].status==0?'background: #ccc':'background: #009900'"
            >{{scope.row[item.key].weeks}}</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import pageTop from '@/components/pageTop.vue'
export default {
  name: "",
  data() {
    return {
      pageTitle:'',
      datas: [],
      tabledatas: []
    };
  },
  components: {pageTop},
  watch: {},
  methods: {
    aaa(val) {
      console.log(val);
    },
    // 两个日期相差的天数
    getDaysBetween(dateString1, dateString2) {
      let startDate = Date.parse(dateString1);
      let endDate = Date.parse(dateString2);
      let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },
    //获取每个月里面有多少天
    GetMonthToDays(years, months) {
      //判断月分是大月还是小月
      //就可以得出这个月除了2月外是30天还是31天
      let allday,
        ss = new Date(years, months, 0),
        year = ss.getFullYear(),
        month = ss.getMonth() + 1,
        week = new Date(year, month - 1, 1).getDay();
      if (month !== 2) {
        if (month === 4 || month === 6 || month === 9 || month === 11)
          allday = 30;
        else allday = 31;
      } else {
        //判断是否是闰年
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
          allday = 29;
        else allday = 28;
      }
      let arr = [];
      let Ch_arr = ["日", "一", "二", "三", "四", "五", "六"];
      for (let index = 0; index < allday; index++) {
        let days = month + "月" + (index + 1) + "号";
        if (week >= 7) {
          week = 0;
        }
        let obj = {
          status: 0,
          key: "days" + index,
          week: "星期" + Ch_arr[week++],
          day: days
        };
        arr.push(obj);
      }
      this.datas = arr;
    },
    /**
     * stardata:起始日期
     * enddata:所展示的月份
     * period:周期 等于0时默认按照一周七天为一周期
     * weekType:周期选择类型单位  0(周) 1(天)
     * weekdays：weekType为1时所选择的周期天数
     * keyword: 展示特殊情况的描述
     * days: weekType为1时显示不上班的星期，为0时显示上班的星期
     * fate:[] 不上班的日期集合
     */
    GetTableDatas(
      stardata = "2020-04-28",
      enddata = "2020-05-01",
      period = 5,
      weekType = 1,
      weekdays = 4,
      keyword = "",
      days = ["星期一", "星期二"],
      // "星期一", "星期二", "星期三", "星期四", "星期五"
      fate = [5, 15, 20]
    ) {
      let between = this.getDaysBetween(stardata, enddata),
        betweens = weekType
          ? parseInt(between / weekdays)
          : parseInt(between / 6),
        arr = [],
        weeks,
        obj,
        objdays = {};
      weeks = betweens == 0 ? 1 : ++betweens;
      for (let index = 0; index < this.datas.length; index++) {
        obj = {
          status: 0,
          weeks: 1,
          days: days,
          weekType: 0
        };
        let Mweeks = weeks;
        if (weekType) {
          let sum = index + between;
          if (sum % weekdays == 0) {
            Mweeks++;
          }
          if (
            obj.days.indexOf(this.datas[index].week) >= 0 ||
            (fate.length > 0 && fate.indexOf(index + 1) >= 0)
          ) {
            obj.status = 0;
          } else {
            obj.status = 1;
          }
        } else {
          Mweeks = this.datas[index].week == "星期一" ? ++weeks : weeks;
          if (obj.days.indexOf(this.datas[index].week) >= 0) {
            obj.status = 1;
          }
        }
        weeks = period > 0 && Mweeks > period ? 1 : Mweeks;
        obj.weeks = weekType ? (keyword ? keyword : weeks) : weeks;
        objdays["days" + index] = obj;
      }
      this.tabledatas.push(objdays);
    }
  }, //生命周期 - 创建完成（访问当前this实例）
  created() {
    // 初始化选择月份的视图渲染数据
    this.GetMonthToDays(2020, 7);
    // 对视图渲染数据进行筛选
    this.GetTableDatas();
  }, //生命周期 - 挂载完成（访问DOM元素）
  mounted() {this.pageTitle = this.$route.meta.title;}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.status01 {
  color: white;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  margin: 0;
  padding: 0;
  cursor: default;
}
.Scheduling {
  padding: 0 1.25rem;
  border: 1px solid rgba(225, 225, 225, .1);
}
</style>