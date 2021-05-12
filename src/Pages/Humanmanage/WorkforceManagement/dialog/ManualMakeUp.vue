<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '手工排班' : '手工排班'"
      width="460px"
      @close='cancel'
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item
          label="职员"
          :label-width="formLabelWidth"
        >
          <el-input
            class="input_border_bottom input_disabled"
            v-model="form.StaffName"
            disabled
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="日期"
          :label-width="formLabelWidth"
        >
          <el-input
            class="input_border_bottom input_disabled"
            v-model="form.NewData"
            disabled
            auto-complete="off"
          ></el-input>
        </el-form-item>
  
        <el-form-item
          label="选择班次"
          prop="FrequencyId"
          :label-width="formLabelWidth"
        >
          <!-- <el-time-select
            placeholder="选择班次"
            v-model="form.FrequencyId"
            :clearable="false"
            class="time_select_defin"
            :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '24:00'
            }"
          >
          </el-time-select> -->
		  <el-select v-model="form.FrequencyId" class="time_select_defin" placeholder="请选择">
		      <el-option
		        v-for="item in options"
		        :key="item.Id"
		        :label="item.Name"
		        :value="item.Id">
		      </el-option>
		    </el-select>
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
          FrequencyId: [
            { required: true, message: '请选择上班时间', trigger: 'blur' },
          ]
        },
      form: {
        "status": 1,
        "weeks": '休',
        "StaffId": '',
        "StaffName": '',
        "Sdate": "",
        "Edate": "",
        "NewData": "",
        "FrequencyId": "0",
      },
	  options:[],
    }
  },
  watch: {
    "$store.state.Humanmanage.SaveStaffShiftHand": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
    this.cancel();
    this.$parent.getlistdata();
    },
  },
  created() {
    that = this;
  },
  methods: {
    commit() {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if(this.form.FrequencyId!=0){
				this.form.status = 2;
			}
			else{
				this.form.status = 1;
			}
			this.options.map((item) => {
			  //  this.unitList 是你 select option遍历的集合 e 是选中的id
			    if(item.Id == this.form.FrequencyId) {
			      this.form.weeks = item.Name;
			    }
			  })
			this.form.Sdate = this.form.Edate = this.form.NewData;
			this.$emit("manualChange",this.form);
			this.cancel();
          } else {
            return false;
          }
        });
    },
    cancel(){
      this.form={
        "status": 1,
        "weeks": '休',
        "StaffId": '',
        "StaffName": '',
        "Sdate": "",
        "Edate": "",
        "NewData": "",
        "FrequencyId": "0",
      }
      this.dialogFormVisible = false;
    },
  },
}
</script>

<style lang="less" scoped>
</style>