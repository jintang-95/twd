<template>
  <div id="shiftde">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
          <!-- <el-button type="primary">导入</el-button>
          <el-button type="primary">配置</el-button> -->
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
        <el-table-column label="班次名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Name }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="考勤时间"  align="center" class-name="status-col">
          <template slot-scope="{row}">
            <span>{{ formatterStatus(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上班容错时间"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.Sfault }}分钟</span>
          </template>
        </el-table-column>
        <el-table-column label="下班容错时间" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.Efault }}分钟</span>
          </template>
        </el-table-column>
        <el-table-column label="严重迟到分钟数" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.SeriousTime }}分钟</span>
          </template>
        </el-table-column>
        <el-table-column label="旷工迟到分钟数：" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Absenteeism }}分钟</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="text" @click="editdetail(row)">
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle">编辑</span> 
            </el-button>
            <el-button type="text" @click="remove(row)">
            <img src="../../../assets/images/delete.png" style="vertical-align:middle"  alt=""> <span style="vertical-align:middle">删除</span> 
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
      <application ref="application" @getlistdata="getlistdata"></application>
    </div>
    
</template>

<script>
import pageTop from '@/components/pageTop.vue'
import application from './dialog/adddefin'
var that;
export default {
  components: {
    pageTop,
    application
  },
  name: "holidayefin",
  data() {
    return {
      title:'',
      input_one:'',
      KeyWord:'',
      loading: false,
      formtype:'1',
      total:0,
      PageSize:10,
      PageIndex:1,
      IsStop:'',
      // checked: true,
      // tatolpage: 0,
     tableKey: 0,
      modal12: false,
      loading: false,
      checked: true,
      tatolpage: 0,
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
    // 搜索
    sendinput() {
      this.getlistdata();
    },
    formatterStatus(row){
      //  console.log(row,1234)
      switch(row.Num) {
        case '1':
         return `${ row.FirstStime }--${ row.FirstEtime }`
        case '2':
         return `${ row.FirstStime }--${ row.FirstEtime } " " ${row.SencordStIme}--${row.SencordEtIme}`
        case '3':
        return `${ row.FirstStime }--${ row.FirstEtime } " " ${row.SencordStIme}--${row.SencordEtIme} ${row.ThirdStime}--${row.ThirdEtime}`
      }
    },
    // 添加组
    addgroup(row) {
       this.$refs.application.formtype =1
        this.$refs.application.dialogFormVisible = true;
    },
    //编辑 
    editdetail(row){
      this.$refs.application.dialogFormVisible = true;
      let rowdata = JSON.parse(JSON.stringify(row));
      if (rowdata.CycleType =='1') {
        rowdata.ShiftInfo = this.getShiftInfo(rowdata.ShiftInfo);
      }
      this.$refs.application.formtype = 2 
        setTimeout(() => {
          this.$refs.application.listfrom = rowdata;
        }, 10);
        this.$refs.application.dialogFormVisible = true;
      
    },
    start(row) {
     let obj = {
        "MN": "UnCancelShift",
        "SN":'Attendance',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "Ids":row.Id
        }
      }
      this.MIX_send(obj);
    },
    stop(row) {
     let obj = {
        "MN": "CancelShift",
        "SN":'Attendance',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "Id":row.Id
        }
      }
      this.MIX_send(obj);
    },
    remove(row) {
     let obj = {
        "MN": "DeleteFrequency",
        "SN": "Attendance",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "Id":row.ID
        }
      }
      this.MIX_send(obj);
      // this.getlistdata();
    },
    getShiftInfo(arr){
      const iconsArr = []; // 声明数组
      arr.forEach((item, index) => {
      const page = Math.floor(index / 7);
      if (!iconsArr[page]) {
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
    },
    getlistdata() {
      if (this.checked) {
        this.listfrom.IsStop = 0;
      } else{
        this.listfrom.IsStop = 1;
      }
      let obj = {
        "MN": "GetFrequencyPages",
        "SN":'Attendance',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          PageIndex: this.PageIndex,
          PageSize :this.PageSize,
          IsStop: this.IsStop,
          Id:'0',
          KeyWord: this.KeyWord,
        }
      }
      this.MIX_send(obj);
    },
    rowClick(data) { },
    handleCurrentChange(PageIndex) {
      this.PageIndex = PageIndex;
      this.getlistdata();
    },
    handleSizeChange(PageSize) {
      // console.log(data,'handleSizeChange');
      this.PageSize = PageSize;
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
  },
  watch: {
     "$store.state.Humanmanage.QueryShift": function (data) {
      this.tatolpage = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
     "$store.state.Humanmanage.GetFrequencyPages": function (data) {
      this.tableData = data.Data;
    },
    "$store.state.Humanmanage.UnCancelShift": function (data) {
      this.$message({
        type: 'success',
        message: '操作成功!'
        });
      this.getlistdata();
    },
    "$store.state.Humanmanage.CancelShift": function (data) {
      this.$message({
        type: 'success',
        message: '操作成功!'
      });
      this.getlistdata();
    },
    "$store.state.Humanmanage.RemoveShift": function (data) {
      this.$message({
        type: 'success',
        message: '操作成功!'
      });
      this.getlistdata();
    },
     "$store.state.Humanmanage.DeleteFrequency": function (data) {
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
#shiftde {
  position: relative;
	/* height: 100%; */
  overflow-y: auto;
	background-color: #FFF;
	border-radius: 5px;
  padding:0 20px;
	box-sizing: border-box;
}
.holifin{
  /* position: relative; */
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
