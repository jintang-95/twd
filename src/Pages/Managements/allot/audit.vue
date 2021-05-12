<!-- 物料审核管理 -->
<template>
  <div class="materiaType">
    <ChooseShow :menus="[]" @GetTableId="GetTableId" title="全部仓库">
      <div class="process" slot="operation">
        <div>
          <!-- <el-button type="primary" @click="addEvent">新增</el-button> -->
        </div>
        <div class="filter">
          <!-- <el-checkbox-group
            v-model="checkData"
            @change="handleConditionChange"
            class="checkMargin"
          >
            <el-checkbox
              v-for="(item, index) in checkList"
              :key="index"
              :label="item.statu"
            >{{item.title}}</el-checkbox>
          </el-checkbox-group>-->
          <div class="search">
            <el-input
              placeholder="请输入内容"
              suffix-icon="el-icon-search"
              v-model="searchKey"
              @change="handleInputChange"
            ></el-input>
            <el-button icon="el-icon-refresh" size="small" class="refresh" @click="refreshPage"></el-button>
          </div>
        </div>
      </div>
      <div slot="table">
        <el-table :data="tabledata" fit :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}">
          <template v-for="(item,index) in columns">
            <el-table-column
              v-if="item.title=='状态'"
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            >
              <template slot-scope="{row}">
                <div class="success" v-if="row.Status=='审批通过'">
                  <img src="../../../assets/images/img/green.png" alt /> 审批通过
                </div>
                <div class="success" v-if="row.Status=='待审核'">
                  <img src="../../../assets/images/img/green.png" alt /> 待审核
                </div>
                <div class="danger" v-if="row.Status=='审批不通过'">
                  <img src="../../../assets/images/img/red.png" alt /> 审批不通过
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.title=='操作'"
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.Status=='挂单'"
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="check(scope.row)"
                >
                  <img src="../../../assets/images/edit_icon.png" alt />
                  <span>编辑</span>
                </el-button>
                <el-button
                  v-if="scope.row.Status=='挂单'"
                  type="text"
                  size="small"
                  @click="deletes(scope.row)"
                  class="operationTtn"
                >
                  <img src="../../../assets/images/del_icon.png" alt />
                  <span>删除</span>
                </el-button>
                <el-button
                  v-else
                  type="text"
                  size="small"
                  class="operationTtn"
                  @click="check(scope.row,true)"
                >
                  <img src="../../../assets/images/look.png" alt />
                  <span>查看</span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :label="item.title"
              :prop="item.key"
              align="center"
            ></el-table-column>
          </template>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          align="right"
          class="pagination"
        ></el-pagination>
      </div>
    </ChooseShow>

    <el-dialog
      class="ModalForm"
      :destroy-on-close="true"
      width="50%"
      :visible.sync="modal12"
      scrollabel
      title="新增入库物料上架单"
    >
      <PopForm
        ref="PopForm"
        @addbtn="addbtn"
        :fromData="fromData"
        :disabled="disabled"
        class="PopForm"
      >
        <div slot="tabPane0">
          <el-table size="small" :data="tabledata01" :header-cell-style="{background: '#DCDFE6'}">
            <template v-for="(item,index) in fromData.tabPane[0].columns">
              <el-table-column
                v-if="item.title=='操作'"
                :label="item.title"
                :prop="item.key"
                align="center"
                fixed="right"
                width="100"
                :key="index"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="disabled"
                    type="text"
                    size="small"
                    @click="EditMateriels(scope.row)"
                  >查看</el-button>
                  <template v-else>
                    <el-button type="text" size="small" @click="EditMateriels(scope.row)">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :show-overflow-tooltip="true"
                :label="item.title"
                :prop="item.key"
                align="center"
                :key="index"
              ></el-table-column>
            </template>
          </el-table>
        </div>
      </PopForm>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="disabled" style="font-size:12px" type="primary">挂 单</el-button>
        <el-button :disabled="disabled" style="font-size:12px" type="primary" @click="Commit">提 交</el-button>
        <el-button style="font-size:12px" @click="PopFormInit">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :destroy-on-close="true"
      class="ModalForm"
      width="460px"
      :visible.sync="modal13"
      scrollabel
      title="上架物料新增"
    >
      <PopForm ref="PopForm01" :fromData="fromData01" :disabled="disabled" :flex="false">
        <el-select
          slot="selectremote"
          v-model="remotevalue"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="remoteloading"
        >
          <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </PopForm>
      <div class="dialog-footer">
        <el-button
          :disabled="disabled"
          style="font-size:12px"
          type="primary"
          @click="AddMateriels"
        >确 定</el-button>
        <el-button style="font-size:12px" @click="PopFormInit01">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="ModalForm"
      width="75%"
      :visible.sync="seeShow"
      :close-on-click-modal="true"
      scrollabel
      :destroy-on-close="true"
      title="查看物料调拨申请单"
    >
      <seeTable
        :seeMsg="seeMsg"
        @addbtn="addbtn"
        :fromData="fromData"
        :columns="seeColumns"
        :aType="2"
      >
        <div slot="tabPane0">
          <el-table
            size="small"
            fit
            :data="tabledata01"
            :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
          >
            <template v-for="(item,index) in fromData.tabPane[0].columns">
              <el-table-column
                :show-overflow-tooltip="true"
                :label="item.title"
                :prop="item.key"
                align="center"
                :key="index"
              ></el-table-column>
            </template>
          </el-table>
        </div>
      </seeTable>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import seeTable from "./dialog/apply";
import PopForm from "@/components/PopForm";
import ChooseShow from "@/components/ChooseShow";
import fromdata from "@/const/index";
import show01 from "@/const/chooseshow";
export default {
  name: "",
  data() {
    return {
      seeColumns: [
        {
          title: "申领单号",
          key: "No",
        },
        {
          title: "申领人",
          key: "CreatedUserName",
        },
        {
          title: "所属部门",
          key: "Dept",
        },
        {
          title: "仓库",
          key: "InWarehouseName",
        },
        {
          title: "当前岗位",
          key: "Station",
        },
        {
          title: "开始时间",
          key: "CreatedTime",
        },
        {
          title: "结束时间",
          key: "DelTime",
        },
        {
          title: "申领原因",
          key: "Reason",
        },
        {
          title: "状态",
          key: "Status",
        },
      ],
      seeMsg: null,
      seeShow: false,
      disabled: false,
      remotevalue: "",
      options: [],
      remoteloading: false,
      drawerloading: true,
      direction: false,
      checkData: [],
      searchKey: "",
      Id: "1",
      units: {},
      unitsId: 1,
      Type: ["采购收货", "调拨入库", "退仓入库", "其他入库"],
      modal12: false,
      modal13: false,
      fromData: {},
      currentPage: 1,
      pageSize: 10,
      total: 50,
      tabledata: [],
      tabledata01: [],
      columns: [],
      Status: ["草稿", "待审核", "审批通过", "审批不通过"],
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
    };
  },
  computed: {
    ...mapGetters([
      "getApplys",
      "Materiels",
      "UnitConvertsByMaterielId",
      "removeApply",
      "saveInShelf",
    ]),
  },
  components: {
    PopForm,
    ChooseShow,
    seeTable,
  },
  watch: {
    getApplys: function (newval, oldval) {
      this.total = newval.ReturnData.DataCount;
      if (
        newval.ReturnData &&
        newval.ReturnData.Data &&
        newval.ReturnData.Data.length > 0
      ) {
        newval.ReturnData.Data.forEach((element) => {
          for (const key in element) {
            if (key == "Type") {
              element.Type = this.Type[element.Type];
            }
            if (key == "Status") {
              element.Status = this.Status[element.Status];
            }
          }
        });
        this.tabledata = newval.ReturnData.Data;
      } else {
        this.tabledata = [];
      }
    },
    Materiels: function (newval, oldval) {
      this.remoteloading = false;
      this.options = newval.ReturnData.Data;
    },
    UnitConvertsByMaterielId: function (newval, oldval) {
      if (newval && newval.ReturnData && newval.ReturnData.length > 0) {
        newval.ReturnData.forEach((element) => {
          element.value = element.Id;
          element.label = element.Name;
        });
      }
      this.$refs.PopForm01.Changeoptions(newval.ReturnData, 3);
    },
    remotevalue: function (newval, oldval) {
      if (newval !== "") {
        this.GetUnitConvertsByMaterielId(newval);
      }
    },
    removeApply: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.GetApplys();
      } else {
        this.$message({
          type: "error",
          message: "删除失败",
        });
      }
    },
    saveInShelf: function (newval, oldval) {
      if (newval.Code == 0) {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.GetApplys();
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
        });
      }
    },
  },
  methods: {
    // 物料编辑
    EditMateriels(val) {
      let PopFormdata = JSON.parse(JSON.stringify(this.$refs.PopForm01.value));
      for (const key in PopFormdata) {
        if (key == "MaterielId") {
          this.remotevalue = val.Id;
        } else {
          PopFormdata[key] = val[key] || "";
        }
      }
      this.$refs.PopForm01.value = PopFormdata;
      this.modal13 = true;
    },
    // select远程搜索回调
    remoteMethod(query) {
      if (query !== "") {
        this.remoteloading = true;
        this.GetMateriels(query);
      } else {
        this.options = [];
      }
    },
    // ==========表格===============
    // 上一页
    handlePrevClick(val) {
      this.currentPage = val;
      if (val < 1) {
        this.currentPage = 1;
      }

      this.GetApplys();
    },
    // 下一页
    handleNextClick(val) {
      this.currentPage = val;
      if (val > this.total) {
        this.currentPage = this.total;
      }
      this.GetApplys();
    },
    // 当前页改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.GetApplys();
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetApplys();
    },
    // 筛选框value发生改变的回调
    handleInputChange(val) {
      this.searchKey = val;
      this.GetApplys();
    },
    // 新增入库单
    addEvent() {
      this.disabled = false;
      this.modal12 = true;
    },
    // 多选框回调
    handleConditionChange(val) {
      this.checkData = val;
      this.GetApplys();
    },
    // 刷新
    refreshPage() {
      this.GetApplys();
    },
    // 新增入库物料
    addbtn(e) {
      this.modal13 = true;
      // this.GetMateriels();
    },
    // 表格删除事件的回调
    deletes(val) {
      this.$confirm("此操作将永久删除" + val.No + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.RemoveApply(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 表格查看事件的回调
    check(val) {
      this.seeShow = true;
      this.seeMsg = [val];
    },
    // check(val, disabled = false) {
    //   this.modal12 = true;
    //   setTimeout(() => {
    //     let value = this.$refs.PopForm.value;
    //     this.disabled = disabled;
    //     let obj = {};
    //     for (
    //       let index = 0;
    //       index < this.fromData.fromComponent.length;
    //       index++
    //     ) {
    //       const element = this.fromData.fromComponent[index].key;
    //       obj[element] = val[element] || "";
    //     }
    //     obj.Id = val.Id;
    //     this.$refs.PopForm.value = obj;
    //   });
    // },
    // 左侧导航栏事件的回调
    GetTableId(val) {
      this.Id = val.Id;
      this.GetApplys();
    },
    // 弹出框表单提交
    Commit() {
      this.$refs.PopForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let value = JSON.parse(JSON.stringify(this.$refs.PopForm.value));
          value.InStockDetail = this.tabledata01;
          value.TableType = 1;
          this.SaveInShelf(value);
          this.PopFormInit();
        } else {
          return false;
        }
      });
    },
    // 弹出框表单初始化
    PopFormInit() {
      this.tabledata01 = [];
      this.$refs.PopForm.$refs.ruleForm.resetFields();
      this.modal12 = false;
    },
    PopFormInit01() {
      this.remotevalue = "";
      this.$refs.PopForm.$refs.ruleForm.resetFields();
      this.modal13 = false;
    },
    // 新增物料提交
    AddMateriels() {
      let exist = false;
      this.tabledata01.forEach((element) => {
        if (element.Id == this.remotevalue) {
          exist = true;
        }
      });
      if (exist) {
        this.$message.error("提交失败，该物料已添加请重新选择");
      } else {
        let element = this.$refs.PopForm01.value;
        let obj = {
          Id: element.Id || this.remotevalue || "",
          No: element.No || "",
          Name: element.Name || "",
          Spec: element.Spec || "",
          Model: element.Model || "",
          Batch: element.Batch || "",
          Number: element.Number || "",
          UnitId: element.UnitId || "",
          Price: element.Price || "",
          Amount: element.Amount || 0,
          Remark: element.Remark || "",
        };
        for (let index = 0; index < this.options.length; index++) {
          const element = this.options[index];
          if (element.Id == this.remotevalue) {
            obj.No = element.No;
            obj.Name = element.Name;
            obj.Spec = element.Spec;
            obj.Model = element.Model;
          }
        }
        this.tabledata01.push(obj);
        this.PopFormInit01();
      }
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    },
    // 获取仓储表格数据
    GetApplys() {
      let json = {
        MN: "GetApplys",
        SN: "Apply",
        DataContent: {
          KeyWord: this.searchKey,
          PageSize: this.pageSize,
          PageIndex: this.currentPage,
          TableType: 1,
          Status: this.checkData.join(","),
        },
      };
      this.MIX_send(json);
    },
    // 获取所有物料
    GetMateriels(val) {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: 0,
          Status: "",
          KeyWord: val,
          PageSize: 10,
          PageIndex: 1,
        },
      };
      this.MIX_send(json);
    },
    // 根据id获取单位
    GetUnitConvertsByMaterielId(val) {
      let json = {
        MN: "GetUnitConvertsByMaterielId",
        SN: "Materiel",
        DataContent: {
          MaterielId: val,
        },
      };
      this.unitsId = val;
      if (!this.units[val]) {
        this.MIX_send(json);
      }
    },
    // 删除入库单
    RemoveApply(val) {
      let json = {
        MN: "RemoveApply",
        SN: "Apply",
        DataContent: {
          Ids: val.Id,
        },
      };
      this.MIX_send(json);
    },
    // 保存/提交入库单
    SaveInShelf(obj) {
      let json = {
        MN: "SaveInShelf",
        SN: "InStock",
        DataContent: obj,
      };
      this.MIX_send(json);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.fromData = fromdata.fromdata03;
    this.fromData01 = fromdata.fromdata01;
    this.columns = show01().columns02;
    this.GetApplys();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.dialog-footer {
  margin-top: 15px;
  text-align: right;
}
.process {
  height: 56px;
  line-height: 56px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.checkMargin {
  margin-right: 20px;
}
.filter {
  display: flex;
}
.search {
  display: flex;
  flex-direction: row;
}
.refresh {
  height: 40px;
  padding: 0;
  width: 40px;
  margin-top: 8px;
  margin-left: 10px;
}
.pagination {
  margin-top: 40px;
  padding-right: 20px;
}
.PopForm {
  height: 51vh;
  overflow-y: auto;
}
.PopForm::-webkit-scrollbar {
  width: 4px;
}
.PopForm::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.PopForm::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
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
</style>