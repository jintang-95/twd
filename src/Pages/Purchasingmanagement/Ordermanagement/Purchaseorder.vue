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
        <!-- <el-table-column
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
          align="center"
        ></el-table-column>-->
        <template v-for="(item,index) in columns">
          <el-table-column
            v-if="item.label=='源单类型'"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.ResoureType=='0'">请购单</span>
            </template>
          </el-table-column>
          <el-table-column v-else :key="index" :label="item.label" :prop="item.prop" align="center"></el-table-column>
        </template>
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
                @click="godown(scope.row)"
              >
                <span>入库</span>
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

    <el-dialog
      class="ModalForm"
      width="75%"
      :visible.sync="outPutDialog"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      :title="'入库单'"
    >
      <PopForm
        ref="PopForm"
        :addTrue="false"
        :fromData="outPutFromData"
        :typeList="menuLists"
        :popVal="popVal"
        :seeUpTable="seeUpTable"
        class="PopForm"
      >
        <div slot="tabPane0">
          <el-table
            :data="seeTableData"
            style="width: 100%"
            fit
            :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
          >
            <el-table-column align="center" prop="MName" label="物料名称"></el-table-column>
            <el-table-column align="center" prop="MNo" label="物料编号"></el-table-column>
            <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
            <el-table-column align="center" prop="MModel" label="型号"></el-table-column>
            <el-table-column align="center" prop="Number" label="数量"></el-table-column>
          </el-table>
        </div>
      </PopForm>
      <div slot="footer" class="dialog-footer">
        <button
          style=" outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
          @click="PopFormInit"
        >取 消</button>
        <button
          :disabled="disabled"
          style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
          @click="Commit"
        >提 交</button>
      </div>
    </el-dialog>

    <!-- 查看弹框 -->
    <el-dialog title="查看请购单" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <span>申请时间 ：</span>
            <span>{{seeUpTable.PurchaseDate}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div v-if="seeUpTable.ApplyType == 1">
            <span>源单类型 ：</span>
            <span>请购单</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>采购编号 ：</span>
            <span>{{seeUpTable.No}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <span>供应商 ：</span>
            <span>{{seeUpTable.SupplierName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>采购员 ：</span>
            <span>{{seeUpTable.StaffName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <span>备注 ：</span>
            <span>{{seeUpTable.Remark}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="24" style="margin-top:40px;margin-bottom:20px;">
          <div>
            <span style="font-size:18px;font-weight:600 ;">购买明细</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          :data="seeTableData"
          height="250"
          border
          :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
          style="width: 100%"
        >
          <el-table-column prop="MName" align="center" label="物料名称"></el-table-column>
          <el-table-column prop="MNo" align="center" label="物料编码"></el-table-column>
          <el-table-column prop="Spec" align="center" label="规格"></el-table-column>
          <el-table-column prop="MModel" align="center" label="型号"></el-table-column>
          <el-table-column prop="Number" align="center" label="数量"></el-table-column>
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
import fromdata from "@/const/index";
import PopForm from "@/components/PQGodown.vue";
import RightContainer from "@/components/rightContainer.vue";
import Archives from "./dialogcaigou/archives.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "Purchaseorder",
  data() {
    return {
      CGId: "",
      Status: "",
      menuLists: [],
      options: [],
      popVal: {},
      outPutFromData: {},
      outPutDialog: false,
      disabled: false,
      seeTableData: [],
      seeUpTable: [], //查看
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      Id: "",
      UserId: "",

      OneId: "",
      valueSelect: "",
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      searchVal: "",
      IsDel: -1,
      ResoureType: 0,
      checkTable: [],
      formData: {
        Id: 0,
        No: "",
        PurchaseDate: "",
        ResoureType: "",
        ResoureNumber: "",
        Supplier: 5,
        ContactPerson: "",
        Buyer: "",
        AmountPayable: "",
        AmountActually: "",
        Currency: 0,
        Remark: "",
        DelTime: "",
        DelUser: "",
        IsDel: "",
        PEList: [
          {
            PDetailId: 0,
            PleaseBuyId: 0,
            MaterielId: 1,
            Number: 1,
            OperateType: 0,
          },
        ],
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
      checkData: "",
      lastData: [],
      editTable: [],
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
          label: "采购单号",
          prop: "No",
        },
        {
          label: "采购时间",
          prop: "PurchaseDate",
        },
        {
          label: "采购员",
          prop: "StaffName",
        },
        {
          label: "供应商",
          prop: "SupplierName",
        },
        {
          label: "源单类型",
          prop: "ResoureType",
        },
        // {
        //   label: "源单号",
        //   prop: "ResoureNumber",
        // },
        {
          label: "备注",
          prop: "Remark",
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
    this.getSessionUser();
    this.sessionPurchase();
    this.GetWarehousesTree();
    this.outPutFromData = fromdata.fromdataCG;
  },
  computed: {
    ...mapGetters([
      "GetMaterielCategoryTree",
      "GetListPurchase", //表格列表
      "UnCancelMateriel",
      "CancelMateriel",
      "RemoveMateriel",
      "DelPurchase",
      "SaveMateriel",
      "SavePleaseBuy",
      "SavePurchaseAndDetail",
      "GetMaterielById",
      "GetSinglePurchase",
      "GetWarehouses",
      "GetBrands",
      "imgUrl",
      "Materiels",
      "WarehousesTree",
      "UpdatePurchaseStatus",
    ]),
  },
  watch: {
    //采购状态
    // "$store.state.Purchasingmanagement.UpdatePurchaseStatus": function (data){
    //   console.log(data,"mmmnnnnjj")
    // },
    //获取仓库
    WarehousesTree: function (newval, oldval) {
      if (newval.Code == 0) {
        this.menuLists = newval.ReturnData;
      }
    },
    Materiels: function (newval, oldval) {
      this.options = newval.ReturnData.Data;
      console.log(this.options, ";;jj");
    },
    GetMaterielCategoryTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.treeData = newValue.ReturnData;
        this.lastData = newValue.ReturnData;
        this.typeList = newValue.ReturnData;
      } else {
        // 失败
      }
    },
    //查看
    //查看
    "$store.state.Purchasingmanagement.GetSinglePurchase": function (data) {
      this.seeUpTable = data.ReturnData;
      this.seeTableData = data.ReturnData.PEList;
      this.editTable = JSON.parse(JSON.stringify(data.ReturnData.PEList));
      console.log(this.seeTableData, "seeupsss");
    },
    GetListPurchase(newValue, oldValue) {
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
          // newValue.ReturnData.Data[i].Status == 0 ? "待采购" : (newValue.ReturnData.Data[i].Status == 1 ? "待付款" : (newValue.ReturnData.Data[i].Status == 2 ? "待入库":"入库完成"));
          newValue.ReturnData.Data[i].ValidityTime =
            newValue.ReturnData.Data[i].ValidityTime + unit;
          newValue.ReturnData.Data[i].UnitName = !newValue.ReturnData.Data[i]
            .UnitName
            ? "无"
            : newValue.ReturnData.Data[i].UnitName;
        }
        this.tableData = newValue.ReturnData.Data;
        console.log(this.tableData, "aaa");
        this.total = newValue.ReturnData.DataCount;
      } else {
      }
    },
    DelPurchase(newValue, oldValue) {
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
    DelPurchase(newValue, oldValue) {
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
    async DelPurchase(newValue, oldValue) {
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
        console.log(newValue, "////");
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
    //获取采购单状态
    getUpdatePurchaseStatus(data) {
      let json = {
        MN: "UpdatePurchaseStatus",
        SN: "Purchase",
        DataContent: data,
      };
      this.MIX_send(json);
    },
    // 获取仓库树
    GetWarehousesTree() {
      let json = {
        MN: "GetWarehousesTree",
        SN: "Warehouse",
        DataContent: {},
      };
      this.MIX_send(json);
    },
    //入库确认弹框
    Commit() {
      this.popVal = {};
      this.$refs.PopForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let value = JSON.parse(JSON.stringify(this.$refs.PopForm.value));
          value.InStockDetail = this.newTableData;
          value.TableType = 1;
          console.log(value);
          this.SaveInStock(value);
          this.PopFormInit();
        } else {
          return false;
        }
      });
    },
    // 保存/提交入库单
    SaveInStock(obj) {
      let json = {
        MN: "SaveInStock",
        SN: "InStock",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    // 弹出框表单初始化
    PopFormInit() {
      // this.tabledata01 = [];
      // this.$refs.PopForm.$refs.ruleForm.resetFields();
      // this.modal12 = false;
      this.outPutDialog = false;
    },
    //出库
    godown(row) {
      // this.seeUpTable.ResoureType = 0
      // this.seeUpTable.No = row.No
      this.OneId = row.Id;
      this.outPutDialog = true;
      this.getOneTable();
    },
    sessionPurchase() {
      this.sessionPurchase = JSON.stringify(sessionStorage.getItem("Purchase"));
    },
    //查看
    seeUp(row) {
      this.dialogFormVisible = true;
      this.OneId = row.Id;
      this.getOneTable();
    },
    //停用
    stop(row) {
      this.stopMateria(row.Id);
      console.log(row.Id, ".......");
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
          SType: 1,
        },
      };
      this.MIX_send(json);
    },
    // shs获取表格数据
    getTableData() {
      let json = {
        MN: "GetListPurchase",
        SN: "Purchase",
        DataContent: {
          IsDel: this.IsDel,
          ResoureType: this.ResoureType,
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
        MN: "SavePurchaseAndDetail",
        SN: "Purchase",
        DataContent: data,
      };
      this.MIX_send(json);
    },
    //获取单挑数据 查看
    getOneTable() {
      let json = {
        MN: "GetSinglePurchase",
        SN: "Purchase",
        DataContent: {
          Id: this.OneId,
        },
      };
      console.log(json, "wwww");
      this.MIX_send(json);
    },
    //获取本地用户信息
    getSessionUser() {
      this.SessionUser = JSON.parse(sessionStorage.getItem("UserDetial"));
    },
    //停用
    stopMateria(Id) {
      let json = {
        MN: "DelPurchase",
        SN: "Purchase",
        DataContent: {
          Id: Id,
          IsDel: 1,
          UserId: this.SessionUser.Id,
        },
      };
      this.MIX_send(json);
      this.getSessionUser();
    },
    startMateria(Id) {
      let json = {
        MN: "DelPurchase",
        SN: "Purchase",
        DataContent: {
          Id: Id,
          IsDel: 0,
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
    handleClickone(row) {
      console.log(row, "mmmmmmmmmmm");

      console.log(this.formData);
      this.showMask = true;
      this.getTableData();
      this.getOneTable();
    },
    // 编辑
    edit(row) {
      console.log(row, "ppppppppppppppp");
      this.formType = "2";
      this.OneId = row.Id;
      this.getOneTable();
      this.formData = {
        Id: row.Id,
        No: row.No,
        PurchaseDate: row.PurchaseDate,
        ResoureType: (row.ResoureType = 0),
        ResoureNumber: row.ResoureNumber,
        Supplier: row.Supplier,
        ContactPerson: row.ContactPerson,
        Buyer: row.Buyer,
        AmountPayable: row.AmountPayable,
        AmountActually: row.AmountActually,
        Currency: (row.Currency = 0),
        Remark: row.Remark,
        DelTime: row.DelTime,
        DelUser: row.DelUser,
        IsDel: 0,
        PEList: [],
      };
      setTimeout(() => {
        this.showMask = true;
      });
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
    },
    // 新增或者编辑
    addMateria(data) {
      console.log(data);
      this.addMateriaType(data);
      // this.getUpdatePurchaseStatus(data);
      this.checkTable = data;
      console.log(this.checkTable, "/////");
    },
    resetFormData() {
      this.formData = {
        Id: 0,
        No: "",
        PurchaseDate: "",
        ResoureType: "",
        ResoureNumber: "",
        Supplier: 1,
        ContactPerson: "",
        Buyer: "",
        AmountPayable: "",
        AmountActually: "",
        Currency: 0,
        Remark: "",
        DelTime: "",
        DelUser: "",
        IsDel: "",
        PEList: [],
      };
    },
  },
  components: {
    RightContainer,
    Archives,
    PopForm,
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
/deep/.el-dialog {
  width: 1440px;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474;
}
/deep/.dialog-footer button.el-button--primary {
  background: #0060a0;
}
/deep/.dialog-footer button.el-button--default {
  color: rgb(92, 135, 164);
}
/deep/.dialog-footer button {
  width: 64px;
  height: 32px;
  border-radius: 0;
  text-align: center;
  line-height: 0;
  border: 1px solid rgb(209, 221, 245);
}
</style>