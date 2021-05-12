<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '新增职员' : '编辑职员'"
      class="el_dialog_pro1"
      width="900px"
      @close="cancel"
      :visible="dialogFormVisible"
    >
      <div class="dialog_body EditCMBox">
        <el-form :model="listfrom" ref="reference" :rules="rules" label-position="left">
          <el-row>
            <el-col :span="8" class="el_col1">
              <el-form-item label="职员工号:" prop="No" :label-width="formLabelWidth">
                <el-input
                  v-model="listfrom.No"
                  placeholder="请输入职员工号"
                  maxlength="10"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="el_col1 pad_left">
              <el-form-item label="职员姓名:" prop="Name" :label-width="formLabelWidth">
                <el-input v-model="listfrom.Name" placeholder="请输入职员姓名" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="el_col1 pad_left">
              <el-form-item label="职员性别:" prop="Sex" :label-width="formLabelWidth">
                <el-select v-model="listfrom.Sex" placeholder="请选择职员性别">
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in $optiondata.sex"
                    :key="index"
                  ></el-option>
                  <!-- <el-option label="女" value="2"></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="el_col1">
              <el-form-item label="隶属部门:" prop="OrganizationId" :label-width="formLabelWidth">
                <el-cascader
                  style="width:150"
                  v-model="value"
                  :props="defaultProps"
                  :options="menus"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="el_col1 pad_left">
              <el-form-item label="联系方式:" prop="Phone" :label-width="formLabelWidth">
                <el-input v-model="listfrom.Phone" placeholder="请输入联系方式" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="el_col1 pad_left">
              <el-form-item label="登录方式:" prop="LoginType" :label-width="formLabelWidth">
                <el-select v-model="listfrom.LoginType" placeholder="请选择登录方式">
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
            <el-col :span="8" class="el_col1">
              <el-form-item label="账号类型:" prop="UserType" :label-width="formLabelWidth">
                <el-select v-model="listfrom.UserType" @select="utypeselect" placeholder="请选择登录方式">
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in $optiondata.UserType"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="el_col1 pad_left" v-if="listfrom.UserType != 3">
              <el-form-item label="登录账号:" prop="User" :label-width="formLabelWidth">
                <el-input
                  class="input_disabled"
                  v-model="listfrom.User"
                  :disabled="listfrom.UserType=='2'"
                  placeholder="请输入登录号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="el_col1 pad_left" v-else>
              <el-form-item label="系统用户:" prop="UserId" :label-width="formLabelWidth">
                <el-select v-model="listfrom.UserId" @change="UserIdchange" placeholder="请选择">
                  <el-option
                    v-for="item in useroptions"
                    :key="item.UId"
                    :label="item.UName"
                    :value="item.UId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="listfrom.UserType != 3" class="el_col1 pad_left">
              <el-form-item label="登录密码:" prop="PassWord" :label-width="formLabelWidth">
                <el-input
                  v-model="listfrom.PassWord"
                  placeholder="请输入密码"
                  type="password"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el_col1">
              <el-form-item label="入职时间:" prop="EntryTime" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="listfrom.EntryTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
                <!-- <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入开户银行" auto-complete="off"></el-input> -->
              </el-form-item>
              <!-- <el-form-item
                label="隶属部门:"
                prop="OrganizationId"
                :label-width="formLabelWidth">
                <el-cascader
                  v-model="value"
                  :props="defaultProps"
                  :options="menus"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>-->
            </el-col>
            <el-col :span="12" class="el_col1 pad_left">
              <el-form-item label="入职岗位:" prop="JobsId" :label-width="formLabelWidth">
                <el-select v-model="listfrom.JobsId" placeholder="请选择岗位">
                  <el-option
                    v-for="item in JobsIdoptions"
                    :key="item.UId"
                    :label="item.Name"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="el_col1">
              <el-form-item label="身份证号:" prop="IdCard" :label-width="formLabelWidth">
                <el-input v-model="listfrom.IdCard" placeholder="请输入身份证号" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="el_col1 pad_left" v-if="listfrom.UserType != 3">
              <el-form-item label="分配角色:" prop="RId" :label-width="formLabelWidth">
                <el-select v-model="RIdvalue" collapse-tags @change="rolechange" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.RId"
                    :label="item.RName"
                    :value="item.RId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="el_col1">
              <el-form-item label="描述:" prop="Desc" :label-width="formLabelWidth">
                <el-input v-model="listfrom.Desc" type="textarea" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="el_tabs_pro" v-if="formtype == 2">
          <el-button
            type="primary"
            @click="add"
            class="add_btn"
            size="small"
            v-if="tbasindex != 0"
          >新增</el-button>
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="调动记录" name="first">
              <div class="contact_list">
                <table-cmp
                  style="width:100%"
                  class="table_cmp"
                  :loading="loading"
                  :table-data="tableData"
                  height
                  :table-label="tableLabel"
                  @handleButton="handleButton"
                  @rowClick="rowClick"
                  @cellClick="cellClick"
                  @handleSortChange="handleSortChange"
                  @handleSelectionChange="handleSelectionChange"
                ></table-cmp>
              </div>
            </el-tab-pane>
            <el-tab-pane label="扩展信息" name="second">
              <div class="contact_list">
                <table-cmp
                  style="width:100%"
                  class="table_cmp"
                  :loading="loading"
                  :table-data="infor_tableData"
                  height
                  :table-label="infor_tableLabel"
                  @handleButton="handleButton"
                  @rowClick="rowClick"
                  @cellClick="cellClick"
                  @handleSortChange="handleSortChange"
                  @handleSelectionChange="handleSelectionChange"
                ></table-cmp>
              </div>
            </el-tab-pane>
            <el-tab-pane label="照片库" name="third">
              <div class="contact_list">
                <table-cmp
                  style="width:100%"
                  class="table_cmp"
                  :loading="loading"
                  :table-data="product_tableData"
                  height
                  :table-label="product_tableLabel"
                  @handleButton="handleButton"
                  @rowClick="rowClick"
                  @cellClick="cellClick"
                  @handleSortChange="handleSortChange"
                  @handleSelectionChange="handleSelectionChange"
                ></table-cmp>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" style="background:rgba(0,96,160,1)" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
    <inforpop ref="inforpop"></inforpop>
    <input ref="filElem" type="file" @change="getFile" style="display:none" />
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
            <el-button type="text" @click='shenhDetail(row)' size="small">编辑</el-button>
            <el-button type="text" @click='remove(row)' size="small">删除</el-button>

  </div>`,
  props: ['row'],
  created () {
  },
  methods: {
    shenhDetail (row) {
      this.$emit('shenh-detail', row);
      // console.log(this.row,'1111111');

    },
    remove (row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "MN": "RemoveStaffExtend",
          "SN": "Organization",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            'Ids': row.Id
          }
        }
        this.MIX_send(obj);
      }).catch(() => {
      });
    }
  }
};
var product_occupancyDisplay = {
  template: `<div>
            <el-button type="text" @click='viewimg' size="small">查看</el-button>
            <el-button type="text" @click='shenhDetail(row)' size="small">删除</el-button>

  </div>`,
  props: ['row', 'keyindex'],
  created () {
  },
  methods: {
    shenhDetail (row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "MN": "RemoveStaffImage",
          "SN": "Organization",
          "RequestId": "1",
          "DataContent": {
            "Ids": row.Id,
          },
        }
        this.MIX_send(obj);
      }).catch(() => {
      });
    },
    viewimg (row) {
      // this.$emit('see-detail', row);
      window.open(this.$config.config.IMG_URL + this.row.Image, '_blank');

    }
  }
};
var that;
import inforpop from './inforpop'
export default {
  data () {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (!(/^1[3456789]\d{9}$/.test(value))) {
        // if (this.ruleForm2.checkPass !== '') {
        //   this.$refs.ruleForm2.validateField('checkPass');
        // }
        console.log(value);
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      loading: false,
      formtype: 1,
      tbasindex: 0,
      filedatab: '',
      id: '',
      value: '',
      fileName: '',
      fileType: '',
      options: [],
      RIdvalue: [],
      menus: [],
      Organoptions: [],
      JobsIdoptions: [],
      useroptions: [],
      tableData: [],
      arr: [],
      rules: {
        No: [
          { required: true, message: '请输入工号', trigger: 'blur' },
        ],
        Name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        EntryTime: [
          { required: true, message: '请选择入职时间', trigger: 'blur' },
        ],
        UserType: [
          { required: true, message: '请选择账号类型', trigger: 'blur' },
        ],
        Phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        OrganizationId: [
          { required: true, message: '请选择隶属部门', trigger: 'blur' },
        ],
        JobsId: [
          { required: true, message: '请选择岗位', trigger: 'blur' },
        ],
        IdCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
        ],
        PassWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        User: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
        ],
        RId: [
          { required: true, message: '请选择角色', trigger: 'blur' },
        ],
        UserId: [
          { required: true, message: '请选择用户', trigger: 'blur' },
        ],
      },
      defaultProps: {
        children: 'Children',
        label: 'Name',
        value: 'Id',
        checkStrictly: true,
      },
      listfrom: {
        "No": '',
        "Name": '',
        "RId": '',
        "IdCard": '',
        "Sex": '1',
        "UserType": '',
        "OrganizationId": '',
        "JobsId": '',
        "EntryTime": '',
        "Phone": '',
        "User": '',
        "PassWord": '',
        "LoginType": '1',
        "Desc": '',
        "UserId": 0,
      },
      tableLabel: [
        { label: '时间', param: 'ApplyDate', width: '100', align: 'center', sortable: false },
        {          label: '类型', param: 'Type', align: 'center', width: '200', render: (row) => {
            if (row.Type == '1') {
              return '部门调动'
            }
            if (row.Type == '2') {
              return '岗位调动'
            }
          }        },
        { label: '部门', param: 'MOrganizationName', align: 'center', width: '150' },
        { label: '岗位', param: 'MJobsName', align: 'center' },
      ],
      infor_tableData: [],
      infor_tableLabel: [
        {          label: '类型', param: 'Type', width: '100', align: 'center', render: (row) => {
            if (row.Type == '1') {
              return '证件信息'
            }
            if (row.Type == '2') {
              return '个人信息'
            }
            if (row.Type == '3') {
              return '联系方式'
            }
          }        },
        { label: '属性', param: 'Attribute', align: 'center', width: '200', sortable: false },
        { label: '详细信息', param: 'Info', align: 'center', },
        {          label: '操作', align: 'center', width: '300',
          component: infor_occupancyDisplay, listeners: {
            'shenh-detail' (row) {
              that.dyapiDetail(row);
            }
          }
        }
      ],
      handleRemove (file, fileList) {
        console.log(file, fileList);
      },
      handlePreview (file) {
        console.log(file);
      },
      product_tableData: [],
      product_tableLabel: [
        { label: '名称', param: 'Name', width: '100', align: 'center', sortable: false },
        { label: '地址', param: 'Image', align: 'center', sortable: false },
        {          label: '操作', align: 'center', width: '300',
          component: product_occupancyDisplay, listeners: {
            'dyapi-detail' (row) {
              that.dyapiDetail(row);
            },
            'delete-detail' (row) {
              that.deleteDetail(row);
            }
          }
        }
      ],
      activeName2: 'first',
      formLabelWidth: '100px',
    }
  },
  components: {
    inforpop,
  },
  created () {
    that = this;
    // console.log(citys);
    this.getRole();
    this.getOrgan();
    this.getQueryUser();
    // this.getpeopleoption();
  },
  watch: {
    "$store.state.Common.ULFB": function (data) {
      if (data.Code == 0) {
        this.uploadfifleULFE()
      } else {
        this.$message.error(data.Message);
      }
    },
    "$store.state.Humanmanage.QueryJobs": function (data) {
      console.log(data, '!!!!!!!!!!!!!!!!!')
      let DataContent = data.ReturnData.Data;
      this.JobsIdoptions = DataContent;
    },
    "listfrom.UserType": function (data) {
      // this.listfrom.UserId = ''
      if (data == 2) {
        this.listfrom.User = this.listfrom.No;
      }
    },
    "listfrom.No": function (data) {
      if (this.listfrom.UserType == 2) {
        this.listfrom.User = this.listfrom.No;
      }
    },
    "$store.state.Humanmanage.SaveStaff": function (data) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      this.$parent.getlistdata();
      this.cancel();
    },
    "$store.state.Humanmanage.RemoveStaffExtend": function (data) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      this.getStaffExtend();
      // this.cancel();
    },
    "$store.state.Permission.MNvalue.QueryRole": function (data) {
      this.options = data.ReturnData;
    },
    "$store.state.Permission.MNvalue.QueryUser": function (data) {
      this.useroptions = data.ReturnData;
    },
    // 获取部门
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
      console.log("==========")
      this.menus = this.removechild(data.ReturnData);
    },
    "$store.state.Humanmanage.QueryStaffById": function (data) {
      this.listfrom = data.ReturnData;
      if (data.ReturnData.RId) {
        this.RIdvalue = data.ReturnData.RId.split(",");
      }
      console.log(this.listfrom)
      let arr = []
      this.getId(this.listfrom.OrganizationId, this.menus, arr)
      // this.value = this.arr;
      this.getpeopleoption();
    },
    "$store.state.Humanmanage.QueryStaffExtend": function (data) {
      this.infor_tableData = data.ReturnData;
    },
    "$store.state.Humanmanage.QueryStaffMove": function (data) {
      this.tableData = data.ReturnData.Data;
    },
    "$store.state.Humanmanage.QueryStaffImage": function (data) {
      this.product_tableData = data.ReturnData;
    },
    "$store.state.Humanmanage.SaveStaffImage": function (data) {
      this.$message({
        message: '上传成功',
        type: 'success'
      });
      this.getImagelist();
    },
    "$store.state.Humanmanage.RemoveStaffImage": function (data) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      this.getImagelist();
    },
    "$store.state.Common.ULFE": function (data) {
      if (data.Code == 0) {
        // this.$message({
        //   message: '上传成功',
        //   type: 'success'
        // });
        // let obj = {
        //   "fileName": this.fileName,
        //   "FilePath": data.ReturnData.FilePath
        // }
        this.uploadfiledata(this.fileName, data.ReturnData.FilePath, this.fileType)
        // console.log(data.ReturnData.FilePath, '666666666');
        // this.product_tableData.push(obj);
        // this.listfrom.DllFilePath = data.ReturnData.FilePath;
        // this.$set(this.listfrom,'DllFilePath',data.ReturnData.FilePath);
        // Object.assign({}, this.listfrom,{'DllFilePath':data.ReturnData.FilePath})

      } else {
        this.$message.error(data.Message);
      }

    },
  },
  methods: {
    utypeselect () {
      // this.listfrom.UserId = ''
      // this.listfrom.User = ''
    },
    getstaff (id) {
      this.id = id;
      // 查询职员
      let obj = {
        "MN": "QueryStaffById",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          'Id': id
        }
      }
      this.MIX_send(obj);
      this.getStaffExtend(id);
      this.getImagelist(id);
      this.getQueryStaffMove(id);
    },
    getStaffExtend (id) {
      // 查询职员扩展
      let obj1 = {
        "MN": "QueryStaffExtend",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          'StaffId': this.id
        }
      }
      this.MIX_send(obj1);

    },
    getQueryStaffMove (id) {
      // 查询职员调动记录
      let obj1 = {
        "MN": "QueryStaffMove",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          'StaffId': this.id
        }
      }
      this.MIX_send(obj1);

    },
    getImagelist (id) {
      // 查询照片库
      let obj1 = {
        "MN": "QueryStaffImage",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          'StaffId': this.id
        }
      }
      this.MIX_send(obj1);
    },
    // 选择部门
    handleChange (e) {
      this.listfrom.OrganizationId = e[e.length - 1];
      this.getpeopleoption();
      this.listfrom.JobsId = '';
    },
    // 获取部门
    getOrgan () {
      let obj = {
        "MN": "QueryOrganizationTree",
        "RequestId": 1,
        "UserId": 1,
        "SN": "Organization",
        "DataContent": {}
      }
      this.MIX_send(obj);
    },
    // 获取岗位
    getpeopleoption () {
      let obj1 = {
        MN: "QueryJobs",
        SN: "Organization",
        RequestId: 2,
        UserId: 1,
        DataContent: {
          IsStop: "1",
          Status: '-1',
          OrganizationId: this.listfrom.OrganizationId,
          KeyWord: "",
          "Status": "",
          PageIndex: 1,
          PageSize: 100
        }
      };
      console.log(obj1, 123456)
      this.MIX_send(obj1);
    },
    // 选择角色
    rolechange (e) {
      this.listfrom.RId = e.toString()
    },
    // 选择角色
    UserIdchange (e) {
      this.useroptions.forEach((item, index) => {
        if (item.UId == e) {
          this.listfrom.PassWord = item.PassWord;
        }
      })
    },
    // 获取用户
    getQueryUser () {
      let obj = {
        "MN": "QueryUser",
        "SN": "UserPermission",
        "DataContent": {
          "States": 2,
        }
      }
      this.MIX_send(obj);
    },
    // 获取角色
    getRole () {
      let obj = {
        "MN": "QueryRole",
        "SN": "UserPermission",
        "DataContent": {
          "IsDel": 0,
        }
      }
      this.MIX_send(obj);
    },
    uploadfiledata (name, address, type) {
      let obj = {
        "MN": "SaveStaffImage",
        "RequestId": "1",
        "DataContent": {
          "StaffId": this.listfrom.Id,
          "Name": name,
          "Image": address,
        },
      }
      this.MIX_send(obj);
    },
    // 获取文件
    getFile () {
      const inputFile = this.$refs.filElem.files[0];
      if (inputFile) {
        let datavalue = inputFile.type.split('/');
        let sttring = 'bmp,jpg,jpeg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp'
        if (sttring.indexOf(datavalue[1]) < 0) {
          console.log(datavalue[1])
          this.$message.error('不是有效的图片文件');
          return;
        }
        this.fileName = inputFile.name;
        this.fileType = datavalue[1];
        let size = inputFile.size;
        const reader = new FileReader();
        reader.readAsDataURL(inputFile);
        reader.onload = function (e) {
          that.uploadfile(this.result, inputFile.name, size);
        }
      } else {
        return;
      }
    },
    cancel () {
      this.listfrom = {
        "No": '',
        "Name": '',
        "RId": '',
        "IdCard": '',
        "Sex": '1',
        "UserType": '',
        "OrganizationId": '',
        "JobsId": '',
        "EntryTime": '',
        "Phone": '',
        "User": '',
        "PassWord": '',
        "LoginType": '1',
        "Desc": '',
        "UserId": '',
      };
      this.$refs.reference.resetFields();
      this.value = '';
      this.RIdvalue = '';
      this.dialogFormVisible = false;
      this.$emit('update:dialogFormVisible', false)
    },
    // 上传文件
    uploadfile (filedata, name, size) {
      console.log(filedata, name, size);
      this.filedatab = filedata;
      let obj = {
        "MN": "ULFB",
        "RequestId": "1",
        "DataContent": {
          "FileLength": size,
          "FileName": name
        }
      }
      this.MIX_send(obj);
    },
    uploadfifleULFE () {
      console.log(this.filedatab);
      this.MIX_send(this.dataURLtoBlob(this.filedatab), true);
    },
    dataURLtoBlob (dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // --------------------提交数据
    commit () {
      let dataobj = JSON.parse(JSON.stringify(this.listfrom));
      // alert(JSON.stringify(this.listfrom));
      if (dataobj.UserType == 3) {
        delete dataobj.User;
      }
      // if (dataobj.UserType != 3) {
      //   delete dataobj.UserId;
      // }
      this.$refs.reference.validate((valid) => {
        if (valid) {
          let obj = {
            "MN": "SaveStaff",
            "RequestId": "1",
            "DataContent": dataobj
          }
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
    // 编辑扩展信息
    dyapiDetail (row) {
      this.$refs.inforpop.formtype = 2;
      this.$refs.inforpop.formdata = JSON.parse(JSON.stringify(this.listfrom));
      this.$refs.inforpop.dialogFormVisible = true;
      this.$refs.inforpop.form = JSON.parse(JSON.stringify(row));
    },
    add () {
      if (this.tbasindex == 0) {
      } else if (this.tbasindex == 1) {
        this.$refs.inforpop.formtype = 1;
        this.$refs.inforpop.formdata = JSON.parse(JSON.stringify(this.listfrom));
        this.$refs.inforpop.dialogFormVisible = true;
      } else {
        this.$refs.filElem.dispatchEvent(new MouseEvent('click'));
      }
    },
    getId (str, array, arr) {
      for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if (item.Id == str) {
          arr.push(item.Id)
          // console.log(arr)
          this.value = arr
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
    handleButton () { },
    rowClick () { },
    cellClick () { },
    handleSortChange () { },
    handleSelectionChange () { },
  },
}
</script>

<style lang="less" scoped>
.dialog_body {
  width: 100%;
  max-height: 440px;
  overflow-y: auto;
}
.pad_left {
  padding-left: 15px;
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
  // height: 165px;
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
</style>
