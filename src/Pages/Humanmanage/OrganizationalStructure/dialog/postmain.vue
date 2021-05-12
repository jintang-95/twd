<!-- 编辑岗位FORM start -->
<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '新增岗位' : '编辑岗位'"
      :visible="dialogFormVisible"
      width="900px"
      class="postForm"
      @close="cancel"
    >
      <el-form
        ref="formName"
        :rules="rules"
        :model="listfrom"
        label-position="left"
        label-width="85px"
        style="width: 100%px;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位编号:" prop="No">
              <el-input v-model="listfrom.No" auto-complete="off" placeholder="请输入岗位编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位名称" prop="Name">
              <el-input v-model="listfrom.Name" auto-complete="off" placeholder="请输入岗位名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="隶属部门" prop="OrganizationId">
              <el-cascader
                v-model="value"
                :props="defaultProps"
                :options="menus"
                @change="handleChangeByfrom"
                v-if="menus"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录方式" prop="LoginMethod">
              <el-select
                v-model="listfrom.LoginMethod"
                class="filter-item"
                placeholder="请选择登录方式"
                style="display:block"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in $optiondata.LoginMethod"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="SuperiorType" label="上级类型">
              <el-select
                v-model="listfrom.SuperiorType"
                placeholder="请选择上级类型"
                @change="selectchang"
                style="display:block"
              >
                <el-option
                  v-for="(item, index) in $optiondata.SuperiorType"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为管理">
              <el-radio-group v-model="listfrom.IsManager" prop="IsManager">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="listfrom.SuperiorType">
            <el-form-item label="直属上级" prop="Superior">
              <el-select
                v-model="listfrom.Superior"
                v-if="listfrom.SuperiorType != 1"
                class="filter-item"
                placeholder="请选择直属上级"
                style="display:block"
              >
                <el-option
                  v-for="(item, index) in peopleoption"
                  :label="item.Name"
                  :value="item.Id"
                  :key="index"
                ></el-option>
              </el-select>
              <el-select
                v-model="listfrom.Superior"
                v-else
                class="filter-item"
                placeholder="请选择直属上级"
                style="display:block"
              >
                <el-option
                  :label="item.Name"
                  :value="item.Id"
                  v-for="(item, index) in postmainoption"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="Desc">
              <el-input
                v-model="listfrom.Desc"
                auto-complete="off"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="关于岗位描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="position:relative">
            <el-button type="primary" @click="add" class="add_btn" size="small">新增职责</el-button>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="职责管理" name="first">
                <el-table v-model="tableDatas" :data="tableDatas" style="width: 100%">
                  <el-table-column
                    label="类型"
                    width="180"
                    class="table_cmp"
                    :loading="loading"
                    @handleButton="handleButton"
                    @rowClick="rowClick"
                    @cellClick="cellClick"
                    @handleSortChange="handleSortChange"
                    @handleSelectionChange="handleSelectionChange"
                  >
                    <template slot-scope="{row}">
                      <span v-if="row.Type==1">部门</span>
                      <span v-else>项目组</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述">
                    <template slot-scope="{row}">
                      <span>{{ row.Desc }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="{row}">
                      <!-- <el-button
                            size="mini"
                      @click="upDateDutyDetail(row)">编辑</el-button>-->
                      <el-button size="mini" type="danger" @click="DutyDelete(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" style="background:rgba(0,96,160,1)" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
    <postmainpop ref="postmainpop" @dataChange="dataChange"></postmainpop>
  </div>
</template>

<script>
var that;
var delateArry = ""
import postmainpop from "./postmainpop";
export default {
  name: 'postmain',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // formtype: {
    //   type: Number,
    //   default: 1,
    // },
    typeList: {
      type: Array,
      default () {
        return [];
      },
    },
    formData: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      center: true,
      textMap: {
        update: '修改岗位',
        create: '新增岗位'
      },
      loading: false,
      formtype: 1,
      tbasindex: 0,
      tableDatas: [],
      value: [],
      postmainoption: [],
      menus: [],
      peopleoption: [],
      defaultProps: {
        children: 'Children',
        label: 'Name',
        value: 'Id',
        checkStrictly: true,
      },
      listfrom: {
        "No": "",
        "Name": "",
        "OrganizationId": "",
        "LoginMethod": "1",
        "SuperiorType": "",
        "IsManager": '0',
        "Superior": "",
        "Desc": ""
      },
      activeName: "first",
      rules: {
        Name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        No: [{ required: true, message: "请输入编号", trigger: "blur" }],
        OrganizationId: [
          { required: true, message: "请选择组织", trigger: "blur" }
        ],
        LoginMethod: [
          { required: true, message: "请选择登录方式", trigger: "blur" }
        ],
        Desc: [{ required: true, message: "请输入描述", trigger: "blur" }]
      }
    };
  },
  watch: {
    "$store.state.Humanmanage.QueryStaff": function (data) {
      console.log(data)
      let DataContent = data.ReturnData.Data;
      this.peopleoption = DataContent;
      console.log(this.peopleoption)
    },
    "$store.state.Humanmanage.QueryDuty": function (data) {
      this.tableDatas = [];
      let DataContent = data.ReturnData;
      this.tableDatas = DataContent;
    },
    // 获取部门
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
      this.menus = this.removechild(data.ReturnData);
    },
    "$store.state.Humanmanage.QueryJobs": function (data) {
      let DataContent = data.ReturnData.Data;
      if (data.RequestId == 2) {
        let arr = []
        DataContent.forEach(item => {
          if (item.Id != this.listfrom.Id) {
            arr.push(item)
          }
        });
        this.postmainoption = JSON.parse(JSON.stringify(arr));
      }
    },
    "$store.state.Humanmanage.SaveJobs": function (data) {
      this.saveDutyList(data.ReturnData.JobsId);
    },
    "$store.state.Humanmanage.SaveDutyList": function (data) {
      this.$message({
        type: "success",
        message: "操作成功!"
      });
      this.cancel();
      this.$parent.getlistdata();
    },
    "$store.state.Humanmanage.RemoveDutyById": function (data) {

    },
    listfrom: function () {
      if (this.listfrom.Id) {
        this.getDuty(this.listfrom.Id);
      }
      this.listfrom.IsManager = this.formtype == 1 ? '0' : this.listfrom.IsManager;
    }
  },
  components: {
    postmainpop
  },
  created () {
    that = this;
    this.getpeopleoption();
    this.getOrgan();
    // this.listfrom.IsManager = this.formtype == 1 ? '0' : '0';
  },
  methods: {
    handleChangeByfrom (e) {
      this.listfrom.OrganizationId = e[e.length - 1];
      // console.log(this.listfrom.OrganizationId,e);
      this.orangchange();
      this.listfrom.Superior = '';
      this.listfrom.SuperiorType = '';
    },
    orangchange () {
      this.getpeopleoption();
      let obj1 = {
        MN: "QueryJobs",
        "SN": "Organization",
        RequestId: 2,
        UserId: 1,
        DataContent: {
          IsStop: "1",
          OrganizationId: this.listfrom.OrganizationId,
          KeyWord: "",
          "Status": "",
          PageIndex: 1,
          PageSize: 100
        }
      };
      this.MIX_send(obj1);
    },
    // 获取部门
    getOrgan () {
      let obj = {
        "MN": "QueryOrganizationTree",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {}
      }
      this.MIX_send(obj);
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
    checkbox () {

    },
    selectchang () {
      this.listfrom.Superior = "";
      this.listfrom.IsManager = '0';
    },
    cancel () {
      this.listfrom = {
        No: "",
        Name: "",
        OrganizationId: "",
        LoginMethod: "1",
        SuperiorType: "",
        Superior: "",
        Desc: ""
      };
      this.dialogFormVisible = false;
      this.$refs.formName.resetFields()
      this.$emit('update:dialogFormVisible', false)
    },
    getpeopleoption () {
      let obj = {
        MN: "QueryStaff",
        "SN": "Organization",
        RequestId: 2,
        UserId: 1,
        DataContent: {
          IsStop: "1"
        }
      };
      this.MIX_send(obj);
    },
    getDuty (id) {
      let obj = {
        MN: "QueryDuty",
        "SN": "Organization",
        RequestId: 2,
        UserId: 1,
        DataContent: {
          JobsId: id
        }
      };
      this.MIX_send(obj);
    },
    commit () {
      if (delateArry != "") {
        this.RemoveDutyById();
      }
      this.$refs.formName.validate(valid => {
        if (valid) {
          let obj = {
            MN: "SaveJobs",
            "SN": "Organization",
            RequestId: 1,
            UserId: 1,
            DataContent: this.listfrom
          };
          this.MIX_send(obj);
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
        this.$refs.postmainpop.dialogFormVisible = true;
        this.$refs.postmainpop.formtype = 1;
      }
    },
    upDateDutyDetail (row) {
      this.$refs.postmainpop.dialogFormVisible = true;
      this.$refs.postmainpop.form = JSON.parse(JSON.stringify(row));
      this.$refs.postmainpop.formtype = 2;
    },
    DutyDelete (row) {
      let that = this;
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.Id && row.Id != 0) {
          if (delateArry == "") {
            delateArry += row.Id;
          } else {
            delateArry += "," + row.Id;
          }
        }
        let i
        for (i in this.tableDatas) {
          if (row.Id == this.tableDatas[i].Id) {
            this.tableDatas.splice(i, 1);
          }
        }

      }).catch(() => {
      });
    },
    dataChange (data) {
      let that = this;
      let i
      if (data.Id) {
        for (i in this.tableDatas) {
          if (data.Id == this.tableDatas[i].Id) {
            this.$set(this.tableDatas[i], "Type", data.Type);
            this.$set(this.tableDatas[i], "Desc", data.Desc);
          }
        }
      }
      else {
        this.$set(data, "Id", 0);
        this.$set(data, "JobsId", this.listfrom.Id);
        this.tableDatas.push(data);
      }
    },
    saveDutyList () {
      console.log('121212', this.listfrom.IsManager)
      let datas = { "dutyList": this.tableDatas }
      let obj = {
        MN: "SaveDutyList",
        SN: "Organization",
        RequestId: 1,
        UserId: 1,
        DataContent: datas
      };
      this.MIX_send(obj);
    },
    RemoveDutyById () {
      let obj = {
        "MN": "RemoveDutyById",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          'Ids': delateArry
        }
      }
      that.MIX_send(obj);
    },
    handleButton () { },
    rowClick () { },
    cellClick () { },
    handleSortChange () { },
    handleSelectionChange () { }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  // display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.postForm .el-col {
  padding: 0 10px !important;
}
.add_btn {
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 12;
}
/deep/ .el-dialog__header {
  margin: 0 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    color: #4d6474;
    font-size: 18px;
    font-weight: 400;
  }
}
// /deep/ .el-dialog__body {
//    margin-top: 20px;
// }
</style>
