<template>
  <div style="padding:20px">
    <div slot="operation" class="Head_Top">
      <div class="Top_one">
        <el-button @click="addgroup" size="" type="primary">批量排班</el-button>
        <el-date-picker
          v-model="monthdata"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
        >
        </el-date-picker>
      </div>
      <div class="Top_two">
        <div class="Top_two_radio">
          <el-button size="small" style="background:#009900" type="primary">标准</el-button>
          <el-button size="small" style="background:#199ED8" type="primary">例外</el-button>
          <el-button size="small" style="background:#33FF00" type="primary">节假日</el-button>
          <el-button size="small" style="background:#CCCCCC" type="primary">已结束</el-button>
        </div>
        <div class="Top_two_one">
          <el-input placeholder="请输入内容" v-model="listfrom.KeyWord">
            <i
              slot="suffix"
              @click="getlistdata"
              class="el-input__icon el-icon-search"
            ></i>
          </el-input>
        </div>
        <div class="Top_two_two1">
          <el-button
            icon="el-icon-refresh"
            size="small"
            class="refresh"
            @click="getlistdata"
          ></el-button>
        </div>
      </div>
    </div>
    <div slot="table">
      <tablezd
        class="table_cmp"
        :loading="loading"
        :table-data="tableData"
        :table-label="tableLabel"
        @newdata="cellClick"
      ></tablezd>
      <div style="text-align: right;">
        <el-pagination
          v-if="tatolpage < 10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listfrom.PageIndex"
          layout=" prev, pager, next"
          :total="tatolpage"
        >
        </el-pagination>
      </div>
    </div>
    <rosterre ref="rosterre"></rosterre>
    <manual ref="manual"></manual>
  </div>
</template>

<script>
var that
import rosterre from "./dialog/rosterre";
import tablezd from "./dialog/tabel";
import manual from "./dialog/ManualMakeUp";
import Mymixin from "./js/minxin";
export default {
  name: "",
  mixins: [Mymixin],
  data() {
    return {
      modal12: false,
      loading: false,
      tatolpage: 0,
      monthdata: '',
      tableData: [],
      listfrom: {
        "KeyWord": '',
        "Time": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      tableLabel: [
      ],
      fromData: {},
      columns: [],
      menus: []
    };
  },
  components: {
    rosterre,tablezd,manual
  },
  watch: {
    "monthdata": function (params) {
      // console.log(params);
      this.listfrom.Time = params
      this.getmonth(params);
      this.getlistdata()
      // this.getdata(this.data)
    },
    "$store.state.Humanmanage.QueryStaffShift": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.getdata(data.ReturnData.Data)

      // this.tableData = data.ReturnData.Data;
    },
  },
  created() {
    that = this;
    this.getlistdata();
    var date = new Date();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    if (month < 10) {
      month = '0'+ month;
    }
    this.monthdata = year+'-'+month;
    console.log(this.monthdata);
  },
  mounted() {

  },
  methods: {
    // 添加组
    addgroup() {
      this.$refs.rosterre.dialogFormVisible = true;
    },
    getlistdata() {
      let obj = {
		"SN": "Scheduling",
        "MN": "QueryStaffShift",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);
    },
    rowClick(data) { },
    handleCurrentChange(data) {
      this.listfrom.PageIndex = data;
      this.getlistdata();
    },
    handleSizeChange(data) {
      // console.log(data,'handleSizeChange');
      this.listfrom.PageSize = data;
      this.getlistdata();
    },
    handleButton(data) { },
    cellClick(data) {
      if (!this.CompareDate(data.NewData)) {
        return
      }
      this.$refs.manual.form.ShiftDate = data.NewData;
      this.$refs.manual.form.WorkTime = data.WorkTime;
      this.$refs.manual.form.ClosingTime = data.ClosingTime;
      this.$refs.manual.form.StaffName = data.StaffName;
      this.$refs.manual.form.StaffId = data.StaffId;
      if (data.HandId) {
        this.$refs.manual.form.HandId = data.HandId;
      }
      if (data.HandshiftId) {
        this.$refs.manual.form.Id = data.HandshiftId;
      }
      if (data.Desc) {
        this.$refs.manual.form.Desc = data.Desc;
      }
      this.$refs.manual.form.OrganizationName = data.OrganizationName;
      this.$refs.manual.dialogFormVisible = true;
      console.log(data);
      
     },
    handleSortChange(data) { },
    handleSelectionChange(data) { },
    GetTableId(data) {
      console.log(data);
    },
    search() {
      this.getlistdata();
    },
    // 表格上方筛选slot的事件回调
    add() {
      console.log("表格上方筛选slot的事件回调");
    },
    // 弹出框表单提交
    Commit() {
      // console.log(this.$refs.PopForm.value);
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    }
  },
}
</script>

<style lang='less' scoped>
.Head_Top {
  width: 100%;
  height: 51px;
  // overflow: hidden;
  display: flex;
  justify-content: space-between;
  .Top_one {
    width: 350px;
  }
  .Top_two {
    // flex: 1;
    display: flex;
    .Top_two_two {
      padding: 10px;
    }
  }
  .Top_three {
    width: 50px;
  }
}
</style>