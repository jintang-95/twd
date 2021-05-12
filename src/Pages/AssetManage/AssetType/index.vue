

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
        stripe
        header-row-class-name="headerClass"
        slot="table"
        align="center"
        cell-class-name="elliplise"
        style="width: 100%"
      > 
      <el-table-column 
          label="所属分类名称"
          align="center"
          width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.ParentId=='0'">无</div>
          <div v-if="scope.row.ParentId!='0'">{{scope.row.PartentTypeName}}</div>
        </template>
      </el-table-column>
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
            <div type="success" v-if="row.IsDel=='0'" class="success">
              <img src="../../../assets/images/圆点-绿色.png" alt />已启用
            </div>
            <div type="dangger" v-if="row.IsDel=='1'" class="danger">
              <img src="../../../assets/images/圆点-红色.png" alt />已停用
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.IsDel == '0'">
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
              </el-button> -->
            </div>
            <div v-if="scope.row.IsDel == '1'">
              <!-- <el-button type="text" size="small" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />编辑
              </el-button>
              <span class="line"></span> -->
              <el-button type="text" size="small" style="margin-left: 0;" @click="start(scope.row)">
                <img src="../../../assets/images/start_icon.png" alt />启用
              </el-button>
              <!-- <span class="line"></span>
              <el-button type="text" @click="open(scope.row)">
                <img src="../../../assets/images/del_icon.png" alt />删除
              </el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>

    <Dialog
      :visible="showMask"
      :typeList="typeList"
      :type="formType"
      :treeData='treeData'
      :formData="formData"
      :currentId="currentId"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Dialog>
  </div>
  <!-- </div> -->
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Dialog from "./dialog/classify.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
import { Message } from 'element-ui';
export default {
  name: "materiaType", //物料分类
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId:"0",
      total: 0,
      showMask: false,
      typeList: [],
      formData: {},
      formType: "1",
      process: ["Add", "check"],
      checkData:-1,
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "全部状态",
          statu: -1,
        },
        {
          title: "启用",
          statu: 0,
        },
        {
          title: "停用",
          statu: 1,
        },

      ],
      treeData: [],
      columns: [
        // {
        //   label: "上级分类名",
        //   prop: "ParentName",
        // },
        // {
        //   label: "上级分类ID",
        //   prop: "ParentId",
        // },
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
    console.log(this.AssetsTypeGetTree);
    await this.getTreeData();
    this.getTableData();
  },
  computed: {
    ...mapGetters([
      "AssetsTypeGetTree",
      "AssetsTypeGetList",
      "AssetsTypeUnCancelByID",
      "AssetsTypeCancelByID",
      "AssetsTypeDeleteByID",
      "AssetsTypeSave",
      "AssetsTypeGetByID",
    ]),
  },
  watch: {
    
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
   
    AssetsTypeGetList:{
      handler(newValue, oldValue) {
       if (newValue.Code === 0) {
        this.tableData = newValue.ReturnData;
        this.total = newValue.ReturnData.length;
      } else {
        // 失败
      }
      },
      immediate: true,
      deep: true,
    },
    AssetsTypeUnCancelByID(newValue, oldValue) {
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
    AssetsTypeCancelByID(newValue, oldValue) {
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
    async AssetsTypeDeleteByID(newValue, oldValue) {
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
    async AssetsTypeSave(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: 'success'
        });
        // this.formData={}
        await this.getTableData()
        this.getTreeData()
        this.formData={}
        this.showMask = false
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'fail'
        });
      }
    },
  
    AssetsTypeGetByID:{
      handler(newValue, oldValue) {
        if (newValue.Code === 0) {
          this.formData = newValue.ReturnData.Data[0];
      } else {
       
        // 失败
      }
      },
      immediate: true,
      deep: true,
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
        SN:'Assets',
        MN: "AssetsTypeGetList",
        DataContent: {
          "Id": this.currentId,
          "Status":this.checkData,
          "KeyWord":this.keyWord,
          "PageSize":this.pageSize,
          "PageIndex":this.page,
          "IsAssets": '1'
        }
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        SN: "Assets",
        MN: "AssetsTypeCancelByID",
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
        MN: "AssetsTypeUnCancelByID",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria(id) {
      let json = {
        SN: "Materiel",
        MN: "AssetsTypeDeleteByID",
        DataContent: {
          Ids: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
    
         let adddata={...data,IsDel:0}
     
      let json = {
        SN: "Assets",
        MN: "AssetsTypeSave",
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
      this.formType = "2";
      this.showMask=true
      let json = {
        SN: "Assets",
        MN: "AssetsTypeGetByID",
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
        console.log(this.currentId)

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
