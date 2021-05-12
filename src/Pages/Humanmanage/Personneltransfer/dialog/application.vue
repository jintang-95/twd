<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '新增调动申请单' :'编辑调动申请单'"
      class="el_dialog_pro1"
      width="800px"
      @close="cancel"
      :visible.sync="dialogFormVisible"
    >
      <!-- <div class="dialog_body"> -->
      <el-form :model="listfrom" ref="reference" :rules="rules" label-position="left">
        <el-row>
          <el-col :span="12" class="el_col1">
            <el-form-item label="单据编号" :label-width="formLabelWidth" v-if="formtype == 2">
              <el-input
                class="input_disabled"
                style="width:100%;"
                v-model="listfrom.No"
                disabled
                placeholder="请输入单据编号"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col1">
            <el-form-item label="申请时间" prop="time" :label-width="formLabelWidth">
              <!-- <el-input
                class=" input_disabled"
                 style="width:210px;"
                v-model="listfrom.time"
                :disabled="formtype == 3"
                placeholder="请输入单据编号"
                auto-complete="off"
              ></el-input>-->
              <el-date-picker
                style="width:100%"
                value-format="yyyy-MM-dd"
                v-model="listfrom.ApplyDate"
                type="date"
                :disabled="formtype == 3"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col1 pad_left">
            <el-form-item label="申请人" prop="ApplyStaffId" :label-width="formLabelWidth">
              <!-- <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入身份证号" auto-complete="off"></el-input> -->
              <el-select
                class="input_disabled"
                style="width:100%;"
                v-model="listfrom.ApplyStaffId"
                :disabled="formtype == 3"
                placeholder="请选择申请人"
                @change="apllyselect"
                filterable
              >
                <el-option
                  :label="item.Name"
                  :value="item.Id"
                  v-for="(item,index) in staffoption"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col1">
            <el-form-item label="调动类型" prop="Type" :label-width="formLabelWidth">
              <el-select
                style="width:100%;"
                :disabled="formtype == 3"
                v-model="listfrom.Type"
                placeholder="请选择调动类型"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in $optiondata.Typeoption"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="el_col1 pad_left">
            <el-form-item label="当前岗位" :label-width="formLabelWidth">
              <!-- <el-input
                 style="width:100%;"
                 class="input_disabled"
                v-model="listfrom.JobsId"
                placeholder="当前岗位"
                disabled
                auto-complete="off"
              ></el-input>-->
              <el-select
                class="input_disabled"
                style="width:100%;"
                v-model="listfrom.JobsName"
                disabled
                placeholder="当前岗位"
              >
                <el-option
                  :label="item.Name"
                  :value="item.Id"
                  v-for="(item,index) in JobsIdoptions"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col1">
            <el-form-item label="当前部门" :label-width="formLabelWidth">
              <!-- <el-cascader
                  v-model="valueold"
                  class="select_border_bottom"
                  :props="defaultProps"
                  :options="menus"
                  @change="handleChange"
              ></el-cascader>-->
              <!-- <el-input
                 style="width:100%;"
                  class="input_disabled"
                  v-model="listfrom.OrganizationId"
                  disabled
                  placeholder="当前部门"
                  auto-complete="off"
              ></el-input>-->
              <el-select
                class="input_disabled"
                style="width:100%;"
                v-model="listfrom.OrganizationId"
                disabled
                placeholder="当前部门"
              >
                <el-option
                  :label="item.Name"
                  :value="item.Id"
                  v-for="(item,index) in menus"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="el_col1">
            <el-form-item label="目标部门" prop="MOrganizationId" :label-width="formLabelWidth">
              <!-- <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入当前部门" auto-complete="off"></el-input> -->
              <el-cascader
                style="width:100%;"
                v-model="valuenew"
                :props="defaultProps"
                :disabled="formtype == 3"
                :options="menus"
                @change="handleChangenew"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col1 pad_left">
            <el-form-item label="目标岗位" prop="MJobsId" :label-width="formLabelWidth">
              <el-select
                style="width:100%;"
                :disabled="formtype == 3"
                v-model="listfrom.MJobsId"
                placeholder="请选择目标岗位"
              >
                <el-option
                  v-for="item in JobsIdoptionsnew"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="申请原因" prop="Reason" :label-width="formLabelWidth">
          <el-input
            class="input_textarea_disabled"
            style="width:100%;"
            :disabled="formtype == 3"
            placeholder="请输入申请原因"
            v-model="listfrom.Reason"
            type="textarea"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button style="background:rgba(0,96,160,1)" type="primary" @click="commit">确 定</el-button>
      </div>
      <!-- </div> -->
    </el-dialog>
    <!-- <inforpop ref="inforpop"></inforpop> -->
  </div>
</template>

<script>
var occupancyDisplay = {
  template: `<div>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>

  </div>`,
  props: ['row'],
  created () {
  },
  methods: {
    shenhDetail (row) {
      this.$emit('shenh-detail', row);
      // console.log(this.row,'1111111');

    },
    seeDetail (row) {
      this.$emit('see-detail', row);
      // console.log(this.row,'1111111');

    }
  }
};
var infor_occupancyDisplay = {
  template: `<div>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>

  </div>`,
  props: ['row'],
  created () {
  },
  methods: {
    shenhDetail (row) {
      this.$emit('shenh-detail', row);
      // console.log(this.row,'1111111');

    },
    seeDetail (row) {
      this.$emit('see-detail', row);
      // console.log(this.row,'1111111');

    }
  }
};
var product_occupancyDisplay = {
  template: `<div>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>

  </div>`,
  props: ['row'],
  created () {
  },
  methods: {
    shenhDetail (row) {
      this.$emit('shenh-detail', row);
      // console.log(this.row,'1111111');

    },
    seeDetail (row) {
      this.$emit('see-detail', row);
      // console.log(this.row,'1111111');

    }
  }
};
var that;
export default {
  data () {
    return {
      dialogFormVisible: false,
      loading: false,
      formtype: 1,
      tbasindex: 0,
      valuenew: [],
      valueold: [],
      staffoption: [],
      JobsIdoptions: [],
      JobsIdoptionsnew: [],
      menus: [],
      rules: {
        ApplyDate: [
          { required: true, message: '请选择时间', trigger: 'blur' },
        ],
        ApplyStaffId: [
          { required: true, message: '请选择申请人', trigger: 'blur' },
        ],
        Type: [
          { required: true, message: '请选择调动类型', trigger: 'blur' },
        ],
        OrganizationId: [
          { required: true, message: '请选择当前部门', trigger: 'blur' },
        ],
        JobsId: [
          { required: true, message: '请选择当前岗位', trigger: 'blur' },
        ],
        MOrganizationId: [
          { required: true, message: '请选择目标部门', trigger: 'blur' },
        ],
        MJobsId: [
          { required: true, message: '请选择目标岗位', trigger: 'blur' },
        ],
        Reason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' },
        ],
      },
      listfrom: {
        "OrganizationId": '',
        "No": '',   //编号
        "ApplyDate": '',
        "ApplyStaffId": '',
        "Type": '',     //调动类型
        // "OrganizationName": '',  //当前部门
        'OrganizationId': '',
        'JobsId': '',
        // "JobsName": '',
        "MOrganizationId": '',
        "MJobsId": '',
        "Reason": '', //原因
      },
      activeName2: 'first',
      formLabelWidth: '80px',
      defaultProps: {
        children: 'Children',
        label: 'Name',
        value: 'Id',
        checkStrictly: true,
      },
      hasResetStatus: false
    }
  },
  components: {
    // inforpop,
  },
  created () {
    that = this;
    // console.log(citys);
    this.getstaff();
    this.getOrgan();
  },
  watch: {
    // 获取部门
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
      this.menus = this.removechild(data.ReturnData);
    },
    // 获取职员
    "$store.state.Humanmanage.QueryStaff": function (data) {
      this.staffoption = data.ReturnData.Data;
    },
    // 新增、编辑
    "$store.state.Humanmanage.SaveStaffMove": function (data) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      this.cancel();
      this.$parent.getlistdata();
    },
    "$store.state.Humanmanage.QueryJobs": function (data) {
      let DataContent = data.ReturnData.Data;
      if (data.RequestId == 2) {
        // old
        this.JobsIdoptions = DataContent;
      }
      if (data.RequestId == 1) {
        // new
        this.JobsIdoptionsnew = DataContent;
      }
    },
  },
  methods: {
    apllyselect (e) {
      console.log(this.JobsIdoptions)
      this.staffoption.forEach((item, index) => {
        if (item.Id == e) {
          console.log(item)
          this.listfrom.JobsId = item.JobsId;
          this.listfrom.JobsName = item.JobsName;
          this.listfrom.OrganizationId = item.OrganizationId;
        }
      })
    },
    // new选择部门
    handleChangenew (e) {
      this.listfrom.MOrganizationId = e[e.length - 1];
      this.getmpeopleoption();
      this.listfrom.MJobsId = '';
    },
    // 获取部门
    getOrgan () {
      let obj = {
        "SN": "Organization",
        "MN": "QueryOrganizationTree",
        "SN": 'Organization',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {}
      }
      this.MIX_send(obj);
    },
    getlistdata (form) {
      this.listfrom = JSON.parse(JSON.stringify(form));
      this.getIdn(this.listfrom.MOrganizationId, this.menus, []);
      // this.getIdn();
      this.getmpeopleoption();
    },
    // new获取岗位
    getmpeopleoption () {
      let obj1 = {
        "SN": "Organization",
        MN: "QueryJobs",
        "SN": 'Organization',
        RequestId: 1,
        UserId: 1,
        DataContent: {
          IsStop: "1",
          OrganizationId: this.listfrom.MOrganizationId,
          Status: "2"
        }
      };
      this.MIX_send(obj1);
    },
    getstaff () {
      let obj = {
        "SN": "Organization",
        "MN": "QueryStaff",
        "SN": 'Organization',
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          "IsStop": '1'
        }
      }
      this.MIX_send(obj);
    },
    cancel () {
      this.listfrom = {
        "OrganizationId": '',
        "No": '',
        "ApplyDate": '',
        "ApplyStaffId": '',
        "Type": '',
        "OrganizationId": '',
        "JobsId": '',
        "MOrganizationId": '',
        "MJobsId": '',
        "Reason": '',
      };
      this.valuenew = [];
      this.$refs.reference.resetFields();
      this.dialogFormVisible = false
    },
    commit () {
      this.$refs.reference.validate((valid) => {
        if (valid) {
          if (this.hasResetStatus) {
            this.$emit('reCommitData')
            return
          } else {
            let obj = {
              "MN": "SaveStaffMove",
              "SN": "Organization",
              "RequestId": "1",
              "DataContent": this.listfrom
            }
            console.log(obj, 123456)
            this.MIX_send(obj);
            this.$emit('getlistdata')
            this.dialogFormVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    onSelected (data) {
      // this.dialogFormVisible=false
      console.log(data);
    },
    handleClick (data) {
      // this.dialogFormVisible=false
      // console.log(data.index);
      this.tbasindex = data.index;
    },
    add () {
      if (this.tbasindex == 0) {
      } else if (this.tbasindex == 1) {
        this.$refs.inforpop.dialogFormVisible = true;
      } else {

      }
    },
    getIdn (str, array, arr) {
      for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if (item.Id == str) {
          arr.push(item.Id)
          // console.log(arr)
          this.valuenew = arr
          return
        }
        if (item.Children && item.Children.length > 0) {
          let arr01 = JSON.parse(JSON.stringify(arr))
          arr01.push(item.Id);
          this.getIdn(str, item.Children, arr01);
        }
      }
    },
    handleButton () { },
    rowClick () { },
    cellClick () { },
    handleSortChange () { },
    handleSelectionChange () { },
    getId (str, array, arr) {
      for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if (item.Id == str) {
          arr.push(item.Id)
          // console.log(arr)
          this.valuenew = arr
          return
        }
        if (item.Children && item.Children.length > 0) {
          let arr01 = JSON.parse(JSON.stringify(arr))
          arr01.push(item.Id);
          this.getId(str, item.Children, arr01);
        }
      }
    },
    getIds (str, array, arr) {
      for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if (item.Id == str) {
          arr.push(item.Id)
          // console.log(arr)
          this.valueold = arr
          return
        }
        if (item.Children && item.Children.length > 0) {
          let arr01 = JSON.parse(JSON.stringify(arr))
          arr01.push(item.Id);
          this.getId(str, item.Children, arr01);
        }
      }
    },
    removechild (data) {
      data.forEach((item, index) => {
        if (item.Children && item.Children.length > 0) {
          this.removechild(item.Children);
        } else {
          delete item.Children;
        }
      });
      return data;
    },
  },
}
</script>

<style lang="less" scoped>
.dialog_body {
  width: 100%;
}
.el_tabs_pro {
  margin-top: 10px;
  width: 100%;
  position: relative;
}
.add_btn {
  position: absolute;
  top: 5px;
  right: 0px;
  z-index: 12;
}
.contact_list {
  width: 100%;
  height: 165px;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    margin-left: 20px;
    color: #4d6474;
    font-size: 18px;
    font-weight: 400;
  }
}
</style>
