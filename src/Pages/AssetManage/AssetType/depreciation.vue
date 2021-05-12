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
        :showTree="false"
        title="全部分类"
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
            v-for="(item, index) in columns"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            :key="index"
          ></el-table-column>
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
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Dialog from "./dialog/adddepreciation.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "brand", //品牌分类
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      formData: {},
      formType: "1",
      process: [ "search"],
      checkData: -1,
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
          statu: 0,
        },
        {
          title: "已停用",
          statu: 1,
        },
      ],
      treeData: [],
      columns: [
        {
          label: "资产编号",
          prop: "AssetsNo",
        },
        {
          label: "记录日期",
          prop: "RecordDate",
          width: "150",
        },
        {
          label: "折旧比例",
          prop: "ratio",
        },
        {
          label: "折旧金额",
          prop: "Dprice"
        },
        {
          label: "累计折旧",
          prop: "Cumulative",
        },
        {
          label: "资产残值",
          prop: "OutputValue"
        },
        {
          label: "创建时间",
          prop: "CreateTime",
          width: "150",
        },
        {
          label: "创建人",
          prop: "CreateUser"
        },
      ],
    };
  },
  async created() {
    await this.getTableData();
    
  },
  computed: {
    ...mapGetters([
      "AssetDepreciationLogGetList",//表结构
      "AssetDepreciationLogSave",//新增修改
      "AssetsAddTypeDeleteByID",//删除
      "AssetsAddTypeCancelByID",//禁用
      "GetBrandById",
      "AssetsAddTypeUnCancelByID",//启用
    ]),
  },
  watch: {
   
    AssetDepreciationLogGetList(newValue, oldValue) {
      if (newValue.Code === 0) {
        
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    AssetsAddTypeUnCancelByID(newValue, oldValue) {
      console.log(newValue)
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
    AssetsAddTypeCancelByID(newValue, oldValue) {
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
    async AssetsAddTypeDeleteByID(newValue, oldValue) {
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
    async AssetDepreciationLogSave(newValue, oldValue) {
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
    GetBrandById(newValue, oldValue) {
      if (newValue.Code === 0) {
      } else {
        // 失败
      }
    },
  },
  methods: {
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
  
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "AssetDepreciationLogGetList",
        SN:"Assets",
        DataContent: {
          Status: this.checkData,
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
        MN: "AssetsAddTypeCancelByID",
        SN:"Assets",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria(id) {
      let json = {
        MN: "AssetsAddTypeUnCancelByID",
        SN:"Assets",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria(id) {
      let json = {
        MN: "AssetsAddTypeDeleteByID",
        SN:"Assets",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
        let adddata={...data,isDel:0}
      let json = {
        MN: "AssetDepreciationLogSave",
        SN:"Assets",
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
      console.log(data);
      this.keyWord = data;
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
      this.formData = {...row};
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
    //下拉框选择id
    GetTableId(val){
      console.log(val.val.length-1)
      this.form.ParentId=val[val.length-1]
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

.name {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(77, 100, 116, 1);
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

/deep/ .el-tag {
  border: none;
}
.materiaType{
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #fff;
  border-radius: 5px;
  padding: 0 1.1875rem;
 // padding: 0 5%;
	box-sizing: border-box;
}
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