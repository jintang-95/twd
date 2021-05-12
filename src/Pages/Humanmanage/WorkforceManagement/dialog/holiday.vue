<template>
  <div>
    <el-dialog
      @close="cancel"
      :title="formtype == 1 ? '新增节假日' : '编辑节假日'"
      class="holiday_dialog"
      width="30%"
      :visible.sync="dialogFormVisible">
         <el-form :rules="rules" :model="form" ref="ruleForm" class="formContainer" label-width="80px" label-position="left">
        <el-form-item
          label-width="100px"
          label="节假日名称"
          prop="Hname">
          <el-input
            v-model="form.Hname"
            style="width:210px"
            placeholder="请输入名称"
            auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="100px" prop="Stype">
          <el-select
            v-model="form.Stype"
            label-width="100px"
            placeholder="请选择类型">
             <el-option label="请选择类型" value=""></el-option>
            <el-option label="假日" value="1"></el-option>
            <el-option label="上班" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择日期"
          label-width="100px"
          prop="Sdate">
          <el-date-picker
           style="width:210px"
            v-model="form.Sdate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述"  label-width="100px" prop="Desc">
          <el-input
            v-model="form.Desc"
            type="textarea"
            style="width:210px"
            placeholder="请输入描述"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button  style="background:rgba(0,96,160,1)" type="primary" @click="commit">确 定</el-button>
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
       rules: {},
      form: {
        Hname: '',
        // Resoures: '1',
        Stype: '1',
        Sdate: '',
        Edate: '',
        Desc: '',
      },
      rules:{
         Hname:[{required: true, message: '请输入节假日名称', trigger: 'blur'}],
         Stype:[{required: true, message: '请选择类型', trigger: 'change'}],
         Sdate:[{required: true, message: '请选择时间', trigger: 'change'}]
      }
    }
  },
  created() {
    that = this
  },
  watch: {
    "$store.state.Humanmanage.SaveHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.cancel();
          this.$parent.getlistdata();
    },
    "$store.state.Humanmanage.AddAttendanceHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
        this.aaa();  
        // this.$parent.getlistdata();
        // // this.$emit('getlistdata');
        // console.log(  this.$parent.getlistdata(),2222222)
         this.cancel();
    },
     "$store.state.Humanmanage.UpdateAttendanceHoliday": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.cancel();
          this.$parent.getlistdata();
    },
    'value6': (e) => {
      that.form.Sdate = e[0];
      that.form.Edate = e[1];
    }
  },
  methods: {
    commit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
              if(this.formtype == 1){
                let obj = {
                  "MN": "AddAttendanceHoliday",
                  "SN":"Attendance",
                  "RequestId": 1,
                  "UserId": 1,
                  "DataContent": this.form
                }
                this.MIX_send(obj);
                this.dialogFormVisible = false;
              }else{
                let form = JSON.parse(JSON.stringify(this.form))
                let obj = {
                  "MN": "UpdateAttendanceHoliday",
                  "SN":"Attendance",
                  "RequestId": 1,
                  "UserId": 1,
                  "DataContent": this.form
                }
                this.MIX_send(obj);
                this.dialogFormVisible = false;
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    aaa() {
      this.$parent.getlistdata();
    },
    cancel() {
      this.form= {
        Name: '',
        Resoures: '1',
        Type: '1',
        StartDate: '',
        EndDate: '',
        Desc: '',
      }
     this.$refs.ruleForm.resetFields();
      this.dialogFormVisible = false;
    }
  },
}
</script>

<style lang="less" scoped>
    /deep/ .el-dialog__header{
      margin: 0 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      span {
        color:#4D6474;
        font-size: 18px;
        font-weight: 400;
      }
    }

</style>