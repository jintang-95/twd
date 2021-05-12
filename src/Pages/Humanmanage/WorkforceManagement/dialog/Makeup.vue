<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '新增补班' : '编辑补班'"
      width="460px"
      @close='cancel'
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item
          label="补班名称"
          prop="Name"
          :label-width="formLabelWidth"
        >
          <el-input
            class="input_border_bottom"
            v-model="form.Name"
            placeholder="请输入名称"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="补班班次"
          prop="ShiftId"
          :label-width="formLabelWidth"
        >
          <el-select
            class="select_border_bottom"
            v-model="form.ShiftId"
            placeholder="请选择班次"
          >
            <el-option
              :label="item.Name"
              :value="item.Id"
              v-for="(item, index) in tableData"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始结束日期"
          prop="StartDate"
          label-width="120px"
        >
          <el-date-picker
            v-model="value6"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            class="time_picker_defin"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="上班时间"
          prop="WorkTime"
          :label-width="formLabelWidth"
        >
          <el-time-select
            placeholder="上班时间"
            v-model="form.WorkTime"
            :clearable="false"
            class="time_select_defin"
            :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '24:00'
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item
          label="下班时间"
          prop="ClosingTime"
          :label-width="formLabelWidth"
        >
          <el-time-select
            placeholder="下班时间"
            v-model="form.ClosingTime"
            :clearable="false"
            class="time_select_defin"
            :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '24:00',
              minTime: form.WorkTime
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="描述" prop="Desc" :label-width="formLabelWidth">
          <el-input
            class="textarea_border_bottom"
            v-model="form.Desc"
            type="textarea"
            placeholder="请输入描述"
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
var that
export default {
  data() {
    return {
      dialogFormVisible: false,
      formtype: 1,
      formLabelWidth: '100px',
      value6: [],
      tableData: [],
      rules: {
          Name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          WorkTime: [
            { required: true, message: '请选择上班时间', trigger: 'blur' },
          ],
          StartDate: [
            { required: true, message: '请选择补班日期', trigger: 'blur' },
          ],
          ClosingTime: [
            { required: true, message: '请选择下班时间', trigger: 'blur' },
          ],
          ShiftId: [
            { required: true, message: '请选择补班班次', trigger: 'blur' },
          ],
        },
      form: {
        Name: '',
        WorkTime: '',
        ShiftId: '',
        StartDate: '',
        EndDate: '',
        ClosingTime: '',
      }
    }
  },
  watch: {
    "$store.state.Humanmanage.QueryShift": function (data) {
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.SaveMakeUp": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
    this.cancel();
    this.$parent.getlistdata();
    },
    'value6': (e) => {
      console.log(e);
      that.form.StartDate = e[0]
      that.form.EndDate = e[1]
    }
  },
  created() {
    that = this;
    this.getoptiondata()
  },
  methods: {
    commit() {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let obj = {
              "MN": "SaveMakeUp",
              "RequestId": 1,
              "UserId": 1,
              "DataContent": this.form
            }
            this.MIX_send(obj);
          } else {
            return false;
          }
        });
    },
    cancel(){
      this.form={
        Name: '',
        WorkTime: '',
        ShiftId: '',
        StartDate: '',
        EndDate: '',
        ClosingTime: '',
      }
      this.value6 = [];
      this.dialogFormVisible = false;
    },
    getoptiondata() {
      let obj = {
        "MN": "QueryShift",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "IsStop": '1'
        }
      }
      this.MIX_send(obj);
    },
  },
}
</script>

<style lang="less" scoped>
</style>