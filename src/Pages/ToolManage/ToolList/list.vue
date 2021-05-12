<template>
  <div class="materiaType">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="name">工具清单</span>
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
      :page="page"
      :pageSize="pageSize"
      :total="total"
      :checkList="checkList"
      :process="process"
      :menuList="treeData"
      title="全部工具"
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
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.Status == '启用'">
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
            </div>
            <div v-if="scope.row.Status == '停用'">
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
                <img src="../../../assets/images/stop_icon.png" alt />
                <span>启用</span>
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
              <!-- <el-popconfirm
                  icon="el-icon-info"
                  iconColor="red"
                  title="确定清除吗？"
                  @onConfirm="clear(scope.row)"
                >
                  <el-button slot="reference" type="text" class="operationTtn" size="small">
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
    <Archives
      :visible="showMask"
      :manageStyle="manageStyle"
      :brands="brands"
      :wareHouse="wareHouse"
      :typeList="typeList"
      :type="formType"
      :formData="formData"
      @closeMask="closeMask"
      @addMateria="addMateria"
      :SType="3"
    ></Archives>
  </div>
</template>

<script>
import RightContainer from "@/components/rightContainer.vue";
// import Archives from "@/components/archives/archives.vue";
import Archives from "./dialog/archives.vue";
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "materielArchives", //物料档案
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      formData: {
        No: "",
        Name: "",
        Desc: "",
        CategoryId: "",
        IsReplaceMateriel: "",
        IsTool: "",
        IsAssets: "",
        StandardUnitId: "",
        DefaultWarehouseId: "",
        Grade: "",
        BrandId: "",
        DefaultSupplierId: "", //默认供应商
        ManageStyle: "",
        Spec: "",
        Model: "",
        ValidityTime: "",
        ValidityTimeUnit: "",
        Status: "",
        ReplaceMaterielDetail: [],
        UnitConvertDetail: [],
        MaterielBOMDetail: [],
        OperationStandardDetail: [],
        ExPropertyDetail: [],
        MaterielImageDetail: [],
      },
      editForm: {},
      wareHouse: [], //默认仓库列表
      brands: [], //品牌列表,
      manageStyle: [
        {
          Id: "1",
          Name: "备件管理",
        },
        {
          Id: "2",
          Name: "工具管理",
        },
      ], //管理方式
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
        // {
        //   label: "状态",
        //   prop: "Status",
        // },
        {
          label: "编码",
          prop: "No",
        },
        {
          label: "所属分类",
          prop: "CategoryName",
          width: "100",
        },
        {
          label: "名称",
          prop: "Name",
        },
        {
          label: "品牌",
          prop: "BrandName",
        },
        {
          label: "规格",
          prop: "Spec",
        },
        {
          label: "型号",
          prop: "Model",
        },
        {
          label: "有效期",
          prop: "ValidityTime",
        },
        {
          label: "标准单位",
          prop: "StandardUnitId",
        },
        {
          label: "默认仓库",
          prop: "WarehouseName",
        },
      ],
    };
  },
  async created() {
    this.resetFormData();
    await this.getTreeData();
    await this.getTableData();
    await this.getDefauktWareHouse();
    this.getBrandList();
  },
  computed: {
    ...mapGetters([
      "GetMaterielCategoryTree",
      "GetMateriels",
      "UnCancelMateriel",
      "CancelMateriel",
      "RemoveMateriel",
      "SaveMateriel",
      "MaterielById",
      "GetWarehousesTree",
      "GetBrands",
      "imgUrl",
    ]),
  },
  watch: {
    GetMaterielCategoryTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        let List = JSON.parse(JSON.stringify(newValue.ReturnData));
        this.treeData = JSON.parse(JSON.stringify(List));
        this.lastData = JSON.parse(JSON.stringify(List));
        this.typeList = JSON.parse(JSON.stringify(List));
      } else {
        // 失败
      }
    },
    GetMateriels(newValue, oldValue) {
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          let unit =
            newValue.ReturnData.Data[i].ValidityTimeUnit == 0
              ? "天"
              : newValue.ReturnData.Data[i].ValidityTimeUnit == 1
              ? "月"
              : "年";
          newValue.ReturnData.Data[i].Status =
            newValue.ReturnData.Data[i].Status == 2 ? "启用" : "停用";
          newValue.ReturnData.Data[i].ValidityTime =
            newValue.ReturnData.Data[i].ValidityTime + unit;
          newValue.ReturnData.Data[i].UnitName = !newValue.ReturnData.Data[i]
            .UnitName
            ? "无"
            : newValue.ReturnData.Data[i].UnitName;
          //   newValue.ReturnData.Data[i].OperationStandard = newValue.ReturnData.Data[i].OperationStandard == 1 ? '是' : '否'
          //   newValue.ReturnData.Data[i].MaterielBOM = newValue.ReturnData.Data[i].MaterielBOM == 1 ? '是' : '否'
        }
        this.tableData = newValue.ReturnData.Data;
        this.total = newValue.ReturnData.DataCount;
      } else {
        // 失败
      }
    },
    UnCancelMateriel(newValue, oldValue) {
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
    CancelMateriel(newValue, oldValue) {
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
    async RemoveMateriel(newValue, oldValue) {
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
    async SaveMateriel(newValue, oldValue) {
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
    MaterielById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData;
        console.log(this.editForm["MaterielImageDetail"]);
        this.editForm["MaterielImageDetail"] = this.editForm[
          "MaterielImageDetail"
        ].map((item) => {
          item["url"] = this.imgUrl + item.Address;
          // item['uid'] = new Date().getTime()
          return item;
        });
        console.log(this.editForm["MaterielImageDetail"]);
        this.openEdit();
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "获取数据失败",
          type: "fail",
        });
      }
    },
    GetWarehousesTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.wareHouse = JSON.parse(JSON.stringify(newValue.ReturnData));
        let obj = {
          Id: "0",
          Name: "无",
        };
        this.wareHouse.unshift(obj);
        console.log(this.wareHouse);
      } else {
        // 失败
      }
    },
    GetBrands(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.brands = newValue.ReturnData.Data;
      } else {
        // 失败
      }
    },
  },
  methods: {
    selectType(data) {
      this.currentId = data;
      this.page = 1;
      this.treeData = [];
      this.treeData = this.lastData;
      this.getTableData();
    },
    // 获取默认仓库数据
    getDefauktWareHouse() {
      let json = {
        MN: "GetWarehousesTree",
        SN: "Warehouse",
        DataContent: {
          Id: "",
          KeyWord: "",
          PageSize: 100,
          PageIndex: 1,
          Status: "",
        },
      };
      this.MIX_send(json);
    },
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
    // 通过Id获取数据
    getMaterielById(Id) {
      let json = {
        MN: "GetMaterielById",
        SN: "Materiel",
        DataContent: {
          Id: Id,
        },
      };
      this.MIX_send(json);
    },
    // 获取树形结构数据
    getTreeData() {
      let json = {
        MN: "GetMaterielCategoryTree",
        SN: "Materiel",
        DataContent: {
          SType: "3",
        },
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: this.currentId,
          Status: this.checkData,
          KeyWord: this.keyWord,
          PageSize: this.pageSize,
          PageIndex: this.page,
          SType: 3,
        },
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria(id) {
      let json = {
        MN: "CancelMateriel",
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
        MN: "UnCancelMateriel",
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
        MN: "RemoveMateriel",
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
        MN: "SaveMateriel",
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
    /**
     * 表格处理函数
     * */
    // 编辑
    edit(row) {
      this.formType = "2";
      this.formData = {
        No: row.No,
        Name: row.Name,
        Desc: row.Desc,
        CategoryId: row.CategoryId,
        IsReplaceMateriel: row.IsReplaceMateriel == "1",
        IsTool: row.IsTool == "1",
        IsAssets: row.IsAssets == "1",
        StandardUnitId: row.StandardUnitId,
        DefaultWarehouseId: row.DefaultWarehouseId,
        Grade: row.Grade,
        BrandId: row.BrandId,
        DefaultSupplierId: row.DefaultSupplierId, //默认供应商
        ManageStyle: row.ManageStyle,
        Spec: row.Spec,
        Model: row.Model,
        ValidityTime: row.ValidityTime.substring(
          0,
          row.ValidityTime.length - 1
        ),
        ValidityTimeUnit: row.ValidityTimeUnit,
        Id: row.Id,
        SType: 3,
      };
      this.getMaterielById(row.Id);
    },
    openEdit() {
      // this.formData[
      //   "ReplaceMaterielDetail"
      // ] = this.editForm.ReplaceMaterielDetail;
      //console.log(this.editForm.ReplaceMaterielDetail)
      if (this.editForm.ReplaceMaterielDetail.length != 0) {
        this.formData["ReplaceMaterielDetail"] = [
          {
            Id: this.editForm.ReplaceMaterielDetail[0].ParentId,
            Name: this.editForm.ReplaceMaterielDetail[0].MaterielName,
            No: this.editForm.ReplaceMaterielDetail[0].MaterielNo,
            Spec: this.editForm.ReplaceMaterielDetail[0].MaterielSpec,
            Model: this.editForm.ReplaceMaterielDetail[0].MaterielModel,
          },
        ];
      }
      this.formData["UnitConvertDetail"] = this.editForm.UnitConvertDetail;
      this.formData["MaterielImageDetail"] = this.editForm.MaterielImageDetail;
      this.formData["MaterielBOMDetail"] = this.editForm.MaterielBOMDetail;
      this.formData[
        "OperationStandardDetail"
      ] = this.editForm.OperationStandardDetail;
      this.formData["ExPropertyDetail"] = this.editForm.ExPropertyDetail;
      setTimeout(() => {
        this.showMask = true;
      });
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
      this.showMask = false;
      this.resetFormData();
    },
    // 新增或者编辑
    addMateria(data) {
      this.addMateriaType(data);
    },
    resetFormData() {
      this.formData = {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        CategoryId: "",
        IsReplaceMateriel: false,
        IsTool: false,
        IsAssets: false,
        StandardUnitId: "",
        DefaultWarehouseId: "",
        Grade: "",
        BrandId: "",
        DefaultSupplierId: "", //默认供应商
        ManageStyle: "",
        Spec: "",
        Model: "",
        ValidityTime: "",
        ValidityTimeUnit: "",
        ReplaceMaterielDetail: [],
        UnitConvertDetail: [],
        MaterielBOMDetail: [],
        OperationStandardDetail: [],
        ExPropertyDetail: [],
        MaterielImageDetail: [],
      };
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
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  width: 14px;
  vertical-align: middle;
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
.box-card {
  width: 98%;
  margin: 20px auto;
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