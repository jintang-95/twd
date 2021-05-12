<!-- 入库收货单 -->
<template>
  <div class="materiaType">
    <ChooseShow :menus="WarehousesTree.ReturnData||[]" @GetTableId="GetTableId" title="全部仓库">
      <div class="process" slot="operation">
        <div>
          <el-button type="primary" style="background-color:#0060A0;" @click="addEvent">新 增</el-button>
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
            <!-- <el-button icon="el-icon-refresh" size="small" class="refresh" @click="refreshPage"></el-button> -->
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
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.Status=='待入库'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="edit(scope.row,true)"
                >
                  <img src="../../../assets/images/edit_icon.png" alt />
                  <span>编辑</span>
                </el-button>
                <el-button
                  v-if="scope.row.Status=='待入库'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="input(scope.row)"
                >
                  <!-- <img src="../../../assets/images/del_icon.png" alt /> -->
                  <span>入库</span>
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
      @close="PopFormInit"
      :visible.sync="modal12"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      :title="'入库单'"
    >
      <PopForm
        ref="PopForm"
        @addbtn="addbtn"
        :fromData="fromData"
        :disabled="disabled"
        :typeList="menuList"
        :clickType="clickType"
        :popVal="popVal"
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
      :title="'入库物料选择'"
      :typeList="typeList"
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
      title="入库信息查看"
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
import { Row } from "element-ui";
export default {
  name: "",
  data() {
    return {
      clickType: "",
      popVal: null,
      seeColumns: [
        {
          title: "上架单编号",
          key: "No",
        },
        {
          title: "所在仓库",
          key: "WarehouseName",
        },
        {
          title: "操作人",
          key: "CreatedUserName",
        },
        {
          title: "操作时间",
          key: "CreatedTime",
        },
        {
          title: "操作方式",
          key: "Status",
        },
        {
          title: "描述",
          key: "Remark",
        },
      ],
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
      searchKey: "",
      Id: "0",
      units: {},
      currentId: 0,
      unitsId: 1,
      Type: [
        "采购单",
        "调拨入库",
        "盘点入库",
        "退仓入库",
        "工具归还",
        "其他入库",
      ],
      keyWord: "",
      modal12: false,
      showMask: false,
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
      menuList: [],
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
    };
  },
  computed: {
    ...mapGetters([
      "WarehousesTree",
      "InStocks",
      "Materiels",
      "MaterielById",
      "UnitConvertsByMaterielId",
      "UnitConvertById",
      "removeInStock",
      "saveInStock",
      "GetMateriels",
      "GetMaterielCategoryTree",
      "GetInStockById",
      "UpdateInStockStatus",
    ]),
  },
  components: {
    PopForm,
    ChooseShow,
    myTable,
    seeTable,
  },
  watch: {
    // GetInStockById(newVal,oldVal){
    //   console.log(newVal)
    // },
    async UpdateInStockStatus(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.GetInStocks();
      } else {
        this.$message({
          showClose: true,
          message: newVal.Message,
          type: "fail",
        });
      }
    },
    GetMaterielCategoryTree(newValue, oldValue) {
      if (newValue.Code == 0) {
        this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
      }
    },
    WarehousesTree: function (newVal, oldval) {
      if (newVal.Code == 0) {
        this.menuList = newVal.ReturnData;
        this.GetInStocks();
      }
    },
    GetMateriels: function (newVal, oldVal) {
      if (newVal.Code == 0) {
        this.materielTable = newVal.ReturnData.Data;
      }
    },
    InStocks: function (newval, oldval) {
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
              // element.Status = this.Status[element.Status];
              if (element.Status == 0) {
                element.Status = "待入库";
              } else {
                element.Status = "已入库";
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
    removeInStock: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.GetInStocks();
      } else {
        this.$message({
          type: "error",
          message: "删除失败",
        });
      }
    },
    saveInStock: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.GetInStocks();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    },
    GetInStockById: function (newval, oldval) {
      this.tabledata01 = newval.ReturnData.InStockDetail || [];
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
        MN: "UpdateInStockStatus",
        SN: "InStock",
        DataContent: data,
      };
      this.MIX_send(json);
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
    // 物料删除
    RemoveMateriels(val) {
      for (let index = 0; index < this.newTableData.length; index++) {
        const element = this.newTableData[index];
        if (element.Name == val.Name) {
          this.newTableData.splice(index, 1);
        }
      }
    },
    // 物料编辑
    EditMateriels(val, istrue) {
      this.showMask = true;
      setTimeout(() => {
        let PopFormdata = JSON.parse(
          JSON.stringify(this.$refs.PopForm01.value)
        );
        for (const key in PopFormdata) {
          this.remotevalue = val.MaterielId;
          if (key == "MaterielId") {
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
      this.newTableData.push(row);
      console.log(row);
      console.log(this.newTableData);
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

      this.GetInStocks();
    },
    // 下一页
    handleNextClick(val) {
      this.currentPage = val;
      if (val > this.total) {
        this.currentPage = this.total;
      }
      this.GetInStocks();
    },
    // 当前页改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.GetInStocks();
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetInStocks();
    },
    // 筛选框value发生改变的回调
    handleInputChange(val) {
      this.searchKey = val;
      this.GetInStocks();
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
      this.GetInStocks();
    },
    // 刷新
    refreshPage() {
      this.GetInStocks();
    },
    // 新增入库物料
    addbtn(e) {
      this.showReplace = true;
      this.showMask = true;
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
          this.RemoveInStock(val);
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
      this.GetOneInStockById(val.Id);
      this.seeMsg = [val];
      this.seeShow = true;
    },
    //编辑修改
    edit(val) {
      console.log(val);
      this.clickType = "edit";
      let obj = {};
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
      console.log(obj)
      setTimeout(() => {
        this.modal12 = true;
      });
      this.GetOneInStockById(val.Id);
    },
    // 左侧导航栏事件的回调
    GetTableId(val) {
      this.Id = val.Id;
      this.currentPage = 1;
      this.GetInStocks();
    },
    // 弹出框表单提交
    Commit() {
      // for(var i=0;i<this.newTableData;i++){
      //   this.newTableData[i].unitsId=0
      // }
      this.popVal = {};
      this.$refs.PopForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let value = JSON.parse(JSON.stringify(this.$refs.PopForm.value));
          value.InStockDetail = this.newTableData;
          value.TableType = 1;
          console.log(value)
          this.SaveInStock(value);
          this.PopFormInit();
        } else {
          return false;
        }
      });
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
    // 弹出框表单初始化
    PopFormInit() {
      this.newTableData = [];
      this.modal12 = false;
    },
    // 新增物料提交
    AddMateriels() {
      // let exist = false;
      // let isnum = 0;
      // if (this.tabledata01.length > 0) {
      //   this.tabledata01.forEach((element, index) => {
      //     if (element.MaterielId == this.remotevalue) {
      //       exist = true;
      //       isnum = index;
      //     }
      //   });
      // }
      // let element;
      // if (exist) {
      //   element = JSON.parse(JSON.stringify(this.tabledata01[isnum]));
      //   for (const key in this.$refs.PopForm01.value) {
      //     element[key] = this.$refs.PopForm01.value[key];
      //   }
      // } else {
      //   element = this.$refs.PopForm01.value;
      // }
      // let obj = {
      //   MaterielId: element.MaterielId || this.remotevalue || "",
      //   No: element.No || "",
      //   Name: element.Name || "",
      //   Spec: element.Spec || "",
      //   Model: element.Model || "",
      //   Batch: element.Batch || "",
      //   Number: element.Number || "",
      //   UnitId: element.UnitId || "",
      //   Price: element.Price || "",
      //   Amount: element.Amount || 0,
      //   Remark: element.Remark || "",
      // };
      // if (exist) {
      //   this.tabledata01.splice(isnum, 1, obj);
      //   this.$message.success("物料 " + obj.Name + " 已修改");
      // } else {
      //   for (let index = 0; index < this.options.length; index++) {
      //     const element = this.options[index];
      //     if (element.Id == this.remotevalue) {
      //       obj.No = element.No;
      //       obj.Name = element.Name;
      //       obj.Spec = element.Spec;
      //       obj.Model = element.Model;
      //     }
      //   }
      //   this.tabledata01.push(obj);
      // }
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
    GetInStocks() {
      let json = {
        MN: "GetInStocks",
        SN: "InStock",
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
    //搜索物料事件
    searchFun(val) {
      this.keyWord = val;
      this.getTableData();
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
    RemoveInStock(val) {
      let json = {
        MN: "RemoveInStock",
        SN: "InStock",
        DataContent: {
          Ids: val.Id,
        },
      };
      this.MIX_send(json);
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
    // 获取入库单明细
    GetOneInStockById(id) {
      let json = {
        MN: "GetInStockById",
        SN: "InStock",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 根据Id获取物料信息
    GetMaterielById(id) {
      let json = {
        MN: "GetMaterielById",
        SN: "Materiel",
        DataContent: {
          Id: id,
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
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.fromData = fromdata.fromdata;
    this.fromData01 = fromdata.fromdata01;
    this.columns = show01().columns;
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
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  width: 14px;
  vertical-align: middle;
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
button:hover {
  cursor: pointer;
}
/* /deep/ .el-input__inner{
  width: 200px !important;
} */
</style>