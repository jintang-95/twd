<template>
  <div id="attendance">
    <pageTop :title="title"></pageTop>
    <div class="top">
      <div class="PerLeft">
        <div class="typeLabel" @click="selectAll(0)">
          <i class="icon-front"></i>
          {{ title }}
        </div>
        <el-tree
          :data="Menudata"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :highlight-current="true"
        ></el-tree>
      </div>
      <div class="PerRight">
        <div class="operation">
          <div class="buttons">
            <el-button type="primary" @click="ClickAdd">新增</el-button>
          </div>
          <div class="inputs">
            <!-- <el-checkbox-group v-model="checkList" @change="checkChange">
              <el-checkbox :label="0">休息</el-checkbox>
              <el-checkbox :label="1">假日</el-checkbox>
              <el-checkbox :label="2">正常</el-checkbox>
              <el-checkbox :label="3">补卡</el-checkbox>
            </el-checkbox-group>-->
            <el-date-picker
              style="margin-left: 10px;"
              v-model="time"
              value-format="yyyy-MM-dd"
              @change="dateChange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <div class="check" style="margin-right:10px;position:relative;margin-left: 10px;">
              <el-input
                placeholder="请输入搜索关键字"
                maxlength="15"
                style="width:330px;"
                v-model="InputValue"
              ></el-input>
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
              <el-button @click="handleClickone(scope.row)" type="text" size="small">
                <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt />
                <span style="vertical-align:middle">编辑</span>
              </el-button>
              <el-button @click="handleClicktwo(scope.row)" type="text" size="small">
                <img src="../../../assets/images/look.png" style="vertical-align:middle" alt />
                <span style="vertical-align:middle">查看</span>
              </el-button>
              <el-button @click="handleClickthree(scope.row)" type="text" size="small">
                <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt />
                <span style="vertical-align:middle">删除</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="Pages">
          <el-pagination
            :hide-on-single-page="true"
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="current_change"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      title="考勤清单"
      @close="$refs.form.resetFields()"
      center
      :visible.sync="dialog"
      width="60%"
    >
      <el-form :rules="rule" label-width="80px" ref="form" :model="formone">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="StaffId" label="员工:" label-width="120px">
              <el-select
                class="input_disabled"
                :disabled="LookType"
                style="width: 100%;"
                v-model="formone.StaffId"
                placeholder="请选择员工"
                @change="apllyselect"
              >
                <el-option
                  :label="item.Name"
                  :value="item.Id"
                  v-for="(item,index) in staffoption"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="Sdate" label="考勤日期:" label-width="120px">
              <el-date-picker
                v-model="formone.Sdate"
                :disabled="LookType"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班次:" prop="FrequencyId" label-width="120px">
              <el-select
                class="input_disabled"
                :disabled="LookType"
                style="width: 100%;"
                v-model="formone.FrequencyId"
                placeholder="请选择班次"
                filterable
                :filter-method="getShift"
                @change="seletChange"
              >
                <el-option
                  :label="item.Name"
                  :value="item.ID"
                  v-for="(item,index) in shiftList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考勤类型:" prop="AttendanceType" label-width="120px">
              <el-select
                class="input_disabled"
                :disabled="LookType"
                style="width: 100%;"
                v-model="formone.AttendanceType"
                placeholder="请选择考勤类型"
              >
                <el-option
                  :label="item.Name"
                  :value="item.Id"
                  v-for="(item,index) in AttendanceTypeList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上班1时间:" label-width="120px">
              <el-input disabled placeholder="签退时间" v-model="formone.FirstStime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下班1时间:" label-width="120px">
              <el-input disabled placeholder="签退时间" v-model="formone.FirstEtime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上班2时间:" label-width="120px">
              <el-input disabled placeholder="签到时间" v-model="formone.SencordStime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下班2时间:" label-width="120px">
              <el-input disabled placeholder="签退时间" v-model="formone.SencordEtime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上班3时间:" label-width="120px">
              <el-input disabled placeholder="签到时间" v-model="formone.ThirdStime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下班3时间:" label-width="120px">
              <el-input disabled placeholder="签退时间" v-model="formone.ThirdEtime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="迟到类型:" label-width="120px">
              <el-input v-model="formone.Late" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="迟到时长:" label-width="120px">
              <el-input v-model="formone.LateTime" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="早退类型:" label-width="120px">
              <el-input v-model="formone.Leave" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="早退时长:" label-width="120px">
              <el-input v-model="formone.LeaveTime" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;margin-top:10px;">
        <el-button type="primary" @click="ClickYes">确定</el-button>
        <el-button @click="Canclematerial">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageTop from "../../../components/pageTop.vue";
export default {
  name: "Attendance",
  data () {
    return {
      title: "考勤记录",
      checkList: [],
      OrganizationId: 0,
      time: '',
      LookType: false,
      Menudata: [
        {
          Name: "人力资源部",
          Children: [{ Name: "人事部" }, { Name: "行政部" }]
        },
        {
          Name: "设备运维部",
          Children: [
            { Name: "电器维保组" },
            { Name: "机械维保组" },
            { Name: "综合巡检组" }
          ]
        },
        {
          Name: "采购部",
          Children: [{ Name: "设备采购部" }, { Name: "综合采购部" }]
        }
      ],
      defaultProps: {
        children: "Children",
        label: "Name"
      },
      Checkone: true,
      Checktwo: true,
      InputValue: "",
      tableData: [],
      tableTitle: [
        { name: "状态", tableprop: "AttendanceTypeName" },
        { name: "工号", tableprop: "StaffNo" },
        { name: "姓名", tableprop: "StaffName" },
        { name: "考勤日期", tableprop: "Sdate" },
        { name: "班次", tableprop: "FrequencyName" },
        { name: "考勤类型", tableprop: "AttendanceTypeName" },
        { name: "考勤日期", tableprop: "Sdate" },
        { name: "上班1签到", tableprop: "FirstStime" },
        { name: "下班1签到", tableprop: "FirstEtime" },
        { name: "上班2签到", tableprop: "SencordStime" },
        { name: "下班2签到", tableprop: "SencordEtime" },
        { name: "上班3签到", tableprop: "ThirdStime" },
        { name: "下班3签到", tableprop: "ThirdEtime" },
        { name: "迟到类型", tableprop: "Late" },
        { name: "迟到时长", tableprop: "LateTime" },
        { name: "早退类型", tableprop: "Leave" },
        { name: "早退时长", tableprop: "LeaveTime" },
      ],
      staffoption: [],
      AttendanceTypeList: [{
        Id: '0',
        Name: '休息'
      }, {
        Id: '1',
        Name: '假日'
      }, {
        Id: '2',
        Name: '正常'
      }, {
        Id: '3',
        Name: '补卡'
      }],
      shiftList: [],
      total: 20,
      pagesize: 10,
      page: 1,
      BeginTime: '',
      EndTime: '',
      dialog: false,
      currentId: '',
      formone: {
        StaffId: "",
        Sdate: "",
        FirstStime: "",
        FirstEtime: "",
        SencordStime: "",
        SencordEtime: "",
        ThirdStime: "",
        ThirdEtime: "",
        Late: "",
        LateTime: "",
        Leave: "",
        LeaveTime: ""
      },
      rule: {
        StaffId: [
          { required: true, message: '请选择员工', trigger: 'blur' }
        ],
        Sdate: [
          { required: true, message: '请选择考勤日期', trigger: 'blur' }
        ],
        FrequencyId: [
          { required: true, message: '请选择员工', trigger: 'blur' }
        ],
        AttendanceType: [
          { required: true, message: '请选择考勤类型', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getData()
    this.getstaff()
    this.getShift('')
  },
  methods: {
    // 
    seletChange (val) {
      let arr = this.shiftList.filter(item => item.ID === val)[0]
      console.log(arr)
      this.formone.FirstStime = arr.FirstStime
      this.formone.FirstEtime = arr.FirstEtime
      this.formone.SencordStime = arr.SencordStIme
      this.formone.SencordEtime = arr.SencordEtIme
      this.formone.ThirdStime = arr.ThirdStime
      this.formone.ThirdEtime = arr.ThirdEtime
    },
    // 获取班次
    getShift (keyWord) {
      let obj = {
        "MN": "GetAllFrequency",
        "SN": "Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {}
      }
      this.MIX_send(obj);
    },
    // 获取员工
    getstaff () {
      let obj = {
        "MN": "QueryStaff",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "IsStop": '1'
        }
      }
      this.MIX_send(obj);
    },
    apllyselect (e) {
      this.staffoption.forEach((item, index) => {
        if (item.Id == e) {
          console.log(item)
          this.formone.StaffId = item.Id;
        }
      })
    },
    // 获取数据
    getData () {
      let obj = {
        "MN": "GetAttendanceRecordPages",
        "SN": "Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          staffName: this.InputValue,
          BeginTime: this.BeginTime,
          EndTime: this.EndTime,
          OrganizationId: this.OrganizationId,
          PageSize: this.pagesize,
          PageIndex: this.page,
        }
      }
      this.MIX_send(obj);
    },
    // 删除
    removeData (id) {
      let obj = {
        "MN": "DeleteAttendanceRecord",
        "SN": "Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          Id: id
        }
      }
      this.MIX_send(obj);
    },
    // 清除
    cycleData (id) {
      let obj = {
        "MN": "QueryStaff",
        "SN": "Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          Id: id
        }
      }
      this.MIX_send(obj);
    },
    // 时间切换
    dateChange (time) {
      this.BeginTime = time[0]
      this.EndTime = time[1]
      this.getData()
    },
    //点击菜单导航
    handleNodeClick (r) {
      this.OrganizationId = r.$treeNodeId
      this.getData()
    },
    selectAll (id) {
      this.OrganizationId = id
      this.getData()
    },
    //点击新增
    ClickAdd () {
      this.dialog = true;
      this.LookType = false;
      this.currentId = 0
      this.formone = {
        StaffId: "",
        Sdate: "",
        FrequencyId: '',
        AttendanceType: '',
        FirstStime: "",
        FirstEtime: "",
        SencordStime: "",
        SencordEtime: "",
        ThirdStime: "",
        ThirdEtime: "",
        Late: "",
        LateTime: "",
        Leave: "",
        LeaveTime: ""
      };
    },
    //勾选框
    checkChange (ids) {

    },
    //点击搜索
    ToCheck () {
      this.getData()
    },
    //刷新
    Toreload () {
      this.$router.go(0);
    },
    //点击编辑
    handleClickone (r) {
      this.dialog = true;
      this.LookType = false;
      this.currentId = r.Id
      console.log(r)
      //填充数据
      this.formone = {
        StaffId: r.StaffId,
        Sdate: r.Sdate,
        FrequencyId: r.FrequencyId,
        AttendanceType: r.AttendanceType,
        FirstStime: r.FirstStime,
        FirstEtime: r.FirstEtime,
        SencordStime: r.SencordStime,
        SencordEtime: r.SencordEtime,
        ThirdStime: r.ThirdStime,
        ThirdEtime: r.ThirdEtime,
        Late: r.Late,
        LateTime: r.LateTime,
        Leave: r.Leave,
        LeaveTime: r.LeaveTime
      }
    },
    //点击查看
    handleClicktwo (r) {
      this.dialog = true;
      this.LookType = true;
      this.currentId = r.Id
      //填充数据
      this.formone = {
        StaffId: r.StaffId,
        Sdate: r.Sdate,
        FrequencyId: r.FrequencyId,
        AttendanceType: r.AttendanceType,
        FirstStime: r.FirstStime,
        FirstEtime: r.FirstEtime,
        SencordStime: r.SencordStime,
        SencordEtime: r.SencordEtime,
        ThirdStime: r.ThirdStime,
        ThirdEtime: r.ThirdEtime,
        Late: r.Late,
        LateTime: r.LateTime,
        Leave: r.Leave,
        LeaveTime: r.LeaveTime
      }
    },
    //点击删除
    handleClickthree (r) {
      console.log(r)
      this.$confirm("是否删除此条考勤记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeData(r.Id)
        })
        .catch(() => {
          this.$message.error('取消删除')
        });
    },
    //点击清除
    handleClickfour (r) {
      this.$confirm("是否清除此条考勤记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.cycleData(r.Id)
        })
        .catch(() => {
          this.$message.warning('取消清除')
        });
    },
    //分页
    current_change (currentPage) {
      this.page = currentPage
      this.getData()
    },
    //点击表单确定
    ClickYes () {
      if (this.LookType) {
      } else {
        //数据提交
        this.$refs.form.validate(va => {
          if (va) {
            let obj = {
              Id: this.currentId,
              StaffId: this.formone.StaffId,
              Sdate: this.formone.Sdate,
              AttendanceType: this.formone.AttendanceType,
              FrequencyId: this.formone.FrequencyId,
              FirstStime: this.formone.FirstStime == '' ? '00:00' : this.formone.FirstStime,
              FirstEtime: this.formone.FirstEtime == '' ? '00:00' : this.formone.FirstEtime,
              SencordStime: this.formone.SencordStime == '' ? '00:00' : this.formone.SencordStime,
              SencordEtime: this.formone.SencordEtime == '' ? '00:00' : this.formone.SencordEtime,
              ThirdStime: this.formone.ThirdStime == '' ? '00:00' : this.formone.ThirdStime,
              ThirdEtime: this.formone.ThirdEtime == '' ? '00:00' : this.formone.ThirdEtime,
              Late: this.formone.Late,
              LateTime: this.formone.LateTime,
              Leave: this.formone.Leave,
              LeaveTime: this.formone.LeaveTime,
            }
            this.MIX_send({
              "MN": "AddOrUpdateAttendanceRecord",
              "SN": "Attendance",
              "RequestId": 1,
              "UserId": 1,
              "DataContent": obj
            })
          }
        })
      }
    },
    //点击表单取消
    Canclematerial () {
      this.dialog = false;
    }
  },
  mounted () { },
  watch: {
    "$store.state.Kaoqin.GetAttendanceRecordPages" (newVal, oldVal) {
      if (newVal.Code === 0) {
        let arr = newVal.ReturnData.Data.map(item => {
          item.AttendanceTypeName = item.AttendanceType == '0' ? '休息' : item.AttendanceType == '1' ? '假日' : item.AttendanceType == '2' ? '正常' : '补卡'
          return item
        })
        this.tableData = arr
        this.total = newVal.ReturnData.DataCount
      } else {
        this.$message.error(newVal.Message)
      }
    },
    "$store.state.Kaoqin.DeleteAttendanceRecord" (newVal, oldVal) {
      if (newVal.Code == 0) {
        this.$message.success('删除成功')
        this.getData()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    "$store.state.Kaoqin.AddOrUpdateAttendanceRecord" (newVal, oldVal) {
      if (newVal.Code == 0) {
        this.$message.success('保存成功')
        this.dialog = false;
        this.getData()
      } else {
        this.$message.error(newVal.Message)
      }
    },
    // 获取职员
    "$store.state.Humanmanage.QueryStaff": function (data) {
      this.staffoption = data.ReturnData.Data;
    },
    // 获取班次
    "$store.state.Kaoqin.GetAllFrequency": function (data) {
      console.log('111', data)
      this.shiftList = data.ReturnData;
    },
  },
  components: {
    pageTop
  }
};
</script>

<style scoped >
#attendance {
  /* display: flex; */
  height: 100%;
  position: relative;
  background: #fff;
  padding: 0 20px;
}
.top {
  display: flex;
  height: calc(100% - 56px);
}
.typeLabel {
  position: relative;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  cursor: pointer;
  border-bottom: 1px solid #e6e6e6;
}
.icon-front {
  width: 2px;
  height: 15px;
  background: rgba(0, 96, 160, 1);
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 10px;
  margin-top: -8px;
}
.typeLabel:hover {
  background: rgb(236, 245, 255);
}

.typeLabel:active {
  background: #e6e6e6;
}
.PerLeft {
  min-width: 180px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e6e6e6;
}
.Name {
  width: 180px;
  height: 45px;
  line-height: 45px;
  font-size: 24px;
  text-align: center;
}
.PerRight {
  width: calc(100% - 288px);
  flex: 1;
}
.operation {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons {
  width: 310px;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.buttons > div {
  width: 90px;
  height: 40px;
  color: white;
  line-height: 40px;
  text-align: center;
  background: #108cee;
}
.inputs {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.inputs > div {
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
.el-button--primary {
  color: #fff;
  background-color: #0060a0;
  border-color: #0060a0;
  width: 6.8125rem;
  height: 2.6875rem;
}
.el-button--text {
  color: #0060a0;
}
</style>
<style lang="less">
.is-current > .el-tree-node__content {
  background-color: rgba(240, 247, 251, 1);
  color: #0060a0 !important;
}
</style>