
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
      title="全部资产档案"
    >
      <el-table
        :data="tableData"
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
            <div type="success" v-if="row.Status=='2'" class="success">
              <img src="../../../assets/images/圆点-绿色.png" alt />已启用
            </div>
            <div type="dangger" v-if="row.Status=='3'" class="danger">
              <img src="../../../assets/images/圆点-红色.png" alt />已停用
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == '2'">
              <el-button type="text" size="small" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />编辑
              </el-button>
              <span class="line"></span>
              <el-button type="text" size="small" style="margin-left: 0;" @click="stop(scope.row)">
                <img src="../../../assets/images/stop_icon.png" alt />停用
              </el-button>
              <!-- <span class="line"></span>
              <el-button type="text" @click="open(scope.row)">
                <img src="../../../assets/images/del_icon.png" alt />删除
              </el-button>-->
              <!-- <span class="line"></span> -->
              <!-- <el-button type="text" @click="addzj(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />新增折旧
              </el-button>-->
            </div>
            <div v-if="scope.row.Status == '3'">
              <!-- <el-button type="text" size="small" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />编辑
              </el-button>
              <span class="line"></span> -->
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
      :treeData="treeData"
      :formData="formData"
      :addway="addway"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Dialog>
    <Zhe-jiu
      :showZJ="showZJ"
      :typeList="typeList"
      :type="formType"
      :treeData="treeData"
      :editformData="editformData"
      :addway="addway"
      @closeZJ="closeZJ"
      @addZJPush="addZJPush"
    ></Zhe-jiu>
    
  </div>
  <!-- </div> -->
</template>

<script>
import replaceProp from "@/components/replaceTable.vue";
import RightContainer from "@/components/rightContainer.vue";
import Dialog from "./dialog/archives.vue";
import ZheJiu from "./dialog/adddepreciation";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
import { Message } from "element-ui";
export default {
  name: "materiaType", //物料分类
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      showZJ: false,
      showReplace: false,
      typeList: [],
      formData: {},
      editformData: {},
      formType: "1",
      process: ["Add", "check", "search"],
      checkData: -1,
      lastData: [],
      addway: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "全部状态",
          statu: -1,
        },
        {
          title: "启用",
          statu: 2,
        },
        {
          title: "停用",
          statu: 3,
        },
      ],
      treeData: [],
      columns: [
        // {
        //   label: "资产编号",
        //   prop: "AssetsNo",
        // },
        {
          label: "资产名称",
          prop: "Name",
        },
        {
          label: "资产单位",
          prop: "Unit",
        },
        {
          label: "规格",
          prop: "Spec",
        },
        // {
        //   label: "增加方式",
        //   prop: "Addtype",
        // },
        // {
        //   label: "物料ID",
        //   prop: "MaterielId",
        // },
        // {
        //   label: "经办人",
        //   prop: "BuyUser",
        // },
        {
          label: "数量",
          prop: "BuyNum",
        },
        {
          label: "初始价值",
          prop: "Price",
        },
        // {
        //   label: "折旧方式",
        //   prop: "depreciationType",
        // },
        // {
        //   label: "残值率",
        //   prop: "ratio",
        // },
        // {
        //   label: "资产描述",
        //   prop: "Desc",
        // },
        {
          label: "残值",
          prop: "ResidualValue",
        },
        // {
        //   label: "资产状态",
        //   prop: "Status",
        // },
        // {
        //   label: "创建时间",
        //   prop: "CreatedTime",
        //   width: 150,
        // },
        // {
        //   label: "创建人",
        //   prop: "CreatedUser",
        // },
      ],
    };
  },
  async created() {
    // console.log(this.AssetsTypeGetTree);
    await this.getTreeData();
    this.getTableData();
    this.getAssetsAddTypeGetList();
  },
  computed: {
    ...mapGetters([
      "AssetsTypeGetTree",
      "AssetsDetailGetList", //list
      "AssetsDetailUnCancelByID", //启用
      "AssetsDetailCancelByID", //禁用
      "AssetsDetailDeleteByID", //删除
      "AssetsDetailSave", //add,edit
      "AssetsDetailGetByID", //search
      "AssetsAddTypeGetList", //增加方式
      "AssetsDetailSave", //新增折旧方式
    ]),
  },
  watch: {
    AssetsAddTypeGetList: {
      handler(newValue, oldValue) {
        if (newValue.Code === 0) {
          this.addway = newValue.ReturnData.Data;
        } else {
          // 失败
        }
      },
      immediate: true,
      deep: true,
    },
    AssetsTypeGetTree: {
      handler(newValue, oldValue) {
        // console.log(11111,newValue,oldValue);
        if (newValue.Code === 0) {
          this.treeData = newValue.ReturnData;
          this.lastData = newValue.ReturnData;
          this.typeList = treeToArray(newValue.ReturnData, []);
        } else {
          // 失败
        }
      },
      immediate: true,
      deep: true,
    },

    AssetsDetailGetList: {
      handler(newValue, oldValue) {
        if (newValue.Code === 0) {
          this.tableData = newValue.ReturnData.Data;
          this.total = newValue.ReturnData.DataCount;
        } else {
          // 失败
        }
      },
      immediate: true,
      deep: true,
    },
    AssetsDetailSave(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "新增成功",
          type: "success",
        });
        this.getTableData();
        this.formData={}
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "新增失败",
          type: "fail",
        });
      }
    },
    AssetsDetailUnCancelByID(newValue, oldValue) {
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
    AssetsDetailCancelByID(newValue, oldValue) {
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
    async AssetsDetailDeleteByID(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "删除成功",
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
    async AssetsDetailSave(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
        this.getTreeData();
        this.showMask = false;
        this.formData = {};
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: "fail",
        });
      }
    },

    AssetsDetailGetByID: {
      handler(newValue, oldValue) {
        if (newValue.Code === 0) {
          this.editformData = newValue.ReturnData.Data;
          this.editformData.AssetsType=this.editformData.AssetsType+""
          console.log(this.editformData)
        } else {
          // 失败
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
   

    //增加方式
    getAssetsAddTypeGetList() {
      let json = {
        SN: "Assets",
        MN: "AssetsAddTypeGetList",
        DataContent: {},
      };
      this.MIX_send(json);
    },
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
        SN: "Assets",
        MN: "AssetsTypeGetTree",
        DataContent: {
          // "IsAssets": '1'
          ParentId: -1,
        },
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        SN: "Assets",
        MN: "AssetsDetailGetList",
        DataContent: {
          Id: this.currentId,
          Status: this.checkData,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          IsAssets: "1",
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        SN: "Assets",
        MN: "AssetsDetailCancelByID",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria(id) {
      let json = {
        SN: "Assets",
        MN: "AssetsDetailUnCancelByID",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },

    // 删除
    removeMateria(id) {
      let json = {
        SN: "Assets",
        MN: "AssetsDetailDeleteByID",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
      let adddata = { ...data };
      let json = {
        SN: "Assets",
        MN: "AssetsDetailSave",
        DataContent: adddata,
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
      this.showZJ = true;
      let json = {
        SN: "Assets",
        MN: "AssetsDetailGetByID",
        DataContent: {
          Id: row.Id,
        },
      };
      this.MIX_send(json);
      // this.formData = {...row};
      // this.showMask = true;
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
    closeZJ() {
      this.showZJ = false;
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    },
    //新增折旧数据提交
    addZJPush(data) {
      this.addZJData(data);
    },
    addZJData(data) {
      console.log(data);
      let json = {
        SN: "Assets",
        MN: "AssetsDetailSave",
        DataContent: { ...data },
      };
      this.MIX_send(json);
      this.showZJ = false;
    },
  },
  components: {
    RightContainer,
    Dialog,
    ZheJiu,
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
.el-tag img {
  display: inline-block;
  margin-right: 5px;
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
.danger img {
  display: inline-block;
  margin-right: 5px;
}
.success img {
  display: inline-block;
  margin-right: 5px;
}
</style>
