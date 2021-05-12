<template>
  <el-dialog
    :title="type == 1? '新增物料' : '编辑物料'"
    :visible.sync="show"
    width="460px"
    @close="cancelAdd"
    append-to-body
    center
  >
    <el-form ref="form" label-width="80px">
      <el-form-item label="物料名称" label-position="left">
        <el-select
          v-model="formData.MaterielName"
          @change="selectChange"
          filterable
          remote
          :remote-method="remoteMethod"
          placeholder="请选择或者输入物料名称"
        >
          <el-option
            v-for="(item,index) in optionList"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" label-position="left">
        <el-input placeholder="请输入物料编码" readonly v-model="formData.MaterielNo"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" label-position="left">
        <el-select v-model="formData.MaterielCategoryName" filterable placeholder="请选择所属分类">
          <el-option
            v-for="(item,index) in typeList"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最小库存" label-position="left">
        <el-input placeholder="请输入最小库存" v-model="formData.MinStock"></el-input>
      </el-form-item>
      <el-form-item label="最大库存" label-position="left">
        <el-input placeholder="请输入最大库存" v-model="formData.MaxStock"></el-input>
      </el-form-item>
      <el-form-item label="单位" label-position="left">
        <el-select v-model="formData.UnitId" @change="unitChange" filterable placeholder="请选择单位">
          <el-option
            v-for="(item,index) in unitList"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申购采购" label-position="left">
        <el-checkbox v-model="formData.IsAutoPurchase">自动申购</el-checkbox>
        <el-checkbox v-model="formData.IsforbidPurchase">禁止采购</el-checkbox>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="formData.Desc" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAdd">取 消</el-button>
      <el-button type="primary" @click="submitAdd">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "AddMateriel",
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
    type: {
      type: String,
      default: "1",
    },
    allData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      formData: {},
      show: false,
      optionList: [],
      typeList: [],
      unitList: [],
    };
  },
  computed: {
    ...mapGetters([
      "GetMaterielsByKeyWord",
      "GetMaterielCategoryTree",
      "GetUnitConvertsByMaterielId",
    ]),
  },
  watch: {
    addData(newVal, oldVal) {
      this.formData = newVal;
      this.formData.IsforbidPurchase = this.formData.IsforbidPurchase == "1";
      this.formData.IsAutoPurchase = this.formData.IsAutoPurchase == "1";
    },
    visible(newValue, oldValue) {
      this.show = newValue;
    },
    GetMaterielsByKeyWord(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.optionList = newValue.ReturnData.Data;
      }
    },
    GetMaterielCategoryTree(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.typeList = treeToArray(newValue.ReturnData, []);
      }
    },
    GetUnitConvertsByMaterielId(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.unitList = newValue.ReturnData;
      }
    },
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      let json = {
        MN: "GetMaterielCategoryTree",
        DataContent: {},
      };
      this.MIX_send(json);
    },
    remoteMethod(keyword) {
      let json = {
        MN: "GetMaterielsByKeyWord",
        DataContent: {
          CategoryId: "",
          Status: "",
          KeyWord: keyword,
          PageSize: 10,
          PageIndex: 1,
        },
      };
      this.MIX_send(json);
    },
    getUnitList(Id) {
      let json = {
        MN: "GetUnitConvertsByMaterielId",
        DataContent: {
          MaterielId: Id,
        },
      };
      this.MIX_send(json);
    },
    selectChange(Id) {
      let No = "",
        Name = "";
      this.optionList.map((item) => {
        if (item.Id == Id) {
          No = item.No;
          Name = item.Name;
        }
      });
      this.formData.MaterielId = Id;
      this.formData.MaterielNo = No;
      this.formData.MaterielName = Name;
      this.getUnitList(Id);
    },
    unitChange(Id) {
      let UnitName = "";
      this.unitList.map((item) => {
        if (item.Id == Id) {
          UnitName = item.Name;
        }
      });
      this.formData.UnitName = UnitName;
    },
    cancelAdd() {
      this.$emit("closePropMask", false);
    },
    submitAdd() {
      console.log(this.allData);
      if (this.type == 1) {
        for (let i = 0; i < this.allData.length; i++) {
          if (
            this.allData[i].MaterielName == this.formData.MaterielName.trim()
          ) {
            this.$message({
              type: "fail",
              message: "该物料已存在",
              showClose: true,
            });
            return;
          }
        }
      }
      this.formData["IsAutoPurchase"] = this.formData["IsAutoPurchase"]
        ? "1"
        : "0";
      this.formData["IsforbidPurchase"] = this.formData["IsforbidPurchase"]
        ? "1"
        : "0";
      this.$emit("dataSubmit", this.formData);
      this.formData = {
        MaterielName: "",
        MaterielNo: "",
        MaterielCategoryName: "",
        MinStock: "",
        MaxStock: "",
        UnitId: "",
        IsAutoPurchase: false,
        IsforbidPurchase: false,
        Desc: "",
      };
    },
  },
  components: {},
};
</script>
<style scoped>
.el-select {
  width: 100% !important;
}
</style>