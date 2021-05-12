<template>
  <div class="materiaType">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="name">物料档案</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="refreshPage">
          <img style="width:18px;" src="../../../assets/images//serch.png.png" alt />
        </el-button>
    </div>-->
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
      :page="page"
      :pageSize="pageSize"
      :total="total"
      :checkList="checkList"
      :process="process"
      :menuList="treeData"
      title="全部备件分类"
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
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
        ></el-table-column>
        <el-table-column label="状态" align="center" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <div class="success" v-if="row.Status=='启用'">
              <img src="../../../assets/images/img/green.png" alt /> 已启用
            </div>
            <div class="danger" v-if="row.Status=='停用'">
              <img src="../../../assets/images/img/red.png" alt /> 已停用
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == '启用'">
              <!-- <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />
                <span>新增</span>
              </el-button>-->
              <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />
                <span>编辑</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                style="margin-left: 0;"
                class="operationTtn"
                @click="stop(scope.row)"
              >
                <img src="../../../assets/images/stop_icon.png" alt />
                <span>停用</span>
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
            <div v-if="scope.row.Status == '停用'">
              <!-- <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />
                <span>新增</span>
              </el-button>-->
              <!-- <el-button
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="reCover(scope.row)"
                >
                  <img src="../../../assets/images/del_icon.png" alt />
                  <span>回收</span>
              </el-button>-->
              <el-button type="text" size="small" class="operationTtn" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />
                <span>编辑</span>
              </el-button>
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
              <!-- <el-popconfirm
                  icon="el-icon-info"
                  iconColor="red"
                  title="确定清除吗？"
                  @onConfirm="clear(scope.row)"
                >
                  <el-button slot="reference" type="text" size="small" class="operationTtn">
                    <img src="../../../assets/images/eliminate_icon.png" alt />
                    <span>清除</span>
                  </el-button>
              </el-popconfirm>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>
    <!-- </el-card> -->
    <Dialog
      :currentId="currentId"
      :visible="showMask"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Dialog>
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Dialog from "./dialog/classify.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materiaType", //物料分类
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: "0",
      total: 0,
      showMask: false,
      typeList: [],
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
      optionsList: [
        {
          Id: "",
          Name: "全部",
        },
        {
          Id: "2",
          Name: "已启用",
        },
        {
          Id: "3",
          Name: "已停用",
        },
      ],
      optionsValue: "",
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
        {
          label: "分类编码",
          prop: "No",
        },
        {
          label: "分类名",
          prop: "Name",
        },
        {
          label: "所属分类",
          prop: "ParentCategoryName",
          width: "100",
        },
        {
          label: "自动编码",
          prop: "AutoCode",
        },
        {
          label: "单位换算",
          prop: "UnitConvert",
        },
        {
          label: "作业标准",
          prop: "OperationStandard",
        },
        {
          label: "BOM",
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
    await this.getTreeData();
    this.resetFormData();
    this.getTableData();
  },
  computed: {
    ...mapGetters([
      "GetMaterielCategoryTree",
      "GetMaterielCategorys",
      "UnCancelMaterielCategory",
      "CancelMaterielCategory",
      "RemoveMaterielCategory",
      "SaveMaterielCategory",
      "GetMaterielCategoryById",
    ]),
  },
  watch: {
    GetMaterielCategoryTree(newValue, oldValue) {
      console.log(newValue);
      if (newValue.Code === 0) {
        this.treeData = JSON.parse(JSON.stringify(newValue.ReturnData));
        this.lastData = JSON.parse(JSON.stringify(newValue.ReturnData));
        this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData));
        let obj = {
          Id: "0",
          Name: "无",
        };
        this.typeList.unshift(obj);
      } else {
        // 失败
      }
    },
    GetMaterielCategorys(newValue, oldValue) {
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          newValue.ReturnData.Data[i].Status =
            newValue.ReturnData.Data[i].Status == 2 ? "启用" : "停用";
          newValue.ReturnData.Data[i].AutoCode =
            newValue.ReturnData.Data[i].AutoCode == 1 ? "是" : "否";
          newValue.ReturnData.Data[i].UnitConvert =
            newValue.ReturnData.Data[i].UnitConvert == 1 ? "是" : "否";
          newValue.ReturnData.Data[i].OperationStandard =
            newValue.ReturnData.Data[i].OperationStandard == 1 ? "是" : "否";
          newValue.ReturnData.Data[i].MaterielBOM =
            newValue.ReturnData.Data[i].MaterielBOM == 1 ? "是" : "否";
        }
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    UnCancelMaterielCategory(newValue, oldValue) {
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
    CancelMaterielCategory(newValue, oldValue) {
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
    async RemoveMaterielCategory(newValue, oldValue) {
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
    async SaveMaterielCategory(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
        this.getTreeData();
        this.resetFormData();
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
    GetMaterielCategoryById(newValue, oldValue) {
      if (newValue.Code === 0) {
      } else {
        // 失败
      }
    },
  },
  methods: {
    GetTableId(val) {
      console.log(val[val.length - 1]);
      this.form.ParentId = val[val.length - 1];
    },
    selectType(data) {
      this.currentId = data;
      this.page = 1;
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    //下拉框事件
    optionChange(id) {
      console.log(id);
      this.checkData = id;
      this.getTableData();
    },
    // 获取树形结构数据
    getTreeData() {
      let json = {
        MN: "GetMaterielCategoryTree",
        SN: "Materiel",
        DataContent: {
          SType: "2",
        },
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetMaterielCategorys",
        SN: "Materiel",
        DataContent: {
          Id: this.currentId,
          Status: this.checkData,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          IsReplaceMateriel: 1,
          SType: 2,
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        MN: "CancelMaterielCategory",
        SN: "Materiel",
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
        SN: "Materiel",
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
        SN: "Materiel",
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
        SN: "Materiel",
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
    //重置表单
    resetFormData() {
      this.formData = {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        AutoCode: "",
        UnitConvert: "",
        OperationStandard: "",
        MaterielBOM: "",
        Id: "",
      };
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
        SType: 2,
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
    Dialog,
  },
};
</script>

<style scoped lang="less">
.processBtn {
  display: flex;
}
.has-gutter {
  background-color: #0060a0;
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
.box-card {
  width: 98%;
  margin: 20px auto;
}
.name {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(77, 100, 116, 1);
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
.el-tag {
  border: none;
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