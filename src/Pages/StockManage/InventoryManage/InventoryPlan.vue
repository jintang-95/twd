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
        stripe
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
        <el-table-column label="状态" align="center" class-name="status-col" width="100">
          <template slot-scope="scope">
            <div class="success" v-if="scope.row.InventoryStatusName=='启动'">
              <img src="../../../assets/images/img/green.png" alt /> 已启动
            </div>
            <div class="danger" v-if="scope.row.InventoryStatusName=='停用'">
              <img src="../../../assets/images/img/red.png" alt /> 已停用
            </div>
            <div class="success" v-if="scope.row.InventoryStatusName=='已结束'">
              <img src="../../../assets/images/img/green.png" alt /> 已结束
            </div>
            <div class="success" v-if="scope.row.InventoryStatusName=='草稿'">
              <img src="../../../assets/images/img/green.png" alt /> 草稿箱
            </div>
          </template>
        </el-table-column>
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
                <el-button slot="reference" class="operationTtn" type="text" size="small">
                  <img src="../../../assets/images/del_icon.png" alt />
                  <span>删除</span>
                </el-button>
              </el-popconfirm>
              <el-button
                type="text"
                class="operationTtn"
                size="small"
                style="margin-left: 0;"
                @click="start(scope.row)"
              >
                <img src="../../../assets/images/start_icon.png" alt />
                <span>启用</span>
              </el-button>
            </div>
            <div v-if="scope.row.Status == 1">
              <el-button type="text" class="operationTtn" size="small" @click="stop(scope.row)">
                <img src="../../../assets/images/stop_icon.png" alt />
                <span>停用</span>
              </el-button>
              <el-button type="text" class="operationTtn" size="small" @click="see(scope.row)">
                <img src="../../../assets/images/look.png" alt />
                <span>查看</span>
              </el-button>
            </div>
            <div v-if="scope.row.Status == 3">
              <el-button type="text" class="operationTtn" size="small" @click="start(scope.row)">
                <img src="../../../assets/images/start_icon.png" alt />
                <span>启用</span>
              </el-button>
              <el-button type="text" class="operationTtn" size="small" @click="see(scope.row)"><img src="../../../assets/images/look.png" alt />
                <span> 查看</span>
              </el-button>
            </div>
            <div v-if="scope.row.Status == 2">
              
              <el-button type="text" class="operationTtn" size="small" @click="see(scope.row)"> <img src="../../../assets/images/look.png" alt />
                <span> 查看</span>
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
    <el-dialog
      class="ModalForm"
      width="50%"
      :visible.sync="seeShow"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      title="查看盘点计划"
    >
      <seeTable
        :seeMsg="seeMsg"
        :columns="seeColumns"
        :aType="1"
      >
      </seeTable>
      <div slot="footer" class="dialog-footer" >
      <button style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;" @click="cancelSubmit">返回</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import seeTable from "./dialog/seeDialog";
import RightContainer from "@/components/rightContainer.vue";
import Plan from "./dialog/plan.vue";
import { mapGetters } from "vuex";
export default {
  name: "InventoryPlan", //物料分类
  data() {
    return {
      seeColumns: [
        {
          title: "计划编号",
          key: "No",
        },
        {
          title: "计划名称",
          key: "Name",
        },
        {
          title: "负责部门",
          key: "ResponsibleDeptName",
        },
        {
          title: "负责岗位",
          key: "JobsName",
        },
        {
          title: "负责人",
          key: "ResponsiblerName",
        },
        {
          title: "盘点仓库",
          key: "WarehouseName",
        },
        {
          title: "开始时间",
          key: "StartDate",
        },
        {
          title: "结束时间",
          key: "EndDate",
        },
        {
          title: "描述",
          key: "Desc",
        },
        {
          title:"状态",
          key:"InventoryStatusName"
        }
      ],
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
      checkData: "",
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "全部",
          statu: "",
        },
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
      seeMsg: null,
      seeShow: false,
      treeData: [],
      columns: [
        // {
        //   label: "状态",
        //   prop: "InventoryStatusName",
        // },
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
      "GetWarehousesTree",
    ]),
  },
  watch: {
    GetWarehousesTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.typeList = newValue.ReturnData;
      } else {
        // 失败
      }
    },
    GetInventoryPlans(newValue, oldValue) {
      if (newValue.Code === 0) {
        console.log(newValue);
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
        MN: "GetWarehousesTree",
        SN: "Warehouse",
        DataContent: {
          Id: "",
          Status: "",
          KeyWord: "",
          PageSize: 100,
          PageIndex: 1,
          TableType: "0",
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
        SN: "Inventory",
        DataContent: {
          Id: this.currentId,
          Status: this.checkData,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          TableType: "0",
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        MN: "CancelInventoryPlan",
        SN: "Inventory",
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
        SN: "Inventory",
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
        SN: "Inventory",
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
        SN: "Inventory",
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
        SN: "Inventory",
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
      console.log(JSON.stringify(row))
      this.seeMsg = [row];
      this.seeShow=true
      // this.formType = "3";
      // this.formData = row;
      // this.getPlanById(row.Id);
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
    cancelSubmit(){
      this.seeShow=false
    }
  },
  components: {
    RightContainer,
    Plan,
    seeTable,
  },
};
</script>

<style scoped lang="less">
.processBtn {
  display: flex;
}
.cell {
  text-align: center;
}
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  vertical-align: middle;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
.dialog-footer {
  margin-top: 15px;
  text-align: right;
}
</style>