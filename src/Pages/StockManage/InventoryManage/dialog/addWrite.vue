<template>
  <el-dialog
    @close="cancelSubmit"
    :rules="rules"
    :title="type == 1 ? '新增盘点录入单' : type == '2' ? '编辑盘点录入单' : '查看盘点录入单'"
    :visible.sync="show"
    width="75%"
  >
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
        class="formContainer"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="单据编号" v-if="showNo" prop="No" label-position="left">
              <el-input v-model="form.No" :disabled="true" placeholder="请输入计划编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="所属计划"
              prop="InventoryPlanId"
              label-width="100px"
              label-position="left"
            >
              <el-select
                v-model="form.InventoryPlanId"
                @change="selectChange"
                :disabled="type == 3"
                filterable
                placeholder="请选择所属计划"
              >
                <el-option
                  v-for="(item, index) in planList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" label-width="100px">
              <chooseStaff
                class="chooseStaff"
                :isCustomer="true"
                :isMultipleChoice="false"
                @getToFather="getToId"
              ></chooseStaff>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </el-row> -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="盘点仓库" prop="WarehouseId" label-width="100px">
              <!-- <el-select v-model="form.WarehouseId" :disabled="type == 3" placeholder="请选择盘点仓库">
                <el-option
                  v-for="(item, index) in list"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>-->
              <el-cascader
                placeholder="请选择"
                v-model="form.WarehouseId"
                :options="list"
                :props="optionProps"
                filterable
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间" prop="StartDate" label-width="100px">
              <el-date-picker
                :disabled="type == 3"
                v-model="form.StartDate"
                value-format="yyyy/MM/dd hh:mm:ss"
                type="datetime"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="EndDate" label-width="100px">
              <el-date-picker
                :disabled="type == 3"
                v-model="form.EndDate"
                value-format="yyyy/MM/dd hh:mm:ss"
                type="datetime"
                :default-value="new Date()"
                placeholder="选择结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                type="textarea"
                :disabled="type == 3"
                v-model="form.Desc"
                placeholder="请输入分类描述"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tabs">
        <button
          style="float: right;z-index: 100;position: absolute;right: 20px;width:24px;
height:24px; color:#fff;border:none;font-size:13px; outline: none;
background:rgba(0,96,160,1);
border-radius:2px;"
          @click="addNew"
          v-if="type != 3"
        >+</button>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="| 盘点明细" name="inventory">
            <div class="replaceList">
              <!-- <table-cmp
                style="width:100%"
                class="table_cmp"
                :loading="false"
                :table-data="form.InventoryDetail"
                :table-label="inventoryLabel"
              ></table-cmp>-->
              <el-table
                size="small"
                :data="form.InventoryDetail"
                :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
              >
                <template v-for="(item,index) in inventoryLabel">
                  <el-table-column
                    v-if="item.label=='货架'"
                    :label="item.label"
                    :prop="item.param"
                    align="center"
                    fixed="right"
                    :key="index"
                  >
                    <template slot-scope="scope">
                      <el-input
                        style="width:120px;"
                        v-model="scope.row.WareHouseName"
                        placeholder="请输入货架"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else-if="item.label=='盘点数量'"
                    :label="item.label"
                    :prop="item.param"
                    align="center"
                    fixed="right"
                    :key="index"
                  >
                    <template slot-scope="scope">
                      <el-input
                        style="width:120px;"
                        v-model="scope.row.Number"
                        @input="numberChange(scope.row)"
                        placeholder="盘点数量"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else-if="item.label=='库存数量'"
                    :label="item.label"
                    :prop="item.param"
                    align="center"
                    fixed="right"
                    :key="index"
                  >
                    <template slot-scope="scope">
                      <el-input
                        style="width:120px;"
                        v-model="scope.row.Stock"
                        @input="StockChange(scope.row)"
                        placeholder="库存数量"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else-if="item.label=='差异'"
                    :label="item.label"
                    :prop="item.param"
                    align="center"
                    fixed="right"
                    :key="index"
                  ></el-table-column>
                  <el-table-column
                    v-else-if="item.label=='操作'"
                    :label="item.label"
                    :prop="item.param"
                    align="center"
                    fixed="right"
                    width="100"
                    :key="index"
                  >
                    <template slot-scope="scope">
                      <!-- <el-button
                    v-if="disabled"
                    type="text"
                    size="small"
                    @click="EditMateriels(scope.row,true)"
                      >查看</el-button>-->
                      <template>
                        <el-button
                          class="operationTtn"
                          type="text"
                          size="small"
                          @click="RemoveMateriels(scope.row)"
                        >
                          <img src="../../../../assets/images/del_icon.png" alt />
                          <span>删除</span>
                        </el-button>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else
                    :show-overflow-tooltip="true"
                    :label="item.label"
                    :prop="item.param"
                    align="center"
                    :key="index"
                  ></el-table-column>
                </template>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" style="margin-left: 25.6rem;">
      <button
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
        @click="cancelSubmit"
        v-if="type != 3"
      >取 消</button>
      <button
        style="outline: none;width:86px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
        plain
        @click="saveAsDraft"
        v-if="type != 3"
      >保存为草稿</button>
      <button
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
        @click="submitData"
      >确 定</button>
    </span>
    <materiaTable
      :selectOptionList="selectOptionList"
      :visible.sync="showReplace"
      :close-on-click-modal="true"
      :typeNum="1"
      :check="2"
      :title="'盘点物料新增'"
      :typeList="typeList"
      :showType="false"
      @closePropMask="closePropMask"
      @PopFormInit01="PopFormInit01"
      @addMaterielTable="addTable"
      @addCheck="addCheck"
    ></materiaTable>
    <!-- <Detail
    :visible="showMask"
    :type="formType"
    :typeList="shelevsList"
    :allData="form.InventoryDetail"
    :addData="maskData"
    @closePropMask="closePropMask"
    @dataSubmit="dataSubmit"
    ></Detail>-->
  </el-dialog>
</template>
<script>
import chooseStaff from "@/components/myStaff";
import materiaTable from "@/components/replaceTable";
import Detail from "./detail.vue";
var that;
var process = {
  template: `<div>
            <el-button type="text" size="small" @click="edit()">编辑</el-button>
            <el-button type="text" size="small" @click="del()">删除</el-button>

</div>`,
  props: ["row", "keyindex"],
  methods: {
    edit() {
      that.clickEdit(this.row, this.keyindex);
    },
    del() {
      that.clickDel(this.row, this.keyindex);
    },
  },
};
import { mapGetters } from "vuex";
export default {
  name: "addWrite",
  data() {
    return {
      rules: {
        No: [{ required: true, message: "请输入计划编号", trigger: "blur" }],
        InventoryPlanId: [
          { required: true, message: "请选择所属计划", trigger: "blur" },
        ],
        WarehouseId: [
          { required: true, message: "请选择盘点仓库", trigger: "blur" },
        ],
        StartDate: [
          { required: true, message: "选择开始时间", trigger: "blur" },
        ],
        EndDate: [{ required: true, message: "选择结束时间", trigger: "blur" }],
      },
      optionProps: {
        value: "Id",
        label: "Name",
        children: "ChildNodes",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
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
      formtitle: "盘点物料新增",
      materielTable: [],
      KeyWord: "",
      activeName: "inventory",
      show: false,
      showMask: false,
      maskData: {},
      formType: "1",
      currentIndex: "",
      form: {
        No: '',
        Name: '',
        StartMode: '',
        ResponsibleDept: '',
        Responsibler: '',
        WarehouseId: '',
        StartDate: this.getNowTime(),
        EndDate: '',
        Desc: '',
        JobsId: '',
        InventoryDetail: []
      },
      inventoryLabel: [
        {
          label: "物料编码",
          param: "MaterielNo",
          //   align: "center",
          //   sortable: false,
        },
        {
          label: "物料名称",
          param: "MaterielName",
          //   align: "center",
          //   sortable: false,
        },
        {
          label: "生产批次",
          param: "Batch",
          // align: "center", sortable: false
        },
        {
          label: "货架",
          param: "WareHouseName",
          //   align: "center",
          //   sortable: false,
        },
        {
          label: "盘点数量",
          param: "Number",
          //   align: "center",
          //   sortable: false,
        },
        {
          label: "库存数量",
          param: "Stock",
          //  align: "center", sortable: false
        },
        {
          label: "差异",
          param: "Diff",
          // align: "center", sortable: false
        },
        {
          label: "单位",
          param: "UnitName",
          // align: "center", sortable: false
        },
        {
          label: "操作",
          // align: "center", width: "200", component: process
        },
      ],
      jobList: [],
      organList: [],
      staffList: [],
      planList: [],
      shelevsList: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    showNo: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "1",
    },
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters([
      "QueryOrganization",
      "QueryJobs",
      "QueryStaff",
      "GetInventoryPlans",
      "GetWarehouseById",
      "GetMateriels",
      "GetMaterielCategoryTree",
    ]),
  },
  watch: {
    GetMaterielCategoryTree(newValue, oldValue) {
      console.log(newValue);
      this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
    },
    GetMateriels(newValue, oldValue) {
      this.materielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
    },
    GetWarehouseById(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.shelevsList = newVal.ReturnData.hasOwnProperty("ShelfDetail")
          ? newVal.ReturnData.ShelfDetail
          : [];
      }
    },
    GetInventoryPlans(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.planList = newVal.ReturnData.Data;
      }
    },
    visible(newVal, oldVal) {
      this.show = newVal;
      if (this.show) {
        this.getPlanList();
      }
    },
    formData(newVal, oldVal) {
      this.form = newVal;
    },
    QueryOrganization(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.organList = newVal.ReturnData.Data;
      }
    },
    QueryJobs(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.jobList = newVal.ReturnData.Data;
      }
    },
    QueryStaff(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.staffList = newVal.ReturnData.Data;
      }
    },
    type(newVal, oldVal) {
      let arr = this.inventoryLabel.filter((item) => item.label == "操作");
      if (newVal != "3") {
        if (arr.length == 0) {
          this.inventoryLabel.push({
            label: "操作",
            align: "center",
            width: "200",
            component: process,
          });
        }
      } else {
        if (arr.length != 0) {
          this.inventoryLabel.splice(this.inventoryLabel.length - 1, 1);
        }
      }
    },
  },
  created() {
    that = this;
    this.form = this.formData;
    this.getTableData();
    this.getTreeData();
  },
  mounted() {
    console.log(this.list);
  },
  methods: {
    //处理默认选中当前日期
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
      console.log(defaultDate);
      return defaultDate;
      this.$set(this.fo, "stockDate", defaultDate);
    },
    //获取员工Id
    getToId(val) {
      console.log(val);
      this.form.Responsibler = val.keyId;
    },
    //多选事件
    addCheck(val) {
      for (let i = 0; i < val.length; i++) {
        val[i].MaterielId = val[i].Id;
      }
      this.newTableData = val;
      console.log(this.newTableData);
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
    //=========物料表格事件 start=================
    //提交事件
    dataSubmit(data) {
      console.log(data);
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
      row.UnitId = 0;
      console.log(row);
      var myDate = new Date();
      let year = myDate.getFullYear() + "";
      let month = myDate.getMonth() + 1 + "";
      let day = myDate.getDate() + "";
      let num = year + "0" + month + day;
      let obj = {
        MaterielName: row.Name,
        UnitId: 0,
        MaterielId: row.Id,
        MaterielNo: row.No,
        Batch: num,
        Number: "",
        Diff: null,
        Stock: "",
        UnitName: 0,
      };
      console.log(obj);
      this.form.InventoryDetail.push(obj);
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
        },
      };
      this.MIX_send(json);
    },
    //数量改变
    numberChange(row) {
      // if(row.Number>=row.Stock){

      // }
      console.log(row);
      row.Diff = Number(row.Stock) - Number(row.Number);
    },
    //价格改变
    StockChange(row) {
      console.log(row);
      row.Diff = Number(row.Stock) - Number(row.Number);
    },
    //=========物料表格事件 end=================
    getPlanList() {
      let json = {
        MN: "GetInventoryPlans",
        SN: "Inventory",
        DataContent: {
          Id: "",
          Status: "",
          KeyWord: "",
          PageSize: 999,
          PageIndex: 1,
          TableType: "0",
        },
      };
      this.MIX_send(json);
    },
    deptChange(Id) {
      let Name = "";
      this.organList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.ResponsibleDept = Id;
      this.form.ResponsibleDeptName = Name;
    },
    jobChange(Id) {
      let Name = "";
      this.jobList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.JobsId = Id;
      this.form.JobsName = Id;
    },
    selectChange(Id) {
      let Name = "";
      this.staffList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.Responsibler = Id;
      console.log(this.form.Responsibler);
      this.form.ResponsiblerName = Name;
    },
    warehouseChange(Id) {
      let json = {
        MN: "GetWarehouseById",
        SN: "Warehouse",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    submitData() {
      if (this.type == 3) {
        this.cancelSubmit();
        return;
      }
      let form = {
        No: this.form.No,
        InventoryPlanId: this.form.InventoryPlanId,
        Responsibler: this.form.Responsibler,
        WarehouseId: this.form.WarehouseId,
        StartDate: this.form.StartDate,
        EndDate: this.form.EndDate,
        Desc: this.form.Desc,
        TableType: "0",
        InventoryDetail: this.form.InventoryDetail,
      };
      if (this.form.Id !== "") {
        form.Id = this.form.Id;
      }
      this.$emit("addMateria", form);
    },
    saveAsDraft() {
      let form = {
        Status: 0,
        No: this.form.No,
        InventoryPlanId: this.form.InventoryPlanId,
        Responsibler: this.form.Responsibler,
        WarehouseId: this.form.WarehouseId,
        StartDate: this.form.StartDate,
        EndDate: this.form.EndDate,
        Desc: this.form.Desc,
        TableType: "0",
        InventoryDetail: this.form.InventoryDetail,
      };
      if (this.form.Id !== "") {
        form.Id = this.form.Id;
      }
      console.log(form);
      this.$emit("addMateria", form);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
    },
    addNew() {
      this.formType = "1";
      this.maskData = {};
      this.showMask = true;
      this.showReplace = true;
    },
    getResponsiblerList(keyword) {
      let json = {
        MN: "QueryStaff",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    getOrganList(keyword) {
      let json = {
        MN: "QueryOrganization",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    getJobList(keyword) {
      let json = {
        MN: "QueryJobs",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    closePropMask() {
      this.showMask = false;
    },
    dataSubmit(data) {
      console.log(data);
      if (this.formType == "1") {
        this.form.InventoryDetail.push(data);
      } else {
        this.form.InventoryDetail.splice(this.currentIndex, 1, data);
      }
      this.maskData = {};
      this.showMask = false;
    },
    // 表格编辑和假删除
    clickEdit(row, index) {
      this.currentIndex = index;
      this.formType = "2";
      this.maskData = this.form.InventoryDetail[index];
      console.log(this.maskData);
      this.showMask = true;
    },
    clickDel(row, index) {
      this.form.InventoryDetail.splice(index, 1);
    },
  },
  components: {
    Detail,
    materiaTable,
    chooseStaff,
  },
};
</script>
<style scoped lang="less">
.chooseStaff {
  margin-top: -0.5rem;
}
// /deep/ .selectL .selectL_radious .el-input__inner{
//   width: 170px;
// }
.el-row {
  width: 100% !important;
}
.el-input {
  width: 100% !important;
}
/deep/ .el-dialog {
  border-radius: 4px;
}
button:hover {
  cursor: pointer;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474 !important;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
  color: #4d6474 !important;
}
/deep/
  .el-tabs--top.el-tabs--card
  > .el-tabs__header
  .el-tabs__item:last-child {
  color: #4d6474 !important;
  font-size: 16px;
}
</style>
<style lang="">
.table_cmp .el-table__body-wrapper {
  overflow-y: scroll !important;
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