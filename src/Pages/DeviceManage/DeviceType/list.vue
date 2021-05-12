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
      title="全部设备档案"
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
        <el-table-column label="有效期单位" width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.ValidityTimeUnit=='0'">年</div>
            <div v-if="scope.row.ValidityTimeUnit==1">月</div>
            <div v-if="scope.row.ValidityTimeUnit==2">日</div>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.IsDel == '0'">
              <el-button type="text" size="small" @click="edit(scope.row)">
                <img src="../../../assets/images/edit_icon.png" alt />编辑
              </el-button>
              <span class="line"></span>
              <el-button type="text" size="small" style="margin-left: 0;" @click="stop(scope.row)">
                <img src="../../../assets/images/stop_icon.png" alt />停用
              </el-button>
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
              </el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>
    <Archives
      :visible="showMask"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      :treeData='treeData'
      :brands="brands"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Archives>
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Archives from "./dialog/archives.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "deviceType", //设备档案
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      brands: [],//品牌
      DefaultSupplierId: "", //默认供应商s
      typeList: [],
      formData: {
         DefaultSupplierId: "", //默认供应商
      },
      formType: "1",
      process: ["Add", "check"],
      checkData: "-1",
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
        //   label: "设备档案ID",
        //   prop: "Id",
        //   width:100
        // },
        {
          label: "设备名称",
          prop: "DeviceName",
        },
        {
          label: "所属分类",
          prop: "TypeName",
        },
        // {
        //   label: "所属分类ID",
        //   prop: "DeviceType",
        //   width:100
        // },
        // {
        //   label: "供应商ID",
        //   prop: "SupplierId",
        // },
        {
          label: "供应商名",
          prop: "SupplierName",
        },
        {
          label: "品牌名",
          prop: "BrandName",
        },
        // {
        //   label: "品牌ID",
        //   prop: "Brand",
        // },
        {
          label: "规格",
          prop: "Spec",
        },
        {
          label: "型号",
          prop: "Model",
        },
        // {
        //   label: "物料ID",
        //   prop: "MaterielID",
        // },
        {
          label: "物料名",
          prop: "MaterielName",
        },
       
        {
          label: "初始使用时间",
          prop: "OnlineTIme",
          width:120
        },
        // {
        //   label: "描述",
        //   prop: "Desc",
        // },
         {
          label: "有效期",
          prop: "ValidityTime",
        }
      ],
    };
  },
  async created() {
    await this.getTreeData();
    this.getTableData();
    this.getBrandList();
  },
  computed: {
    ...mapGetters([
      "DeviceTypeGetListTree", //树
      "DeviceInfoGetList", //列表
      "DeviceInfoDel",
      "DeviceInfoDel",//停用、启用
      "RemoveMaterielCategory",
      "DeviceInfoEdit", //新增、编辑
      "GetMaterielCategoryById",
      "DeviceInfoGetbyID",//搜索
      "GetBrands",//品牌
    ]),
  },
  watch: {
    //单条数据
    DeviceInfoGetbyID(newValue, oldValue){
       if (newValue.Code === 0) {
        this.formData = newValue.ReturnData[0];
        console.log(this.formData)
      } else {
        // 失败
      }
    },
    //品牌
    GetBrands(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.brands = newValue.ReturnData.Data;
      } else {
        // 失败
      }
    },
    DeviceTypeGetListTree: {
      handler(newValue, oldValue) {
        if (newValue.Code === 0) {
          this.treeData = newValue.ReturnData.Data;
          this.lastData = newValue.ReturnData.Data;
          this.typeList = treeToArray(newValue.ReturnData, []);
          console.log(this.treeData);
        } else {
          // 失败
        }
      },
      immediate: true,
      deep: true,
    },
    DeviceInfoGetList: {
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
    DeviceInfoDel(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "成功",
          type: "success",
        });
        this.getTableData();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "失败",
          type: "fail",
        });
      }
    },
    DeviceInfoDel(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "成功",
          type: "success",
        });
        this.getTableData();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "失败",
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
    async DeviceInfoEdit(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        this.formData={}
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
      // 获取品牌
    getBrandList() {
      let json = {
        MN: "GetBrands",
        SN: "Materiel",
        DataContent: {
          KeyWord: "",
          PageSize: 100,
          PageIndex: 1,
          Status: "",
        },
      };
      this.MIX_send(json);
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
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    // 获取树形结构数据
    getTreeData() {
      let json = {
        SN: "DeviceManage",
        MN: "DeviceTypeGetListTree",
        DataContent: {
          // 'ParentId':-1,
        },
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        SN: "DeviceManage", //模块名
        MN: "DeviceInfoGetList", //变量名
        DataContent: {
          TypeId: this.currentId,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          IsDel: this.checkData,
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
         SN: "DeviceManage",
        MN: "DeviceInfoDel",
        DataContent: {
          Id: id,
          IsDel:1
        },
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria(id) {
      let json = {
         SN: "DeviceManage",
        MN: "DeviceInfoDel",
        DataContent: {
          Id: id,
          IsDel:0
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
      let adddata={}
      if(this.formType==1){
          adddata = { ...data, IsDel: 0,Id:0 };
      }else if(this.formType==2){
         adddata = { ...data, IsDel: 0 };
      }
     
      let json = {
        SN: "DeviceManage",
        MN: "DeviceInfoEdit",
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
      let json = {
         SN: "DeviceManage",
        MN: "DeviceInfoGetbyID",
        DataContent: {
          Id: row.Id,
        },
      };
      this.MIX_send(json);
      
      // this.formData = { ...row };
      // this.formData.ValidityTimeUnit=this.formData.ValidityTimeUnit*1
      //  this.formData.DefaultSupplierId=row.SupplierId, //默认供应商
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
      this.formData={}
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    },
  },
  components: {
    RightContainer,
    Archives,
  },
};
</script>

<style scoped lang="less">
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