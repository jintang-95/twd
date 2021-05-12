<template>
  <el-dialog
    :visible.sync="shows"
    @close="cancelAdd"
    :title="新增替代件"
    width="70%"
    custom-class="classdialog"
    append-to-body
  >
    <div>
      <div class="filter">
        <div class="search">
          <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="searchKey"
            @input="handleInputChange"
            @change="handleInputChange"
          ></el-input>
        </div>
      </div>
      <el-table :data="materielTable" style="width: 100%; height:400px;overflow:scroll;">
        <el-table-column align="center" prop="No" label="物料编号" width="150"></el-table-column>
        <el-table-column align="center" prop="CategoryName" label="所属分类" width="150"></el-table-column>
        <el-table-column align="center" prop="Name" label="物料名称" width="100"></el-table-column>
        <el-table-column align="center" prop="BrandName" label="品牌" width="150"></el-table-column>
        <el-table-column align="center" prop="Spec" label="规格" width="150"></el-table-column>
        <el-table-column align="center" prop="Model" label="型号" width="150"></el-table-column>
        <el-table-column align="center" prop="Name" label="物料名称" width="100"></el-table-column>
        <el-table-column align="center" prop="ValidityTime" label="有效期" width="150"></el-table-column>
        <el-table-column align="center" prop="UnitName" label="标准单位" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="operationTtn" @click="addTable(scope.row)">
              <span>添加</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer">
        <button
          style=" outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
          @click="PopFormInit01"
        >取 消</button>
        <button
          style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
          @click="AddMateriels"
        >确 定</button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "replaceProp",
  props: {
    addData: {
      type: Object,
      default() {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    typeNum: {
      type: String,
      default: "1",
    },
  },
  computed: {
    ...mapGetters(["GetMaterielsByKeyWord","GetMateriels"]),
  },
  data() {
    return {
      searchKey: "",
      show: false,
      formData: {},
      shows: false,
      loading: false,
      optionList: [],
      materielTable:[],
      keyWord:'',
    };
  },
  watch: {
    GetMateriels(newValue, oldValue) {
      console.log(111)
      console.log(newValue)
      this.materielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
    },
    addData(newVal, oldVal) {
      this.formData = newVal;
    },
    visible(newVal, oldVal) {
      this.shows = newVal;
      console.log(this.shows);
    },
    GetMaterielsByKeyWord(newVal, oldVal) {
      console.log(newVal);
      this.optionList = newVal.ReturnData.Data;
    },
  },
  methods: {
    //获取获取物料
    getTableData() {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: 0,
          Status: 2,
          KeyWord: this.keyWord,
          PageSize: 9999,
          PageIndex: 1,
          SType: this.typeNum,
        },
      };
      this.MIX_send(json);
    },
    PopFormInit01() {
      this.searchKey = "";
      this.$emit("PopFormInit01");
    },
    AddMateriels() {
      this.searchKey = "";
      this.$emit("AddMateriels");
    },
    handleInputChange(val) {
      this.keyWord=val
    },
    addTable(row) {
      // row.disabled=true
      for (let index = 0; index < this.materielTable.length; index++) {
        const element = this.materielTable[index];
        if (element.Name == row.Name) {
          this.materielTable.splice(index, 1);
        }
      }
      this.$emit("addMaterielTable", row);
    },
    cancelAdd() {
      this.$emit("closePropMask", false);
    },
    submitAdd() {
      this.$emit("dataSubmit", this.formData);
    },
  },
  created(){
    console.log(11231)
    this.getTableData()
  },
};
</script>
<style scoped>
/* .el-select {
  width: 100% !important;
} */
.dialog-footer {
  margin-top: 15px;
  text-align: right;
}
</style>