<template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增设备' : '编辑设备'"
    :visible.sync="show"
    width="897px"
    center
  >
    <div>
      <el-form ref="form" :model="form" label-width="100px" class="formContainer">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="设备编码" label-position="left">
              <el-input v-model="form.No" placeholder="请输入设备编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" label-width="100px" label-position="left">
              <el-input v-model="form.Name" placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备分类" label-width="100px">
              <el-select v-model="form.Category" placeholder="请选择设备分类">
                <el-option
                  v-for="(item, index) in typeList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="标准单位" label-position="left">
              <el-input v-model="form.No" placeholder="请输入标准计量单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" label-width="100px">
              <el-select v-model="form.Dept" placeholder="请选择供应商">
                <el-option
                  v-for="(item, index) in organList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="等级" label-width="100px">
              <el-select v-model="form.Dept" placeholder="请选择设备等级">
                <el-option
                  v-for="(item, index) in organList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="品牌" label-width="100px">
              <el-select v-model="form.Dept" placeholder="请选择品牌">
                <el-option
                  v-for="(item, index) in organList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产商" label-width="100px">
              <el-select v-model="form.Dept" placeholder="请选择生产商">
                <el-option
                  v-for="(item, index) in organList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理方式" label-width="100px">
              <el-select v-model="form.ManageStyle" placeholder="请选择管理方式">
                <el-option
                  v-for="(item, index) in managerList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="规格" label-position="left" label-width="100px">
              <el-input v-model="form.Spec" placeholder="请输入规格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号" label-position="left" label-width="100px">
              <el-input v-model="form.Model" placeholder="请输入型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期" label-position="left" label-width="100px" class="FormItem">
              <el-input v-model="form.ValidityTime" placeholder="请输入有效期"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属物料编号" label-position="left" label-width="100px">
              <el-input v-model="form.Spec" placeholder="请输入所属物料编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属物料名称" label-position="left" label-width="100px">
              <el-input v-model="form.Model" placeholder="请输入所属物料名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产批次" label-position="left" label-width="100px" class="FormItem">
              <el-input v-model="form.ValidityTime" placeholder="请输入生产批次"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="负责部门" label-position="left" label-width="100px">
              <el-input v-model="form.Spec" placeholder="请输入负责部门"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号负责人" label-position="left" label-width="100px">
              <el-input v-model="form.Model" placeholder="请输入负责人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input type="textarea" v-model="form.Desc" placeholder="请输入资产描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="18">
              <el-form-item>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                  <el-tab-pane label="知识库" name="first">知识库</el-tab-pane>
                  <el-tab-pane label="图片库" name="second">图片库</el-tab-pane>
                  <el-tab-pane label="物料清单" name="third">物料清单</el-tab-pane>
                  <el-tab-pane label="作业标准" name="fourth">作业标准</el-tab-pane>
                  <el-tab-pane label="扩展属性" name="fifth">扩展属性</el-tab-pane>
                </el-tabs>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button type="primary">新增</el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer " >
      <el-button type="primary" @click="cancelSubmit" class="ownbutton">取 消</el-button>
      <el-button type="primary" @click="submitData" class="ownbutton">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "classify",
  data() {
    return {
      activeName: "first",
      show: false,
      organList:[],
      managerList:[],
      form: {
        No: "",
        Name: "",
        ParentId: "",
        Desc: "",
        AutoCode: "",
        UnitConvert: "",
        OperationStandard: "",
        MaterielBOM: "",
      },
    };
  },
  props: {
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
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.form = newVal;
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
    },
    submitData() {
      this.form["AutoCode"] = this.form["AutoCode"] ? "1" : "0";
      this.form["UnitConvert"] = this.form["UnitConvert"] ? "1" : "0";
      this.form["OperationStandard"] = this.form["OperationStandard"]
        ? "1"
        : "0";
      this.form["MaterielBOM"] = this.form["MaterielBOM"] ? "1" : "0";
      this.form["ParentId"] = !this.form["ParentId"]
        ? "0"
        : this.form["ParentId"];
      this.$emit("addMateria", this.form);
    },
  },
};
</script>
<style scoped lang="less">
.dialog-footer /deep/.ownbutton{
 width: 420px;
}

</style>