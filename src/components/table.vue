<template>
  <el-dialog
    :visible.sync="shows"
    @close="cancelAdd"
    title="入库物料新增"
    width="73%"
    custom-class="classdialog"
    append-to-body
  >
    <div>
      <div class="filter">
        <!-- <el-select v-model="valueSelect" placeholder="请选择" @change="typeChange">
          <el-option
            v-for="(item, index) in selectOptionList"
            :key="index"
            :label="item.title"
            :value="item.statu"
          >{{item.title}}</el-option>
        </el-select>-->
        <el-select v-if="showType==true" v-model="valueType" placeholder="请选择" @change="typeCheck">
          <el-option
            v-for="(item, index) in typeOptionList"
            :key="index"
            :label="item.title"
            :value="item.statu"
          >{{item.title}}</el-option>
        </el-select>
        <el-cascader
          placeholder="请选择所属分类"
          v-model="typeVal"
          :options="typeList"
          :props="optionProps"
          filterable
          clearable
          @change="typeChange"
        ></el-cascader>
        <el-select v-model="valueSelect" placeholder="请选择" @change="handleConditionChange">
          <el-option
            v-for="(item, index) in selectOptionList"
            :key="index"
            :label="item.title"
            :value="item.statu"
          >{{item.title}}</el-option>
        </el-select>
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
      <el-table
        :data="materielTable"
        :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
        style="width: 100%; height:400px;overflow:scroll;"
        tooltip-effect="dark"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="check==1" type="selection" width="55"></el-table-column>
        <el-table-column v-if="typeNum==1" align="center" prop="No" label="物料编号"></el-table-column>
        <el-table-column v-else-if="typeNum==2" align="center" prop="No" label="备件编号"></el-table-column>
        <el-table-column v-else-if="typeNum==3" align="center" prop="No" label="工具编号"></el-table-column>
        <el-table-column align="center" prop="CategoryName" label="所属分类"></el-table-column>
        <el-table-column v-if="typeNum==1" align="center" prop="Name" label="物料名称"></el-table-column>
        <el-table-column v-else-if="typeNum==2" align="center" prop="Name" label="备件名称"></el-table-column>
        <el-table-column v-else-if="typeNum==3" align="center" prop="Name" label="工具名称"></el-table-column>
        <el-table-column align="center" prop="BrandName" label="品牌"></el-table-column>
        <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
        <el-table-column align="center" prop="Model" label="型号"></el-table-column>
        <el-table-column align="center" prop="ValidityTime" label="有效期"></el-table-column>
        <el-table-column align="center" prop="UnitName" label="标准单位"></el-table-column>
        <el-table-column align="center" prop="Status" label="状态"></el-table-column>
        <el-table-column align="center" v-if="check==2" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="operationTtn" @click="addTable(scope.row)">
              <span>选 择</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer">
        <button
          style=" outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
          @click="PopFormInit01"
        >返 回</button>
        <button
          v-if="check==1"
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
    //选择状态数组
    selectOptionList: {
      type: Array,
    },
    //是否显示物料工具备件下拉框选择
    showType: {
      type: Boolean,
      default: false,
    },
    addData: {
      type: Object,
      default() {
        return {};
      },
    },
    //模态框显示隐藏
    visible: {
      type: Boolean,
      default: false,
    },
    //物料属性
    typeNum: {
      type: Number,
      default: 1,
    },
    //物料选择列表
    typeList: {
      type: Array,
    },
    //是否多选，1为多选,
    check: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapGetters(["GetMaterielsByKeyWord", "GetMateriels"]),
  },
  data() {
    return {
      typeVal: "",
      typeOptionList: [
        {
          title: "物料",
          statu: 1,
        },
        {
          title: "备件",
          statu: 2,
        },
        {
          title: "工具",
          statu: 3,
        },
      ],
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
      valueType: "",
      Status: "",
      valueSelect: "",
      searchKey: "",
      show: false,
      formData: {},
      shows: false,
      loading: false,
      optionList: [],
      materielTable: [],
      keyWord: "",
      multipleSelection: [],
    };
  },
  watch: {
    typeNum(newValue, oldValue) {
      console.log(newValue);
    },
    GetMateriels(newValue, oldValue) {
      this.materielTable = JSON.parse(JSON.stringify(newValue.ReturnData.Data));
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
    //SType属性改变事件
    typeCheck() {
      this.getTableData();
    },
    //分类改变事件
    typeChange() {
      this.getTableData();
    },
    handleConditionChange() {
      this.Status = this.valueSelect;
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取获取物料
    getTableData() {
      let json = {
        MN: "GetMateriels",
        SN: "Materiel",
        DataContent: {
          CategoryId: this.typeVal,
          Status: this.Status,
          KeyWord: this.keyWord,
          PageSize: 9999,
          PageIndex: 1,
          SType: this.valueType,
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
      this.$emit("addCheck", this.multipleSelection);
      this.multipleSelection = [];
      this.shows = false;
    },
    handleInputChange(val) {
      this.keyWord = val;
      this.getTableData();
    },
    addTable(row) {
      // row.disabled=true
    //   for (let index = 0; index < this.materielTable.length; index++) {
    //     const element = this.materielTable[index];
    //     if (element.Name == row.Name) {
    //       this.materielTable.splice(index, 1);
    //     }
    //   }
      this.$emit("addMaterielTable", row);
      this.shows = false;
    },
    cancelAdd() {
      this.$emit("closePropMask", false);
    },
    submitAdd() {
      this.$emit("dataSubmit", this.formData);
    },
  },
  created() {
    this.valueType = this.typeNum;
    this.getTableData();
    console.log(this.valueType)
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
.operationTtn span {
  color: #0060a0;
  font-size: 14px;
  vertical-align: middle;
}
.operationTtn img {
  width: 14px;
  vertical-align: middle;
}
.filter {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.search {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
}
.el-cascader {
  margin-right: 20px;
  margin-left: 20px;
}
</style>