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
      @highWatch="highWatch"
      :page="page"
      :showTree="true"
      :pageSize="pageSize"
      :total="total"
      :checkList="checkList"
      :process="process"
      :menuList="treeData"
      title="全部仓库"
    >
      <div slot="table">
        <div v-if="showCondition" class="highSelect">
          <el-form ref="form" label-width="80px">
            <!-- <el-form-item label="物料类型" label-position="left">
              <el-select
                v-model="MaterielId"
                filterable
                remote
                :remote-method="remoteMethod"
                placeholder="请输入物料类型"
              >
                <el-option
                  v-for="(item,index) in MaterielList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="物料名称" label-position="left">
              <el-select
                v-model="MaterielId"
                filterable
                remote
                :remote-method="remoteMethod"
                placeholder="请输入物料名称"
              >
                <el-option
                  v-for="(item,index) in MaterielList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在仓库" label-position="left">
              <!-- <el-select v-model="WarehouseId" filterable placeholder="请输入所在仓库">
                <el-option
                  v-for="(item,index) in WareHouseList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                ></el-option>
              </el-select>-->
              <el-cascader
                placeholder="请选择"
                v-model="WarehouseId"
                :options="WareHouseList"
                :props="optionProps"
                filterable
                clearable
              ></el-cascader>
            </el-form-item>
            <el-button
              @click="showCondition = !showCondition;WarehouseId='';MaterielId=''"
              class="closeBtn"
            >关 闭</el-button>
            <el-button @click="beginSelect">确 定</el-button>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          stripe
          header-row-class-name="headerClass"
          align="center"
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
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="ShelfDistribute(scope.row)"
                >
                  <span>货架分布</span>
                </el-button>
                <el-button
                  slot="reference"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="occupyDetail(scope.row)"
                >
                  <span>占用详情</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </right-container>
    <Detail
      :visible="showMask"
      :type="formType"
      :title="maskTitle"
      :addData="formData"
      @addMateria="closeMask"
    ></Detail>
  </div>
</template>

<script>
import RightContainer from "@/components/rightTree.vue";
import Detail from "./dialog/detail.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "storageSet", //仓库设定
  data() {
    return {
      optionProps: {
        value: "Id",
        label: "Name",
        children: "ChildNodes",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      showWatch: false, //监控
      showCondition: false, //高级查询
      maskTitle: "",
      WarehouseId: "",
      WareHouseList: [],
      MaterielId: "",
      MaterielList: [],
      watchData: {},
      typeList: [],
      formData: {
        MaterielNo: "",
        MaterielName: "",
        MaterielSpec: "",
        MaterielModel: "",
        WarehouseId: "",
        Stock: "",
        UnitId: "",
      },
      editForm: {},
      formType: "1",
      process: ["search"],
      checkData: [],
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "物料",
          statu: 1,
        },
        {
          title: "备件",
          statu: 2,
        },
        {
          title: "工具",
          statu: 3,
        },
      ],
      treeData: [],
      columns: [
        {
          label: "物料编码",
          prop: "MaterielNo",
        },
        {
          label: "物料名称",
          prop: "MaterielName",
        },
        {
          label: "规格",
          prop: "MaterielSpec",
        },
        {
          label: "型号",
          prop: "MaterielModel",
          width: "100",
        },
        {
          label: "所在仓库",
          prop: "WarehouseName",
        },
        {
          label: "价格",
          prop: "Price",
        },
        {
          label: "库存数量",
          prop: "Number",
        },
        {
          label: "单位",
          prop: "UnitName",
        },
        {
          label: "金额",
          prop: "Amount",
          width: "100",
        },
        {
          label: "占用数量",
          prop: "OccupiedStock",
        },
      ],
    };
  },
  async created() {
    await this.getTableData();
    this.getWarehousesTreeData();
  },
  computed: {
    ...mapGetters([
      "GetStocks",
      "GetStockById",
      "GetWarehousesTree",
      "GetMaterielsByKeyWord",
    ]),
  },
  watch: {
    GetStocks(newValue, oldValue) {
      console.log(newValue);
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          newValue.ReturnData.Data[i].Amount =
            (Number(newValue.ReturnData.Data[i].Price * 1000) *
              Number(newValue.ReturnData.Data[i].Number * 1000)) /
            1000000;
        }
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    GetStockById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData;
        this.openEdit();
      } else {
        // 失败
      }
    },
    GetWarehousesTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        console.log(newValue);
        this.WareHouseList = newValue.ReturnData;
        this.treeData = JSON.parse(JSON.stringify(newValue.ReturnData));
      }
    },
    GetMaterielsByKeyWord(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.MaterielList = treeToArray(newValue.ReturnData.Data, []);
      }
    },
  },
  methods: {
    selectType(data){
      console.log(data)
      this.WarehouseId = data
      this.getTableData()
    },
    beginSelect() {
      this.getTableData();
      this.WarehouseId = "";
      this.MaterielId = "";
    },
    remoteMethod(keyword) {
      let json = {
        MN: "GetMaterielsByKeyWord",
        DataContent: {
          CategoryId: "",
          Status: "",
          KeyWord: keyword,
          PageSize: 10,
          PageIndex: 1,
        },
      };
      this.MIX_send(json);
    },
    getWarehousesTreeData() {
      let json = {
        MN: "GetWarehousesTree",
        SN: "Warehouse",
        DataContent: {},
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetStocks",
        SN: "Stock",
        DataContent: {
          WarehouseId: this.WarehouseId,
          MaterielId: this.MaterielId,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
        },
      };
      this.MIX_send(json);
    },
    highWatch() {
      this.showCondition = !this.showCondition;
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
      // this.checkData = data;
      // this.getTableData();
      console.log(data);
    },
    // 输入框回车键
    inputChange(data) {
      this.keyWord = data;
      console.log(data);
      this.getTableData();
    },
    // 刷新回调
    async refreshPage() {
      await this.getTableData();
    },
    /**
     * 表格处理函数
     * */
    // 货架分布
    ShelfDistribute(row) {
      this.formType = "1";
      this.maskTitle = row.MaterielNo + row.MaterielName + "的货架分布";
      // this.formData= row
      this.getWareHouseById(row.Id);
    },
    // 占用详情
    occupyDetail(row) {
      this.formType = "2";
      this.maskTitle = row.MaterielNo + row.MaterielName + "的占用详情";
      // this.formData= row
      this.getWareHouseById(row.Id);
    },
    getWareHouseById(Id) {
      let json = {
        MN: "GetStockById",
        SN: "Stock",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    openEdit() {
      this.formData = this.editForm;
      console.log(this.formData);
      this.showMask = true;
    },
    // 取消新增或者取消编辑
    closeMask(data) {
      this.showMask = false;
      this.showWatch = false;
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    },
  },
  components: {
    RightContainer,
    Detail,
  },
};
</script>

<style scoped lang="less">
.processBtn {
  display: flex;
}
.highSelect {
  margin-bottom: 20px;
  .closeBtn {
    margin-left: 80px;
  }
}
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
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
</style>