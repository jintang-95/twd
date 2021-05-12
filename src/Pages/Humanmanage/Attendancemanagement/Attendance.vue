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
          <!-- <i class="iconfont icon-shuaxin" @click="Toreload"></i> -->
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      fit
      :header-cell-style="{background: 'rgb(240, 247, 251)',color: 'rgb(92, 135, 164)'}"
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
            v-if="scope.row.States ==1"
            @click="handleClickone(scope.row)"
            type="text"
            size="small"
          >编辑排班</el-button>
          <el-button
            v-if="scope.row.States == 2"
            @click="handleClicktwo(scope.row)"
            type="text"
            size="small"
          >修改规则</el-button>
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
          Number: 11,
          Type: "排班制",
          AttTime: "电器维修组",
        },
        {
          States: "待审批",
          Number: 22,
          Type: "排班制",
          AttTime: "电器维修组",
        },
        {
          States: "审批通过",
          Number: 33,
          Type: "固定班制",
          AttTime: "电器维修组",
        },
      ],
      tableTitle: [
        { name: "状态", tableprop: "States" },
        { name: "人数", tableprop: "Number " },
        { name: "类型", tableprop: "Type", filter: this.typeList },
        { name: "考勤时间", tableprop: "AttTime", filter: this.AttTime },
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
    typeList (val) {
      switch (val.Type) {
        case '1':
          return `排班制`
          break
        case '2':
          return `固定班制`
          break
      }
    },
    AttTime () {
      switch (val.AttTime) {
        case '1':
          return `排班制`
          break
        case '2':
          return `固定班制`
          break
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
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  background: #fff;
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
.Pages {
  position: absolute;
  margin-top: 50px;
  right: 20px;
}
</style>