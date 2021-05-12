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
      :checkList="checkList"
      :process="process"
      :menuList="treeData"
      title="全部仓库"
    >
      <el-table
        :data="tableData"
        header-row-class-name="headerClass"
        slot="table"
        align="center"
        cell-class-name="elliplise"
      >
        <el-table-column
          align="center"
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
        ></el-table-column>
        <el-table-column label="状态" align="center" class-name="status-col" width="100">
          <template slot-scope="scope">
                  <div class="success" v-if="scope.row.Status=='启用'">
                <img src="../../../assets/images/img/green.png" alt /> 已启用
              </div>
              <div class="danger" v-if="scope.row.Status=='停用'">
                <img src="../../../assets/images/img/red.png" alt /> 已停用
              </div>
              <div class="danger" v-if="scope.row.Status=='草稿'">
                <img src="../../../assets/images/img/red.png" alt /> 草稿
              </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == '启用'">
              <!--  -->
                <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                  <img src="../../../assets/images/edit_icon.png" alt />
                  <span>编辑</span>
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
                @click="addWatch(scope.row)"
              >
                <img src="../../../assets/images/stock_icon.png" alt />
                <span>库存监控</span>
              </el-button>
              <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                title="确定删除吗？"
                @onConfirm="del(scope.row)"
              >
                <el-button slot="reference" type="text" class="operationTtn" size="small">
                  <el-button slot="reference" type="text" class="operationTtn" size="small">
                    <img src="../../../assets/images/del_icon.png" alt />
                    <span>删除</span>
                  </el-button>
                </el-button>
              </el-popconfirm>
            </div>
            <div v-if="scope.row.Status == '停用'">
              <el-button
                type="text"
                size="small"
                style="margin-left: 0;"
                class="operationTtn"
                @click="start(scope.row)"
              >
                <img src="../../../assets/images/start_icon.png" alt />
                <span>启用</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                class="operationTtn"
                style="margin-left: 0;"
                @click="addWatch(scope.row)"
              >
                <img src="../../../assets/images/stock_icon.png" alt />
                <span>库存监控</span>
              </el-button>
              <!-- <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                title="确定清除吗？"
                @onConfirm="clear(scope.row)"
              >
                <el-button slot="reference" class="operationTtn" type="text" size="small">
                  <img src="../../../assets/images/eliminate_icon.png" alt />
                  <span>清除</span>
                </el-button>
              </el-popconfirm> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>
    <Dialog
      :visible="showMask"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      :WarehouseCheckId="WarehouseCheckId"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Dialog>
    <stock-watch
      :visible="showWatch"
      :typeList="typeList"
      :type="formType"
      :formData="watchData"
      @closeMask="closeMask"
      @addMateria="addStock"
    ></stock-watch>
  </div>
</template>

<script>
import RightContainer from "@/components/rightTree.vue";
import Dialog from "./dialog/classify.vue";
import stockWatch from "./dialog/stockWatch.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "storageSet", //仓库设定
  data() {
    return {
      WarehouseCheckId:"0",
      pageSize: 10,
      page: 1,
      currentId: "0",
      total: 0,
      showMask: false,
      showWatch: false, //监控
      watchData: {},
      beginWatchData: {},
      typeList: [],
      formData: {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        Category: "",
        ManagerId: "",
        ShelfDetail: [],
      },
      editForm: {},
      formType: "1",
      process: ["Add", "check", "search"],
      checkData: '',
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "全部",
          statu: '',
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
      treeData: [],
      columns: [
        // {
        //   label: "状态",
        //   prop: "Status",
        // },
        {
          label: "名称",
          prop: "Name",
        },
        {
          label: "类型",
          prop: "Category",
        },
        {
          label: "隶属仓库",
          prop: "CategoryName",
          width: "100",
        },
        {
          label: "管理员",
          prop: "StaffName",
        },
        {
          label: "描述",
          prop: "Desc",
        },
      ],
    };
  },
  async created() {
    await this.getTreeData();
    this.getTableData();
  },
  computed: {
    ...mapGetters([
      "GetWarehouses",
      "GetWarehousesTree",
      "SaveWarehouse",
      "RemoveWarehouse",
      "UnCancelWarehouse",
      "CancelWarehouse",
      "GetWarehouseById",
      "GetStockMonitorByWarehouseId",
      "SaveStockMonitor",
    ]),
  },
  watch: {
    GetWarehousesTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.treeData = newValue.ReturnData;
        this.lastData = newValue.ReturnData;
        this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
        let obj ={
          Id:"0",
          Name:"无"
        }
        this.typeList.unshift(obj)
        console.log(this.typeList)
      } else {
        // 失败
      }
    },
    GetWarehouses(newValue, oldValue) {
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          newValue.ReturnData.Data[i].Status =
            newValue.ReturnData.Data[i].Status == 2 ? "启用" : "停用";
          newValue.ReturnData.Data[i].Category =
            newValue.ReturnData.Data[i].Category == 0 ? "虚拟仓" : "实体仓";
        }
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    UnCancelWarehouse(newValue, oldValue) {
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
    CancelWarehouse(newValue, oldValue) {
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
    async RemoveWarehouse(newValue, oldValue) {
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
    async SaveWarehouse(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
        this.getTreeData();
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
    GetWarehouseById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData;
        this.openEdit();
      } else {
        // 失败
      }
    },
    // 库存监控数据
    GetStockMonitorByWarehouseId(newValue, oldValue) {
      if (newValue.Code === 0) {
        console.log("11111");
        this.beginWatchData = newValue.ReturnData;
        this.openWatch();
      } else {
        // 失败
        this.$message({
          type: "fail",
          message: newValue.Message,
          showClose: true,
        });
      }
    },
    SaveStockMonitor(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          type: "success",
          message: "保存成功",
          showClose: true,
        });
        this.showWatch = false;
      } else {
        // 失败
        this.$message({
          type: "fail",
          message: newValue.Message,
          showClose: true,
        });
      }
    },
  },
  methods: {
    selectType(data) {
      let Str = JSON.parse(JSON.stringify(data))
      this.WarehouseCheckId=Str
      console.log(this.WarehouseCheckId)
      this.currentId = data;
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    // 获取树形结构数据
    getTreeData() {
      let json = {
        MN: "GetWarehousesTree",
        SN: "Warehouse",
        DataContent: {
          IsTool: "0",
          IsAssets: "0",
          IsReplaceMateriel: "0",
        },
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetWarehouses",
        SN: "Warehouse",
        DataContent: {
          Id: this.currentId,
          Status: this.checkData,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          IsTool: "0",
          IsAssets: "0",
          IsReplaceMateriel: "0",
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        MN: "CancelWarehouse",
        SN: "Warehouse",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria(id) {
      let json = {
        MN: "UnCancelWarehouse",
        SN: "Warehouse",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria(id) {
      let json = {
        MN: "RemoveWarehouse",
        SN: "Warehouse",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
      let json = {
        MN: "SaveWarehouse",
        SN: "Warehouse",
        DataContent: data,
      };
      this.MIX_send(json);
    },
    // 保存监控
    addStock(data) {
      console.log(data);
      let json = {
        MN: "SaveStockMonitor",
        SN: "Warehouse",
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
      console.log(1213)
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
      console.log(row)
      this.formType = "2";
      this.formData = {
        ManagerId: row.ManagerId,
        StaffName: row.StaffName,
        Name: row.Name,
        ParentId: row.ParentId,
        Desc: row.Desc,
        Category: row.Category == "虚拟仓" ? 0 : 1,
        IsAssets: "0",
        IsReplaceMateriel: "0",
        IsTool: "0",
        Id: row.Id,
      };
      this.getWareHouseById(row.Id);
    },
    getWareHouseById(Id) {
      let json = {
        MN: "GetWarehouseById",
        SN: "Warehouse",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    openEdit() {
      this.formData["ShelfDetail"] = this.editForm.hasOwnProperty("ShelfDetail")
        ? this.editForm["ShelfDetail"]
        : [];
      console.log(this.formData);
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
    // 库存监控
    addWatch(row) {
      console.log(row);
      this.getStockById(row.Id);
    },
    openWatch() {
      if (Object.keys(this.beginWatchData).length == 0) {
        this.watchData = {
          Frequency: "",
          Unit: "",
          NotifiedBy: "",
          NotifiedByName: "",
          Mobile: "",
          StockMonitorDetail: [],
        };
      } else {
        for (let key in this.beginWatchData) {
          this.watchData[key] = this.beginWatchData[key];
        }
      }
      console.log(this.watchData);
      this.showWatch = true;
    },
    getStockById(Id) {
      let json = {
        MN: "GetStockMonitorByWarehouseId",
        SN: "Warehouse",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
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
    Dialog,
    stockWatch,
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
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
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