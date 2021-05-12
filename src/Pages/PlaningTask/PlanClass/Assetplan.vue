<template>
    <div class="holifin">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
        </div>
        <div class="inputs">
          <el-select v-model="value1" placeholder="类型:请选择" @change="stypeChange" >
            <el-option
              v-for="item in cloums"
              :key="item.value1"
              :label="item.label"
              :value="item.Stype">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="状态:请选择" @change="statusChange" style="margin-left:20px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.IsDel">
            </el-option>
          </el-select>
        </div> 
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
        style="margin-top:20px;"
        show-overflow-tooltip
        fit
        highlight-current-row>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.TypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="{row}">
            <label v-if="row.Stype==1">计划</label>
            <label v-if="row.Stype==2">任务</label>
          </template>
        </el-table-column>
        <el-table-column label="状态" sortable="custom" align="center">
          <template slot-scope="{row}">
            <div v-if="row.IsDel=='0'">
             <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle; color:#8CD16B">正常</span>
            </div>
            <div v-if="row.IsDel=='1'">
             <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle; color:#F56262">停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.IsDel=='0'"  type="text"  @click="editdetail(row)">
              <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">编辑</span> 
            </el-button>
            <el-button v-if="row.IsDel=='1'"  type="text"  @click="start(row)">
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
        :title="formtype == 1 ? '新增分类' : '编辑分类'"
        :visible.sync="dialogVisible"
        width="30%"
        :destroy-on-close="true"
        :before-close="handleClose">
        <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="80px">
          <el-form-item label="分类名称" prop="TypeName">
            <el-input v-model="form.TypeName" placeholder="请输入分类名称"  style="width:240px"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="Stype">
            <el-select v-model="form.Stype" placeholder="请选择类型" style="width:240px">
              <el-option label="计划" value="1"></el-option>
              <el-option label="任务" value="2"></el-option>
            </el-select>
          </el-form-item>
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
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        align="right"
        class="pagination">
      </el-pagination>
    </div>
</template>

<script>
 import pageTop from '@/components/pageTop.vue'
var that;
export default {
  components: {
     pageTop,
  },
  name: "holidayefin",
  data() {
    return {
      title: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      formtype: 1, 
      dialogVisible: false,
      tableData: [],
      value: '全部',   // 状态 默认选中全部
      value1: '全部',  // 类型 默认选中全部
      cloums: [        // 定义类型
        {
         label: '全部', 
         Stype: 0,
        },
         {
         label: '计划', 
         Stype: 1,
        },
         {
         label: '任务', 
         Stype: 2,
        },
      ],
      options: [      // 定义状态
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
        "Stype":'0',
        "PageSize": 10,
        "PageIndex": 1
      },
      form:{
        "ID": '0',
        "Stype":'',
        "TypeName": ''
      },
      rules:{
        TypeName:[ { required: true, message: '请输入分类名称', trigger: 'blur' }],
        Stype:[{ required: true, message: '请选择类型', trigger: 'blur' }],
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
    // 类型选择
    stypeChange(Stype) {
      this.listfrom.Stype = Stype;
      this.getlistdata();
    },
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
      this.form = rowdata;
      this.dialogVisible = true;
    },
    // 保存
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = {
            "MN": "WorkPlanTypeSave",
            "SN":"WorkPlanAndTask",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": this.form
          }
          console.log(obj,1111111)
          this.MIX_send(obj);
          this.handleClose();
        }else {
          return false;
        }
      });
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
      let obj = {
        "MN": "WorkPlanTypeGetList",
        "SN":"WorkPlanAndTask",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);
    },
    // 分页
    handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.getlistdata();
    },
    // 分页
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getlistdata();
    },
    // 关闭弹框
    handleClose() {
      this.form = {};  // 关闭弹框时清除表单数据
      this.dialogVisible = false;
    }
  },
  watch: {
    "$store.state.Humanmanage.WorkPlanTypeSave": function (data) {
      this.$message({
        message: '恭喜你,保存成功',
        type: 'success'
      });
      this.getlistdata();
    },
    "$store.state.Humanmanage.WorkPlanTypeDelete": function (data) {
      this.$message({
        message: '恭喜你,操作成功',
        type: 'success'
      });
      this.getlistdata();
    },
    // //查询成功 返回数据
    "$store.state.Humanmanage.WorkPlanTypeGetList": function (data) {
      this.total = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
  },
};
</script>

<style lang="less" scoped>
  .holifin{
    /* position: relative; */
    width: 100%;
    // height: 100%;
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
  /deep/ .el-dialog__header{
    margin: 0 20px;
    padding:16px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    span {
      color:#4D6474;
      font-size: 18px;
      font-weight: bold;
    }
  }
  /deep/ .el-dialog__body{
    margin:20px 20px 0 20px;
    padding:20px;
  }
  /deep/ .el-form-item__label{
    color:#4D6474;
    // font-size: 16px;
    font-weight: 500;
  }
</style>
