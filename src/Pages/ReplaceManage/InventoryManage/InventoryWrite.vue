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
      :showTree="false"
      :page="page"
      :pageSize="pageSize"
      :total="total"
      :checkList="checkList"
      :process="process"
      :menuList="treeData"
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
        <el-table-column align="center"
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
        ></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == 0">
              <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />
                <span>编辑</span>
              </el-button>
              <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                title="确定删除吗？"
                @onConfirm="del(scope.row)"
              >
                <el-button slot="reference" type="text" class="operationTtn" size="small">
                  <img src="../../../assets/images/del_icon.png" alt />
                  <span>删除</span>
                </el-button>
              </el-popconfirm>
            </div>
            <div v-if="scope.row.Status == 1">
              <el-button type="text" size="small" class="operationTtn" @click="see(scope.row)">
                <span>查看</span>
              </el-button>
            </div>
            <div v-if="scope.row.Status == 2">
              <el-button type="text" size="small" class="operationTtn" @click="see(scope.row)">
                <span>查看</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>
    <AddWrite
      :visible="showMask"
      :list="typeList"
      :type="formType"
      :formData="formData"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></AddWrite>
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import AddWrite from "./dialog/addWrite.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materiaType", //盘点录入单
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      formData: {
        No: "",
        Name: "",
        StartMode: "",
        ResponsibleDept: "",
        Responsibler: "",
        StartDate: "",
        EndDate: "",
        Desc: "",
        JobsId: "",
        InventoryDetail: [],
      },
      formType: "1",
      process: ["Add", "check", "search"],
      checkData: [],
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "草稿",
          statu: 0,
        },
        {
          title: "确认",
          statu: 1,
        },
        {
          title: "已结束",
          statu: 2,
        },
      ],
      treeData: [],
      columns: [
        {
          label: "状态",
          prop: "InventoryStatusName",
        },
        {
          label: "盘点录入单号",
          prop: "No",
        },
        {
          label: "所属盘点计划",
          prop: "InventoryPlanId",
        },
        {
          label: "负责部门",
          prop: "ResponsibleDeptName",
          width: "100",
        },
        {
          label: "盘点人",
          prop: "ResponsiblerName",
        },
        {
          label: "盘点仓库",
          prop: "WarehouseName",
        },
        {
          label: "开始时间",
          prop: "StartDate",
        },
        {
          label: "结束时间",
          prop: "EndDate",
        },
        {
          label: "盘点差异",
          prop: "MaterielBOM",
        },
        {
          label: "描述",
          prop: "Desc",
          width: "300",
        },
      ],
    };
  },
  async created() {
    await this.getTableData();
    this.getWareHouseList();
  },
  computed: {
    ...mapGetters([
      "GetInventorys",
      "SaveInventory",
      "RemoveInventory",
      "DraftInventory",
      "GetInventoryById",
      "GetWarehouses",
    ]),
  },
  watch: {
    GetWarehouses(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.typeList = newValue.ReturnData.Data;
      } else {
        // 失败
      }
    },
    GetInventorys(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    async RemoveInventory(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "success",
        });
        await this.getTableData();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "fail",
        });
      }
    },
    async SaveInventory(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
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
    GetInventoryById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.formData.InventoryDetail = newValue.ReturnData.hasOwnProperty(
          "InventoryDetail"
        )
          ? newValue.ReturnData.InventoryDetail
          : [];
        this.openEdit();
      } else {
        // 失败
      }
    },
  },
  methods: {
    getWareHouseList() {
      let json = {
        MN: "GetWarehouses",
        DataContent: {
          Id: "",
          Status: "",
          KeyWord: "",
          PageSize: 100,
          PageIndex: 1,
          TableType: "1",
        },
      };
      this.MIX_send(json);
    },
    selectType(data) {
      this.currentId = data;
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetInventorys",
        DataContent: {
          Id: this.currentId,
          Status: this.checkData.join(","),
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          TableType: "1",
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
        MN: "RemoveInventory",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
      let json = {
        MN: "SaveInventory",
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
      await this.getTableData();
    },
    /**
     * 表格处理函数
     * */
    // 编辑
    edit(row) {
      this.formType = "2";
      this.formData = row;
      this.getWriteById(row.Id);
    },
    getWriteById(Id) {
      let json = {
        MN: "GetInventoryById",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    openEdit() {
      this.showMask = true;
    },
    see(row) {
      this.formType = "3";
      this.formData = row;
      this.getWriteById(row.Id);
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
      this.formData = {
        No: "",
        Name: "",
        StartMode: "",
        ResponsibleDept: "",
        Responsibler: "",
        StartDate: "",
        EndDate: "",
        Desc: "",
        JobsId: "",
        InventoryDetail: [],
      };
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    },
  },
  components: {
    RightContainer,
    AddWrite,
  },
};
</script>

<style scoped lang="less">
.processBtn {
  display: flex;
}
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
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