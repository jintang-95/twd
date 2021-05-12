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
        <el-table-column
          label="状态"
          sortable="custom"
          align="center"
          class-name="status-col"
          width="100"
        >
          <template slot-scope="{row}">
            <div type="success" v-if="row.Status=='0'">待审批</div>
            <div type="dangger" v-if="row.Status=='1'">待发放</div>
            <div type="dangger" v-if="row.Status=='2'">拒绝</div>
            <div type="dangger" v-if="row.Status=='3'">已发放</div>
            <div type="dangger" v-if="row.Status=='4'">已归还</div>
            <div type="dangger" v-if="row.Status=='5'">报废</div>

          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == '0'">
              <el-button type="text" size="small" @click="edit(scope.row)"><img src="../../../assets/images/edit.png" style="vertical-align:middle" alt />编辑</el-button>
              <!-- <span class="line"></span>
              <el-button type="text" @click="open(scope.row)">删除</el-button>
              <span class="line"></span>
              <el-button type="text">提交</el-button> -->
              <!-- <span class="line"></span>
               <el-button type="text" >
                复制
              </el-button>-->
            </div>
            <div v-if="scope.row.Status == '1'">
              <el-button type="text" size="small" style="margin-left: 0;" @click='opensee(scope.row.Id)'><img src="../../../assets/images/look.png" style="vertical-align:middle" alt />查看</el-button>
               <span class="line"></span>
               <el-button type="text" size="small" @click="edit(scope.row.Id)"><img src="../../../assets/images/edit.png" style="vertical-align:middle" alt />编辑</el-button>
              <!-- <span class="line"></span>
              <el-button type="text">撤回</el-button> -->
              <!-- <span class="line"></span>
              <el-button type="text" >复制</el-button>-->
            </div>
            <div v-if="scope.row.Status == '2'">
              <el-button type="text" size="small" style="margin-left: 0;" @click='opensee(scope.row.Id)'><img src="../../../assets/images/look.png" style="vertical-align:middle" alt />查看</el-button>
              <!-- <span class="line"></span>
              <el-button type="text" @click="open(scope.row)">删除</el-button> -->
            </div>
            <div v-if="scope.row.Status == '3'">
              <el-button type="text" size="small" style="margin-left: 0;" @click='opensee(scope.row.Id)'><img src="../../../assets/images/look.png" style="vertical-align:middle" alt />查看</el-button>
           
            </div>
            <div v-if="scope.row.Status == '4'">
              <el-button type="text" size="small" style="margin-left: 0;" @click='opensee(scope.row.Id)'><img src="../../../assets/images/look.png" style="vertical-align:middle" alt />查看</el-button>
            
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
      :seeData='seeData'
      @closeMask="closeMask"
      @addMateria="addMateria"
    ></Dialog>
    <!-- <See
      :visible="showck"
      :typeList="typeList"
      :type="formType"
      :form='form'
      @closeMask="closeMask"
    ></See> -->
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
import Dialog from "./dialog/addapply.vue";
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
      showck:false,
      typeList: [],
      formData: {},
      form:{},
      seeData:{},
      formType: "1",
      process: ["Add", "check"],
      checkData: -1,
      lastData: [],
      keyWord: "",
      tableData: [],
      checkList: [
        {
          title: "全部",
          Status: "-1",
        },
        {
          title: "待审核",
          Status: 0,
        },
        {
          title: "待发放",
          Status: 1,
        },
        {
          title: "拒绝",
          Status: 2,
        },
        {
          title: "已发放",
          Status: 3,
        },
        {
          title: "已归还",
          Status: 4,
        },
        {
          title: "报废",
          Status: 5,
        }
      ],
      treeData: [],
      columns: [
        {
          label: "领用单号",
          prop: "CollectNo",
        },
        {
          label: "领用部门",
          prop: "DepartmentName",
          width: "150",
        },
        {
          label: "领用员工",
          prop: "StaffName",
        },
        {
          label: "领用日期",
          prop: "CollectDate",
          width: "150"
        },
        {
          label: "制单人员",
          prop: "VoucherName",
        },
        {
          label: "制单时间",
          prop: "VoucherTime",
        },
        // {
        //   label: "备注",
        //   prop: "Remark",
        //   width: "150",
        // },
      ],
    };
  },
  async created() {
    await this.getTableData();
  },
  computed: {
    ...mapGetters([
      "AssetCollectionGetList", //表结构
      "AssetCollectionSave", //新增修改
      "AssetCollectionUpdateStatus", //删除
      "AssetCollectionGetByID",//查看
    ]),
  },
  watch: {
    AssetCollectionGetByID(newValue, oldValue) {
      if (newValue.Code === 0) {
        // console.log(newValue)
        this.seeData = newValue.ReturnData.Data;
        this.seeData.StaffId=this.seeData.StaffId
        console.log(this.seeData,this.seeData.StaffId)
      } else {
        // 失败
      }
    },
    AssetCollectionGetList(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    async AssetCollectionUpdateStatus(newValue, oldValue) {
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
    async AssetCollectionSave(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
        await this.getTableData();
        this.formData={}
        this.seeData={}
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
    
  },
  methods: {
    //查看
    opensee(id){
      this.formType = "3"
      let json = {
        MN: "AssetCollectionGetByID",
        SN: "Assets",
        DataContent: {
          Id:id
        },
      };
      this.MIX_send(json);
      this.showMask = true;
      // this.showck = true;
    },
    //删除确定？
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
        MN: "AssetCollectionGetList",
        SN: "Assets",
        DataContent: {
          Status: this.checkData,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
        },
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria(id) {
      let json = {
        MN: "AssetCollectionUpdateStatus",
        SN: "Assets",
        DataContent: {
          Id: id,
        },
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType(data) {
      let adddatas = { ...data, isDel: 0,Status:0 };
      // console.log(adddatas)
      let json = {
        MN: "AssetCollectionSave",
        SN: "Assets",
        DataContent: adddatas,
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
      // console.log(data);
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
      let json = {
        MN: "AssetCollectionGetByID",
        SN: "Assets",
        DataContent: {
          Id:row.Id
        },
      };
      this.MIX_send(json);
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
    GetTableId(val) {
      // console.log(val.val.length - 1);
      this.form.ParentId = val[val.length - 1];
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
      this.seeData={}
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    }, 
  },
  components: {
    RightContainer,
    Dialog
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
.materiaType {
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