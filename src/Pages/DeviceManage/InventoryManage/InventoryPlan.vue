
<template>
  <!-- <div class='rightbox'> -->
  <div class="materiaType">
    <!-- <right-head
    ></right-head>-->
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
      title="全部资产分类"
    >
      <el-table
        :data="tableData"
        height="calc(100%-110px)"
        stripe
        header-row-class-name="headerClass"
        slot="table"
        align="center"
        cell-class-name="elliplise"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :key="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="状态"
          sortable="custom"
          align="center"
          class-name="status-col"
          width="100"
        >
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.Status=='启用'" :hit="false"><img src="../../../assets/images/圆点-绿色.png" alt />已启用</el-tag>
            <el-tag type="dangger" v-if="row.Status=='停用'" :hit="false"><img src="../../../assets/images/圆点-红色.png" alt />已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == '启用'">
              <el-button type="text" size="small" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />编辑
              </el-button>
              <span class="line"></span>
              <el-button type="text" size="small" style="margin-left: 0;" @click="stop(scope.row)">
                <img src="../../../assets/images/stop_icon.png" alt />停用
              </el-button>
              <span class="line"></span>
              <el-button type="text" @click="open(scope.row)">
                <img src="../../../assets/images/del_icon.png" alt />删除
              </el-button>
            </div>
            <div v-if="scope.row.Status == '停用'">
              <!-- <el-button type="text" size="small" @click="reCover(scope.row)">回收</el-button> -->
              <!-- <el-button type="text" size="small" style="margin-left: 0;" @click="start(scope.row)"><img  src="../../../assets/images/start_icon.png" alt />启用</el-button>
                    <el-popconfirm
                    icon="el-icon-info"
                    iconColor="red"
                    title="确定清除吗？"
                    @onConfirm="clear(scope.row)"
                  >
                    <el-button slot="reference" type="text" size="small">清除</el-button>
              </el-popconfirm>-->
              <el-button type="text" size="small" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />编辑
              </el-button>
              <span class="line"></span>
              <el-button type="text" size="small" style="margin-left: 0;" @click="start(scope.row)">
                <img src="../../../assets/images/start_icon.png" alt />启用
              </el-button>
              <span class="line"></span>
              <el-button type="text" @click="open(scope.row)">
                <img src="../../../assets/images/del_icon.png" alt />删除
              </el-button>
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
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Dialog>
  </div>
  <!-- </div> -->
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
// import Dialog from "./dialog/classify.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materiaType", //物料分类
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 10,
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
      formType: "1",
      process: ["Add", "check", "search"],
      checkData: [],
      lastData: [],
      keyWord: "",
      tableData: [],
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
      treeData: [],
      columns: [
        {
          label: "上级分类",
          prop: "ParentID",
        },
        {
          label: "分类名称",
          prop: "TypeName",
        },
        {
          label: "描述",
          prop: "remark",
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
      if (newValue.Code === 0) {
        this.treeData = newValue.ReturnData;
        this.lastData = newValue.ReturnData;
        this.typeList = treeToArray(newValue.ReturnData, []);
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
          message: "删除失败",
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
        this.showMask = false;
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "保存失败",
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
    relod() {
      this.getTableData();
    },
    open(data) {
      this.$confirm("确定删除吗?删除后数据将不可恢复", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.del(data);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    selectType(data) {
      this.currentId = data;
      // this.treeData = []
      this.treeData = this.lastData;
      this.getTableData();
    },
    // 获取树形结构数据
    getTreeData() {
      let json = {
        SN:'Assets',
        MN: "AssetsTypeGetList",
        DataContent: {
            // "IsAssets": '1'
            'ParentId':-1
        }
      };
      this.MIX_send(json);
      
    },
    // 获取表格数据
    getTableData() {
      // let json = {
      //   SN:'Assets',
      //   MN: "AssetsTypeGetList",
      //   DataContent: {
      //     "Id": this.currentId,
      //     "Status":this.checkData.join(','),
      //     "KeyWord":this.keyWord,
      //     "PageSize":this.pageSize,
      //     "PageIndex":this.page,
      //     "IsAssets": '1'
      //   }
      // };

      // this.MIX_send(json);
      let json = {
        Status: "启用",
        OperationStandard: 777,
        Desc: "9xxxxx",
        No: "0001",
      };
      for (let i = 0; i < 20; i++) {
        this.tableData.push(json);
      }
    },
    // 停用
    stopMateria(id) {
      let json = {
        SN: "Materiel",
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
        SN: "Materiel",
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
        SN: "Materiel",
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
        SN: "Materiel",
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
    Dialog,
  },
};
</script>

<style scoped lang="less">
.rightbox {
  height: 100%;
  width: 100%;
  padding: 100px 20px 20px 20px;
  // background: rosybrown;
}
.processBtn {
  display: flex;
}
.line {
  margin: 0 10px;
  height: 12px;
  width: 0px;
  border-left: 1px solid #d4def3;
}
.el-button--text {
  color: #0060a0;
  font-size: 14px;
}
.el-button--text img {
  display: inline-block;
  margin-right: 5px;
  width: 13px;
}
.el-tag img{
	display: inline-block;
	margin-right: 5px;
}
.materiaType{
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #fff;
	border-radius: 5px;
	padding: 0 1.1875rem;
	box-sizing: border-box;
}
</style>