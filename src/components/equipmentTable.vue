<template>
  <!-- 
    @closePropMask //关闭模态框
    @PopFormInit01 //关闭模态框，清空输入值
    @addMaterielTable="addTable" //接收单选框
    @addCheck="addCheck"//传递多选框数组 
    check//是否多选，1为多选,
    visible//模态框显示隐藏
    title//模态框抬头
  -->
  <el-dialog
    :visible.sync="shows"
    @close="cancelAdd"
    :title="title"
    width="73%"
    custom-class="classdialog"
    append-to-body
  >
    <div>
      <div class="filter">
        <!-- <el-select v-if="showType==true" v-model="valueType" placeholder="请选择" @change="typeCheck">
          <el-option
            v-for="(item, index) in typeOptionList"
            :key="index"
            :label="item.title"
            :value="item.statu"
          >{{item.title}}</el-option>
        </el-select>-->
        <el-cascader
          if="typeList!=''"
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
        :data="typeNewList"  ref="multipleTable"
        :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
        style="width: 100%; height:400px;overflow:scroll;"
        tooltip-effect="dark"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="check==1" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="DeviceNum" label="设备编号"></el-table-column>
        <el-table-column align="center" prop="DeviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="TypeName" label="设备分类"></el-table-column>
        <el-table-column align="center" prop="BrandName" label="品牌"></el-table-column>
        <el-table-column align="center" prop="SupplierName" label="供应商"></el-table-column>
        <el-table-column align="center" prop="OnlineTIme" label="初始使用时间"></el-table-column>
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
    //模态框抬头
    title: {
      type: String,
    },
    //模态框显示隐藏
    visible: {
      type: Boolean,
      default: false,
    },
    //是否多选，1为多选,
    check: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapGetters([
      "GetMaterielsByKeyWord",
      "GetMateriels",
      "DeviceInfoGetList",
      "DeviceTypeGetListTree",
    ]),
  },
  data() {
    return {
      selectOptionList: [
        {
          title: "全部",
          statu: -1,
        },
        {
          title: "启用",
          statu: 0,
        },
        {
          title: "禁用",
          statu: 1,
        },
      ],
      typeVal: 0,
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
      typeList: [],
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
      valueSelect: 0,
      searchKey: "",
      show: false,
      formData: {},
      shows: false,
      loading: false,
      optionList: [],
      materielTable: [],
      typeNewList: [],
      keyWord: "",
      multipleSelection: [],
    };
  },
  watch: {
    DeviceTypeGetListTree(newVal, oldVal) {
      this.typeList = newVal.ReturnData.Data;
      let obj = {
        Id: 0,
        IsDel: 0,
        Name: "全部",
      };
      this.typeList.unshift(obj);
      console.log(this.typeList);
    },
    DeviceInfoGetList(newVal, oldVal) {
      this.typeNewList = newVal.ReturnData.Data;
      console.log(this.typeNewList);
    },
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
    //=================设备测试
    // gettest() {
    //   let json = {
    //     MN: "DeviceInfoGetList",
    //     SN: "DeviceManage",
    //     DataContent: {
    //       TypeId: 0,
    //       KeyWord: "",
    //       PageSize: 10,
    //       PageIndex: 1,
    //       IsDel: -1,
    //     },
    //   };
    //   this.MIX_send(json);
    // },
    //=================测试结束
    //获取分类树
    getDeviceTypeGetListTree() {
      let json = {
        MN: "DeviceTypeGetListTree",
        SN: "DeviceManage",
        DataContent: {},
      };
      this.MIX_send(json);
    },
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
        MN: "DeviceInfoGetList",
        SN: "DeviceManage",
        DataContent: {
          TypeId: this.typeVal,
          KeyWord: this.keyWord,
          PageSize: 100,
          PageIndex: 1,
          IsDel: this.Status,
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
      this.$refs.multipleTable.clearSelection();
      this.shows = false;
      console.log(this.multipleSelection)
    },
    handleInputChange(val) {
      this.keyWord = val;
      this.getTableData();
    },
    addTable(row) {
      this.$emit("addMaterielTable", row);
      this.shows = false;
    },
    cancelAdd() {
      this.$emit("closePropMask", false);
    },
  },
  created() {
    this.getTableData();
    this.getDeviceTypeGetListTree();
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