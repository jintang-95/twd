<template>
    <div class="holifin">
      <pageTop :title="title"></pageTop>
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
        </div>
        <div class="inputs">
          <div style="margin-right:13px;">
          </div>
          <div class="check">
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
        highlight-current-row>
         <el-table-column label="工单编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderNO }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单类型" align="center">
          <template slot-scope="{row}">
           <span v-if="row.OrderType==0">保养工单</span>
           <span v-if="row.OrderType==1">维修工单</span>
           <span v-if="row.OrderType==2">检测</span>
           <span v-if="row.OrderType==3">其他</span>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.DeviceNo }}</span>
          </template>
        </el-table-column>
         <el-table-column label="创建人姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.AddStaffName }}</span>
          </template>
        </el-table-column>
          <el-table-column label="创建时间" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.CreatedTime | filterCtime}}</span> 
              </template>        
          </el-table-column>
         <el-table-column label="执行人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ExecName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" align="center">
          <template slot-scope="{row}">
           <span v-if="row.State==0">待分配</span>
           <span v-if="row.State==1">待执行</span>
           <span v-if="row.State==2">执行中</span>
           <span v-if="row.State==3">执行完成</span>
          <span v-if="row.State==4">已作废</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button  type="text"  @click="editdetail(row)">
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">编辑</span> 
            </el-button>
            <el-button   type="text" @click="remove(row)">
            <img src="../../../assets/images/delete.png" style="vertical-align:middle"  alt="">  <span style="vertical-align:middle">删除</span> 
            </el-button>
             <el-button   type="text" @click="view(row)">
            <img src="../../../assets/images/look.png" style="vertical-align:middle"  alt="">  <span style="vertical-align:middle">查看</span> 
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增工单弹出框 -->
      <el-dialog
        v-if="isshow"
        :title="formtype == 1 ? '新增工单' : '编辑工单'"
        :visible.sync="dialogVisible1"
        :destroy-on-close="true"
        :closeOnClickModal="true"
        width="750px"
        :before-close="handleClose">
        <el-form ref="formData" :rules="rules" :model="formData" label-position="left" label-width="80px">
          <el-row>
            <el-col :span="12" style="display:none">
              <el-form-item label="Id">
                <el-input v-model="formData.Id" style="width:210px;"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="12"  style="display:none">
              <el-form-item label="工单编号">
              <el-input disabled v-model="formData.OrderNO" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单类型" prop="OrderType" label-width="90px">
              <el-select v-model="formData.OrderType" placeholder="请选择工单类型">
                <el-option label="保养工单" value="0"></el-option>
                <el-option label="维修工单" value="1"></el-option>
                <el-option label="检测" value="2"></el-option>
                <el-option label="其他" value="3"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号" prop="DeviceNo" label-width="90px">
              <el-input v-model="formData.DeviceNo" style="width:250px" @focus="showEquipment" :validate-event="false"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单状态" style="display:none">
                <el-select v-model="formData.State" placeholder="请选择状态" >
                  <el-option 
                    v-for="item in options" 
                    :key="item.value"
                    :label="item.label"
                    :value="item.State">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-col :span="12" style="display:none">
              <el-form-item label="执行人">
              <!-- <chooseStaff @getToFather="chooseStaff1" :isCustomer="true" :isMultipleChoice="false"></chooseStaff> -->
              <el-input v-model="formData.ExecUserID" ></el-input>
            </el-form-item>
            </el-col>
            </el-col>
            <el-col :span="24">
            <el-form-item label="描   述">
              <el-input type="textarea" v-model="formData.Remark"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看工单弹框 -->
      <el-dialog
        title="工单查看"
        :visible.sync="dialogVisible2"
        width="800px"
        :before-close="handleClose1">
          <div class="dialogContent">
              <div class="orderType">
                  <el-row>
                    <el-col :span="12"><span>工单编号：<span style="font-weight: 100">{{OrderNO}}</span></span></el-col>
                    <el-col :span="12"><span>工单类型：<span style="font-weight: 100">{{OrderType}}</span></span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12"><span>设备名称：<span style="font-weight: 100">{{DeviceNo}}</span></span></el-col>
                    <el-col :span="12"><span>创建人名称：<span style="font-weight: 100">{{AddStaffName}}</span></span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12"><span>执行状态：<span style="font-weight: 100">{{State}}</span></span></el-col>
                    <el-col :span="12"><span>执行人名称：<span style="font-weight: 100">{{ ExecName}}</span></span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"><span>工单内容：<span style="font-weight: 100">{{Remark}}</span></span></el-col>
                  </el-row>
              </div>
              <div class="logging">日志记录: 
                <div class="addButton" v-if="ExecName!='' " @click="addtabel"><i class="el-icon-plus"></i></div>
                <div class="Figure"></div> 
              </div>    
              <div class="formWrap">
                <el-table :data="listData"  slot="table" :header-cell-style="{background:'#F0F7FB','color':'#5C87A4',}" style="width: 100%" row-key="ID" id="formWrapTable2">
                  <el-table-column label="处理人" align="center">
                      <template slot-scope="{row}">
                        <span>{{row.ExecName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="确认时间" align="center">
                      <template slot-scope="{row}">
                        <span>{{row.CreatedTime | CTime }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="是否确认" align="center">
                      <template slot-scope="{row}">
                        <span v-if="row.Confirm==0">待确认</span>
                        <span v-if="row.Confirm==1">确认</span>
                        <span v-if="row.Confirm==2">无效</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="确认人" align="center">
                      <template slot-scope="{row}">
                        <span>{{row.ConfirmName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="处理结果" align="center">
                      <template slot-scope="{row}">
                          <span v-if="row.State==0">未完成</span>
                          <span v-if="row.State==1">已完成</span>
                      </template>
                    </el-table-column>
                  <el-table-column label="操作" align="center"  width="180">
                    <template slot-scope="{row}">
                      <el-button type="text"  @click="look(row)">
                      <img src="../../../assets/images/look.png" style="vertical-align:middle"  alt="">  <span style="vertical-align:middle">查看</span> 
                        </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </div>
      </el-dialog>
      <!-- 查看新增弹框 -->
      <el-dialog
        title="新增工单记录"
        :visible.sync="dialogVisible3"
        class="newOrder"
        width="800px"
        :before-close="handleClose3">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="工单编号" prop="OrderNO">
              <el-input disabled v-model="ruleForm.OrderNO"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="State">
                <el-select v-model="ruleForm.State" placeholder="请选择状态" style="width:210px">
                  <el-option label="未完成" value="0"></el-option>
                  <el-option label="已完成" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="问题描述" prop="Question">
              <el-input type="textarea" v-model="ruleForm.Question"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"></el-col>
            <el-col :span="18">
              <el-form-item label="处理方式" prop="TreatmentMethod">
                <el-input type="textarea" v-model="ruleForm.TreatmentMethod"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose3">取 消</el-button>
          <el-button type="primary" @click="saveOrder">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看工单表格弹框 -->
      <el-dialog
        title="查看工单表格数据"
        :visible.sync="dialogVisible4"
        width="700px"
        :before-close="handleClose4">
          <div class="dialogContent">
              <div class="orderData">
                  <el-row>
                    <el-col :span="12"><span>工单编号：<span style="font-weight: 400">{{OrderNO}}</span></span></el-col>
                    <el-col :span="12"><span>创建人姓名：<span style="font-weight: 400">{{CreatedName}}</span></span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12"><span>执行人姓名：<span style="font-weight: 400">{{ExecName}}</span></span></el-col>
                    <el-col :span="12"><span>确认人姓名：<span style="font-weight: 400"></span>{{ConfirmName }}</span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12"><span>确认状态：<span style="font-weight: 400">{{Confirm}}</span></span></el-col>
                    <el-col :span="12"><span>状态：<span style="font-weight: 400"></span>{{State }}</span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"><span>问题描述：<span style="font-weight: 400">{{Question}}</span></span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"><span>处理方式：<span style="font-weight: 400">{{TreatmentMethod}}</span></span></el-col>
                  </el-row>
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose4">取 消</el-button>
            <el-button type="primary" @click="handleClose4">确 定</el-button>
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
	  <equipmentTable @closePropMask = "closePropMask" :visible="isShowEquipment" @addMaterielTable="addTable" :check="2" :title="EquipmentTitle"></equipmentTable>
    </div>
</template>

<script>
 import pageTop from '@/components/pageTop.vue'
//  import chooseStaff from '@/components/chooseStaff.vue'
 import moment from 'moment'
//  import {mapGetters} from 'vuex'
 import equipmentTable from "@/components/equipmentTable.vue"
var that;
export default {
  components: {
    pageTop,
	equipmentTable
    // chooseStaff
    // holiday
  },
  name: "holidayefin",
  data() {
    return {
	  EquipmentTitle:"关联设备选择",
	  isShowEquipment:false,
      isshow: false,
      title:'',
      rowOrder:'',
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      loading: false,
      formtype: 1,
      total: 0,
      userId:'',
      PageSize: 10,
      PageIndex: 1,
      KeyWord: '',
      IsDel:'',
      TypeID:'0',
      ExecStaffID:'0',
      StaffID:'0',
      tableData: [],
      CreatedName:'', // 定义变量显示数据
      execName: '',
      ExecName:'',
      ConfirmName:'',
      AddStaffName:'',
      Confirm:'',
      State:'',
      Question:'',
      TreatmentMethod:'',
      ruleForm:{
         Id:'',
         OrderNO:'',
         Confirm:'0',
         Question:'',
         State: '',
         ConfirmTIme:'',
         TreatmentMethod:'',
         ExecUser:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
         CreatedUser:JSON.parse(sessionStorage.getItem("UserDetial")).Id
      },
      formData:{
        'Id': '0',
        'OrderNO': '0',
        'OrderType': '',
        'DeviceNo': '',
        'ExecUserID':'0',
        'Remark': '',
        'Createtime': '',
        'State':'',
        'CreatedUser': JSON.parse(sessionStorage.getItem("UserDetial")).Id
      },
      rules:{
        // OrderNO:[{ required: true, message: '工单编号不能为空', trigger: 'blur' },],
        OrderType:[{ required: true, message: '请选择工单类型', trigger: 'change' },],
        State:[{required: true, message: '请选择状态', trigger: 'change'}],
        DeviceNo:[{required: true, message: '请输入设备名称', trigger: 'blur'}],
        CreateUser:[{required: true, message: '请输入执行人', trigger: 'blur'}]

      },
      listData:[],
      OrderNO:'',
      OrderType:'',
      DeviceNo:'',
      Remark:'',
      options:[
        {
          label:'未分配',
          State:'0',
        },
        {
          label:'待执行',
          State:'1',
        },
        {
          label:'执行中',
          State:'2',
        },
      ],
      value:'未分配'
    };
  },
  computed: {
    // ...mapGetters([
    //   'CreateBillNOByBillTypeCode'
    // ])
  },
  created() {
    that = this;
    this.getlistdata();
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  // 过滤时间格式
  filters: {
    filterCtime(CreatedTime) {
      return moment(CreatedTime).format('YYYY-MM-DD')
    },
    CTime(CreatedTime) {
      return moment(CreatedTime).format('YYYY-MM-DD')
    }
  },
  methods: {
    // 当前创建时间
    foamatTimer() {
      let date = new Date()
      return this.ruleForm.ConfirmTIme = moment(date).format('YYYY-MM-DD')
    },
    // 搜索
    sendinput() {
     this.getlistdata();
    },
    // 工单执行记录查看
    look(row) {
     this. dialogVisible4 = true;
      let obj = {
        "MN": "GetSingleWorkOrderLog",
        "SN":"WorkOrderManage",
        "RequestId": 1,
        "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        "DataContent": {
          Id: row.Id
        }
      }
       this.MIX_send(obj);
    },
    // 查看新增按钮
    addtabel() {
      this.dialogVisible3 = true;
      this.ruleForm.OrderNO = this.rowOrder;
      this.ruleForm.Id = 0;
    },
    // 查看工单保存
    saveOrder(){
      this.foamatTimer();   //调用当前创建时间
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let obj = {
            "MN": "SaveWorkOrderLog",
            "SN":"WorkOrderManage",
            "RequestId": 1,
            "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
            "DataContent": this.ruleForm
          }
          this.MIX_send(obj);
          this.handleClose3();
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 添加组
    addgroup(){
      this.isshow = true;
      // this.formData ={};
      this.formtype = 1;
      this.dialogVisible1 = true;
      let obj ={
        "MN": "CreateBillNOByBillTypeCode",
        "SN":"SystemSetting",
        "DataContent": {
          "BillCode":"GDBH",
        }
      }
      this.MIX_send(obj);
    },
    list( listTable) {
      let obj = {
        "MN": "GetListWorkOrderLog",
        "SN":"WorkOrderManage",
        "RequestId": 1,
        "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        "DataContent" :{
          OrderNO:listTable,
          PageSize: 1000,
          PageIndex: this.PageIndex,
        }
      }
      this.MIX_send(obj);
    },
    // 查看
    view(row) {
      // this.userId = row.Id;
      this.rowOrder = row.OrderNO
      localStorage.setItem('getset',this.rowOrder)
      this.dialogVisible2 = true;
        let json = {
          "MN":'GetSingleWorkOrder',
          "SN":"WorkOrderManage",
          "RequestId": 1,
          "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
          "DataContent" :{
            Id:row.Id
          }
        }
      this.MIX_send(json);
      this.listData = [];
      this.list(this.rowOrder);
    },
    // 编辑
    editdetail(row){
      this.isshow = true;
      let rowdata = JSON.parse(JSON.stringify(row));
      this.formData = rowdata;
      this.formtype = 2;
      this.dialogVisible1 = true;      
    },
    // 删除
    remove(row) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "MN": "DelWorkOrder",
          "SN":"WorkOrderManage",
          "RequestId": 1,
          "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
          "DataContent": {
            "Id":row.Id,
            "IsDel":1,
            "UserId":JSON.parse(sessionStorage.getItem("UserDetial")).Id
          }
        }       
        this.MIX_send(obj);
      }).catch(() => {
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      });
    },
    // 查询列表数据
    getlistdata() {
      let obj = {
        "MN": "GetListWorkOrder",
        "SN":"WorkOrderManage",
        "RequestId": 1,
        "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        "DataContent": {
          PageIndex: this.PageIndex,
          PageSize: this.PageSize,
          KeyWord: this.KeyWord,
          IsDel:'0',
          StaffID:this.StaffID,
          ExecStaffID:this.ExecStaffID,
          TypeID:this.TypeID,

        },
      }
      this.MIX_send(obj);
    },
    //新增编辑 保存
    commit() {
      //新增=1 and 修改
        this.$refs.formData.validate((valid) => {
          if (valid) {
            if(this.formtype==1){
              this.formData.Id =0; 
              this.formData.State=0; 
              this.formData.CreatedUser = JSON.parse(sessionStorage.getItem("UserDetial")).Id; 
            }
            let obj = {
              "MN": "SaveWorkOrder",
              "SN":"WorkOrderManage",
              "RequestId": 1,
              "UserId": JSON.parse(sessionStorage.getItem("UserDetial")).Id,
              "DataContent": this.formData
            }  
            this.MIX_send(obj);
            this.formtype = 0;
            this.handleClose();
          } else {
            return false;
          }
        })
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
    // 关闭弹框 
    handleClose() {
       this.formData = {};  // 关闭弹框 清空表单数据
        this.$refs.formData.resetFields();  // 清空表单验证
       this.dialogVisible1 = false;
    },
    // 关闭弹框 
    handleClose1() {
      this.listdata = [];
      this.dialogVisible2 = false;
    },
    // 关闭弹框 
    handleClose3() {
      this.ruleForm = {};  // 关闭弹框 清空表单数据
      this.$refs.ruleForm.resetFields();  // 清空表单验证
      this.dialogVisible3 = false;
    },
    // 关闭弹框 
    handleClose4() {
      this.dialogVisible4 = false;
    },
	closePropMask(){
		this.isShowEquipment = false;
	},
	addTable(data){
		this.formData.DeviceNo = data.DeviceNum;
	},
	showEquipment(){
		this.isShowEquipment = true;
	}
  },
  watch: {
    // //查询成功 返回数据
    "$store.state.Humanmanage.GetListWorkOrder": function (data) {   
      this.total = data.ReturnData.DataCount;   
      this.tableData = data.ReturnData.Data;     
    },
    // 新增编辑 返回数据
    "$store.state.Humanmanage.SaveWorkOrder": function (data) {    
      this.$message({
        message: '恭喜你,保存成功',
        type: 'success'
      });
      this.getlistdata();   
    },
    // 获取工单编号 返回数据
    "$store.state.Purchasingmanagement.CreateBillNOByBillTypeCode": function (data) {
      this.formData.OrderNO = data.ReturnData.BillNo
    },
    // 新增工单 返回数据
    "$store.state.Humanmanage.SaveWorkOrderLog": function (data) {
      this.$message({
        message: '恭喜你,保存成功',
        type: 'success'
      });
      if(data.Code==0){
        this.list(this.rowOrder)
      }
    },
    // 查看 返回数据
    "$store.state.Humanmanage.GetSingleWorkOrder": function (data) {  
        this.OrderNO = data.ReturnData.OrderNO;
         if(data.ReturnData.OrderType==0){
          this.OrderType = '保养工单'
        }else if(data.ReturnData.OrderType==1){
          this.OrderType = '维修工单'
        }else if(data.ReturnData.OrderType==2){
          this.OrderType = '检测'
        }else if(data.ReturnData.OrderType==3){
          this.OrderType = '其他'
        }
        if(data.ReturnData.State ==0){
          this.State = '待分配'
        }else if(data.ReturnData.State ==1){
          this.State = '待执行'
        }else if(data.ReturnData.State ==2){
          this.State = '执行中'
        }else if(data.ReturnData.State ==3){
          this.State = '执行完成'
        }else if(data.ReturnData.State ==4){
          this.State = '已作废'
        };
        this.AddStaffName = data.ReturnData.AddStaffName;
        this.ExecName = data.ReturnData.ExecName;
        this.Remark = data.ReturnData.Remark;
        this.DeviceNo = data.ReturnData.DeviceNo;
    },
    // 查看 返回数据
     "$store.state.Humanmanage.GetListWorkOrderLog": function (data) {
       if(data.ReturnData!=null && data.ReturnData.Data!=null){
          this.listData = data.ReturnData.Data;
       }
    },
    // 查看执行记录 返回数据
     "$store.state.Humanmanage.GetSingleWorkOrderLog": function (data) {
        this.OrderNO = data.ReturnData.OrderNo;
        this.Question = data.ReturnData.Question;
        this.TreatmentMethod = data.ReturnData.TreatmentMethod;
        this.ConfirmName = data.ReturnData.ConfirmName;
        this.ExecName = data.ReturnData.ExecName;
        this.CreatedName = data.ReturnData.CreatedName;
        if(data.ReturnData.State ==0){
          this.State = '未完成'
        }else{
          this.State = '已完成'
        };
        if(data.ReturnData.Confirm == 0){
           this.Confirm = '待确认'
        }else if(data.ReturnData.Confirm == 1){
          this.Confirm = '确认'
        }else{
          this.Confirm = '无效'
        }
    },
    "$store.state.Humanmanage.DelWorkOrder": function (data) {
      this.$message({
        message: '恭喜你,操作成功',
        type: 'success'
      });
       this.getlistdata();
    },
  },
};
</script>

<style lang="less" scoped>
.holifin{
  background-color:#FFF;
	border-radius: 5px;
  padding:0 20px;
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
/deep/ .newOrder{
  .el-dialog__body{
    height:400px;
  }
}
/deep/ .el-dialog__body {
    margin: 20px 20px 10px;
    // height:350px;
    padding:20px 20px 0 20px;
    overflow-y: auto;
    background-color:#FAFBFC;
}
/deep/ .el-textarea__inner{
    height:150px;
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
  font-size: 16px;
  color:#4D6474;
}
.orderType{
  height:200px;
  background-color:#FAFBFC;
}
.el-col {
  line-height:50px;
  span{
    font-size:16px;
    color:#4D6474;
    // margin:20px;
    line-height:40px;
    font-weight: 500;
  }
}
/deep/ .el-input__inner{
  color:#4D6474;
}
.logging{
  margin-top:10px;
  // width:80px;
  color: #0060A0;
  font-size:18px;
  font-weight: bold;
  line-height: 30px;
}
.Figure{
  margin:8px 0px 12px;
  width: 35px;
  height: 3px;
  background: #0060A0;
}
.addButton {
  background-color: #0060A0;
  color:#FFF;
  width: 3%;
  padding: 3% 0 0;
  position: relative;
  display: flex;
  float:right;
  margin-top: 10px;
  align-items: center;
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
</style>
