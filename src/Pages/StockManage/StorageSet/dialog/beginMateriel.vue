<template>
  <el-dialog
    :title="type == 1? '新增期初设置' : '编辑期初设置'"
    :visible.sync="show"
    width="460px"
    @close="cancelAdd"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
      <el-form-item label="物料名称" prop="MaterielName" label-position="left">
        <el-select
          v-model="form.MaterielName"
          @change="selectChange"
          filterable
          remote
          :remote-method="remoteMethod"
          placeholder="请输入物料名称"
        >
          <el-option
            v-for="(item,index) in optionList"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="MaterielNo" label-position="left">
        <el-input placeholder="请输入物料编码" readonly v-model="form.MaterielNo"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="MaterielSpec" label-position="left">
        <el-input placeholder="请输入规格" readonly v-model="form.MaterielSpec"></el-input>
      </el-form-item>
      <el-form-item label="型号" prop="MaterielModel" label-position="left">
        <el-input placeholder="请输入型号" readonly v-model="form.MaterielModel"></el-input>
      </el-form-item>
      <el-form-item label="所在仓库" prop="WarehouseId" label-position="left">
        <!-- <el-select v-model="form.WarehouseId" filterable placeholder="请选择所在仓库">
          <el-option
            v-for="(item,index) in typeList"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select> -->
        <el-cascader
                placeholder="请选择所在仓库"
                v-model="form.WarehouseId"
                :options="typeList"
                :props=" {
        value: 'Id',
        label: 'Name',
        children: 'ChildNodes',
        checkStrictly: true,
        expandTrigger: 'hover',
        emitPath:false,
      }"
                filterable
                clearable
                style="width:100%;"
              ></el-cascader>
      </el-form-item>
      <el-form-item label="价格" prop="Price" label-position="left">
        <el-input placeholder="请输入价格" v-model="form.Price" @input="inputChange"></el-input>
      </el-form-item>
      <el-form-item label="库存数量" prop="Stock" label-position="left">
        <el-input placeholder="请输入库存数量" v-model="form.Stock" @input="inputChange"></el-input>
      </el-form-item>
      <el-form-item label="金额"  label-position="left">
        <el-input placeholder="金额" readonly v-model="form.Amount"></el-input>
      </el-form-item>
      <!-- <el-form-item label="单位" prop="UnitId" label-position="left">
        <el-select v-model="form.UnitId" @change="unitChange" placeholder="请选择单位">
          <el-option
            v-for="(item,index) in unitList"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <button @click="cancelAdd"  style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;">取 消</button>
      <button  style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;" @click="submitAdd">确 定</button>
    </span>
  </el-dialog>
</template>

<script>
import { treeToArray } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "AddMateriel",
  props: {
    formData: {
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
    typeList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      rules: {
          MaterielName: [
            { required: true, message: '请输入物料名称', trigger: 'blur' },
          ],
          MaterielNo: [
            { required: true, message: '请输入物料编码', trigger: 'blur' },
          ],
          MaterielSpec: [
            { required: true, message: '请输入规格', trigger: 'blur' },
          ],
          StaffNaMaterielModelme: [
            { required: true, message: '请选择仓库管请输入型号理员', trigger: 'blur' },
          ],
          WarehouseId: [
            { required: true, message: '请选择所在仓库', trigger: 'blur' },
          ],
          Price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
          ],
          Stock: [
            { required: true, message: '请输入库存数量', trigger: 'blur' },
          ],
          Amount: [
            { required: true, message: '请选择单位', trigger: 'blur' },
          ],
          },
      form: {},
      show: false,
      optionList: [],
      unitList: [],
    };
  },
  computed: {
    ...mapGetters(["GetMateriels", "GetUnitConvertsByMaterielId"]),
  },
  watch: {
    formData(newVal, oldVal) {
      this.form = newVal;
      if (!!this.form.MaterielId) {
        this.getUnitList(this.form.MaterielId);
      } else {
        this.unitList = [];
      }
    },
    visible(newValue, oldValue) {
      this.show = newValue;
    },
    GetMateriels(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.optionList = newValue.ReturnData.Data;
      }
    },
    GetUnitConvertsByMaterielId(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.unitList = newValue.ReturnData;
      }
    },
  },
  created() {},
  methods: {
    remoteMethod(keyword) {
      let json = {
        MN: "GetMateriels",
        SN:"Materiel",
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
    inputChange() {
      this.form.Amount = this.form.Price * this.form.Stock;
    },
    getUnitList(Id) {
      let json = {
        MN: "GetUnitConvertsByMaterielId",
        SN: "Materiel",
        DataContent: {
          MaterielId: Id,
        },
      };
      this.MIX_send(json);
    },
    selectChange(Id) {
      let No = "",
        Name = "",
        spec = "",
        model = "";
      this.form.UnitId = "";
      this.optionList.map((item) => {
        if (item.Id == Id) {
          No = item.No;
          Name = item.Name;
          spec = item.Spec;
          model = item.Model;
        }
      });
      this.form.MaterielId = Id;
      this.form.MaterielNo = No;
      this.form.MaterielName = Name;
      this.form.MaterielSpec = spec;
      this.form.MaterielModel = model;
      this.getUnitList(Id);
    },
    unitChange(Id) {
      let UnitName = "";
      this.unitList.map((item) => {
        if (item.Id == Id) {
          UnitName = item.Name;
        }
      });
      this.form.UnitName = UnitName;
    },
    cancelAdd() {
      this.$emit("closeMask", false);
      this.$refs.form.resetFields()
      this.unitList = [];
    },
    submitAdd() {
      this.$refs.form.validate((vaild)=>{
        if(vaild){
          console.log(222)
      this.form["IsTool"] = "0";
      this.form["IsAssets"] = "0";
      this.form["IsReplaceMateriel"] = "0";
      this.form.UnitId=4
      this.$emit("addMateria", this.form);
      this.$refs.form.resetFields()
        }else{
          console.log("请输入完整")
          return false
        }
      })
      
    },
  },
  components: {},
};
</script>
<style scoped>
.el-select {
  width: 100% !important;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474 !important;
}
/deep/ .el-dialog {
  border-radius: 4px;
}
button:hover{
cursor: pointer;
}
</style>