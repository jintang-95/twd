<template>
  <el-dialog
    custom-class="classdialog"
    :title="type == 1? '新增扩展属性' : '编辑扩展属性'"
    :visible.sync="show"
    width="460px"
    append-to-body
  >
    <el-form ref="form" label-width="80px" label-position="left">
      <el-form-item label="属性名" label-position="left">
        <el-input placeholder="请输入属性名" v-model="formData.Name"></el-input>
      </el-form-item>
      <el-form-item label="属性值" label-position="left">
        <el-input placeholder="请输入属性值" v-model="formData.Value"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="formData.Remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"  style="  margin-left: 12.1rem;" class="dialog-footer">
      <button
        @click="cancelAdd"
        style="width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;outline: none;"
      >取 消</button>
      <button
        type="primary"
        style="width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;outline: none;"
        @click="submitAdd"
      >确 定</button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "extendAttr",
  props: {
    addData: {
      type: Object,
      default() {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default: [],
    },
    type: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      formData: {},
      show: false,
    };
  },
  watch: {
    addData(newVal, oldVal) {
      this.formData = newVal;
    },
    visible(newValue, oldValue) {
      this.show = newValue;
    },
  },
  methods: {
    cancelAdd() {
      this.$emit("closePropMask", false);
    },
    submitAdd() {
      this.$emit("dataSubmit", this.formData);
      this.formData = {
        Name: "",
        Value: "",
        Remark: "",
      };
    },
  },
};
</script>
<style scoped>
</style>