<template>
  <div id="holiday">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
          <el-button type="primary" style="width:180px" @click="search">初始化今年节假日信息</el-button>
          <!-- <el-button type="primary">配置</el-button> -->
        </div>
        <div class="inputs">
          <div style="margin-right:13px;">
            <!-- <el-select v-model="typeValue" multiple placeholder="状态:选择状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </div>
          <div class="check" style="margin-right:10px;">
            <el-input v-model="KeyWord" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
        style="margin-top:20px;"
        show-overflow-tooltip
        fit
        @handleSortChange="handleSortChange"
        @handleSelectionChange="handleSelectionChange"
        highlight-current-row>
        <el-table-column label="节假日名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Hname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Sdate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Edate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <label v-if="scope.row.Stype==1">假日</label>
            <label v-if="scope.row.Stype==2">上班</label>
          </template>
        </el-table-column>
        <!-- <el-table-column label="描述" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Desc }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button  type="text"  @click="editdetail(row)">
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">编辑</span> 
            </el-button>
            <el-button   type="text" @click="remove(row)">
            <img src="../../../assets/images/delete.png" style="vertical-align:middle"  alt="">  <span style="vertical-align:middle">删除</span> 
            </el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="PageIndex"
        :page-size="PageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        align="right"
        class="pagination">
      </el-pagination>
      <holiday ref="holiday" @getlistdata="getlistdata"></holiday>
    </div>
    
</template>

<script>
import pageTop from '@/components/pageTop.vue'
import holiday from './dialog/holiday'
var that;
export default {
  components: {
    pageTop,
    holiday
  },
  name: "holidayefin",
  data() {
    return {
      title:'',
      KeyWord:'',
      loading: false,
      formtype:'1',
      // checked: true,
      // tatolpage: 0,
      PageIndex: 1,
      PageSize:10,
      total:0,
      IsStop:'',
      tableData: [],
      listfrom: {
        "Id": '',
        "KeyWord": '',
        "IsStop": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      fromData: {},
      columns: [],
      menus: [],
      optionProps: {
        value: 'Id',
        label: 'Name',
        children: 'Children',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    };
  },
  created() {
    that = this;
    this.getlistdata();
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  methods: {
    search() {
       let obj = {
          "MN": "InitAttendanceHolidayByApi",
          "SN":"Attendance",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {

          }
        }
        this.MIX_send(obj);
    }, 
    // 搜索
    sendinput() {
       this.getlistdata();
    },
    // 添加组
    addgroup() {
      this.$refs.holiday.formtype = 1;
      this.$refs.holiday.dialogFormVisible = true;
    },
    // 编辑
    editdetail(row){
      let rowdata = JSON.parse(JSON.stringify(row));
      this.$refs.holiday.formtype = 2;
      this.$refs.holiday.value6 = [rowdata.Sdate,rowdata.Edate];
      this.$refs.holiday.form = rowdata;
      this.$refs.holiday.dialogFormVisible = true;
    },
    // 删除
    remove(row) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "MN": "DeleteAttendanceHoliday",
          "SN":"Attendance",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            "Id":row.Id
          }
        }
        this.MIX_send(obj);
      }).catch(() => {
      });
    },
    // 查询列表数据
    getlistdata() {
       if (this.checked) {
        this.listfrom.IsStop = 0;
      } else{
        this.listfrom.IsStop = 1;
      }
      let obj = {
        "MN": "GetAttendanceHolidayPages",
        "SN":"Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          PageIndex:this.PageIndex,
          PageSize:this.PageSize,
          KeyWord:this.KeyWord,
          IsStop:this.IsStop
        }
      }
      this.MIX_send(obj);
    },
    handleSortChange() {

    },
    handleSelectionChange() {

    },
    // 页面Size切换
    handleSizeChange(PageSize) {
      this.PageSize = PageSize;
      this.getlistdata();
    },
    // 页面切换
    handleCurrentChange(PageIndex) {
      this.PageIndex = PageIndex;
      this.getlistdata();
    },
    // Toreload() {
    //   this.listfrom = {
    //     "Status": '',
    //     "KeyWord": '',
    //     "Status": '',
    //     "PageSize": 10,
    //     "PageIndex": 1
    //   }
    //   this.getlistdata();
    // },
    // search() {
    //   this.getlistdata();
    // },
  },
  watch: {
    "$store.state.Purchasingmanagement.MNvalue.GetUsers": function (data) {
      this.tatolpage = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.QueryHoliday": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    //查询成功 返回数据
     "$store.state.Humanmanage.GetAttendanceHolidayPages": function (data) {
        this.total = data.DataCount
      this.tableData = data.Data;
    },
    "$store.state.Humanmanage.UnCancelHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.CancelHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.RemoveHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.InitAttendanceHolidayByApi": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    // 删除成功 返回数据    
    "$store.state.Humanmanage.DeleteAttendanceHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "$store.state.Humanmanage.UnCancelShift": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getlistdata();
    },
    "checked": function (data) {
        this.getlistdata();
    },
  },
};
</script>

<style scoped>
#holiday {
  position: relative;
	width: 100%;
	/* height: 100%; */
	background-color: #FFF;
	border-radius: 5px;
  padding : 0 20px;
  overflow-y: auto;
	box-sizing: border-box;
}
.holifin{
  /* position: relative; */
	width: 100%;
	/* height: 100%; */
  background-color:#FFF;
	border-radius: 5px;
  padding:20px;
	box-sizing: border-box;
}
.operation {
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
/*  padding-left: 20px;
  padding-right: 20px; */
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
.check {
  width: 274px;
  height: 38px !important;
  position: relative;
}
.check > input {
  height: 38px;
  border: none;
  line-height: 40px;
  width: 250px;
  border: 1px solid gray;
}
.check > i {
  position: absolute;
  right: 20px;
  color: #5C87A4;
}
.Pages {
  margin-top: 20px;
  position: absolute;
  right: 100px;
}
.el-button--primary {
    color: #FFF;
    background-color: #0060A0;
    border-color: #0060A0;
	width: 6.8125rem;
	height:2.6875rem;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
.info {
  color: #DFE4ED;
}
.warn{
	color: #FFBA00;
}
.el-tag {
  border: none;
  background: none!important;
  font-size: 14px;
}
.el-tag img{
	display: inline-block;
	margin-right: 5px;
}
.el-button--text{
	color: #0060A0;
	font-size: 14px;
}
.el-button--text img{
	display: inline-block;
	margin-right: 5px;
	width: 13px;
}

</style>
