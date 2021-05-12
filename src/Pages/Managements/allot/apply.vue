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
          <template v-for="(item,index) in columns">
            <el-table-column
              v-if="item.title=='状态'"
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            >
              <template slot-scope="{row}">
                <div class="success" v-if="row.Status=='审批通过'">
                  <img src="../../../assets/images/img/green.png" alt /> 审批通过
                </div>
                <div class="success" v-if="row.Status=='待审核'">
                  <img src="../../../assets/images/img/green.png" alt /> 待审核
                </div>
                <div class="danger" v-if="row.Status=='审批不通过'">
                  <img src="../../../assets/images/img/red.png" alt /> 审批不通过
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
                  v-if="scope.row.Status=='挂单'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="check(scope.row)"
                >
                  <img src="../../../assets/images/edit_icon.png" alt />
                  <span>编辑</span>
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
                  class="operationTtn"
                  size="small"
                  @click="check(scope.row,true)"
                ><img src="../../../assets/images/look.png" alt="">
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
      scrollabel :destroy-on-close="true"
      title="新增物料调拨申请单"
    >
      <PopForm
        ref="PopForm"
        @addbtn="addbtn"
        :fromData="fromData"
        :typeList='menuList'
        :disabled="disabled"
        :clickType="clickType"
        class="PopForm"
      >
        <div slot="tabPane0">
          <el-table
            size="small" fit
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
                  <el-input style="width:120px;"
                      v-model="scope.row.Number"
                      placeholder="请输入数量"
                    />
                    </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.title=='操作'"
                :label="item.title"
                :prop="item.key"
                align="center"
                fixed="right"
                :key="index"
              >
                <template slot-scope="scope">
                    <el-button class="operationTtn" type="text" size="small" @click="RemoveMateriels(scope.row)"> <img src="../../../assets/images/del_icon.png" alt />
                  <span>删除</span></el-button>
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
      :WarehouseIdVal="WarehouseIdVal"
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
      scrollabel :destroy-on-close="true"
      title="查看物料调拨申请单"
    >
    <seeTable 
    :seeMsg="seeMsg"
    @addbtn="addbtn"
    :fromData="fromData"
    :columns="seeColumns"
    :materielTable="detailedTable"
    :aType="1"
    >
    <div slot="tabPane0">
          <el-table
            size="small" fit
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
                  <el-input style="width:120px;"
                      v-model="scope.row.Number"
                      placeholder="请输入数量"
                    />
                    </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.title=='操作'"
                :label="item.title"
                :prop="item.key"
                align="center"
                fixed="right"
                :key="index"
              >
                <template slot-scope="scope">
                    <el-button class="operationTtn" type="text" size="small" @click="RemoveMateriels(scope.row)"> <img src="../../../assets/images/del_icon.png" alt />
                  <span>删除</span></el-button>
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
    </seeTable>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import seeTable from "./dialog/apply"
import PopForm from "@/components/applyForm";
import materiaTable from "@/components/replaceTable";
import ChooseShow from "@/components/ChooseShow";
import fromdata from "@/const/index";
import show01 from "@/const/chooseshow";
export default {
  name: "",
  data() {
    return {
      WarehouseIdVal:Number,
      clickType:"",
      typeList:[],
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
            title:'调入仓库',
            key:"InWarehouseName"
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
      seeMsg:null,
      seeShow:false,
      formtitle: "调拨物料新增",
      materielTable: [],
      menuList: [],
      KeyWord:"",
      disabled: false,
      remotevalue: "",
      options: [],
      remoteloading: false,
      drawerloading: true,
      direction: false,
      checkData: [],
      searchKey: "",
      detailedTable:[],
      Id: "1",
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
      Status: ["草稿", "待审核", "审批通过", "审批不通过"],
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
      "transferApplys",
      "transferApplyById",
      "Materiels",
      "UnitConvertsByMaterielId",
      "UnitConvertById",
      "removeTransferApply",
      "saveTransferApply",
      "GetMaterielCategoryTree",
      "WarehousesTree",
    ]),
  },
  components: {
    PopForm,
    ChooseShow,
    materiaTable,
    seeTable
  },
  watch: {
    WarehousesTree: function (newval, oldval) {
      this.menuList = newval.ReturnData;
    },
    GetMaterielCategoryTree(newValue, oldValue) {
        console.log(newValue)
        this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
    },
    GetMateriels(newValue, oldValue) {
      console.log(newValue)
      this.materielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
    },
    transferApplys: function (newval, oldval) {
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
    removeTransferApply: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.GetTransferApplys();
      } else {
        this.$message({
          type: "error",
          message: "删除失败",
        });
      }
    },
    saveTransferApply: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.GetTransferApplys();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    },
    transferApplyById: function (newval, oldval) {
      this.detailedTable = newval.ReturnData.TransferApplyDetail || [];
      this.detailedTable.forEach((element) => {
        element.No = element.MaterielNo;
        element.Name = element.MaterielName;
        element.Spec = element.MaterielSpec;
        element.Model = element.MaterielModel;
      });
      console.log(this.detailedTable)
    },
  },
  methods: {
    // 获取仓库树
    GetWarehousesTree() {
      let json = {
        MN: "GetWarehousesTree",
        SN: "Warehouse",
        DataContent: {},
      };
      this.MIX_send(json);
    },
    //=========物料表格事件 start=================
    //提交事件
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
    dataSubmit(data) {
      console.log(data)
      this.modal13 = false;
    },
    //关闭表格模态框
    closePropMask(data) {
      this.showReplace = false;
      this.modal13 = false;
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
      row.UnitId=0
      row.MaterielId = row.Id;
      console.log(row);
      this.tabledata01.push(row);
      // console.log(this.newTableData);
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
          WarehouseId:this.WarehouseIdVal,
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

      this.GetTransferApplys();
    },
    // 下一页
    handleNextClick(val) {
      this.currentPage = val;
      if (val > this.total) {
        this.currentPage = this.total;
      }
      this.GetTransferApplys();
    },
    // 当前页改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.GetTransferApplys();
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetTransferApplys();
    },
    // 筛选框value发生改变的回调
    handleInputChange(val) {
      this.searchKey = val;
      this.GetTransferApplys();
    },
    // 新增入库单
    addEvent() {
      this.clickType="add"
      this.disabled = false;
      this.modal12 = true;
    },
    // 多选框回调
    handleConditionChange(val) {
      this.checkData = val;
      this.GetTransferApplys();
    },
    // 刷新
    refreshPage() {
      this.GetTransferApplys();
    },
    // 新增入库物料
    addbtn(a,b,c) {
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
          this.RemoveTransferApply(val);
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
      this.seeMsg=[val]
      this.GetTransferApplyById(val.Id)
      setTimeout(()=>{
        this.seeShow=true
      })
    },
    // check(val, disabled = false) {
    //   console.log(JSON.stringify(val))
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
    //   this.GetTransferApplyById(val.Id);
    // },
    // 左侧导航栏事件的回调
    GetTableId(val) {
      this.Id = val.Id;
      this.GetTransferApplys();
    },
    // 弹出框表单提交
    Commit() {
      this.$refs.PopForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let value = JSON.parse(JSON.stringify(this.$refs.PopForm.value));
          value.TransferApplyDetail = this.tabledata01;
          value.TableType = 1;
          //console.log(value)
          this.SaveTransferApply(value);
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
        UnitId: 0,
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
        console.log(obj);
        this.tabledata01.push(obj);
      }
      this.PopFormInit01();
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    },
    // 获取仓储表格数据
    GetTransferApplys() {
      let json = {
        MN: "GetTransferApplys",
        SN: "Transfer",
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
    RemoveTransferApply(val) {
      let json = {
        MN: "RemoveTransferApply",
        SN: "Transfer",
        DataContent: {
          Ids: val.Id,
        },
      };
      this.MIX_send(json);
    },
    // 保存/提交入库单
    SaveTransferApply(obj) {
      let json = {
        MN: "SaveTransferApply",
        SN: "Transfer",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
    // 获取物料明细
    GetTransferApplyById(id) {
      let json = {
        MN: "GetTransferApplyById",
        SN: "Transfer",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.fromData = fromdata.fromdata08;
    this.fromData01 = fromdata.fromdata07;
    this.columns = show01().columns02;
    this.GetTransferApplys();
    this.getTableData()
    this.getTreeData()
    this.GetWarehousesTree()
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
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474;
}
/deep/ .el-dialog__title {
  color: #4d6474;
}
/deep/ .el-form-item__label {
  color: #4d6474;
}

</style>