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
      title="全部设备分类"
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
          <div v-if="scope.row.ParentID=='0'">无</div>
          <div v-if="scope.row.ParentID!='0'">{{scope.row.ParentName}}</div>
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
      :currentId="currentId"
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Archives>
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Archives from "./dialog/classify.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materiaType", //物料分类
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
      process: ["Add", "check"],
      checkData: -1,
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
        //   label: "所属分类名称",
        //   prop: "ParentName",
        // },
        // {
        //   label: "所属分类ID",
        //   prop: "ParentID",
        // },
        {
          label: "分类名称",
          prop: "Name",
        },
        {
          label: "描述",
          prop: "Remark",
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
      "DeviceTypeGetListTree", //树
      "DeviceTypeGetListByParentId", //列表
      "DeviceTypeDelete",//停用、启用
      "DeviceTypeEdit", //新增、编辑
      "GetSingleDeviceType"//单条数据
    ]),
  },
  watch: {
     GetSingleDeviceType(newValue, oldValue){
        if (newValue.Code === 0) {
         this.formData=newValue.ReturnData
        } else {
          // 失败
        }
     },
    DeviceTypeGetListTree: {
      handler(newValue, oldValue) {
        if (newValue.Code === 0) {
          this.treeData = newValue.ReturnData.Data;
          this.lastData = newValue.ReturnData.Data;
          this.typeList = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
          let obj ={
         Id:"0",Name: "无"
        }
        this.typeList.unshift(obj)
          console.log(this.treeData);
        } else {
          // 失败
        }
      },
      immediate: true,
      deep: true,
    },
    DeviceTypeGetListByParentId: {
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
    DeviceTypeDelete(newValue, oldValue) {
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
   
  
    async DeviceTypeEdit(newValue, oldValue) {
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
  },
  methods: {
  
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
        MN: "DeviceTypeGetListByParentId", //变量名
        DataContent: {
          ParentId: this.currentId,
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
        MN: "DeviceTypeDelete",
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
        MN: "DeviceTypeDelete",
        DataContent: {
          Id: id,
          IsDel:0
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
        MN: "DeviceTypeEdit",
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
      console.log(row)
      this.formType = "2";
      let json = {
        SN: "DeviceManage",
        MN: "GetSingleDeviceType",
        DataContent: {
          Id:row.Id
        },
      };
      this.MIX_send(json);
      // this.formData = { ...row };
      
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
      console.log(this.currentId)
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