<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '新增扩展信息' : '编辑扩展信息'"
      width="460px"
      @close="cancel"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="formName" :rules="rules" label-position="left">
        <el-form-item label="类型" prop="Type" :label-width="formLabelWidth">
          <el-select
            class="select_border_bottom"
            v-model="form.Type"
            placeholder="请选择类型"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in $optiondata.StaffType"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性" prop="Attribute" :label-width="formLabelWidth">
          <el-input
            class="input_border_bottom"
            v-model="form.Attribute"
            placeholder="请输入属性"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细信息" prop="Info" :label-width="formLabelWidth">
          <el-input
            class="textarea_border_bottom"
            v-model="form.Info"
            placeholder="请输入详细信息"
            type="textarea"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      formtype: 1,
      formLabelWidth: '80px',
      formdata: {},
      form: {
        StaffId: '',
        Type: '1',
        Attribute: '',
        Info: '',
      },
       rules: {
          Type: [
            { required: true, message: '请选择类型', trigger: 'blur' },
          ],
          Attribute: [
            { required: true, message: '请输入属性', trigger: 'blur' },
          ],
          Info: [
            { required: true, message: '请输入详细信息', trigger: 'blur' }
          ],
        }
    }
  },
  watch: {
    "$store.state.Humanmanage.SaveStaffExtend": function (data) {
       this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.cancel();
        this.$parent.getStaffExtend();
    },
  },
  methods: {
    cancel() {
      this.form= {
        StaffId: '',
        Type: '1',
        Attribute: '',
        Info: '',
      }
      this.dialogFormVisible = false;
    },
    commit() {
      this.form.StaffId = this.formdata.Id;
      this.$refs.formName.validate((valid) => {
          if (valid) {
            let obj = {
              "MN": "SaveStaffExtend",
              "RequestId": "1",
              "DataContent": this.form,
            }
            this.MIX_send(obj);
          } else {
            return false;
          }
        });

    },
  },
}
</script>

<style lang="less" scoped>
</style>