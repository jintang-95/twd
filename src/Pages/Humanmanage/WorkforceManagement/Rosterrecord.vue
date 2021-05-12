<!-- 排班记录 start -->
<template>
  <div id="user">
	<pageTop :title="title"></pageTop>
    <div class="operation">
      <div class="buttons">
        <el-button type="primary" @click="addgroup">新增考勤组</el-button>
      </div>
      <div class="inputs">
        <!-- <div style="margin-right:13px;">
			<el-select v-model="typeValue" multiple placeholder="状态:选择状态">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
        </div> -->
        <div class="check" style="margin-right:10px;">
          <el-input v-model="listfrom.KeyWord" placeholder="请输入搜索关键字" maxlength="15" style="width:274px;"></el-input>
          <i class="iconfont icon-sousuo" @click="search"></i>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      style="margin-top:20px; height: calc(100% - 130px);"
      show-overflow-tooltip
	  id="tableBox"
    >
    <el-table-column label="名称" width="200px" align="center">
      <template slot-scope="{row}">
        <span>{{ row.ScheduleName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="排班类型" align="center" width="200px">
      <template slot-scope="{row}">
        <span>{{ row.AttTypeStr }}</span>
      </template>
    </el-table-column>
    <el-table-column label="覆盖人数" align="center" width="200px">
      <template slot-scope="{row}">
        <span>{{ row.WorkerCount }}</span>
      </template>
    </el-table-column>
	<el-table-column label="考勤时间" align="center">
	  <template slot-scope="{row}">
		<div v-for=" items in row.FixedAttendanceTime" :key="items.Id" v-if="row.AttType==1">
				<span>星期{{items.WeekDay}}:&nbsp;</span>
				<span v-if="items.Frequency!=null">
					{{ items.Frequency.Name }}
					&nbsp;
					<span>{{ items.Frequency.FirstStime }} - {{ items.Frequency.FirstEtime }}</span>
					<span v-if="items.Frequency.SencordStIme&&items.Frequency.SencordStIme!=''">{{ items.Frequency.SencordStIme }} - {{ items.Frequency.SencordEtIme }}</span>
					<span v-if="items.Frequency.ThirdStime&&items.Frequency.ThirdStime!=''">{{ items.Frequency.ThirdStime }} - {{ items.Frequency.ThirdEtime }}</span>
				</span>
				<span v-else>休息</span>
		</div>
		<div v-if="row.AttType==2">
			<div v-for=" items2 in row.SchedulAttendanceTime" :key="items2.Id">	
				{{ items2.Name }}
				&nbsp;
				<span>{{ items2.FirstStime }} - {{ items2.FirstEtime }}</span>
				<span v-if="items2.SencordStIme&&items2.SencordStIme!=''">{{ items2.SencordStIme }} - {{ items2.SencordEtIme }}</span>
				<span v-if="items2.ThirdStime&&items2.ThirdStime!=''">{{ items2.ThirdStime }} - {{ items2.ThirdEtime }}</span>
			</div>
			<span>休息</span>
		</div>
	  </template>
	</el-table-column>
    <el-table-column
      label="状态"
      sortable="custom"
      align="center"
      class-name="status-col"
      width="100"
    >
      <template slot-scope="{row}">
        <el-tag
          class="success"
          :hit="false"
          v-if="row"
          color="#fff"
        >
          <img src="../../../assets/images/圆点-绿色.png" alt />已启用
        </el-tag>
    
        <el-tag
          class="danger"
          :hit="false"
          v-if="row.Status=='3'"
        >
          <img src="../../../assets/images/圆点-红色.png" alt />已停用
        </el-tag>
      </template>
    </el-table-column>
   
      <el-table-column prop label="操作" width="300" align="center">
        <template slot-scope="scope">
<!--          <el-button
            v-if="scope.row.Status==2"
            @click="seeDetail(scope.row)"
            type="text"
            size="small"
          >查看</el-button> -->
          <el-button
            v-if="scope.row.AttType==2"
            @click="editRoster(scope.row)"
            type="text"
            size="small"
          ><img src="../../../assets/images/edit_icon.png" alt />编辑排班</el-button>
          <el-button
            v-if="scope.row.AttType =='1'||scope.row.AttType==2"
            @click="editdetail(scope.row)"
            type="text"
            size="small"
          ><img src="../../../assets/images/edit_icon.png" alt />修改规则</el-button>
          <el-button
            v-if="scope.row.Status =='3'"
            @click="start(scope.row)"
            type="text"
            size="small"
          ><img src="../../../assets/images/start_icon.png" alt />启用</el-button>
          <el-button
            v-if="scope.row.Status =='2'"
            @click="stop(scope.row)"
            type="text"
            size="small"
          > <img src="../../../assets/images/stop_icon.png" alt />停用</el-button>
          <el-button
            @click="remove(scope.row)"
            type="text"
            size="small"
          ><img src="../../../assets/images/del_icon.png" alt />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="Pages">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="listfrom.PageSize"
        :pager-count="9"
        layout="prev, pager, next"
        :total="tatolpage"
        @current-change="listfrom.PageIndex"
      ></el-pagination>
    </div>
	<manual ref="manual"></manual>
	<rosterre ref="rosterre"></rosterre>
	<Staffrostering ref="Staffrostering"></Staffrostering>
  </div>
</template>

<script>
import pageTop from '@/components/pageTop.vue'
import rosterre from "./dialog/rosterre";
import manual from "./dialog/ManualMakeUp";
import Staffrostering from "./dialog/Staffrostering";
var that;
export default {
  name: 'Makeupclass',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'info',
        2: 'success',
        3: 'danger',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
 data() {
    return {
		title:"",
      tableKey: 0,
      modal12: false,
      loading: false,
      checked: true,
      checked1: true,
      tatolpage: 0,
      tableData: [],
      listfrom: {
        "KeyWord": '',
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
      	},
	input_one:"",
	options: [{
	          value: '1',
	          label: '已停用'
	        }, {
	          value: '2',
	          label: '已结束'
	        }],
	typeValue: [],
    };
  },
  components: {
    rosterre,manual,pageTop,Staffrostering
  },
  watch: {
    "checked":function (params) {
      this.getlistdata()
    },
    "checked1":function (params) {
      this.getlistdata()
    },
     "$store.state.Humanmanage.GetAttendanceSchedulePages": function (data) {
      this.tatolpage = data.DataCount;
      this.tableData =JSON.parse(data.Data);
    },
	"$store.state.Humanmanage.LogicDeleteAttendanceSchedule":function(newValue, oldValue) {
	  if (newValue.Code === 1) {
	    this.$message({
	      showClose: true,
	      message: newValue.Message,
	      type: "success",
	    });
	    this.getlistdata();
	  } else {
	    this.$message({
	      showClose: true,
	      message: newValue.Message,
	      type: "fail",
	    });
	  }
	},
	"$store.state.Humanmanage.GetAttendanceSchedule": function (data) {
	  this.$refs.rosterre.formtype = 2;
	  this.$refs.rosterre.formData = data.ReturnData;
	  this.$refs.rosterre.dialogFormVisible = true;
	},
  },
  methods: {
    // 添加组
    addgroup() {
      this.$refs.rosterre.formtype = 1;
      this.$refs.rosterre.dialogFormVisible = true;
    },
    seeDetail(row){
      if (row.ShiftType=='1') {
        this.$refs.rosterre.formtype = 3;
        this.$refs.rosterre.value = [row.StartDate,row.EndDate];
        this.$refs.rosterre.listfrom.Desc = row.Desc;
        this.$refs.rosterre.listfrom.ShiftId = row.ShiftId;
        if (row.StaffId) {
			this.$refs.rosterre.setkey(row.StaffId.split(","));
        }
        this.$refs.rosterre.dialogFormVisible = true;
      } else {
        this.$refs.rosterre.formtype = 3;
        this.$refs.manual.dialogFormVisible = true;
      }
    },
	editRoster(row) {
		this.$refs.Staffrostering.rowId = row.Id;
		this.$refs.Staffrostering.dialogFormVisible = true;
	},
    editdetail(row) {
		let obj = {
			"SN":"Attendance",
		  "MN": "GetAttendanceSchedule",
		  "RequestId": 1,
		  "UserId": 1,
		  "DataContent": {
			  Id:row.Id,
		  }
		}
		this.MIX_send(obj);
    },
    getlistdata() {
      let obj = {
		"SN":"Attendance",
        "MN": "GetAttendanceSchedulePages",
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
    cellClick(data) { },
    handleSortChange(data) { },
    handleSelectionChange(data) { },
    GetTableId(data) {
      console.log(data);
    },
    Toreload() {
      this.listfrom = {
        "Status": '',
        "KeyWord": '',
        "Status": '',
        "PageSize": 10,
        "PageIndex": 1
      }
      this.getlistdata();
    },
    search() {
      this.getlistdata();
    },
    // 表格上方筛选slot的事件回调
    add() {
      console.log("表格上方筛选slot的事件回调");
    },
    // 逻辑删除
    remove(row) {
      let obj = {
	    "SN":"Attendance",
        "MN": "LogicDeleteAttendanceSchedule",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
			Id:row.Id
		}
      }
      this.MIX_send(obj);
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    },
    CompareDate(d1) {
        return ((new Date(d1.replace(/-/g, "\/"))) > (new Date()));
    },
    //  判断时间是否在某个区间内
    isDateBetween(dateString, startDateString, endDateString) {
        var flag = false;
        var startFlag = (this.dateCompare(dateString, startDateString) < 1);
        var endFlag = (this.dateCompare(dateString, endDateString) > -1);
        if (startFlag && endFlag) {
            flag = true;
        }
        return flag;
    },
    dateCompare(dateString, compareDateString) {
        var dateTime = this.dateParse(dateString).getTime();
        var compareDateTime = this.dateParse(compareDateString).getTime();
        if (compareDateTime > dateTime) {
            return 1;
        } else if (compareDateTime == dateTime) {
            return 0;
        } else {
            return -1;
        }
    },
    dateParse(dateString) {
        var SEPARATOR_BAR = "-";
        var SEPARATOR_SLASH = "/";
        var SEPARATOR_DOT = ".";
        var dateArray;
        if (dateString.indexOf(SEPARATOR_BAR) > -1) {
            dateArray = dateString.split(SEPARATOR_BAR);
        } else if (dateString.indexOf(SEPARATOR_SLASH) > -1) {
            dateArray = dateString.split(SEPARATOR_SLASH);
        } else {
            dateArray = dateString.split(SEPARATOR_DOT);
        }
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    that = this;
    this.getlistdata();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
	this.title = this.$route.meta.title;
  }
}
</script>
<style>
.tableBox th{
  padding: 0!important;
  height: 50px;
  line-height: 50px;
  background: #F5F5F5;
  color: #666;
  text-align: center;
}
.tableBox td{
  padding: 0!important;
  height: 50px;
  line-height: 50px;
}
.filter-container{
  padding-bottom: 20px;
}
#user {
  position: relative;
	width: 100%;
	height: 100%;
	background-color: #fff;
	border-radius: 5px;
	padding:0 1.1875rem;
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
#tableBox .el-table__body-wrapper{
	height: calc(100% - 70px);
	overflow-y: auto;
}
</style>
