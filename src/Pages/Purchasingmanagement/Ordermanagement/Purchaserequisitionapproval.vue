<template>
  <div id="approval">
    <button @click="open">open</button>
      <ApprovalReqShop ref="ApprovalReqShop"></ApprovalReqShop>
    <div class="top">
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
          >审批</el-button>
          <el-button
            v-if="scope.row.States == '审批通过' || scope.row.States == '审批不通过' "
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
    <!-- 审核弹出框 -->
    <el-dialog title="购买申请单审批" center :visible.sync="dialog" width="800px">
      <el-form label-width="100px" :model="formone">
        <el-row>
          <el-col :span="8">
            <el-form-item label="单据编号:">
              <el-input v-model="formone.ApplyOrder" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间:">
              <el-input v-model="formone.ApplyTime" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请购类型:">
              <el-input v-model="TypeValue" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请部门:">
              <el-input v-model="formone.Department" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前岗位:">
              <el-input v-model="formone.Jobs" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人:">
              <el-input v-model="formone.ApplyPeople" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请原因:">
          <el-input v-model="formone.Why" type="textarea" :disabled="true" placeholder="请输入申请调动的原因"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审批结论:">
              <el-radio-group v-model="formone.radio" @change="ChangeChoose">
                <el-radio :label="1" :disabled="LookType">通过</el-radio>
                <el-radio :label="2" :disabled="LookType">不通过</el-radio>
                <el-radio :label="3" :disabled="LookType">打回修改</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批时间:">
              <el-date-picker
                v-model="formone.ApprovalTime"
                type="date"
                placeholder="选择日期"
                :disabled="LookType"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审批意见:">
          <el-input
            v-model="formone.Idea"
            type="textarea"
            placeholder="请输入审批意见"
            :disabled="LookType"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="foottable">
        <el-tabs type="border-card">
          <el-tab-pane label="购买明细">
            <div class="tablecontent">
              <el-table
                :data="Formtable"
                :header-cell-style="{background:'#F5F5F5'}"
                show-overflow-tooltip
                style="width:100%"
                max-height="200"
              >
                <el-table-column
                  v-for="(item,index) in Formtabletitle"
                  :key="index"
                  :prop="item.tableprop"
                  :label="item.name"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template>
                    <el-button type="text" size="small" :disabled="true">编辑</el-button>
                    <el-button type="text" size="small" :disabled="true">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="text-align:right;margin-top:10px;">
        <el-button type="primary" @click="ClickYes">确定</el-button>
        <el-button @click="ClickCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalReqShop from '../dialog/ApprovalReqShop'
export default {
  name: "approval",
  data() {
    return {
      LookType: false,
      Checkone: true,
      Checktwo: true,
      Checkthree: true,
      InputValue: "",
      tableTitle: [
        { name: "状态", tableprop: "States" },
        { name: "申请单号", tableprop: "ApplyOrder" },
        { name: "申请时间", tableprop: "ApplyTime" },
        { name: "申请人", tableprop: "ApplyPeople" },
        { name: "所在部门", tableprop: "Department" },
        { name: "当前岗位", tableprop: "Jobs" },
        { name: "请购原因", tableprop: "Why" }
      ],
      tableData: [
        {
          States: "待审批",
          ApplyOrder: "SF7896465",
          ApplyTime: "2018-1-1",
          ApplyPeople: "张三",
          Department: "电器维修组01",
          Jobs: "电器维修工程师001",
          Why: "检修备货",
          Type: "工作需求"
        },
        {
          States: "待审批",
          ApplyOrder: "SF7896466",
          ApplyTime: "2018-1-2",
          ApplyPeople: "李四",
          Department: "电器维修组",
          Jobs: "电器维修工程师",
          Why: "检修备货",
          Type: "工作需求01"
        },
        {
          States: "审批通过",
          ApplyOrder: "SF7896466",
          ApplyTime: "2018-1-3",
          ApplyPeople: "王五",
          Department: "电器维修组",
          Jobs: "电器维修工程师",
          Why: "检修备货",
          Type: "工作需求02"
        },
        {
          States: "审批不通过",
          ApplyOrder: "SF7896466",
          ApplyTime: "2018-1-4",
          ApplyPeople: "王六",
          Department: "电器维修组",
          Jobs: "电器维修工程师",
          Why: "检修备货",
          Type: "工作需求03"
        }
      ],
      total: 20,
      pagesize: 10,
      dialog: false,
      TypeValue: "",
      formone: {
        ApplyOrder: "",
        ApplyTime: "",
        Department: "",
        Jobs: "",
        ApplyPeople: "",
        Why: "",
        ApprovalTime: "",
        Idea: "",
        radio: ""
      },
      Formtable: [
        {
          Materialcode: "201256",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Number: "9",
          Unit: "个"
        },
        {
          Materialcode: "201257",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Number: "9",
          Unit: "个"
        },
        {
          Materialcode: "201258",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Number: "9",
          Unit: "个"
        },
        {
          Materialcode: "201256",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Number: "9",
          Unit: "个"
        }
      ],
      Formtabletitle: [
        { name: "物料编码", tableprop: "Materialcode" },
        { name: "物料名称", tableprop: "Materialname" },
        { name: "规格", tableprop: "Specifications" },
        { name: "型号", tableprop: "Model" },
        { name: "数量", tableprop: "Number" },
        { name: "单位", tableprop: "Unit" }
      ]
    };
  },
  components: {
    ApprovalReqShop
  },
  methods: {
    //点击勾选框
    Clickone() {
      if (this.Checkone) {
        this.Checkone = false;
      } else {
        this.Checkone = true;
      }
    },
    Clicktwo() {
      if (this.Checktwo) {
        this.Checktwo = false;
      } else {
        this.Checktwo = true;
      }
    },
    open(){
      this.$refs.ApprovalReqShop.dialogFormVisible=true;
    },
    Clickthree() {
      if (this.Checkthree) {
        this.Checkthree = false;
      } else {
        this.Checkthree = true;
      }
    },
    //查询关键字
    ToCheck() {},
    //刷新
    Toreload() {
      this.$router.go(0);
    },
    //分页
    current_change(currentPage) {
      console.log(currentPage);
    },
    //点击审批
    handleClickone(r) {
      this.dialog = true;
      this.formone.ApplyOrder = r.ApplyOrder;
      this.formone.ApplyTime = r.ApplyTime;
      this.formone.Department = r.Department;
      this.formone.Jobs = r.Jobs;
      this.formone.Why = r.Why;
      this.formone.ApplyPeople = r.ApplyPeople;
      this.TypeValue = r.Type;
    },
    //点击查看
    handleClicktwo(r) {
      this.LookType = true;
      this.handleClickone(r);
      //补充审批结果
    },
    //改变审批意见勾选
    ChangeChoose(value) {
      this.formone.radio = value;
    },
    //点击确定
    ClickYes() {
      this.dialog = false;
      this.LookType = false;
    },
    //点击取消
    ClickCancel() {
      this.dialog = false;
      this.LookType = false;
    }
  },
  watch: {},
  mounted() {}
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
  right: 200px;
}
.foottable {
  position: relative;
  width: 100%;
}
.tablecontent {
  width: 100%;
  height: 200px;
}
</style>