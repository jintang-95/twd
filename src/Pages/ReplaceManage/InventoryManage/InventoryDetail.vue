<template>
  <div class="materiaType">
    <div class="refresh"><img @click="refreshPage" src="../../../assets/images/serch.png.png" alt=""></div>
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
      @optionChange="optionChange"
      :showTree="false"
      :page="page"
      :pageSize="pageSize"
      :total="total"
      :checkList="checkList"
      :process="process"
      :menuList="treeData"
      :optionList="planList"
      :selectVal="currentId"
      title
    >
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#F0F7FB',color:'#5C87A4' }"
        header-row-class-name="headerClass"
        slot="table"
        align="center"
        cell-class-name="elliplise"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
        ></el-table-column>
      </el-table>
    </right-container>
    <Plan
      :visible="showMask"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Plan>
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Plan from "./dialog/plan.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materiaType", //物料分类
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: "",
      total: 0,
      showMask: false,
      typeList: [],
      planList: [],
      formData: {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        AutoCode: "",
        UnitConvert: "",
        OperationStandard: "",
        MaterielBOM: "",
      },
      formType: "1",
      process: ["Select", "set", "search"],
      checkData: [],
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [],
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
          label: "生产批次",
          prop: "Batch",
        },
        {
          label: "所在仓库",
          prop: "WarehouseName",
        },
        {
          label: "库存数量",
          prop: "Stock",
        },
        {
          label: "单位",
          prop: "UnitName",
        },
        {
          label: "盘点数量",
          prop: "Number",
        },
        {
          label: "差异",
          prop: "Diff",
        },
        {
          label: "盘点人",
          prop: "ResponsiblerName",
        },
        {
          label: "复核人",
          prop: "ResponsiblerName",
        },
        {
          label: "结果",
          prop: "Result",
          width: "300",
        },
      ],
    };
  },
  async created() {
    await this.getPlanList();
  },
  computed: {
    ...mapGetters(["GetInventoryInfoById", "GetInventoryPlans"]),
  },
  watch: {
    GetInventoryInfoById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    GetInventoryPlans(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.planList = newValue.ReturnData.Data;
        this.currentId = this.planList[0].Id + "";
        this.getTableData();
      } else {
        // 失败
      }
    },
  },
  methods: {
    selectType(data) {
      this.currentId = data;
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    optionChange(Id) {
      this.currentId = Id + "";
      this.getTableData();
    },
    // 获取计划
    getPlanList() {
      let json = {
        MN: "GetInventoryPlans",
        DataContent: {
          KeyWord: "",
          PageSize: 999,
          PageIndex: 1,
          TableType: "1",
        },
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetInventoryInfoById",
        DataContent: {
          Id: this.currentId,
          Status: this.checkData.join(","),
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        MN: "CancelMaterielCategory",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria(id) {
      let json = {
        MN: "UnCancelMaterielCategory",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria(id) {
      let json = {
        MN: "RemoveMaterielCategory",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
      let json = {
        MN: "SaveMaterielCategory",
        DataContent: data,
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
      this.checkData = data;
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
    // 编辑
    edit(row) {
      this.formType = "2";
      this.formData = {
        No: row.No,
        Name: row.Name,
        ParentId: row.ParentId,
        Desc: row.Desc,
        AutoCode: row.AutoCode == "是",
        UnitConvert: row.UnitConvert == "是",
        OperationStandard: row.OperationStandard == "是",
        MaterielBOM: row.MaterielBOM == "是",
        Id: row.Id,
      };
      this.showMask = true;
    },
    // 停用
    stop(row) {
      this.stopMateria(row.Id);
    },
    // 删除
    del(row) {
      this.removeMateria(row.Id);
    },
    // 回收
    reCover(row) {},
    // 启用
    start(row) {
      this.startMateria(row.Id);
    },
    // 清除
    clear(row) {},
    // 新增
    addNew() {
      this.formType = "1";
      for (let key in this.formData) {
        if (key != "Id") {
          this.formData[key] = "";
        } else {
          delete this.formData[key];
        }
      }
      this.showMask = true;
    },
    // 取消新增或者取消编辑
    closeMask(data) {
      this.showMask = false;
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    },
  },
  components: {
    RightContainer,
    Plan,
  },
};
</script>

<style scoped lang="less">
.processBtn {
  display: flex;
}
.refresh{
  height: 54px;
  line-height: 54px;
  float: right;
  img{
    width: 18px;
    height: 18px;
    margin-left: 26%;
    margin-top: 50%;
  }
}

</style>