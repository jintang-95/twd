<!-- 物料申领管理 -->
<template>
  <div class="materiaType">
    <ChooseShow :menus="[]" @GetTableId="GetTableId" title="全部仓库">
      <div class="process" slot="operation">
        <div>
          <el-button type="primary" style="background-color:#0060A0; " @click="addEvent">新增</el-button>
        </div>
        <div class="filter">
          <!-- <el-checkbox-group
            v-model="checkData"
            @change="handleConditionChange"
            class="checkMargin"
          >
            <el-checkbox
              v-for="(item, index) in checkList"
              :key="index"
              :label="item.statu"
            >{{item.title}}</el-checkbox>
          </el-checkbox-group>-->
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
          <template v-for="(item,index) in columns" >
            <el-table-column
              v-if="item.title=='状态'"
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            >
              <template slot-scope="{row}">
                <div class="success" v-if="row.Status=='审批通过'||row.Status== 2">
                  <img src="../../../assets/images/img/green.png" alt  /> 审批通过
                </div>
                <div v-if="row.Status=='待提交审批' ||row.Status== 0">
                  待提交审批
                </div>
                <div v-if="row.Status=='待审批' ||row.Status== 1">
                  待审批
                </div>
                <div v-if="row.Status=='取消'||row.Status== 4">
                  取消
                </div>
                <div v-if="row.Status=='已领取' ||row.Status== 5">
                  已领取
                </div>
                <div class="danger" v-if="row.Status=='审批拒绝'|| row.Status== 3">
                  <img src="../../../assets/images/img/red.png" alt /> 审批拒绝
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.title=='操作'"
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.Status=='待提交审批' ||scope.row.Status== 0"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="check(scope.row)"
                >
                  <img src="../../../assets/images/edit_icon.png" alt />
                  <span>编辑</span>
                </el-button>
                <el-button
                  v-if="scope.row.Status=='审批通过' ||scope.row.Status== 2"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="outWarehouse(scope.row)"
                >
                  <span>出库</span>
                </el-button>
                <el-button
                  v-if="scope.row.Status=='待提交审批' ||scope.row.Status== 0"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="approval(scope.row)"
                >
                  <span>提交审批</span>
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
                  v-if="scope.row.Status!='待提交审批'"
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
      :destroy-on-close="true"
      @before-close="getTableData"
      @close="PopFormInit"
      scrollabel
      title="物料申领单"
    >
      <PopForm
        ref="PopForm"
        @addbtn="addbtn"
        :fromData="fromData"
        :disabled="disabled"
        :NumNo="NumNo"
        class="PopForm"
      >
        <div slot="tabPane0">
          <el-table
            size="small"
            :data="tabledata01"
            :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
          >
            <template v-for="(item,index) in fromData.tabPane[0].columns">
              <el-table-column
                v-if="item.title=='数量'"
                :label="item.title"
                :prop="item.key"
                align="center"
                fixed="right"
                :key="index"
              >
                <template slot-scope="scope">
                  <el-input style="width:120px;" v-model="scope.row.Number" placeholder="请输入数量" />
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.title=='操作'"
                :label="item.title"
                :prop="item.key"
                align="center"
                fixed="right"
                width="100"
                :key="index"
              >
                <template slot-scope="scope">
                  <el-button
                    class="operationTtn"
                    type="text"
                    size="small"
                    @click="RemoveMateriels(scope.row)"
                  >
                    <img src="../../../assets/images/del_icon.png" alt />
                    <span>删除</span>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :show-overflow-tooltip="true"
                :label="item.title"
                :prop="item.key"
                align="center"
                :key="index"
              ></el-table-column>
            </template>
          </el-table>
        </div>
      </PopForm>
      <div slot="footer" class="dialog-footer">
        <button
          style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
          @click="PopFormInit"
        >取 消</button>
        <!-- <button :disabled="disabled"  style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
        height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"  type="primary">挂 单</button>-->
        <button
          :disabled="disabled"
          style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
          type="primary"
          @click="Commit"
        >提 交</button>
      </div>
    </el-dialog>
    <materiaTable
      :selectOptionList="selectOptionList"
      :visible="showReplace"
      :typeNum="1"
      :check="1"
      :title="'申领物料选择'"
      :typeList="typeList"
      :showType="false"
      @closePropMask="closePropMask"
      @PopFormInit01="PopFormInit01"
      @addMaterielTable="addTable"
      @addCheck="addCheck"
    ></materiaTable>
    <el-dialog
      class="ModalForm"
      width="75%"
      :visible.sync="seeShow"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      title="查看物料申领单"
    >
      <seeTable
        :seeMsg="seeMsg"
        @addbtn="addbtn"
        :fromData="fromData"
        :detailedTable="detailedTable"
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
    <!-- 出库弹框 -->
    <el-dialog
      class="ModalForm"
      width="75%"
      :visible.sync="outPutDialog"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      :title="'出库单'"
    >
      <PopForm
        ref="PopForm"
        @addbtn="addbtn"
        :addTrue="false"
        :fromData="outPutFromData"
        :typeList="menuList"
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
            <el-table-column align="center" prop="Number" label="数量"></el-table-column>
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
          @click="outCommit"
        >提 交</button>
      </div>
    </el-dialog>
    <goKCBF ref="goKCBF"></goKCBF>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import seeTable from "./dialog/dialog";
import goKCBF from "./dialog/see";
import PopForm from "@/components/applyForm";
import materiaTable from "@/components/replaceTable";
import ChooseShow from "@/components/ChooseShow";
import fromdata from "@/const/index";
import show01 from "@/const/chooseshow";
export default {
  name: "",
  data() {
    return {
      popVal:{},
      clickType: "",
      sObj: {},
      newTableData: [],
      menuList: [],
      outPutFromData: {},
      outPutDialog: false,
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
          title: "申领单号",
          key: "No",
        },
        {
          title: "申领人",
          key: "CreatedUserName",
        },
        {
          title: "所属部门",
          key: "Dept",
        },
        {
          title: "当前岗位",
          key: "Station",
        },
        {
          title: "申领时间",
          key: "CreatedTime",
        },
        {
          title: "申领原因",
          key: "Reason",
        },
        {
          title: "状态",
          key: "Status",
        },
      ],
      stuffId:"",
      NumNo: "",
      seeMsg: null,
      seeShow: false,
      formtitle: "物料申领新增",
      materielTable: [],
      KeyWord: "",
      disabled: false,
      remotevalue: "",
      options: [],
      remoteloading: false,
      drawerloading: true,
      direction: false,
      checkData: [],
      searchKey: "",
      Id: "1",
      detailedTable:[],
      units: {},
      unitsId: 1,
      Type: ["采购收货", "调拨入库", "退仓入库", "其他入库"],
      modal12: false,
      modal13: false,
      fromData: {},
      currentPage: 1,
      pageSize: 10,
      total: 50,
      tabledata: [],
      tabledata01: [],
      columns: [],
      Status: ["待提交审批", "待审批", "审批通过", "审批拒绝","取消","已领取"],
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
      "GetMateriels",
      "getApplys",
      "ApplyById",
      "Materiels",
      "UnitConvertsByMaterielId",
      "UnitConvertById",
      "removeApply",
      "saveApply",
      "CreateBillNOByBillTypeCode",
      "GetMaterielCategoryTree",
      "UpdateApplyStatusById",
      "ApprovalProcessOrderRecordCreate",
      "saveOutStock",
      "WarehousesTree",
    ]),
  },
  components: {
    PopForm,
    ChooseShow,
    materiaTable,
    seeTable,
    goKCBF
  },
  watch: {
    //监听出库保存
    saveOutStock(newval, oldval) {
      console.log("出库")
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.updateApplyStatusById(this.sObj);
        this.sObj = {};
        this.GetApplys();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    },
     //监听提交审核
    ApprovalProcessOrderRecordCreate(newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.updateApplyStatusById(this.sObj);
        this.sObj={}
        this.GetApplys();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    }, 
     //获取仓库树
    WarehousesTree: function (newval, oldval) {
      if (newval.Code == 0) {
        this.menuList = newval.ReturnData;
      }
    },
    //监听表格编号
    CreateBillNOByBillTypeCode(newValue, oldValue) {
      console.log(newValue);
      this.NumNo = newValue.ReturnData.BillNo;
      //   setTimeout(() => {
      //   let value = this.$refs.PopForm.value;
      //   let obj = {};
      //   for (
      //     let index = 0;
      //     index < this.fromData.fromComponent.length;
      //     index++
      //   ) {
      //     const element = this.fromData.fromComponent[index].key;
      //     obj[element] = val[element] || "";
      //   }
      //   obj.No =12412;
      //   this.$refs.PopForm.value = obj;
      // });
      // console.log(this.NumNo)
      // this.fromData.fromComponent[0].key.value=this.NumNo

      setTimeout(() => this.eject());
    },
    GetMaterielCategoryTree(newValue, oldValue) {
        this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
    },
    //监听获取物料
    GetMateriels(newValue, oldValue) {
      console.log(newValue);
      this.materielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
    },
    getApplys: function (newval, oldval) {
      this.total = newval.ReturnData.DataCount;
      if (
        newval.ReturnData &&
        newval.ReturnData.Data &&
        newval.ReturnData.Data.length > 0
      ) {
        newval.ReturnData.Data.forEach((element) => {
          for (const key in element) {
            if (key == "Type") {
              element.Type = this.Type[element.Type];
            }
            if (key == "Status") {
              element.Status = this.Status[element.Status];
              // if (element.Status == 1) {
              //   element.Status = "待报废";
              // } else {
              //   element.Status = "已报废";
              // }
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
      this.$refs.PopForm01.Changeoptions(newval.ReturnData, 2);
    },
    UnitConvertById: function (newval, oldval) {
      let obj = newval.ReturnData;
      let arr = [];
      obj.value = obj.Id;
      obj.label = obj.Name;
      arr.push(obj);
      this.$refs.PopForm01.Changeoptions(arr, 2);
    },
    remotevalue: function (newval, oldval) {
      if (newval !== "") {
        this.GetUnitConvertsByMaterielId(newval);
      }
    },
    removeApply: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.GetApplys();
      } else {
        this.$message({
          type: "error",
          message: "删除失败",
        });
      }
    },
    saveApply: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.GetApplys();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    },
    ApplyById(newval, oldval) {
      console.log(newval)
      this.detailedTable = newval.ReturnData.ApplyDetail || [];
      this.detailedTable.forEach((element) => {
        element.No = element.MaterielNo;
        element.Name = element.MaterielName;
        element.Spec = element.MaterielSpec;
        element.Model = element.MaterielModel;
      });
      this.newTableData=JSON.parse(JSON.stringify(this.detailedTable))
    },
  },  
  methods: {
    //出库
    outWarehouse(row){
      console.log(row)
      let obj1 = {
        Id: row.Id,
        Status: 5,
      };
      this.sObj = obj1;
      let obj = {};
      for (let index = 0; index < this.outPutFromData.fromComponent.length; index++) {
        const element = this.outPutFromData.fromComponent[index].key;
        obj[element] = row[element] || "";
      }
      obj.Id = row.Id;
      obj.SourceTable = "0";
      this.GetApplyById(row.Id);
      this.popVal = obj;
      this.outPutDialog = true;
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
    //出库确认弹框
    outCommit() {
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
    // 保存/提交入库单
    SaveOutStock(obj) {
      let json = {
        MN: "SaveOutStock",
        SN: "OutStock",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    //提交审批按钮事件
    approval(row) {
      console.log(row);
      console.log(this.stuffId);
      let obj1 = {
        Id: row.Id,
        Status: 1,
      };
      this.sObj = obj1;
      let id = this.stuffId.Id;
      let BillNum = row.No;
      let Abstracts = row.Reason;
      this.getApprovalProcessOrderRecordCreate(BillNum, id, Abstracts);
    },
    //提交至审批
    getApprovalProcessOrderRecordCreate(BillNum, StaffID, Abstracts) {
      let obj = {
        ProcessCode: "KCSL",
        BillNum: BillNum,
        StaffID: StaffID,
        Abstracts: Abstracts,
      };
      let json = {
        MN: "ApprovalProcessOrderRecordCreate",
        SN: "ApprovalCenter",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    //改变状态
    updateApplyStatusById(obj) {
      let json = {
        MN: "UpdateApplyStatusById",
        SN: "Apply",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    //多选事件
    addCheck(val) {
      for (let i = 0; i < val.length; i++) {
        val[i].MaterielId = val[i].Id;
        val[i].UnitId=0
      }
      this.tabledata01 = val;
      console.log(this.tabledata01);
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
    //模态框弹出
    eject() {
      this.disabled = false;
      console.log(this.NumNo);
      this.modal12 = true;
      console.log(this.modal12)
    },
    //获取表单编号
    getTableNum() {
      let json = {
        MN: "CreateBillNOByBillTypeCode",
        SN: "SystemSetting",
        DataContent: {
          BillCode: "SL",
        },
      };
      this.MIX_send(json);
    },
    //=========物料表格事件 start=================
    //提交事件
    dataSubmit(data) {
      console.log(data);
      this.modal13 = false;
    },
    //关闭表格模态框
    closePropMask(data) {
      this.showReplace = false;
    },
    PopFormInit01() {
      // this.remotevalue = "";
      // this.$refs.PopForm01.$refs.ruleForm.resetFields();
      this.showReplace = false;
      this.modal13 = false;
    },
    AddMateriels() {
      this.PopFormInit01();
    },
    //表格搜索事件
    searchFun(val) {
      console.log(val);
      this.keyWord = val;
      this.getTableData();
      // this.getTableData();
    },
    //物料表格内添加事件
    addTable(row) {
      //this.newTableData.push(row);
      row.UnitId = 0;
      row.MaterielId = row.Id;
      this.tabledata01.push(row);
      console.log(this.tabledata01);
    },
    //获取筛选表格
    getTableData() {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: 0,
          Status: 2,
          KeyWord: this.keyWord,
          PageSize: 9999,
          PageIndex: 1,
          SType: 1,
        },
      };
      this.MIX_send(json);
    },
    //=========物料表格事件 end=================
    // 物料删除
    RemoveMateriels(val) {
      for (let index = 0; index < this.tabledata01.length; index++) {
        const element = this.tabledata01[index];
        if (element.MaterielId == val.MaterielId) {
          this.tabledata01.splice(index, 1);
        }
      }
    },
    // 物料编辑
    EditMateriels(val, istrue) {
      this.modal13 = true;
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
    // remoteMethod(query) {
    //   if (query !== "") {
    //     this.remoteloading = true;
    //     this.GetMateriels(query);
    //   } else {
    //     this.options = [];
    //   }
    // },
    // ==========表格===============
    // 上一页
    handlePrevClick(val) {
      this.currentPage = val;
      if (val < 1) {
        this.currentPage = 1;
      }

      this.GetApplys();
    },
    // 下一页
    handleNextClick(val) {
      this.currentPage = val;
      if (val > this.total) {
        this.currentPage = this.total;
      }
      this.GetApplys();
    },
    // 当前页改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.GetApplys();
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetApplys();
    },
    // 筛选框value发生改变的回调
    handleInputChange(val) {
      this.searchKey = val;
      this.GetApplys();
    },
    // 新增入库单
    addEvent() {
      this.modal12=true;
      // setTimeout(() => {
      //   let value = this.$refs.PopForm.value;
      //   let obj = {};
      //   for (
      //     let index = 0;
      //     index < this.fromData.fromComponent.length;
      //     index++
      //   ) {
      //     const element = this.fromData.fromComponent[index].key;
      //     obj[element] = val[element] || "";
      //   }
      //   obj.No = this.NumNo
      //   this.$refs.PopForm.value = obj;
      //});
    },
    // 多选框回调
    handleConditionChange(val) {
      this.checkData = val;
      this.GetApplys();
    },
    // 刷新
    refreshPage() {
      this.GetApplys();
    },
    // 新增入库物料
    addbtn(e) {
      this.modal13 = true;
      this.showReplace = true;
      this.outPutDialog = false;
      // this.GetMateriels();
    },
    // 表格删除事件的回调
    deletes(val) {
      this.$confirm("此操作将永久删除" + val.No + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.RemoveApply(val);
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
      // this.GetApplyById(val.Id)
      // console.log(JSON.stringify(val))
      // this.seeMsg = [val];
      // setTimeout(() => {
      //   this.seeShow = true;
      // });
      console.log(val);
      this.$refs.goKCBF.formData = val;
      this.$refs.goKCBF.BillNum = val.No;
      this.$refs.goKCBF.dialogKCBF = true;
    },
    // check(val, disabled = false) {
    //   this.modal12 = true;
    //   setTimeout(() => {
    //     let value = this.$refs.PopForm.value;
    //     this.disabled = disabled;
    //     let obj = {};
    //     for (
    //       let index = 0;
    //       index < this.fromData.fromComponent.length;
    //       index++
    //     ) {
    //       const element = this.fromData.fromComponent[index].key;
    //       obj[element] = val[element] || "";
    //     }
    //     obj.Id = val.Id;
    //     this.$refs.PopForm.value = obj;
    //   });
    //   this.GetApplyById(val.Id);
    // },
    // 左侧导航栏事件的回调
    GetTableId(val) {
      this.Id = val.Id;
      this.currentPage=1
      this.GetApplys();
    },
    // 弹出框表单提交
    Commit() {
      this.$refs.PopForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let value = JSON.parse(JSON.stringify(this.$refs.PopForm.value));
          value.ApplyDetail = this.tabledata01;
          value.TableType = 1;
          this.SaveApply(value);
          this.PopFormInit();
        } else {
          return false;
        }
      });
    },
    // 弹出框表单初始化
    PopFormInit() {
      this.tabledata01 = [];
      this.$refs.PopForm.$refs.ruleForm.resetFields();
      this.modal12 = false;
      this.outPutDialog=false
    },
    PopFormInit01() {
      this.remotevalue = "";
      this.$refs.PopForm01.$refs.ruleForm.resetFields();
      this.modal13 = false;
    },
    // 新增物料提交
    AddMateriels() {
      let exist = false;
      let isnum = 0;
      if (this.tabledata01.length > 0) {
        this.tabledata01.forEach((element, index) => {
          if (element.MaterielId == this.remotevalue) {
            exist = true;
            isnum = index;
          }
        });
      }
      let element;
      if (exist) {
        element = JSON.parse(JSON.stringify(this.tabledata01[isnum]));
        for (const key in this.$refs.PopForm01.value) {
          element[key] = this.$refs.PopForm01.value[key];
        }
      } else {
        element = this.$refs.PopForm01.value;
      }
      let obj = {
        MaterielId: element.MaterielId || this.remotevalue || "",
        No: element.No || "",
        Name: element.Name || "",
        Spec: element.Spec || "",
        Model: element.Model || "",
        Number: element.Number || "",
        UnitId: element.UnitId || "",
      };
      if (exist) {
        this.tabledata01.splice(isnum, 1, obj);
        this.$message.success("物料 " + obj.Name + " 已修改");
      } else {
        for (let index = 0; index < this.options.length; index++) {
          const element = this.options[index];
          if (element.Id == this.remotevalue) {
            obj.No = element.No;
            obj.Name = element.Name;
            obj.Spec = element.Spec;
            obj.Model = element.Model;
          }
        }
        this.tabledata01.push(obj);
      }
      this.PopFormInit01();
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    },
    // 获取仓储表格数据
    GetApplys() {
      let json = {
        MN: "GetApplys",
        SN: "Apply",
        DataContent: {
          KeyWord: this.searchKey,
          PageSize: this.pageSize,
          PageIndex: this.currentPage,
          TableType: 1,
          Status: this.checkData.join(","),
        },
      };
      this.MIX_send(json);
    },
    // 获取所有物料
    // GetMateriels(val) {
    //   let json = {
    //     MN: "GetMateriels",
    //     SN: "Materiel",
    //     DataContent: {
    //       CategoryId: 0,
    //       Status: "",
    //       KeyWord: val,
    //       PageSize: 10,
    //       PageIndex: 1,
    //     },
    //   };
    //   this.MIX_send(json);
    // },
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
    RemoveApply(val) {
      let json = {
        MN: "RemoveApply",
        SN: "Apply",
        DataContent: {
          Ids: val.Id,
        },
      };
      this.MIX_send(json);
    },
    // 保存/提交入库单
    SaveApply(obj) {
      let json = {
        MN: "SaveApply",
        SN: "Apply",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    // 获取物料明细
    GetApplyById(id) {
      let json = {
        MN: "GetApplyById",
        SN: "Apply",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    // let obj1 = {
    //     Id: 17,
    //     Status: 1,
    //   };
    //   this.sObj = obj1;
    // this.updateApplyStatusById(this.sObj);
    this.GetWarehousesTree();
    this.outPutFromData = fromdata.fromdata4;
    this.stuffId = JSON.parse(window.sessionStorage.getItem("UserDetial"));
    this.fromData = fromdata.fromdata03;
    this.fromData01 = fromdata.fromdata07;
    this.columns = show01().columns02;
    this.GetApplys();
    this.getTableData();
    this.getTreeData()
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="less">
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
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: #4d6474;
}
// /deep/ .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:last-child{
//     color: #4D6474 !important;
// }
// /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
//     background-color: #9FB6CD;
// }
</style>