<template>
  <div id="attendance">
    <div class="top">
      <div>
        <el-button type="primary">导入考勤</el-button>
        <el-button type="primary">考勤清单</el-button>
      </div>
      <div class="Inputs">
        <div style="margin-right:10px;">
          <el-button style="background:#FF3300;color:white;" size="mini">异常</el-button>
        </div>
        <div style="margin-right:10px">
          <el-button style="background:#009900;color:white;" size="mini">正常</el-button>
        </div>
        <div style="margin-right:10px">
          <el-button style="background:#3366CC;color:white;" size="mini">请假</el-button>
        </div>
        <div style="margin-right:30px">
          <el-date-picker v-model="Month" type="month" placeholder="选择月" style="width:400px;"></el-date-picker>
        </div>
        <div class="check" style="margin-right:10px;position:relative">
          <el-input placeholder="请输入搜索关键字" maxlength="15" style="width:330px;" v-model="InputValue"></el-input>
          <i class="iconfont icon-sousuo" @click="ToCheck"></i>
        </div>
        <div>
          <i class="iconfont icon-shuaxin" @click="Toreload"></i>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background: 'rgb(240, 247, 251)',color: 'rgb(92, 135, 164)'}"
      style="margin-top:20px;padding: 0 20px;"
      show-overflow-tooltip
      @cell-click="CellClick"
      :cell-style="CellStyle"
    >
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        width="110px"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
    <!-- 编辑弹出框 -->
    <el-dialog title="考勤编辑" center :visible.sync="dialog" width="30%">
      <el-form label-width="100px" :model="formone">
        <el-form-item label="部门:">
          <el-input v-model="formone.Department"></el-input>
        </el-form-item>
        <el-form-item label="职员:">
          <el-input v-model="formone.Name"></el-input>
        </el-form-item>
        <el-form-item label="日期:">
          <el-input v-model="formone.Date"></el-input>
        </el-form-item>
        <el-form-item label="排班:">
          <el-input v-model="formone.Schedu"></el-input>
        </el-form-item>
        <el-form-item label="结果:">
          <el-input v-model="formone.Result"></el-input>
        </el-form-item>
        <el-form-item label="实际出勤:">
          <el-input v-model="formone.Attendance"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input v-model="formone.Description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;margin-top:10px;">
        <el-button type="primary" @click="ClickYes">确定</el-button>
        <el-button @click="Canclematerial">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Attendance",
  data () {
    return {
      InputValue: "",
      Month: "",
      tableData: [
        {
          Department: "电器维保组",
          Order: "EAM001",
          Name: "张三",
          date1: "五天",
          date2: "五天",
          date3: "五天",
          date4: "五天",
          date5: "五天",
          date8: "五天",
          date9: "五天",
          date10: "五天",
          date11: "五天",
          date12: "五天"
        },
        {
          Department: "机械维保组",
          Order: "EAM002",
          Name: "李四",
          date4: "五天",
          date5: "五天",
          date6: "五天",
          date7: "五天",
          date8: "五天",
          date11: "五天",
          date12: "五天",
          date13: "五天",
          date14: "五天",
          date15: "五天"
        }
      ],
      tableTitle: [],
      dialog: false,
      formone: {
        Department: "",
        Name: "",
        Date: "",
        Schedu: "",
        Result: "",
        Attendance: "",
        Description: ""
      }
    };
  },
  methods: {
    Addnum (timer) {
      return timer >= 10 ? timer : "0" + timer;
    },
    //搜索
    ToCheck () { },
    //刷新
    Toreload () {
      this.$router.go(0);
    },
    //判断某年某个月有多少天
    DaysNumber (year, month) {
      let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        days[1] = 29;
      }
      return days[month - 1];
    },
    //获取表格日期列表
    Gettitle (value) {
      let year = value.getFullYear();
      let month = value.getMonth() + 1;
      month = this.Addnum(month);
      // console.log(this.DaysNumber(year,month))
      let num = this.DaysNumber(year, month);
      let datearr = [];
      let allarr = [
        { name: "部门", tableprop: "Department" },
        { name: "工号", tableprop: "Order" },
        { name: "职员", tableprop: "Name" }
      ];
      for (var i = 0; i < num; i++) {
        let day;
        let nowtime = new Date();
        nowtime.setFullYear(year, month - 1, i + 1);
        let week = nowtime.getDay();
        switch (week) {
          case 0:
            day = "星期日";
            break;
          case 1:
            day = "星期一";
            break;
          case 2:
            day = "星期二";
            break;
          case 3:
            day = "星期三";
            break;
          case 4:
            day = "星期四";
            break;
          case 5:
            day = "星期五";
            break;
          case 6:
            day = "星期六";
            break;
        }
        let daynumber = this.Addnum(i + 1);
        datearr.push(year + "-" + month + "-" + daynumber + day);
      }
      // console.log(datearr);
      datearr.forEach((v, index) => {
        allarr.push({ name: v, tableprop: "date" + (index + 1) });
      });
      console.log(allarr);
      this.tableTitle = allarr;
    },
    //点击表格单元格
    CellClick (row, column, cell) {
      // console.log(row);
      // console.log(column);
      this.dialog = true;
    },
    //点击确定
    ClickYes () {
      this.dialog = false;
    },
    //点击取消
    Canclematerial () {
      this.dialog = false;
    },
    CellStyle (row, column, rowindex, columnindex) {
      // console.log(row);
      // console.log(row.row.date1);
      if (row.row.date1 == "五天" && row.columnIndex == 4) {
        return { background: "#009900", color: "white" };
      }
    }
  },
  mounted () {
    this.Month = new Date();
    this.Gettitle(this.Month);
  },
  watch: {
    //监听日期选择的变化
    Month: function () {
      this.Gettitle(this.Month);
    }
  }
};
</script>

<style scoped>
#attendance {
  background: #fff;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
.top {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 10px;
}
.Inputs {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.Inputs > div {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.check > i {
  position: absolute;
  right: 20px;
}
</style>