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
        <el-table-column
          align="center"
          :show-overflow-tooltip="true"
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
              <el-button type="text" size="small" class="operationTtn" @click="start(scope.row)">
                <img src="../../../assets/images/start_icon.png" alt />
                <span>启用</span>
              </el-button>
            </div>
            <div v-if="scope.row.Status == 1">
              <el-button type="text" size="small" class="operationTtn" @click="stop(scope.row)">
                <img src="../../../assets/images/stop_icon.png" alt />
                <span>停用</span>
              </el-button>
              <el-button type="text" size="small" class="operationTtn" @click="see(scope.row)">
                <span>查看</span>
              </el-button>
            </div>
            <div v-if="scope.row.Status == 3">
              <el-button type="text" size="small" class="operationTtn" @click="start(scope.row)">
                <img src="../../../assets/images/start_icon.png" alt />
                <span>启用</span>
              </el-button>
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
    <Plan
      :visible="showMask"
      :list="typeList"
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
import { mapGetters } from "vuex";
export default {
  name: "InventoryPlan", //物料分类
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
        WarehouseId: "",
        StartDate: "",
        EndDate: "",
        Desc: "",
        JobsId: "",
        InventoryPlanDetail: [],
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
          title: "启动",
          statu: 1,
        },
        {
          title: "停用",
          statu: 3,
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
          label: "计划编号",
          prop: "No",
        },
        {
          label: "计划名称",
          prop: "Name",
        },
        {
          label: "负责部门",
          prop: "ResponsibleDeptName",
          width: "100",
        },
        {
          label: "负责岗位",
          prop: "JobsName",
        },
        {
          label: "负责人",
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
      "GetInventoryPlans",
      "RemoveInventoryPlan",
      "GetInventoryPlanById",
      "SaveInventoryPlan",
      "UnCancelInventoryPlan",
      "CancelInventoryPlan",
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
    GetInventoryPlans(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    UnCancelInventoryPlan(newValue, oldValue) {
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
    CancelInventoryPlan(newValue, oldValue) {
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
    async RemoveInventoryPlan(newValue, oldValue) {
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
    async SaveInventoryPlan(newValue, oldValue) {
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
    GetInventoryPlanById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData;
        this.formData.InventoryPlanDetail = this.editForm.InventoryPlanDetail;
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
        MN: "GetInventoryPlans",
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
        MN: "CancelInventoryPlan",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria(id) {
      let json = {
        MN: "UnCancelInventoryPlan",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria(id) {
      let json = {
        MN: "RemoveInventoryPlan",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
      let json = {
        MN: "SaveInventoryPlan",
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
    getPlanById(Id) {
      let json = {
        MN: "GetInventoryPlanById",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    openEdit() {
      this.showMask = true;
    },
    /**
     * 表格处理函数
     * */
    // 编辑
    edit(row) {
      this.formType = "2";
      this.formData = row;
      this.getPlanById(row.Id);
    },
    see(row) {
      this.formType = "3";
      this.formData = row;
      this.getPlanById(row.Id);
      // this.showMask = true
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
      this.formData = {
        No: "",
        Name: "",
        StartMode: "",
        ResponsibleDept: "",
        Responsibler: "",
        WarehouseId: "",
        StartDate: "",
        EndDate: "",
        Desc: "",
        JobsId: "",
        InventoryPlanDetail: [],
      };
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