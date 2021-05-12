<template>
  <div class="materiaType">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
        </div>
        <div class="inputs">
          <el-select v-model="value" placeholder="状态:请选择" @change="statusChange" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.TypeName"
              :value="item.ID">
            </el-option>
          </el-select>
          <div class="check" style="margin-left:20px;">
            <el-input v-model="KeyWord" placeholder="请输入搜索关键字"  maxlength="15" style="width:274px;">
            </el-input>
             <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div> 
      </div>
      <el-table
        :data="tableData"
        style="margin-top:20px;"
        show-overflow-tooltip
        fit
        center
        highlight-current-row
        :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}">
        <el-table-column label="类型名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.TypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.PlanName }}</span>
          </template>
        </el-table-column>
          <el-table-column label="开始日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.StartDate | filterCtime  }}</span>
          </template>
        </el-table-column>
          <el-table-column label="截止日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.EndDate | filterCtime }}</span>
          </template>
        </el-table-column>
          <el-table-column label="创建人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.AddStaffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否停用" align="center">
          <template slot-scope="{row}">
            <div v-if="row.isDel=='0'">
              <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle; color:#8CD16B">正常</span>
            </div>
            <div v-if="row.isDel=='1'">
              <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle; color:#F56262">停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.isDel =='0'" type="text" size="mini" @click="dyapiDetail(row)">
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  
            <span style="vertical-align:middle">编辑</span> 
            </el-button>
            <el-button v-if="row.isDel =='1'" size="mini" type="text" @click="start(row)">
            <img src="../../../assets/images/start_icon.png" alt=""> <span style="vertical-align:middle"> 启用</span> 
            </el-button>
            <el-button v-if="row.isDel =='0'" size="mini" type="text" @click="stop(row)">
              <img src="../../../assets/images/stop_icon.png" alt="">   <span style="vertical-align:middle">停用</span> 
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增弹框 -->
    <el-dialog
      :title="formtype == 1 ? '新增计划' : '编辑计划'"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
      <el-form ref="formPoint" :rules="rules" :model="formPoint" label-position="left" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属分类" prop="TypeID">
              <el-select v-model="formPoint.TypeID" placeholder="请选择所属分类" style="width:100%">
                <el-option 
                  v-for="item in cloums" 
                  :key="item.value"
                  :label="item.TypeName"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划名称" prop="PlanName">
             <el-input v-model="formPoint.PlanName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="StartDate">
              <el-date-picker type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd" 
                placeholder="选择日期"
                v-model="formPoint.StartDate" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="EndDate">
              <el-date-picker type="date" 
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="formPoint.EndDate" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择状态" prop="isDel">
              <el-radio-group v-model="formPoint.isDel" >
                <el-radio  label="0">正常</el-radio>
                <el-radio  label="1">停用</el-radio>
              </el-radio-group>  
            </el-form-item>
          </el-col>
           <el-col :span="24">
            <el-form-item label="计划内容">
             <el-input type="textarea" v-model="formPoint.PlanContent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script>
   import pageTop from '@/components/pageTop.vue'
   import moment from 'moment'
// import { treeToArray } from '@/util/util.js'
// import { mapGetters } from 'vuex'
var that;
export default {
  name: 'materielArchives',//物料档案
   components: {
      pageTop
  },
  data() {
    return {
      title: '',
      formtype:1,
      total: 0,
      dialogVisible: false,
      PageSize: 10,
      PageIndex: 1,
      Stype:'',
      KeyWord: '',   // 搜索关键字
      isDel:'0',       // 默认传值
      tableData: [],
      formPoint:{
        isDel:'0',
        TypeID:'',
        PlanName:'',
        StartDate:'',
        EndDate:'',
        PlanContent:'',
      },
      TypeID:'',
      PlanName:'',
      PlanContent:'',
      StartDate:'',
      EndDate:'',
      Addtime:'',
      // IsDel:'',
      AddStaffID:'',
      cloums:[],
      value:'-1',
      options:[],
      rules:{
        TypeID:[{ required: true, message: '请选择所属分类', trigger: 'change'}],
        PlanName:[{required: true, message: '请输入计划名称', trigger: 'blur'}],
        isDel:[{required: true, message: '请选择状态', trigger: 'change'}],
         StartDate:[{required: true, message: '请选择开始时间', trigger: 'change'}],
         EndDate:[{required: true, message: '请选择结束时间', trigger: 'change'}]
      }
    };
  },
  computed: {
   
  },
  watch: {
    "$store.state.Humanmanage.WorkPlanGetList": function (data) {
      this.total = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.DeleteWorkPlanByID": function (data) {
      this.$message({
        message: '恭喜你,操作成功',
        type: 'success'
      });
      this.getTableData();
    },
    "$store.state.Humanmanage.WorkPlanTypeGetList": function (data) {
       this.cloums =JSON.parse(JSON.stringify(data.ReturnData.Data))
      this.options =JSON.parse(JSON.stringify(data.ReturnData.Data))
      let obj ={
         ID:'-1',
         IsDel:'-1',
         Stype:'-1',
         TypeName:'全部'
        }
      this.options.unshift(obj)
    },
    "$store.state.Humanmanage.WorkPlanCreate": function (data) {
       this.$message({
        message: '恭喜你,保存成功',
        type: 'success'
      });
      this.getTableData();
    },
  },
  filters:{
    filterCtime(StartDate){  //过滤时间格式
      return moment(StartDate).format('YYYY-MM-DD')
    },
    filterCtime(EndDate) {
      return moment(EndDate).format('YYYY-MM-DD')
    }
  },
  created() {
    that = this;
    this.getTableData();
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.select();
  },
  methods: {
    // 获取表格数据
    getTableData() {
      let json = {
        "MN": "WorkPlanGetList",
        "SN":'WorkPlanAndTask',
        DataContent: {
          PageSize:this.PageSize,
          PageIndex:this.PageIndex,
          KeyWord: this.KeyWord,
          TypeID: this.Stype
        }
      };
      this.MIX_send(json);
    },
    // 获取下拉框数据
    select() {
        let obj = {
        "MN": "WorkPlanTypeGetList",
        "SN":"WorkPlanAndTask",
        "RequestId": 1,
        "UserId": 1,
        "DataContent":{
          Stype:this.Stype,
          PageSize:this.PageSize,
          PageIndex:this.PageIndex
        }
      }
    
      this.MIX_send(obj);
    },
    // 顶部下拉选项框
    statusChange(Stype) {
      this.Stype = Stype ;
      this.getTableData();
    },
    // 停用
    stop (row) {
      this.$confirm('此操作将停用该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let json = {
          "MN": "DeleteWorkPlanByID",
          "SN":"WorkPlanAndTask",
          DataContent: {
            "ID":row.ID,
            "IsDel":row.IsDel == 1?0:1,
          }
      }
      this.MIX_send(json);
       }).catch(() => {
      });
    },
    // 启用
    start (row) {
      this.$confirm('此操作将启用该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let json = {
          "MN": "DeleteWorkPlanByID",
          "SN":"WorkPlanAndTask",
          DataContent: {
            "ID":row.ID,
            "IsDel": row.IsDel == 0?1:0,
          }
        };

      this.MIX_send(json);
        }).catch(() => {
      });
    },
    // 关键字搜索
    sendinput() {
      this.getTableData();
    },
    // 分页
    handleSizeChange(PageSize) {
      this.PageSize = PageSize;
      this.getTableData();
    },
    // 分页
    handleCurrentChange(PageIndex) {
       this.PageIndex = PageIndex;
        this.getTableData();
    },
    /**
     * 表格处理函数
     * */
    // 新增
    addgroup() {
      this.formType ='1'
      this.formPoint.ID = 0;   // 新增时ID 为0
      this.dialogVisible = true;
    },
    // 编辑
    dyapiDetail(row) {
      this.formPoint.ID = 1;
      let rowdata = JSON.parse(JSON.stringify(row));
      this.formtype = 2;
      this.formPoint = rowdata;
      this.dialogVisible = true;
    },
    // 新增编辑保存  
    commit() {
      this.$refs.formPoint.validate((valid) => {
        if (valid) {
          if(this.formPoint.ID ==0){
            let obj = {
              "MN": "WorkPlanCreate",
              "SN":"WorkPlanAndTask",
              "RequestId": 1,
              "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
              "DataContent": {
                ID:this.formPoint.ID,
                TypeID: this.formPoint.TypeID,
                PlanName: this.formPoint.PlanName,
                PlanContent:this.formPoint.PlanContent,
                StartDate: this.formPoint.StartDate,
                Addtime:this.formPoint.Addtime,
                EndDate:this.formPoint.EndDate,
                AddStaffID:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
                IsDel:this.formPoint.IsDel
              }
            }
            this.MIX_send(obj);
            this.handleClose();
          }else{
            let obj = {
            "MN": "WorkPlanCreate",
            "SN":"WorkPlanAndTask",
            "RequestId": 1,
            "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
            "DataContent": this.formPoint
            }
           this.MIX_send(obj);
           this.handleClose();
          }
        } else {
          return false;
        }
      });
    },
    // 关闭弹框
    handleClose() {
     this.formPoint = {};   // 关闭弹框清空表单数据
       this.$refs.formPoint.resetFields();   // 清空表单验证
     this.dialogVisible = false;
    }   
  },
}
</script>

<style scoped lang="less">
  .materiaType{
    padding:0 20px;
    border-radius: 5px;
    background-color:#fff;
  }
  .operation {
    height: 40px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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
  .el-button--primary {
      color: #FFF;
      background-color: #0060A0;
      border-color: #0060A0;
    width: 4.815rem;
    height:2.685rem;
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
  /deep/ .el-dialog__body {
    padding: 20px 20px 0;
  }
  /deep/ .el-textarea__inner{
    height:140px;
    color:#4D6474;
  }
  /deep/ .el-dialog__header{
    margin: 0 20px;
    padding: 20px 0 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    span {
      color:#4D6474;
      font-size: 18px;
      font-weight: bold;
    }
  }
  /deep/ .el-form-item__label{
    color:#4D6474;
    // font-size: 16px;
    font-weight: 500;
  }
</style>