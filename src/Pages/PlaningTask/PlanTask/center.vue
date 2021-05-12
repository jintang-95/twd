<template>
    <div class="materiaType">
       <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
        </div>
      </div>
        <el-table
          :data="tableData"
          show-overflow-tooltip
          fit
          highlight-current-row
          :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
          style="margin-top:20px">
          <el-table-column label="任务名称" align="center">
            <template slot-scope="{row}">
              <span>{{ row.TaskName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="任务类型" align="center">
            <template slot-scope="{row}">
              <span>{{ row.TypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="任务等级" align="center">
            <template slot-scope="{row}">
              <label v-if="row.Grade==0">普通</label>
              <label v-if="row.Grade==1">重要</label>
              <label v-if="row.Grade==2">紧急</label>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.StartDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.EndDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="完成度" align="center">
            <template slot-scope="{row}">
              <span>{{ row.Percentage }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="执行人" align="center">
            <template slot-scope="{row}">
              <span>{{ row.ExecStaffName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
              <template slot-scope="{row}">
                    <div v-if="row.Status=='1'">
                      待执行
                    </div>  
                  <div v-if="row.Status=='0'">
                    待下发
                  </div>
                <div v-if="row.Status=='2'">
                <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#F56262">已取消</span> 
                </div>
                <div v-if="row.Status=='3'">
                <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#F56262;">执行中</span>  
                </div>
                <div v-if="row.Status=='4'">
                <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#8CD16B;">已完成</span> 
                </div>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button   v-if="row.Status == 0 || row.Status == 1 || row.Status ==3" type="text" size="mini" @click="dyapiDetail(row)">
              <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  
              <span style="vertical-align:middle">编辑</span> 
              </el-button>
              <el-button   size="mini" type="text" @click="view(row)">
               <img src="../../../assets/images/look.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle"> 查看</span> 
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      <!-- 新增任务弹框 -->
      <el-dialog
        class="newBox"
        :title="formtype == 1 ? '新增任务' : '编辑任务'"
        :visible.sync="dialogVisible1"
        width="750px"
        :before-close="handleClose">
        <el-form ref="formData" :rules="rules"  :model="formData" label-position="left" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="所属计划" prop="PlanID">
                <el-select v-model="formData.PlanID" placeholder="请选择任务" style="width:100%">
                  <el-option 
                   v-for="item in cloumn"
                   :key="item.value" 
                   :label="item.PlanName"
                   :value="item.ID">
                   </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="display:none">
              <el-form-item label="上级任务" prop="TopTaskID">
                <el-select v-model="formData.TopTaskID" placeholder="请选择上级任务" style="width:100%">
                  <el-option label="无" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务名称" prop="TaskName">
              <el-input v-model="formData.TaskName" style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务分类" prop="TaskTypeID">
                 <el-select v-model="formData.TaskTypeID" placeholder="请选任务分类" style="width:240px">
                   <el-option 
                   v-for="item in taskData"
                   :key="item.value" 
                   :label="item.TypeName"
                   :value="item.ID">
                   </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务等级" prop="Grade">
                 <el-select v-model="formData.Grade" placeholder="请选择任务等级" style="width:240px">
                  <el-option label="普通" value="0"></el-option>
                  <el-option label="重要" value="1"></el-option>
                  <el-option label="紧急" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期" prop="StartDate">
                <el-date-picker
                  v-model="formData.StartDate"
                  type="date"
                  style="width:240px"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期" prop="EndDate">
             <el-date-picker
                  v-model="formData.EndDate"
                  type="date"
                  style="width:240px"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行者">
                <chooseStaff 
                class="chooseSttaff"
                @getToFather="chooseStaff2"
                :stuffId="ExecStaffID"
                :isCustomer="true" 
                :isMultipleChoice="false"></chooseStaff>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态" prop="Status">
                <el-select v-model="formData.Status" placeholder="请选择任务状态" style="width:240px">
                  <el-option label="待下发" value="0"></el-option>
                  <el-option label="待执行" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务描述" >
                <el-input type="textarea" v-model="formData.Describe"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看弹框 -->
      <el-dialog
        title="任务详情"
        :visible.sync="dialogVisible2"
        width="60%"
        :before-close="handleClose2">
         	<div class="dialogContentWrap">
					<div class="dialogContent">
						<div class="orderType">
                <el-row>
                  <el-col :span="8"><span >类型名称：<span style="font-weight: 400">{{TypeName}}</span></span></el-col>
                  <el-col :span="8"><span >计划名称：<span style="font-weight: 400">{{PlanName}}</span></span></el-col>
                  <el-col :span="8"><span >创建人名称：<span style="font-weight: 400">{{AddStaffName}}</span></span></el-col>
                </el-row>
                <el-row>
                  <el-col :span="8"><span >开始日期：<span style="font-weight: 400">{{StartDate}}</span></span></el-col>
                  <el-col :span="8"><span >结束日期：<span style="font-weight: 400">{{EndDate}}</span></span></el-col>
                  <el-col :span="8"><span >完成度：<span style="font-weight: 400">{{Percentage}}%</span></span></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><span >任务内容：<span style="font-weight: 400">{{Describe}}</span></span></el-col>
                </el-row>
							<div class="addButton" @click="addRules" v-if="state== '4'" style="display:none;"></div>
              <div class="addButton" @click="addRules" v-if="state == '2'" style="display:none;"></div>
              <div class="addButton" @click="addRules" v-if="state == '1'" ><i class="el-icon-plus"></i></div>
              <div class="addButton" @click="addRules" v-if="state == '0'" ><i class="el-icon-plus"></i></div>
              <div class="addButton" @click="addRules" v-if="state == '3'" ><i class="el-icon-plus"></i></div>
						</div>
						<div class="formWrap">
							<el-table :data="listData" :header-cell-style="{background:'#F0F7FB','color':'#5C87A4',}" style="width: 100%" row-key="ID" id="formWrapTable2">
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
								<el-table-column label="操作" align="center"  width="180">
									<template slot-scope="scope">
										<el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
                     v-if="scope.row.Status!=2"><i class="iconfont icon-iconbianji"></i>编辑</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
			   	</div>
      </el-dialog>
      <!--新增任务执行日志弹框-->
      <el-dialog
        :title="tabletype == 1 ? '新增执行日志' : '编辑执行日志'"
        :visible.sync="dialogVisible3"
         width="40%"
        :before-close="handleClose3">
        <el-form ref="form" :model="tableForm" label-width="80px">
          <el-row>
            <el-col :span="24">
                 <el-form-item label="任务完成度" label-width="82px">
                   <el-slider v-model="tableForm.Percentage" show-input></el-slider>
                  </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="描述">
                  <el-input  type="textarea" v-model="tableForm.Remark"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose3">取 消</el-button>
          <el-button type="primary" @click="addForm">确 定</el-button>
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
import chooseStaff from '@/components/chooseStaff.vue'
// import { treeToArray } from '@/util/util.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { parse } from 'url';
import { connect } from 'net';
var that;
export default {
    name: 'materielArchives',//工作任务
  components: {
    pageTop,
    chooseStaff
  },
  data() {
    return {
      title: '',
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      rowId:'',      //定义 保存id
      Stype:'2',
      row:'',        // 定义保存row
      formtype: 1,   // 新增任务弹框
      tabletype:1,   // 新增执行记录弹框
      Percentage:'',
      tableData:[],
      taskData:[],  
      listData:[],
      cloumn:[],
      total: 0,
      PageSize: 10,
      PageIndex: 1,
      KeyWord:'',
      Datarow:'',
      TypeName:'',
      PlanName:'',
      value:'0',
      PlanContent:'',
      StartDate:'',
      EndDate:'',
      AddStaffName:'',
      ID:'-1',
      PlanID:"",
      TopTaskID:'0',
      TaskTypeID:'',
      TaskName:'',
      Grade:'',
      Degree:'',     //定义完成度
      StartDate:'',
      EndDate:'',
      Addtime:'',
      AddStaffID:'',
      Describe:'',
      ExecStaffID:'',
      Status:'',
      state:"",
      AddStaffID:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
      formData: {
        "ID":'0',
        "PlanID":'',
        "TopTaskID":'0',
        "TaskTypeID":'',
        "TaskName":'',
        "Grade":'',
        "Percentage":'0',
        "StartDate":'',
        "EndDate":'',
        "Addtime":'',
        "AddStaffID":JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        "Describe":'',
        "ExecStaffID":'',
        "Status":'',
      },
      tableForm:{},
      // Percentage:null,
      Remark:'',
      rules:{
         PlanID:[{ required: true, message: '请选择任务', trigger: 'change' }],
         TaskName:[{required: true, message: '请输入任务名称', trigger: 'blur'}],
         TaskTypeID:[{required: true, message: '请选择计划分类', trigger: 'change'}],
         Grade:[{required: true, message: '请选择任务等级', trigger: 'change'}],
         Status:[{required: true, message: '请选择任务状态', trigger: 'change'}],
         StartDate:[{required: true, message: '请选择开始时间', trigger: 'change'}],
         EndDate:[{required: true, message: '请选择结束时间', trigger: 'change'}]
      }
    };
  },
  computed: {
    ...mapGetters([
      'GetMaterielCategoryTree',
      'GetAssetsDetails',
      'UnCancelAssetsDetail',
      'CancelAssetsDetail',
      'RemoveAssetsDetail',
      'SaveAssetsDetail',
      'GetAssetsDetailById',
      'GetBrands'
    ])
  },
  watch: {
    "$store.state.Humanmanage.WorkTaskEdit": function (data) {
      this.$message({
        message: '恭喜你,保存成功',
        type: 'success'
      });
       this.getTableData();
    },
    "$store.state.Humanmanage.WorkPlanGetList": function (data) {
      this.cloumn = data.ReturnData.Data;  
      let obj ={
         ID:'-1',
         IsDel:'-1',
         Stype:'-1',
         PlanName:'无'
        }
        this.cloumn.unshift(obj)
    },
    "$store.state.Humanmanage.WorkPlanTypeGetList": function (data) {
      for(var index in data.ReturnData.Data){
        if(data.ReturnData.Data[index].Stype !=1){
          this.taskData.push(data.ReturnData.Data[index]);
        }
      }
    },
    "$store.state.Humanmanage.WorkTaskGetList": function (data) {
      this.total = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.WorkTaskGetByID": function (data) {
      this.state = data.ReturnData.Status;
      this.Percentage = data.ReturnData.Percentage;
      this.TypeName = data.ReturnData.TypeName;
      this.PlanName = data.ReturnData.PlanName;
      this.StartDate = data.ReturnData.StartDate;
      this.EndDate = data.ReturnData.EndDate;
      this.AddStaffName = data.ReturnData.AddStaffName;
      this.Describe = data.ReturnData.Describe;
      this.getFormdata();
    },
    "$store.state.Humanmanage.WorkTaskSubmitExeLog": function (data) {
      this.$message({
        message: '恭喜你,保存成功',
        type: 'success'
      });
      this.getTableData();
      this.view(this.Datarow);
      this.getFormdata();
    },
    "$store.state.Humanmanage.WorkTaskExeGetLogList": function (data) {
      this.listData = data.ReturnData.Data;
    },
  },
  methods: {
    chooseStaff2(data) {
      this.formData.ExecStaffID = data.keyId
    },
    foamatTimer() {
      let date = new Date()
      return this.formData.Addtime = moment(date).format('YYYY-MM-DD')
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "WorkTaskGetList",
        SN:'WorkPlanAndTask',
        DataContent: {
          PageSize:this.PageSize,
          PageIndex:this.PageIndex,
          KeyWord: this.KeyWord,
          // TypeID: this.Stype
        }
      };
      this.MIX_send(json);
    },
    // 查看
    view (row) {
      this.Datarow = row              // 保存row
      this.Degree = row.Percentage;   //获取完成度
      this.rowId = row.ID;            // 获取ID
      this.ExecStaffID = row.ExecStaffID;
      this.dialogVisible2 = true;
      let json = {
        "MN": "WorkTaskGetByID",
        "SN":'WorkPlanAndTask',
        DataContent: {
          "TaskID": row.ID
        }
      };
      this.MIX_send(json);
    },
    // 页面Size切换
    handleSizeChange(PageSize) {
      this.PageSize = PageSize;
      this.getTableData();
    },
    // 页面切换
    handleCurrentChange(PageIndex) {
      this.PageIndex = PageIndex;
      this.getTableData();
    },
    /**
     * 表格处理函数
     * */
    // 编辑
    dyapiDetail(row) {
      this.formtype = 2;
      this.formData= JSON.parse(JSON.stringify(row));
      this.ExecStaffID = row.ExecStaffID;
      this.dialogVisible1 = true;
       let obj = {
        "MN": "WorkTaskGetList",
        "SN":"WorkPlanAndTask",
        "RequestId": 1,
        "UserId": 1,
        "DataContent":{
          TypeID: this.Stype,
          PageSize: this.PageSize,
          PageIndex: this.PageIndex,
          KeyWord: this.KeyWord,
          EndDate: this.EndDate
        }
      }
      this.MIX_send(obj);
      let json = {
          "MN": "WorkPlanTypeGetList",
          "SN":"WorkPlanAndTask",
          "RequestId": 1,
          "UserId": 1,
          "DataContent":{
          TypeID:this.Stype,
          PageSize:this.PageSize,
          PageIndex:this.PageIndex
        }
      }
      this.MIX_send(json);
    },
    // 新增
    addgroup() {
      this.formType = '1'
      this.formData.ID = 0;
      this.dialogVisible1 = true;
      let obj = {
        "MN": "WorkPlanGetList",
        "SN":"WorkPlanAndTask",
        "RequestId": 1,
        "UserId": 1,
        "DataContent":{
          TypeID: this.Stype,
          PageSize: this.PageSize,
          PageIndex: this.PageIndex,
          KeyWord: this.KeyWord,
          EndDate: this.EndDate
        }
      }
      this.MIX_send(obj);
      let json = {
          "MN": "WorkPlanTypeGetList",
          "SN":"WorkPlanAndTask",
          "RequestId": 1,
          "UserId": 1,
          "DataContent":{
          TypeID:this.Stype,
          PageSize:this.PageSize,
          PageIndex:this.PageIndex
        }
      }
      this.MIX_send(json);
    },
    // 新增编辑保存
    commit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.foamatTimer();
          if( this.formData.ID == 0) {
            let obj = {
              "MN": "WorkTaskEdit",
              "SN":"WorkPlanAndTask",
              "RequestId": 1,
              "UserId": 1,
              "DataContent": {
                ID:'0',
                PlanID: this.formData.PlanID,
                TopTaskID: this.formData.TopTaskID,
                TaskTypeID: this.formData.TaskTypeID,
                TaskName: this.formData.TaskName,
                Grade: this.formData.Grade,
                Percentage: this.formData.Percentage,
                StartDate: this.formData.StartDate,
                EndDate: this.formData.EndDate,
                Addtime: this.formData.Addtime,
                AddStaffID: this.AddStaffID,
                Describe: this.formData.Describe,
                ExecStaffID: this.formData.ExecStaffID,
                Status: this.formData.Status
              }
            }
            this.MIX_send(obj);
            this.handleClose();
          }else{
            let obj = {
              "MN": "WorkTaskEdit",
              "SN":"WorkPlanAndTask",
              "RequestId": 1,
              "UserId": 1,
              "DataContent": this.formData,
              
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
      this.formData ={};   // 关闭弹框 清空表单数据
      this.$refs.formData.resetFields();   // 清空表单验证
      this.dialogVisible1 = false;
    },
    // 关闭弹框
    handleClose2() {
      this.dialogVisible2 = false;
    },
    // 关闭弹框
    handleClose3() {
      this.tableForm = {};  // 关闭弹框 清空表单数据
      this.dialogVisible3 = false;
    },
    // 新增任务执行记录
    addRules() {
      this.tabletype = 1;
      this.tableForm.ID = 0;
      this.dialogVisible3 = true;
    },
    // 编辑任务执行记录
    handleEdit(index,row){
      this.tableForm = JSON.parse(JSON.stringify(row));
      this.tableForm.Percentage = parseInt(this.Degree) ;  //点击编辑时双向绑定完成度
      this.tabletype = 2;
      this.tableForm.Percentage =  JSON.parse(JSON.stringify(Number(row.Percentage))) ;
      this.dialogVisible3 = true;
    },
    // 执行记录保存
    addForm(){
        this.tableForm.TaskID = this.rowId;
        this.tableForm.ExecStaffID = this.ExecStaffID;
        if(this.tableForm.Percentage ==100){
          this.Status =2
        }else{
          this.Status = 1
        }
        let state = this.Status
        let obj = {
          "MN": "WorkTaskSubmitExeLog",
          "SN":"WorkPlanAndTask",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            "ID":this.tableForm.ID,
            "TaskID": this.rowId,
            "ExecStaffID":this.tableForm.ExecStaffID,
            "Percentage": this.tableForm.Percentage,
            "Remark": this.tableForm.Remark,
            "Status": this.Status
          }
        }
        this.MIX_send(obj);
        this.handleClose3();
    },
    // 获取任务详情数据列表
     getFormdata() {
      let obj = {
        "MN": "WorkTaskExeGetLogList",
        "SN":"WorkPlanAndTask",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          TaskID: this.rowId,
          PageSize: this.PageSize,
          PageIndex:this.PageIndex,
        }
      }
      this.MIX_send(obj);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    that = this;
    this.getTableData();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.title = this.$route.meta.title;
    if(this.$route.query.row){
      this.view(this.$route.query.row);
      this.$route.query={};
    }
  }
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
  .dialogContentWrap {
    background-color:#FAFBFC;
  }
	.orderType>div:first-child {
		display: flex;
		// width: 50%;
		justify-content: space-between;
  }
  .el-col {
  line-height:50px;
  span{
    font-size:16px;
    color:#4D6474;
    line-height:40px;
    font-weight: 500;
  }
}
  .addButton {
    background-color: #0060A0;
    color:#FFF;
		width: 3%;
		padding: 3% 0 0;
		position: relative;
    display: flex;
    float:right;
    align-items: center;
    margin-bottom: 10px;
		justify-content: center;
	}
	.addButton i {
		position: absolute;
		top: 0;
		margin: auto;
		bottom: 0;
		display: flex;
		align-items: center;
  }
  .formWrap button {
		border: none;
		background: none;
		color: #0060A0;
	}

	.formWrap {
		margin-top: 20px;
	}

	.formWrap th {
		color: #0060A0;
	}
  .dialogFooter {
		position: absolute;
		bottom: 4%;
		display: flex;
		/* width: 100%; */
		left: 5%;
		right: 5%;
		margin: auto;
		justify-content: flex-end;
	}

	.dialogFooter button {
		background-color: #0060A0;
		width: 9%;
		padding-top: 4.5%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border: none;
		outline: none;
		cursor: pointer;
	}
	.dialogFooter span {
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 0;
		/* display: inline-block; */
		display: flex;
		align-items: center;
  }
  /deep/ .newBox{
    .el-dialog__body{
      height:450px;
    }
  }
  /deep/ .el-dialog__header{
    margin: 0 20px;
    padding: 20px 0px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    span {
      color:#4D6474;
      font-size: 18px;
      font-weight: bold;
    }
  }
  /deep/ .el-dialog__body{
    overflow-y: auto;
   background-color:#FAFBFC;
   margin:20px 20px 10px;
   padding:20px;
  }
  /deep/ .el-textarea__inner{
    height:130px;
    color:#4D6474;
  }
  /deep/ .selectL {
    padding-top:3px;
  }
  /deep/ .selectL .selectL_radious .el-input__inner {
    width:240px !important;
  }
  /deep/ .el-form-item__label{
    color:#4D6474;
    font-weight: 500;
  }
  /deep/ .el-input__inner{
   color:#4D6474;
  }
</style>