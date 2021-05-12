<template>
  <div id="approval">
    <div class="top">
      <!-- <el-button type="primary" @click="ClickAdd">新增</el-button> -->
      <div></div>
      <div class="Inputs">
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checkone" @click="Clickone" /> 待审批
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checktwo" @click="Clicktwo" /> 审批通过
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checkthree" @click="Clickthree" /> 审批不通过
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
      :header-cell-style="{background:'#F5F5F5'}"
      style="padding-left:20px;padding-right:20px;margin-top:20px;"
      show-overflow-tooltip
    >
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.States == '待审批'"
            @click="handleClickone(scope.row)"
            type="text"
            size="small"
          >审核</el-button>
          <el-button
            v-if="scope.row.States != '待审批'"
            @click="handleClicktwo(scope.row)"
            type="text"
            size="small"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="Pages">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="pagesize"
        :pager-count="9"
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="请假单" center :visible.sync="dialog" width="40%">
      <el-form label-width="100px" :model="formone">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据编号:">
              <el-input v-model="formone.Order" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间:">
              <el-input v-model="formone.Time" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人:">
              <el-input v-model="formone.People" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在部门:">
              <el-input v-model="formone.Department" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型:">
              <el-input v-model="formone.Type" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请假天数:">
              <el-input v-model="formone.Days" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="请假日期:">
          <el-input v-model="formone.Times" style="width:100%" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请原因:">
          <el-input v-model="formone.Why" type="textarea" :disabled="true"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="13">
            <el-form-item label="审批结论:">
              <el-radio-group v-model="ApprovalType" @change="ChangeType" :disabled="LookType">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
                <el-radio :label="3">打回修改</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="审批时间:">
              <el-date-picker
                v-model="ApprovalDay"
                type="date"
                placeholder="选择日期"
                :disabled="LookType"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审批意见:">
          <el-input v-model="Advice" type="textarea" :disabled="LookType"></el-input>
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
  name: "Approval",
  data () {
    return {
      LookType: false,
      Checkone: true,
      Checktwo: true,
      Checkthree: true,
      InputValue: "",
      tableData: [
        {
          States: "待审批",
          ApplyOrder: "SPA111111",
          ApplyTime: "2019-01-01",
          ApplyPeople: "张三",
          Department: "电器维修组",
          Type: "事假",
          Date: "2019-01-01",
          Days: "1天"
        },
        {
          States: "待审批",
          ApplyOrder: "SPA222222",
          ApplyTime: "2019-01-02",
          ApplyPeople: "李四",
          Department: "电器维修组",
          Type: "事假",
          Date: "2019-01-02",
          Days: "1天"
        },
        {
          States: "审批通过",
          ApplyOrder: "SPA333333",
          ApplyTime: "2019-01-03",
          ApplyPeople: "王五",
          Department: "电器维修组",
          Type: "事假",
          Date: "2019-01-03",
          Days: "1天"
        },
        {
          States: "审批不通过",
          ApplyOrder: "SPA444444",
          ApplyTime: "2019-01-04",
          ApplyPeople: "谢六",
          Department: "电器维修组",
          Type: "事假",
          Date: "2019-01-04,2019-01-05",
          Days: "2天"
        },
        {
          States: "待审批",
          ApplyOrder: "SPA555555",
          ApplyTime: "2019-01-05",
          ApplyPeople: "李七",
          Department: "电器维修组",
          Type: "事假",
          Date: "2019-01-05",
          Days: "1天"
        }
      ],
      tableTitle: [
        { name: "状态", tableprop: "States" },
        { name: "申请单号", tableprop: "ApplyOrder" },
        { name: "申请时间", tableprop: "ApplyTime" },
        { name: "申请人", tableprop: "ApplyPeople" },
        { name: "所在部门", tableprop: "Department" },
        { name: "类型", tableprop: "Type" },
        { name: "请假日期", tableprop: "Date" },
        { name: "请假天数", tableprop: "Days" }
      ],
      total: 20,
      pagesize: 10,
      dialog: false,
      formone: {
        Order: "",
        Time: "",
        People: "",
        Department: "",
        Type: "",
        Days: "",
        Times: "",
        Why: "",
      },
      ApprovalDay: "",
      ApprovalType: "",
      Advice: "",
    };
  },
  methods: {
    //勾选框
    Clickone () {
      if (this.Checkone) {
        this.Checkone = false;
      } else {
        this.Checkone = true;
      }
    },
    Clicktwo () {
      if (this.Checktwo) {
        this.Checktwo = false;
      } else {
        this.Checktwo = true;
      }
    },
    Clickthree () {
      if (this.Checkthree) {
        this.Checkthree = false;
      } else {
        this.Checkthree = true;
      }
    },
    //搜索关键字
    ToCheck () { },
    //刷新
    Toreload () {
      this.$router.go(0);
    },
    //点击审核
    handleClickone (r) {
      this.dialog = true;
      this.LookType = false;
      this.ApprovalType = "";
      this.ApprovalType = "";
      this.Advice = "";
      //补充数据
    },
    //点击查看
    handleClicktwo (r) {
      this.dialog = true;
      this.LookType = true;
      //补充数据
    },
    //分页
    current_change (currentPage) {
      console.log(currentPage);
    },
    //勾选审批意见
    ChangeType (r) {
      console.log(r)
    },
    //点击表单确定
    ClickYes () {
      this.dialog = false;
    },
    //点击表单取消
    Canclematerial () {
      this.dialog = false;
    },
  },
  mounted () { },
  watch: {}
};
</script>

<style scoped>
#approval {
  position: relative;
}
.top {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
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
.Pages {
  position: absolute;
  margin-top: 50px;
  right: 20px;
}
</style>