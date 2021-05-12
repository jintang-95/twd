<template>
  <div id="record">
    <div class="holifin">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <!-- <el-button type="primary" @click="addgroup">新增</el-button> -->
        </div>
         <div class="inputs">
          <!-- <el-select v-model="value" placeholder="状态:请选择" @change="statusChange" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.IsDel">
            </el-option>
         </el-select> -->
          <!-- <div class="check" style="margin-right:10px;">
            <el-input v-model="input_one" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div> -->
        </div> 
        
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
        style="margin-top:20px;"
        show-overflow-tooltip
        fit
        highlight-current-row>
        <!-- <el-table-column label="分类ID" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ID }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="任务名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.TaskName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行人名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ExecStaffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Addtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务完成度" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Percentage }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" sortable="custom" align="center">
          <template slot-scope="{row}">
            <div v-if="row.Status=='1'">
             <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle; color:#F56262">执行中</span>
            </div>
            <div v-if="row.Status=='2'">
             <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle; color:#8CD16B">已完成</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.Isdel=='0'"  type="text"  @click="editdetail(row)">
              <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">编辑</span> 
            </el-button>
            <el-button v-if="row.IsDel=='0'"  type="text"  @click="start(row)">
              <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">启用</span> 
            </el-button>
            <el-button v-if="row.IsDel=='0'"  type="text" @click="stop(row)">
              <img src="../../../assets/images/stop_icon.png" style="vertical-align:middle"  alt="">  <span style="vertical-align:middle">停用</span> 
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增弹框 -->
      <el-dialog
        :title="formtype == 1 ? '新增任务执行记录' : '编辑任务执行记录'"
        :visible.sync="dialogVisible"
        width="45%"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="12">
                <el-form-item label="创建时间">
                   <el-date-picker type="date"
                        placeholder="选择日期" 
                        value-format="yyyy-MM-dd" 
                        v-model="form.Addtime" >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="任务完成度" label-width="82px">
                  <el-input v-model="form.Percentage" style="width:210px;"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="任务执行状态" label-width="100px">
                    <el-select v-model="form.Status" placeholder="请选择任务状态">
                       <el-option label="执行中" value="1"></el-option>
                       <el-option label="已完成" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
             <el-col :span="24">
                <el-form-item label="描述">
                  <el-input  type="textarea" v-model="form.Remark" style="width:210px;"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <holiday ref="holiday"></holiday> -->
  </div>
</template>

<script>
 import pageTop from '@/components/pageTop.vue'
// import holiday from './dialog/holiday'
var that;
export default {
  components: {
     pageTop,
    // holiday
  },
  name: "holidayefin",
  data() {
    return {
      title:'',
      input_one:'',
      loading: false,
      formtype:1,
      dialogVisible: false,
      // checked: true,
      // tatolpage: 0,
      tableData: [],
      value:'全部',
      options:[
        {
         label: '全部', 
         IsDel: -1,
        },
        {
         label: '正常', 
         IsDel: 0,
        },
        {
         label: '停用', 
         IsDel: 1,
        },
      ],
      listfrom: {
        "Id": '',
        "KeyWord": '',
        "IsDel": '0',
        "PageSize": 10,
        "PageIndex": 1
      },
      form:{
        "ID":'0',
        "TaskID": '',
        "ExecStaffID": '',
        "Addtime":'',
        "Percentage":'',
        "Status":'',
        "Remark":'',
        "Isdel":'',
      },
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
    // 状态选择
    statusChange(IsDel) {
      this.listfrom.IsDel = IsDel;
      this.getlistdata()
    },
    // 添加组
    addgroup() {
      this.formtype = 1;
      this.dialogVisible = true;
    },
    // 编辑
    editdetail(row){
      let rowdata = JSON.parse(JSON.stringify(row));
      this.formtype = 2;
      // this.$refs.holiday.value6 = [rowdata.Sdate,rowdata.Edate];
      this.form = rowdata;
      this.dialogVisible = true;
    },
    // 保存
    commit() {
        if( this.form.ID == 0) {
            let obj = {
                "MN": "WorkTaskSubmitExeLog",
                "SN":"WorkPlanAndTask",
                "RequestId": 1,
                "UserId": 1,
                "DataContent": this.form
            }
            this.MIX_send(obj);
            this.dialogVisible = false;
        }else{
            let obj = {
                "MN": "WorkTaskSubmitExeLog",
                "SN":"WorkPlanAndTask",
                "RequestId": 1,
                "UserId": 1,
                "DataContent": this.form
            }
            console.log(obj,123456)
            this.MIX_send(obj);
            this.dialogVisible = false;
        }
    },
    // 启用
    start(row) {
      this.$confirm('此操作将启用该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "MN": "WorkPlanTypeDelete",
          "SN":"WorkPlanAndTask",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            "Id":row.ID,
            "IsDel":row.IsDel ==1?0:1,
          }
        }
        this.MIX_send(obj);
      }).catch(() => {
      });
    },
    // 停用
    stop(row) {
      this.$confirm('此操作将停用该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "MN": "WorkPlanTypeDelete",
          "SN":"WorkPlanAndTask",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            "Id":row.ID,
            "IsDel":row.IsDel ==0?1:0,
          }
        }
        this.MIX_send(obj);
      }).catch(() => {
      });
    },
    // 查询列表数据
    getlistdata() {
      //  if (this.checked) {
      //   this.listfrom.IsStop = 0;
      // } else{
      //   this.listfrom.IsStop = 1;
      // }
      let obj = {
        "MN": "WorkTaskExeGetLogList",
        "SN":"WorkPlanAndTask",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);
    },

    handleClose(done) {
      done();
    }
  },
  watch: {
    "$store.state.Humanmanage.WorkTaskSubmitExeLog": function (data) {
       this.getlistdata();
      // this.tatolpage = data.ReturnData.DataCount;
      // this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.WorkPlanTypeDelete": function (data) {
       this.getlistdata();
      // this.tatolpage = data.ReturnData.DataCount;
      // this.tableData = data.ReturnData.Data;
    },
    // //查询成功 返回数据
    "$store.state.Humanmanage.WorkTaskExeGetLogList": function (data) {
      // let DataContent = data.ReturnData.DataCount;
       this.tableData = data.ReturnData.Data;
    },
  },
};
</script>

<style scoped>
#record {
  position: relative;
	width: 100%;
	height: 100%;
	background-color: #F8FAFF;
	border-radius: 5px;
	box-sizing: border-box;
}
.holifin{
  /* position: relative; */
	width: 100%;
	height: 100%;
  background-color:#FFF;
	border-radius: 5px;
  padding:0 20px;
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
	 width: 4.815rem;
	 height:2.685rem;
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
