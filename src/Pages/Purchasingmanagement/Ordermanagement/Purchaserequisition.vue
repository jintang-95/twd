<template>
  <div class="materiaType">
    <right-container
      @selectType="selectType"
      @pageSizeToggle="pageSizeToggle"
      @pageToggle="pageToggle"
      @pagePrev="pagePrev"
      @pageNext="pageNext"
      @statusChange="statusChange"
      @inputChange="inputChange"
      @refreshPage="refreshPage"
      @addNew="addNew"
      :page="page"
      :pageSize="pageSize"
      :total="total"
      :process="process"
      :checkList="checkList"
      :menuList="treeData"
      title="全部物料"
      :showTree="false"

    >
      <el-table
        :data="tableData"
        header-row-class-name="headerClass"
        slot="table"
        align="center"
        :header-cell-style="{background:'#F0F7FB',color:'#5C87A4' }"
        cell-class-name="elliplise"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <div class="success" v-if="row.IsDel=='启用'">
              <img src="../../../assets/images/img/green.png" alt /> 已启用
            </div>
            <div class="danger" v-if="row.IsDel=='停用'">
              <img src="../../../assets/images/img/red.png" alt /> 已停用
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.IsDel == '启用'">
              <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />
                <span>编辑</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="seeUp(scope.row)"
              >
                <img src="../../../assets/images/look.png" alt />
                <span>查看</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="stop(scope.row)"
              >
                <img src="../../../assets/images/stop_icon.png" alt />
                <span>停用</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="addEvent(scope.row)"
              >
                <img src="../../../assets/images/purchase.png" alt />
                <span>采购</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="commit(scope.row)"
              >
                <img src="../../../assets/images/start_icon.png" alt />
                <span>提交审核</span>
              </el-button>
            </div>
            <div v-if="scope.row.IsDel == '停用'">
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="seeUp(scope.row)"
              >
                <img src="../../../assets/images/look.png" alt />
                <span>查看</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="start(scope.row)"
              >
                <img src="../../../assets/images/start_icon.png" alt />
                <span>启用</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>
    <Archives
      :visible="showMask"
      :manageStyle="manageStyle"
      :brands="brands"
      :wareHouse="wareHouse"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      @closeMask="closeMask"
      @addMateria="addMateria"
      :editTable="editTable"
    ></Archives>

    <!-- //采购 -->
    <Purchase
      :visible="showPurchase"
      :manageStyle="manageStyle"
      :brands="brands"
      :wareHouse="wareHouse"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      @closeMask="closeMask"
      @addPQ="addPQ"
      :seeTableData="seeTableData"
      :QGNobainhao="QGNobainhao"
    ></Purchase>










  <!-- 查看弹框 -->
    <el-dialog title="查看请购单" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
          <el-col :span="8">
              <div><span>申请时间 ：</span><span>{{seeUpTable.ApplyTime}}</span></div>
          </el-col>
          <el-col :span="8">
            <div v-if="seeUpTable.ApplyType == 1"><span>请购类型 ：</span><span>物料</span></div>
            <div v-else-if="seeUpTable.ApplyType == 2"><span>请购类型 ：</span><span>备件</span></div>
            <div v-else-if="seeUpTable.ApplyType == 3"><span>请购类型 ：</span><span>工具</span></div>
          </el-col>
          <el-col :span="8">
            <div><span>申请部门 ：</span><span>{{seeUpTable.OrganizationName}}</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          
          <el-col :span="8">
            <div><span>当前岗位 ：</span><span>{{seeUpTable.JobsName}}</span></div>
          </el-col>
          <el-col :span="8">
            <div><span>申请人 ：</span><span>{{seeUpTable.StaffName}}</span></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div><span>申请原因 ：</span><span>{{seeUpTable.ApplyReason}}</span></div>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="24" style="margin-top:40px;margin-bottom:20px;">
            <div><span style="font-size:18px;font-weight:600 ;">购买明细</span></div>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="seeTableData"
            height="250"
            border
            :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}" 
            style="width: 100%">
            <el-table-column
              prop="MName"
              align="center"
              label="物料名称">
            </el-table-column>
            <el-table-column
              prop="MNo"
              align="center"
              label="物料编码">
            </el-table-column>
            <el-table-column
              prop="Spec"
              align="center"
              label="规格">
            </el-table-column>
              <el-table-column
              prop="MModel"
              align="center"
              label="型号">
            </el-table-column>
              <el-table-column
              prop="Number"
              align="center"
              label="数量">
            </el-table-column>
          </el-table>
        </el-row>
    <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
    
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Archives from "./dialog/archives.vue";
import Purchase from "./dialogcaigou/purchase.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materielArchives", //物料档案
  data() {
    return {
      showPurchase:false,
      seeTableData:[],
      QGNobainhao:'',
      seeUpTable:[],//查看
      dialogFormVisible:false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
      Id:'',
      UserId:'',
      
      OneId:'',
      valueSelect: "",
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      searchVal:"",
      IsDel:'',//是否停用，0正常  1停用  -1所有数据，此参数不传默认所有数据
      ApplyType:'',//请购类型（1物料  2 备件   3 工具），此参数不传默认所有数据
      checkTable:[],
      formData: {
        Id:'',
        No:'',
        ApplyTime:'',
        ApplyStaff:'',
        ApplyReason:'',
        // CreatedTime:'',
        CreatedUser:'',
        DelTime:'',
        DelUser:'',
        IsDel:'',//是否停用，0正常  1停用  -1所有数据，此参数不传默认所有数据
        ApplyType:'',//请购类型（1物料  2 备件   3 工具），此参数不传默认所有数据
        BuyInfoList:[{
          BuyInfoId:0,
          PleaseBuyId:0,
          MaterielId:1,
          Number:1,
          OperateType:0
        }],
        // No: "",
        // Name: "",
        // Desc: "",
        // CategoryId: "",
        // IsReplaceMateriel: "",
        // IsTool: "",
        // IsAssets: "",
        // StandardUnitId: "",
        // DefaultWarehouseId: "",
        // Grade: "",
        // BrandId: "",
        // DefaultSupplierId: "", //默认供应商
        // ManageStyle: "",
        // Spec: "",
        // Model: "",
        // ValidityTime: "",
        // ValidityTimeUnit: "",
        // Status: "",
        // ReplaceMaterielDetail: [],
        // UnitConvertDetail: [],
        // MaterielBOMDetail: [],
        // OperationStandardDetail: [],
        // ExPropertyDetail: [],
        // MaterielImageDetail: [],
      },
      editForm: {},
      wareHouse: [], //默认仓库列表
      brands: [], //品牌列表,
      manageStyle: [
        {
          Id: "1",
          Name: "备件管理",
        },
        {
          Id: "2",
          Name: "工具管理",
        },
      ], //管理方式
      
      formType: "1",
      process: ["Add", "check", "search"],
      checkData: '',
      lastData: [],
      editTable:[],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "全部",
          statu: -1,
        },
        {
          title: "已启用",
          statu: 0,
        },
        {
          title: "已停用",
          statu: 1,
        },
      ],
      treeData: [],
      columns: [
        {
          label: "申请单号",
          prop: "No",
        },
        {
          label: "申请时间",
          prop: "ApplyTime",
        },
        {
          label: "申请人",
          prop: "StaffName",
        },
        {
          label: "所在部门",
          prop: "OrganizationName",
        },
        {
          label: "当前岗位",
          prop: "JobsName",
        },
        {
          label: "请购原因",
          prop: "ApplyReason",
        },
      ],
    };
  },
  async created() {
    this.resetFormData();
    await this.getTreeData();
    await this.getTableData();
    await this.getDefauktWareHouse();
    this.getBrandList();
    this.getSessionUser()
    // this.seeUp(row)
  },
  computed: {
    ...mapGetters([
      "GetMaterielCategoryTree",
      "GetListPleaseBuy",//表格列表
      "UnCancelMateriel",
      "CancelMateriel",
      "RemoveMateriel",
      "DelPleaseBuy",
      "SaveMateriel",
      "SavePleaseBuy",
      "SavePleaseBuyAndInfo",
      "GetMaterielById",
      "GetSinglePleaseBuy",
      "GetWarehouses",
      "GetBrands",
      "imgUrl",
      "SavePurchaseAndDetail",
    ]),
  },
  watch: {
    GetMaterielCategoryTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.treeData = newValue.ReturnData;
        this.lastData = newValue.ReturnData;
        this.typeList = newValue.ReturnData
      } else {
        // 失败
      }
    },
    //查看
    "$store.state.Purchasingmanagement.GetSinglePleaseBuy": function (data){
      this.seeUpTable = data.ReturnData
      this.seeTableData = data.ReturnData.BuyInfoList
      this.editTable=JSON.parse(JSON.stringify(data.ReturnData.BuyInfoList))
      console.log(this.seeUpTable,"seeupsss")
      this.QGNobainhao = data.ReturnData.No
      
    },
    GetListPleaseBuy(newValue, oldValue) {
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          let unit =
            newValue.ReturnData.Data[i].ValidityTimeUnit == 0
              ? "天"
              : newValue.ReturnData.Data[i].ValidityTimeUnit == 1
              ? "月"
              : "年";
          newValue.ReturnData.Data[i].IsDel =
            // newValue.ReturnData.Data[i].Status == 2 ? "启用" : "停用";
            newValue.ReturnData.Data[i].IsDel == 0 ? "启用" : "停用";
          newValue.ReturnData.Data[i].ValidityTime =
            newValue.ReturnData.Data[i].ValidityTime + unit;
          newValue.ReturnData.Data[i].UnitName = !newValue.ReturnData.Data[i]
            .UnitName
            ? "无"
            : newValue.ReturnData.Data[i].UnitName;
        }
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
      }
    },
    UnCancelMateriel(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "启用成功",
          type: "success",
        });
        this.getTableData();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "启用失败",
          type: "fail",
        });
      }
    },
    DelPleaseBuy(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "停用成功",
          type: "success",
        });
        this.getTableData();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "停用失败",
          type: "fail",
        });
      }
    },
    async DelPleaseBuy(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "success",
        });
        await this.getTableData();
        this.getTreeData();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "fail",
        });
      }
    },
    async SavePleaseBuyAndInfo(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
        this.getTreeData();
        this.resetFormData();
        this.showMask = false;
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "fail",
        });
      }
    },
    async SavePurchaseAndDetail(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
        this.getTreeData();
        this.resetFormData();
        this.showMask = false;
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "fail",
        });
      }
    },
    // searchFun(val){
    //   // this.searchVal=val
    //   console.log(val)
    // },
    GetMaterielById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData;
        console.log(this.editForm["MaterielImageDetail"]);
        this.editForm["MaterielImageDetail"] = this.editForm[
          "MaterielImageDetail"
        ].map((item) => {
          item["url"] = this.imgUrl + item.Address;
          // item['uid'] = new Date().getTime()
          return item;
        });
        console.log(this.editForm["MaterielImageDetail"]);
        this.openEdit();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "获取数据失败",
          type: "fail",
        });
      }
    },
    GetWarehouses(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.wareHouse = newValue.ReturnData.Data;
      } else {
        // 失败
      }
    },
    GetBrands(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.brands = newValue.ReturnData.Data;
      } else {
        // 失败
      }
    },
  },
  methods: {
     // 点击提交
    commit (r) {
      console.log(r,"=====")
      let json = {
        MN: "ApprovalProcessOrderRecordCreate",
        SN: "ApprovalCenter",
        "RequestId": 1,
        "UserId": 1,
        DataContent: {
          ProcessCode: 'CJ',
          StaffID: this.SessionUser.Id,
          Abstracts: r.ApplyReason,
          BillNum: r.No
        }
      }
      this.MIX_send(json)
      this.getSessionUser()
    },
    // 点击采购
    addEvent(row){
      this.showPurchase = true;
      this.OneId = row.Id
      this.getOneTable()
      
      console.log(row.Id,"bbbmmmmmmmmm")
    },

    //查看
    seeUp(row){
     
      this.dialogFormVisible = true
      this.OneId = row.Id
      this.getOneTable()
      
    },
    //停用
    stop(row) {
      this.stopMateria(row.Id);
      console.log(row.UserId,".......")
    },
    // 启用
    start(row) {
      this.startMateria(row.Id);
    },


    selectType(data) {
      this.currentId = data;
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    //下拉框事件
    optionChange(id) {
      console.log(id);
      this.valueSelect = id;
      this.getTableData();
    },
    // 获取默认仓库数据
    getDefauktWareHouse() {
      let json = {
        MN: "GetWarehouses",
        SN: "Warehouse",
        DataContent: {
          Id: "",
          KeyWord: "",
          PageSize: 100,
          PageIndex: 1,
          Status: "",
        },
      };
      this.MIX_send(json);
    },
    // 获取品牌
    getBrandList() {
      let json = {
        MN: "GetBrands",
        SN: "Materiel",
        DataContent: {
          KeyWord: "",
          PageSize: 100,
          PageIndex: 1,
          Status: "",
        },
      };
      this.MIX_send(json);
    },
    // 通过Id获取数据
    getMaterielById(Id) {
      let json = {
        MN: "GetMaterielById",
        SN: "Materiel",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    // 获取树形结构数据
    getTreeData() {
      let json = {
        MN: "GetMaterielCategoryTree",
        SN: "Materiel",
        DataContent: {
          SType:1
        },
      };
      this.MIX_send(json);
    },
    // shs获取表格数据
    getTableData() {
      let json = {
        MN: "GetListPleaseBuy",
        SN: "Purchase",
        DataContent: {
          IsDel:this.IsDel,
          ApplyType: this.ApplyType,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
        },
      };
      this.MIX_send(json);
    },
    //shs新增
    addMateriaType(data) {
      let json = {
        MN: "SavePleaseBuyAndInfo",
        SN: "Purchase",
        DataContent: data,
      };
      this.MIX_send(json);
    },
    //shs新增采购明细
    addPQType(data) {
      let json = {
        MN: "SavePurchaseAndDetail",
        SN: "Purchase",
        DataContent: data,
      };
      this.MIX_send(json);
    },
  //获取单挑数据 查看
  getOneTable() {
      let json = {
        MN: "GetSinglePleaseBuy",
        SN: "Purchase",
        DataContent: {
          Id:this.OneId
        },
      };

      this.MIX_send(json);
    },
    //获取本地用户信息
    getSessionUser(){
      this.SessionUser = JSON.parse(sessionStorage.getItem("UserDetial"));
      console.log(this.SessionUser.Id,";;;")

    },
    //停用
    stopMateria(Id) {
      let json = {
        MN: "DelPleaseBuy",
        SN: "Purchase",
        DataContent: {
          Id:Id,
          IsDel:1,
          UserId:this.SessionUser.Id
          
        },
      };
      this.MIX_send(json);
      this.getSessionUser()
    },
    startMateria(Id) {
      let json = {
        MN: "DelPleaseBuy",
        SN: "Purchase",
        DataContent: {
          Id:Id,
          IsDel:0,
          
        },
      };
      this.MIX_send(json);
    },
    // 页面Size切换
    pageSizeToggle(data) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    // 页面切换
    pageToggle(data) {
      this.page = data;
      this.getTableData();
    },
    // 上一页回调
    pagePrev(data) {
      this.page = data;
      this.getTableData();
    },
    // 下一页回调
    pageNext(data) {
      this.page = data;
      this.getTableData();
    },
    // 顶部复选框过滤
    statusChange(data) {
      this.IsDel = data;
      this.getTableData();
    },
    // 输入框回车键
    inputChange(data) {
      this.keyWord = data;
      console.log(data);
      this.getTableData();
    },
    // 刷新回调
    async refreshPage() {
      await this.getTreeData();
      this.getTableData();
    },
    /**
     * 表格处理函数
     * */
    //查看
    handleClickone(row){
      console.log(row,"mmmmmmmmmmm")
      
      console.log(this.formData)
      this.showMask = true;
      this.getTableData()
      this.getOneTable()

    },
    // 编辑
    edit(row) {
      this.formType = "2";
      this.OneId=row.Id
      this.getOneTable()
      this.formData = {
        Id:row.Id,
        No:row.No,
        ApplyTime:row.ApplyTime,
        ApplyStaff:row.ApplyStaff,
        ApplyReason:row.ApplyReason,
        // CreatedTime:row.CreatedTime,
        CreatedUser:row.CreatedUser,
        DelTime:row.DelTime,
        DelUser:row.DelUser,
        IsDel:0,//是否停用，0正常  1停用  -1所有数据，此参数不传默认所有数据
        ApplyType:row.ApplyType,
        BuyInfoList:[
        ]
      };
      console.log(this.seeTableData,"/////")
      console.log(this.formData,"ppppppppppppppp");
      setTimeout(()=>{
        this.showMask = true;
      }) 
    },
    openEdit() {
      this.formData[
        "ReplaceMaterielDetail"
      ] = this.editForm.ReplaceMaterielDetail;
      this.formData["UnitConvertDetail"] = this.editForm.UnitConvertDetail;
      this.formData["MaterielImageDetail"] = this.editForm.MaterielImageDetail;
      this.formData["MaterielBOMDetail"] = this.editForm.MaterielBOMDetail;
      this.formData[
        "OperationStandardDetail"
      ] = this.editForm.OperationStandardDetail;
      this.formData["ExPropertyDetail"] = this.editForm.ExPropertyDetail;
      this.showMask = true;
    },
    // 删除
    del(row) {
      this.removeMateria(row.Id);
      
    },
    // 回收
    reCover(row) {},
    
    // 清除
    clear(row) {},
    // 新增
    addNew() {
      this.formType = "1";
      for (let key in this.formData) {
        if (key != "Id") {
          this.formData[key] =
            this.formData[key] instanceof Array
              ? []
              : typeof this.formData[key] == "Object"
              ? {}
              : "";
        } else {
          delete this.formData[key];
        }
      }
      this.showMask = true;
    },
    // 取消新增或者取消编辑
    closeMask(data) {
      this.showMask = false;
      this.resetFormData();
      this.showPurchase = false;
    },
    // 新增或者编辑请购单
    addMateria(data) {
      console.log(data);
      this.addMateriaType(data);
      this.checkTable = data;
      this.showPurchase = false;
      console.log(this.checkTable,"/////")
    },
    // 新增或者编辑采购单
    addPQ(data) {
      console.log(data,"ccc")
      this.addPQType(data)
      this.showPurchase = false;
    },
    resetFormData() {
      this.formData = {
        Id:'',
        No:'',
        ApplyTime:'',
        ApplyStaff:'',
        ApplyReason:'',
        // CreatedTime:'',
        CreatedUser:'',
        DelTime:'',
        DelUser:'',
        IsDel:'',//是否停用，0正常  1停用  -1所有数据，此参数不传默认所有数据
        ApplyType:'',//请购类型（1物料  2 备件   3 工具），此参数不传默认所有数据
        BuyInfoList:[],
ReplaceMaterielDetail: [],
        Edit:[],


       
      };
    },
  },
  components: {
    RightContainer,
    Archives,
    Purchase,
  },
};
</script>

<style scoped lang="less">
// .text {
//   font-size: 14px;
// }

// .item {
//   margin-bottom: 18px;
// }

// .clearfix:before,
// .clearfix:after {
//   display: table;
//   content: "";
// }
// .clearfix:after {
//   clear: both
// }

// .box-card {
//   width: 480px;
// }
.materiaType {
  width: 100%;
}
.processBtn {
  display: flex;
}
// .el-card{
//   width: 98%;
//   height: 98%;
//   margin: 20px auto;
//   z-index: 1;
// }
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  width: 14px;
  vertical-align: middle;
}
.el-table__header-wrapper {
  background-color: #0060a0;
}
.box-card {
  width: 98%;
  margin: 20px auto;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
/deep/ .el-tag {
  border: none;
}
.name {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(77, 100, 116, 1);
}
.materiaType {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 0 1.1875rem;
  box-sizing: border-box;
}
/deep/.el-dialog{
  width: 1440px;
}
/deep/.el-dialog__header{
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474;
}
/deep/.dialog-footer button.el-button--primary{
  background:#0060a0;
} 
/deep/.dialog-footer button.el-button--default{
  color:rgb(92, 135, 164);
}
/deep/.dialog-footer button{
  width:64px;
  height:32px;
  border-radius: 0;
  text-align: center;
  line-height: 0;
  border: 1px solid rgb(209, 221, 245);
}  
</style>