<!-- 出库单 -->
<template>
  <div class="materiaType">
    <ChooseShow :menus="WarehousesTree.ReturnData||[]" @GetTableId="GetTableId" title="全部仓库">
      <div class="process" slot="operation">
        <div>
          <el-button
            type="primary"
            style="margin-left: 10px;background-color:#0060A0;"
            @click="addEvent"
          >新增</el-button>
        </div>
        <div class="filter">
          <!-- <el-checkbox-group v-model="checkData" @change="handleConditionChange" class="checkMargin">
          <el-checkbox
            v-for="(item, index) in checkList"
            :key="index"
            :label="item.statu"
          >{{item.title}}</el-checkbox>
          </el-checkbox-group>-->
          <!-- 选择部门多级下拉 -->
          <!-- <el-cascader
          class="search"
          placeholder="选择部门"
          :options="menuList"
          :props="optionProps"
          @change="GetTableId"
          filterable
          clearable
          style="width: 200px;float: right;margin-right: 20px; margin-top:8px;"
          ></el-cascader>-->
          <div class="search">
            <el-input
              placeholder="请输入内容"
              suffix-icon="el-icon-search"
              v-model="searchKey"
              @change="handleInputChange"
            ></el-input>
          </div>
        </div>
      </div>
      <div slot="table">
        <el-table :data="tabledata" fit :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}">
          <template v-for="(item,index) in columns">
            <el-table-column
              v-if="item.title=='操作'"
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.Status=='待出库'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="edit(scope.row)"
                >
                  <img src="../../../assets/images/edit_icon.png" alt />
                  <span>编辑</span>
                </el-button>
                <el-button
                  v-if="scope.row.Status=='待出库'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="input(scope.row)"
                >
                  <!-- <img src="../../../assets/images/del_icon.png" alt /> -->
                  <span>出库</span>
                </el-button>
                <el-button
                  v-if="scope.row.Status=='挂单'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="deletes(scope.row)"
                >
                  <img src="../../../assets/images/del_icon.png" alt />
                  <span>删除</span>
                </el-button>
                <el-button
                  v-else
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="check(scope.row,true)"
                >
                  <img src="../../../assets/images/look.png" alt />
                  <span>查看</span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            ></el-table-column>
          </template>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          align="right"
          class="pagination"
        ></el-pagination>
      </div>
    </ChooseShow>

    <el-dialog
      class="ModalForm"
      width="75%"
      :visible.sync="modal12"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      :title="'出库单'"
    >
      <PopForm
        ref="PopForm"
        @addbtn="addbtn"
        :fromData="fromData"
        :typeList="menuList"
        :disabled="disabled"
        :popVal="popVal"
        :clickType="clickType"
        class="PopForm"
      >
        <div slot="tabPane0">
          <el-table
            :data="newTableData"
            style="width: 100%"
            fit
            :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
          >
            <!-- <el-table-column align="center" prop="MaterielId" label="物料ID" width="100"></el-table-column> -->
            <el-table-column align="center" prop="Name" label="物料名称"></el-table-column>
            <el-table-column align="center" prop="No" label="物料编号"></el-table-column>
            <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
            <el-table-column align="center" prop="Model" label="型号"></el-table-column>
            <el-table-column align="center" prop="StandardUnitId" label="单位"></el-table-column>
            <el-table-column align="center" prop="Number" label="数量">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.Number"
                  style="width:120px;"
                  @input="numberChange(scope.row)"
                  placeholder="请输入数量"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="Price" label="单价">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.Price"
                  style="width:120px;"
                  @input="priceChange(scope.row)"
                  placeholder="请输入单价"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="Amount" label="总价"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="RemoveMateriels(scope.row)"
                >
                  <span>删除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </PopForm>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button :disabled="disabled" style="font-size:12px" type="primary">挂 单</el-button> -->
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
    <myTable
      :selectOptionList="selectOptionList"
      :visible="showReplace"
      :typeNum="1"
      :check="1"
      :title="'出库物料选择'"
      :typeList="typeList"
      :WarehouseIdVal="WarehouseIdVal"
      :showType="false"
      @closePropMask="closePropMask"
      @PopFormInit01="PopFormInit01"
      @addMaterielTable="addTable"
      @addCheck="addCheck"
    ></myTable>
    <el-dialog
      class="ModalForm"
      width="75%"
      :visible.sync="seeShow"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      title="出库信息查看"
    >
      <seeTable
        :seeMsg="seeMsg"
        @addbtn="addbtn"
        :fromData="fromData"
        :columns="seeColumns"
        :aType="1"
      >
        <div slot="tabPane0">
          <el-table
            size="small"
            :data="tabledata01"
            :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
          >
            <template v-for="(item,index) in fromData.tabPane[0].columns">
              <el-table-column
                :show-overflow-tooltip="true"
                :label="item.title"
                :prop="item.key"
                align="center"
                :key="index"
              ></el-table-column>
            </template>
          </el-table>
        </div>
      </seeTable>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import seeTable from "./dialog/see";
import PopForm from "@/components/applyForm";
import ChooseShow from "@/components/ChooseShow";
import fromdata from "@/const/index";
import show01 from "@/const/chooseshow";
import myTable from "@/components/replaceTable";
export default {
  name: "",
  data() {
    return {
      WarehouseIdVal:Number,
      clickType: "",
      popVal: null,
      typeList: [],
      showReplace: false,
      selectOptionList: [
        {
          title: "全部",
          statu: "",
        },
        {
          title: "已启用",
          statu: 2,
        },
        {
          title: "已停用",
          statu: 3,
        },
      ],
      seeColumns: [
        {
          title: "出库单编号",
          key: "No",
        },
        {
          title: "出货人",
          key: "CreatedUserName",
        },
        {
          title: "出库仓库",
          key: "WarehouseName",
        },
        {
          title: "出库时间",
          key: "CreatedTime",
        },
        {
          title: "状态",
          key: "Status",
        },
        {
          title: "描述",
          key: "Remark",
        },
      ],
      NumNo: "",
      seeMsg: null,
      seeShow: false,
      newTableData: [],
      materielTable: [],
      disabled: false,
      remotevalue: "",
      options: [],
      remoteloading: false,
      drawerloading: true,
      direction: false,
      checkData: [],
      showMask: false,
      searchKey: "",
      Id: "0",
      units: {},
      unitsId: 1,
      Type: [
        "申领出库",
        "调拨出库",
        "盘点出库",
        "退货出库",
        "报废出库",
        "其他出库",
      ],
      menuList: [],
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
      modal12: false,
      modal13: false,
      fromData: {},
      currentPage: 1,
      pageSize: 10,
      total: 50,
      tabledata: [],
      tabledata01: [],
      columns: [],
      Status: ["", "", "正式", "挂单"],
      checkList: [
        {
          title: "全部下级",
          statu: 2,
        },
        {
          title: "已停用",
          statu: 3,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "WarehousesTree",
      "OutStocks",
      "OutStockById",
      "Materiels",
      "MaterielById",
      "UnitConvertsByMaterielId",
      "removeOutStock",
      "saveOutStock",
      "GetMateriels",
      "GetMaterielCategoryTree",
      "UpdateOutStockStatus",
    ]),
  },
  components: {
    PopForm,
    ChooseShow,
    myTable,
    seeTable,
  },
  watch: {
    async UpdateOutStockStatus(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.GetOutStocks();
      } else {
        this.$message({
          showClose: true,
          message: newVal.Message,
          type: "fail",
        });
      }
    },
    GetMateriels: function (newVal, oldVal) {
      if (newVal.Code == 0) {
        this.materielTable = newVal.ReturnData.Data;
      }
    },
    GetMaterielCategoryTree(newValue, oldValue) {
      console.log(newValue);
      if (newValue.Code == 0) {
        this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
      }
    },
    WarehousesTree: function (newval, oldval) {
      if (newval.Code == 0) {
        this.menuList = newval.ReturnData;
        this.GetOutStocks();
      }
    },
    OutStocks: function (newval, oldval) {
      this.total = newval.ReturnData.DataCount;
      if (
        newval.ReturnData &&
        newval.ReturnData.Data &&
        newval.ReturnData.Data.length > 0
      ) {
        newval.ReturnData.Data.forEach((element) => {
          for (const key in element) {
            if (key == "SourceTable") {
              element.Type = this.Type[element.Type];
            }
            if (key == "Status") {
              //element.Status = this.Status[element.Status];
              if (element.Status == 0) {
                element.Status = "待出库";
              } else {
                element.Status = "已出库";
              }
            }
          }
        });
        this.tabledata = newval.ReturnData.Data;
      } else {
        this.tabledata = [];
      }
    },
    Materiels: function (newval, oldval) {
      this.remoteloading = false;
      this.options = newval.ReturnData.Data;
    },
    UnitConvertsByMaterielId: function (newval, oldval) {
      if (newval && newval.ReturnData && newval.ReturnData.length > 0) {
        newval.ReturnData.forEach((element) => {
          element.value = element.Id;
          element.label = element.Name;
        });
      }
      this.$refs.PopForm01.Changeoptions(newval.ReturnData, 3);
    },
    UnitConvertById: function (newval, oldval) {
      let obj = newval.ReturnData;
      let arr = [];
      obj.value = obj.Id;
      obj.label = obj.Name;
      arr.push(obj);
      this.$refs.PopForm01.Changeoptions(arr, 3);
    },
    remotevalue: function (newval, oldval) {
      if (newval !== "") {
        this.GetUnitConvertsByMaterielId(newval);
      }
    },
    removeOutStock: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.GetOutStocks();
      } else {
        this.$message({
          type: "error",
          message: "删除失败",
        });
      }
    },
    saveOutStock: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.GetOutStocks();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    },
    OutStockById: function (newval, oldval) {
      this.tabledata01 = newval.ReturnData.OutStockDetail || [];
      this.tabledata01.forEach((element) => {
        element.No = element.MaterielNo;
        element.Name = element.MaterielName;
        element.Spec = element.MaterielSpec;
        element.Model = element.MaterielModel;
      });
      this.newTableData = JSON.parse(JSON.stringify(this.tabledata01));
    },
  },
  methods: {
    input(row) {
      let obj = {
        Status: 1,
        Id: row.Id,
      };
      this.Warehousing(obj);
    },
    //入库
    Warehousing(data) {
      let json = {
        MN: "UpdateOutStockStatus",
        SN: "OutStock",
        DataContent: data,
      };
      this.MIX_send(json);
    },
    searchFun(val) {
      this.keyWord = val;
      this.getTableData();
    },
    // 物料删除
    RemoveMateriels(val) {
      for (let index = 0; index < this.newTableData.length; index++) {
        const element = this.newTableData[index];
        if (element.Name == val.Name) {
          this.newTableData.splice(index, 1);
        }
      }
    },
    closePropMask() {
      this.showReplace = false;
    },
    PopFormInit01() {
      // this.remotevalue = "";
      // this.$refs.PopForm01.$refs.ruleForm.resetFields();
      this.showMask = false;
      this.showType = false;
    },
    // 获取入库单明细
    GetOneById(id) {
      let json = {
        MN: "GetOutStockById",
        SN: "OutStock",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    //多选事件
    addCheck(val) {
      var myDate = new Date();
      let year = myDate.getFullYear() + "";
      let month = myDate.getMonth() + 1 + "";
      let day = myDate.getDate() + "";
      let num = year + "0" + month + day;
      for (let i = 0; i < val.length; i++) {
        val[i].MaterielId = val[i].Id;
        val[i].UnitId = 0;
        val[i].Batch = num;
      }
      this.newTableData = val;
      console.log(this.newTableData);
    },
    //table选中物料事件
    addTable(row) {
      row.UnitId = 0;
      row.MaterielId = row.Id;
      var myDate = new Date();
      let year = myDate.getFullYear() + "";
      let month = myDate.getMonth() + 1 + "";
      let day = myDate.getDate() + "";
      let num = year + "0" + month + day;
      row.Batch = num;
      this.newTableData.push(row);
      console.log(row);
      console.log(this.newTableData);
    },
    //通过部门类型筛选
    // GetTableId(value) {
    //   this.listfrom.PageIndex = 1;
    //   this.listfrom.Id = value[0];
    //   this.GetOutStocks();
    //   console.log(value);
    // },
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
    // 物料编辑
    EditMateriels(val, istrue) {
      this.showMask = true;
      setTimeout(() => {
        let PopFormdata = JSON.parse(
          JSON.stringify(this.$refs.PopForm01.value)
        );
        for (const key in PopFormdata) {
          if (key == "MaterielId") {
            this.remotevalue = val.MaterielId;
            if (istrue) {
              this.GetUnitConvertById(val.UnitId);
            }
          } else {
            PopFormdata[key] = val[key] || "";
          }
        }
        this.$refs.PopForm01.value = PopFormdata;
      });
    },
    // select远程搜索回调
    remoteMethod(query) {
      if (query !== "") {
        this.remoteloading = true;
        this.getTableData(query);
      } else {
        this.options = [];
      }
    },
    // ==========表格===============
    // 上一页
    handlePrevClick(val) {
      this.currentPage = val;
      if (val < 1) {
        this.currentPage = 1;
      }

      this.GetOutStocks();
    },
    // 下一页
    handleNextClick(val) {
      this.currentPage = val;
      if (val > this.total) {
        this.currentPage = this.total;
      }
      this.GetOutStocks();
    },
    // 当前页改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.GetOutStocks();
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetOutStocks();
    },
    // 筛选框value发生改变的回调
    handleInputChange(val) {
      this.searchKey = val;
      this.GetOutStocks();
    },
    // 新增入库单
    addEvent() {
      this.disabled = false;
      this.newTableData.length = 0;
      this.clickType = "add";
      this.modal12 = true;
    },
    // 多选框回调
    handleConditionChange(val) {
      this.checkData = val;
      this.GetOutStocks();
    },
    // 刷新
    refreshPage() {
      this.GetOutStocks();
    },
    // 新增入库物料
    addbtn(a,b,c) {
      console.log(a,b,c)
      if(b!=undefined){
        this.WarehouseIdVal=Number(b)
        console.log(this.WarehouseIdVal)
      }else if(c!=undefined){
        this.WarehouseIdVal=Number(c)
        console.log(this.WarehouseIdVal)
      }else{
        this.WarehouseIdVal=0
      }
      setTimeout(()=>{
        this.showReplace = true
      })
      this.keyWord = "";
      this.getTableData();
    },
    // 表格删除事件的回调
    deletes(val) {
      this.$confirm("此操作将永久删除" + val.No + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.RemoveOutStock(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 表格查看事件的回调
    check(val) {
      console.log(JSON.stringify(val));
      this.seeMsg = [val];
      this.GetOneById(val.Id);
      this.seeShow = true;
    },
    //编辑修改
    edit(val) {
      console.log(val);
      this.clickType = "edit";
      let obj = {};
      console.log(this.fromData);
      for (let index = 0; index < this.fromData.fromComponent.length; index++) {
        const element = this.fromData.fromComponent[index].key;
        obj[element] = val[element] || "";
      }
      obj.Id = val.Id;
      if (val.SourceTableNo) {
        obj.SourceTable = val.SourceTable;
        obj.SourceTableNo = val.SourceTableNo;
      }else{
        obj.SourceTable="0"
        obj.SourceTableNo = "0"
      }
      this.popVal = obj;

      console.log(this.popVal);
      console.log(this.modal12);
      setTimeout(() => {
        this.modal12 = true;
      });
      this.GetOneById(val.Id);
    },
    // 左侧导航栏事件的回调
    GetTableId(val) {
      this.Id = val.Id;
      this.currentPage = 1;
      this.GetOutStocks();
    },
    // 弹出框表单提交
    Commit() {
      this.$refs.PopForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let value = JSON.parse(JSON.stringify(this.$refs.PopForm.value));
          value.OutStockDetail = this.newTableData;
          value.TableType = 1;
          this.SaveOutStock(value);
          this.PopFormInit();
        } else {
          return false;
        }
      });
    },
    // 弹出框表单初始化
    PopFormInit() {
      this.newTableData = [];
      // this.$refs.PopForm.$refs.ruleForm.resetFields();
      this.modal12 = false;
    },
    PopFormInit01() {
      // this.remotevalue = "";
      // this.$refs.PopForm01.$refs.ruleForm.resetFields();
      // this.modal13 = false;
      this.showReplace = false;
      this.showMask = false;
    },
    // 新增物料提交
    AddMateriels() {
      this.PopFormInit01();
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
    // 获取仓储表格数据
    GetOutStocks() {
      let json = {
        MN: "GetOutStocks",
        SN: "OutStock",
        DataContent: {
          WarehouseId: this.Id,
          KeyWord: this.searchKey,
          PageSize: this.pageSize,
          PageIndex: this.currentPage,
          Status: this.checkData.join(","),
        },
      };
      this.MIX_send(json);
    },
    //数量改变
    numberChange(row) {
      console.log(row);
      row.Amount = Number(row.Number) * Number(row.Price);
    },
    //价格改变
    priceChange(row) {
      console.log(row);
      row.Amount = Number(row.Number) * Number(row.Price);
    },
    // 获取所有物料
    getTableData(val) {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: this.currentId,
          Status: 2,
          KeyWord: this.keyWord,
          PageSize: 999999,
          PageIndex: 1,
          SType: 1,
          WarehouseId:this.WarehouseIdVal,
        },
      };
      this.MIX_send(json);
    },
    // 根据物料id获取单位
    GetUnitConvertsByMaterielId(val) {
      let json = {
        MN: "GetUnitConvertsByMaterielId",
        SN: "Materiel",
        DataContent: {
          MaterielId: val,
        },
      };
      this.unitsId = val;
      if (!this.units[val]) {
        this.MIX_send(json);
      }
    },
    // 根据id获取单位
    GetUnitConvertById(val) {
      let json = {
        MN: "GetUnitConvertById",
        SN: "Materiel",
        DataContent: {
          Id: val,
        },
      };
      this.MIX_send(json);
    },
    // 删除入库单
    RemoveOutStock(val) {
      let json = {
        MN: "RemoveOutStock",
        SN: "OutStock",
        DataContent: {
          Ids: val.Id,
        },
      };
      this.MIX_send(json);
    },
    // 保存/提交入库单
    SaveOutStock(obj) {
      let json = {
        MN: "SaveOutStock",
        SN: "OutStock",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    // 获取入库单明细
    GetOutStockById(id) {
      let json = {
        MN: "GetOutStockById",
        SN: "OutStock",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.fromData = fromdata.fromdata04;
    this.fromData01 = fromdata.fromdata01;
    this.columns = show01().columns03;
    this.GetWarehousesTree();
    this.getTreeData();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.dialog-footer {
  margin-top: 15px;
  text-align: right;
}
.process {
  height: 56px;
  line-height: 56px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.checkMargin {
  margin-right: 20px;
}
.filter {
  display: flex;
}
.search {
  display: flex;
  flex-direction: row;
}
.refresh {
  height: 40px;
  padding: 0;
  width: 40px;
  margin-top: 8px;
  margin-left: 10px;
}
.pagination {
  margin-top: 40px;
  padding-right: 20px;
}
.PopForm {
  height: 51vh;
  overflow-y: auto;
}
.PopForm::-webkit-scrollbar {
  width: 4px;
}
.PopForm::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.PopForm::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.filter-container {
  padding-bottom: 20px;
}
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  width: 14px;
  vertical-align: middle;
}
</style>