<template>
  <div id="user">
    <pageTop :title="title"></pageTop>
    <div class="head">
      <div class="buttons">
        <el-button
          type="primary"
          style="margin-right:40px;"
          @click="AddGroup"
          v-permission="['User_AddGroup']"
        >新增用户组</el-button>
        <el-button type="primary" @click="AddUser" v-permission="['User_Adduser']">新增用户</el-button>
      </div>
      <div style="display:flex;justify-content: space-between;">
        <div class="checkboxs">
          <el-checkbox v-model="audit" @change="change">待审核</el-checkbox>
          <el-checkbox v-model="online" @change="change">在线</el-checkbox>
          <el-checkbox v-model="outline" @change="change">离线</el-checkbox>
          <el-checkbox v-model="deleted" @change="change">已删除</el-checkbox>
        </div>
        <div class="inputs">
          <el-input
            placeholder="请输入搜索关键字"
            v-model="InputValue"
            style="width:250px"
            clearable
            @keyup.enter.native="getValue"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!-- <el-button icon="el-icon-refresh" style="width:40px;padding-left:13px;"></el-button> -->
        </div>
      </div>
    </div>
    <div class="content">
      <div class="leftcontent">
        <div
          v-for="(item,index) in groupdata"
          :key="index"
          style="height:50px;line-height:50px;padding-left:20px;position:relative;font-size:14px"
          @click="Clickgroup(item,index)"
          :class="{bg:index==initdex}"
        >
          {{item.groupName}}
          <el-dropdown
            trigger="click"
            style="position:absolute;right:30px;color:white;"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              <i class="IconFont iconmore"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">授权</el-dropdown-item>
              <el-dropdown-item command="b" v-permission="['User_Editorgroup']">修改</el-dropdown-item>
              <el-dropdown-item command="c" v-permission="['User_Deletegroup']">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="rightcontent">
        <el-table
          :data="tableData"
          height="620"
          :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
          show-overflow-tooltip
          class="tabl_cmp"
        >
          <el-table-column
            v-for="(item,index) in tableTitle"
            :key="index"
            :prop="item.tableprop"
            :label="item.name"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop label="操作" width="350" align="center">
            <template slot-scope="scope">
              <!-- <div class="btn_body">
              <div class="btn_item" v-if="scope.row.online =='在线'">-->
              <el-button
                class="Colorbutton"
                v-if="scope.row.online =='在线'"
                @click="handleClickone(scope.row)"
                type="text"
                size="small"
                v-permission="['User_Check']"
              >
                <span class="iconlook IconFont"></span>&nbsp;查看
              </el-button>

              <!-- </div> -->
              <span class="Icon-iconline IconFont" v-if="scope.row.online =='在线'"></span>
              <!-- <div class="btn_item" v-if="scope.row.online =='在线'"> -->
              <el-button
                class="Colorbutton"
                v-if="scope.row.online =='在线'"
                @click="handleClicktwo(scope.row)"
                type="text"
                size="small"
              >
                <span class="iconxia IconFont"></span>&nbsp;强制下线
              </el-button>

              <!-- </div> -->
              <span class="Icon-iconline IconFont" v-if="scope.row.online =='在线'"></span>
              <!-- <div class="btn_item" v-if="scope.row.online =='离线'"> -->
              <el-button
                class="Colorbutton"
                v-if="scope.row.online =='离线'"
                @click="handleClickthree(scope.row)"
                type="text"
                size="small"
                v-permission="['User_Editoruser']"
              >
                <span class="Icon-iconedit IconFont"></span>&nbsp;编辑
              </el-button>

              <!-- </div> -->
              <span class="Icon-iconline IconFont" v-if="scope.row.online =='离线'"></span>
              <!-- <div class="btn_item" v-if="scope.row.online =='待审核'"> -->
              <el-button
                class="Colorbutton"
                v-if="scope.row.online =='待审核'"
                @click="handleClickfour(scope.row)"
                type="text"
                size="small"
              >
                <span class="iconshenhe IconFont"></span>&nbsp;审核
              </el-button>

              <!-- </div> -->
              <span class="Icon-iconline IconFont" v-if="scope.row.online =='待审核'"></span>
              <!-- <div class="btn_item" v-if="scope.row.online =='离线'"> -->
              <el-button
                class="Colorbutton"
                v-if="scope.row.online =='离线'"
                @click="handleClickfive(scope.row)"
                type="text"
                size="small"
                v-permission="['User_Deleteuser']"
              >
                <span class="Icon-icondelete IconFont"></span>&nbsp;删除
              </el-button>

              <!-- </div> -->
              <span class="Icon-iconline IconFont" v-if="scope.row.online =='离线'"></span>
              <!-- <div class="btn_item"> -->
              <el-button
                class="Colorbutton"
                @click="handleClicksix(scope.row)"
                type="text"
                size="small"
              >
                <span class="iconquan IconFont"></span>&nbsp;授权
              </el-button>

              <!-- </div> -->
              <span class="Icon-iconline IconFont"></span>
              <!-- <div class="btn_item"> -->
              <el-button
                class="Colorbutton"
                @click="handleClickseven(scope.row)"
                type="text"
                size="small"
              >
                <span class="iconchange IconFont"></span>&nbsp;重置密码
              </el-button>
              <!-- </div> -->
              <!-- </div> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增组弹窗 -->
    <el-dialog title="新增组" :visible.sync="dialogOne" width="600px">
      <el-form label-width="100px" :model="form_one" :rules="ruleAddG" ref="form_one">
        <el-form-item label="组名称:" prop="name">
          <el-input v-model="form_one.name" placeholder="请输入组名"></el-input>
        </el-form-item>
        <el-form-item label="所有用户:" prop="GroupValue">
          <el-select
            v-model="form_one.GroupValue"
            multiple
            placeholder="请选择组所属用户"
            style="width:100%;"
          >
            <el-option
              v-for="item in UserData"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_one')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterOne('form_one')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增用户弹窗 -->
    <el-dialog title="新增用户" :visible.sync="dialogTwo" width="600px">
      <el-form label-width="100px" :model="form_two" :rules="ruleAddU" ref="form_two">
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="form_two.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="form_two.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="登录状态:">
          <el-select v-model="form_two.status" placeholder="请选择登录状态" disabled style="width:100%;">
            <el-option
              v-for="item in accountstatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态:" prop="statu">
          <el-select v-model="form_two.statu" placeholder="请选择账号状态" style="width:100%;">
            <el-option
              v-for="item in accountstatu"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拥有角色:">
          <el-select
            v-model="form_two.RoleValue"
            multiple
            disabled
            placeholder="请选择用户拥有角色"
            style="width:100%;"
          >
            <el-option
              v-for="item in RoleData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组:">
          <el-select v-model="form_two.group" placeholder="请选择组" style="width:100%;">
            <el-option
              v-for="item in groupdata"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="form_two.Description"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_two')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterTwo('form_two')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改组弹窗 -->
    <el-dialog title="修改组" :visible.sync="dialogThree" width="600px">
      <el-form label-width="100px" :model="form_three" :rules="ruleChangeG" ref="form_three">
        <el-form-item label="组名称:" prop="name">
          <el-input v-model="form_three.name"></el-input>
        </el-form-item>
        <el-form-item label="所有用户:" prop="GroupValue">
          <el-select v-model="form_three.GroupValue" multiple style="width:100%;">
            <el-option
              v-for="item in ChooseUserData"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_three')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterThree('form_three')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 授权组弹窗 -->
    <el-dialog title="用户组授权" :visible.sync="dialogFour" width="600px">
      <el-form label-width="80px" :model="form_four" :rules="toPerG" ref="form_four">
        <el-form-item label="组名称:" prop="name">
          <el-input v-model="form_four.name"></el-input>
        </el-form-item>
        <el-form-item label="授权:" prop="RoleValue">
          <el-select v-model="form_four.RoleValue" multiple style="width:100%;" placeholder="请选择角色">
            <el-option
              v-for="item in RoleData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_four')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterFour('form_four')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 授权用户弹窗 -->
    <el-dialog title="用户授权" :visible.sync="dialogFive" width="600px">
      <el-form label-width="100px" :model="form_five" :rules="toPerU" ref="form_five">
        <el-form-item label="用户名称:" prop="name">
          <el-input v-model="form_five.name"></el-input>
        </el-form-item>
        <el-form-item label="授权:" prop="RoleValue">
          <el-select v-model="form_five.RoleValue" multiple style="width:100%;" placeholder="请选择角色">
            <el-option
              v-for="item in RoleData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_five')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterFive('form_five')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 重置密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="dialogSix" width="600px">
      <el-form label-width="100px" :model="form_six" :rules="rulePass" ref="form_six">
        <el-form-item label="输入新密码:" prop="pass">
          <el-input v-model="form_six.pass" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_six')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterSix('form_six')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看用户弹窗 -->
    <el-dialog title="查看用户" :visible.sync="dialogSeven" width="600px">
      <el-form label-width="80px" :model="form_seven" ref="form_seven">
        <el-form-item label="用户名:">
          <el-input v-model="form_seven.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="登录状态:">
          <el-input v-model="form_seven.loginstatus" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户状态:">
          <el-input v-model="form_seven.status" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="关联员工:">
          <el-input v-model="form_seven.employ" disabled></el-input>
        </el-form-item>-->
        <el-form-item label="拥有角色:">
          <el-input v-model="form_seven.role" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属组:">
          <el-input v-model="form_seven.group" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="form_seven.Description" disabled></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_seven')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterSeven"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEight" width="600px">
      <el-form label-width="100px" :model="form_eight" :rules="ruleChangeU" ref="form_eight">
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="form_eight.name"></el-input>
        </el-form-item>
        <el-form-item label="登录状态:" prop="accountstatus">
          <el-select v-model="form_eight.accountstatus" style="width:100%;">
            <el-option
              v-for="item in accountstatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态:" prop="accountstatu">
          <el-select v-model="form_eight.accountstatu" style="width:100%;">
            <el-option
              v-for="item in accountstatu"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="关联员工:" >
          <el-select v-model="form_eight.employ" style="width:100%;">
            <el-option
              v-for="item in EmployData"
              :key="item.id"
              :label="item.personnelName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="拥有角色:">
          <el-input v-model="form_eight.role" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属组:">
          <el-select v-model="form_eight.group" style="width:100%;">
            <el-option
              v-for="item in groupdata"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="form_eight.Description"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('form_eight')">取消</el-button>
          <el-button
            style="color: #FFF; background-color: #0060A0;border-color: #0060A0;"
            @click="DeterEight('form_eight')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pageTop from "../../../components/pageTop.vue";
export default {
  name: "userIndex",
  data() {
    return {
      title: "账户管理",
      audit: true,
      online: true,
      outline: true,
      deleted: true,
      Initid: "", //初始用户组id
      InitName: "", //初始用户组name
      Accountid: "", //初始用户id
      choosegroup: "",
      initdex: "0",
      InputValue: "",
      allarr: [], //初始表格数据
      groupdata: [],
      tableData: [],
      tableTitle: [
        { name: "状态", tableprop: "online" },
        { name: "用户名", tableprop: "userName" },
        { name: "数据来源", tableprop: "accountSource" },
        { name: "拥有角色", tableprop: "rolesname" },
        { name: "描述", tableprop: "remark" },
      ],
      dialogOne: false,
      form_one: {
        name: "",
        GroupValue: [],
      },
      UserData: [],
      ChooseUserData: [],
      dialogTwo: false,
      form_two: {
        name: "",
        password: "",
        status: 0,
        statu: 0,
        group: "",
        Description: "",
      },
      accountstatu: [
        { label: "启用", value: 0 },
        { label: "禁用", value: 1 },
      ],
      accountstatus: [
        { label: "待审核", value: 0 },
        { label: "离线", value: 1 },
        { label: "在线", value: 2 },
        { label: "已删除", value: 3 },
      ],
      RoleData: [],
      EmployData: [],
      dialogThree: false,
      form_three: {
        name: "",
        GroupValue: [],
      },
      dialogFour: false,
      form_four: {
        name: "",
        RoleValue: [],
      },
      dialogFive: false,
      form_five: {
        name: "",
        RoleValue: [],
      },
      dialogSix: false,
      form_six: {
        pass: "",
      },
      dialogSeven: false,
      form_seven: {
        name: "",
        loginstatus: "",
        status: "",
        employ: "",
        role: "",
        group: "",
        Description: "",
      },
      dialogEight: false,
      form_eight: {
        name: "",
        password: "",
        accountstatus: "",
        accountstatu: "",
        employ: "",
        role: "",
        group: "",
        Description: "",
      },
      //新增组表单验证
      ruleAddG: {
        name: [{ required: true, message: "请输入组名称", trigger: "blur" }],
        GroupValue: [
          { required: true, message: "请选择所有用户", trigger: "change" },
        ],
      },
      //新增用户表单验证
      ruleAddU: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        statu: [
          { required: true, message: "请选择用户状态", trigger: "change" },
        ],
      },
      //修改组表单验证
      ruleChangeG: {
        name: [{ required: true, message: "请输入组名称", trigger: "blur" }],
        GroupValue: [
          { required: true, message: "请选择所有用户", trigger: "change" },
        ],
      },
      //授权组表单验证
      toPerG: {
        name: [{ required: true, message: "请输入组名称", trigger: "blur" }],
        RoleValue: [
          { required: true, message: "请选择所有角色", trigger: "change" },
        ],
      },
      //授权用户表单验证
      toPerU: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        RoleValue: [
          { required: true, message: "请选择所有角色", trigger: "change" },
        ],
      },
      //重置密码表单验证
      rulePass: {
        pass: [{ required: true, message: "请输入新密码", trigger: "blur" }],
      },
      //编辑i用户表单验证
      ruleChangeU: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        accountstatus: [
          { required: true, message: "请选择登录状态", trigger: "change" },
        ],
        accountstatu: [
          { required: true, message: "请选择用户状态", trigger: "change" },
        ],
      },
    };
  },
  components: {
    pageTop,
  },
  methods: {
    //数组中对象去重
    Getonly(arr) {
      var obj = {};
      var value = arr.reduce((item, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
        return item;
      }, []);
      return value;
    },
    //请求用户列表函数
    Getaccount() {
      let json = {
        Modular: "AccountManage",
        MN: "GetAccountList",
        DataContent: {
          id: this.Initid,
          status: this.Getvalue(
            this.audit,
            this.online,
            this.outline,
            this.deleted
          ),
          keyword: this.InputValue,
        },
      };
      this.MIX_send(json);
    },
    //请求用户组列表函数
    Getgroup() {
      let json = {
        Modular: "AccountManage",
        MN: "GetAccountGroupList",
        DataContent: {},
      };
      this.MIX_send(json);
    },
    //点击关键字搜索
    getValue() {
      this.Getaccount();
    },
    //勾选checkbox
    change() {
      this.Getaccount();
    },
    Clickgroup(t, i) {
      console.log(t);
      this.choosegroup = t;
      this.initdex = i;
      this.Initid = this.choosegroup.id;
      this.InitName = this.choosegroup.groupName;
    },
    //选择操作
    handleCommand(i) {
      if (i == "a") {
        this.dialogFour = true;
        this.form_four.name = this.InitName;
        let arr_one = [];
        let arr_two = [];
        arr_two = this.Getonly(this.choosegroup.roleList);
        arr_two.forEach((v, i) => {
          arr_one.push(v.id);
        });
        this.form_four.RoleValue = arr_one;
        let arr_three = [];
        let arr_four = [];
        arr_three = [...this.RoleData, ...arr_two];
        arr_four = this.Getonly(arr_three);
        this.RoleData = arr_four;
      } else if (i == "b") {
        //点击修改组
        let arr = [...this.UserData, ...this.allarr];
        this.ChooseUserData = this.Getonly(arr);
        let newarr = [];
        this.allarr.forEach((v, i) => {
          newarr.push(v.id);
        });
        this.form_three.GroupValue = newarr;
        this.form_three.name = this.InitName;
        this.dialogThree = true;
      } else if (i == "c") {
        this.$confirm("是否删除此组?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let json = {
              Modular: "AccountManage",
              MN: "DeleteAccountGroup",
              DataContent: {
                id: this.Initid,
              },
            };
            this.MIX_send(json);
          })
          .catch(() => {});
      }
    },
    //点击表格查看
    handleClickone(r) {
      console.log(r);
      this.form_seven.name = r.userName;
      this.form_seven.loginstatus = r.online;
      this.form_seven.status =
        r.status == "0" ? "启用" : r.status == "1" ? "禁用" : "禁用";
      // this.form_seven.employ = r.PersonnelName;
      this.form_seven.role = r.rolesname;
      this.form_seven.group = r.groupName;
      this.form_seven.Description = r.remark;
      this.dialogSeven = true;
    },
    //点击强制下线
    handleClicktwo(r) {
      this.$confirm("是否强制下线该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.Accountid = r.id;
          let json = {
            Modular: "AccountManage",
            MN: "UpdateAccountStatus",
            DataContent: {
              id: this.Accountid,
              status: "1",
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击编辑
    handleClickthree(r) {
      console.log(r);
      this.Accountid = r.id;
      this.form_eight.password = r.password;
      this.form_eight.name = r.userName;
      this.form_eight.accountstatus =
        r.online == "待审核"
          ? 0
          : r.online == "离线"
          ? 1
          : r.online == "在线"
          ? 2
          : r.online == "已删除"
          ? 3
          : 3;
      this.form_eight.accountstatu = Number(r.status);
      // this.form_eight.employ = r.pId;
      this.form_eight.role = r.rolesname;
      this.form_eight.group = r.agId;
      this.form_eight.Description = r.remark;
      this.dialogEight = true;
    },
    //点击审核
    handleClickfour(r) {
      console.log(r);
      this.$confirm("审核该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.Accountid = r.id;
          let json = {
            Modular: "AccountManage",
            MN: "UpdateAccountStatus",
            DataContent: {
              id: this.Accountid,
              status: "0",
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击删除
    handleClickfive(r) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.Accountid = r.id;
          let json = {
            Modular: "AccountManage",
            MN: "DeleteAccount",
            DataContent: {
              id: this.Accountid,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击表格授权
    handleClicksix(r) {
      this.form_five.name = r.userName;
      this.Accountid = r.id;
      let arr_one = [];
      let arr_two = [];
      arr_one = this.Getonly(r.roleList);
      arr_one.forEach((v, i) => {
        arr_two.push(v.id);
      });
      this.form_five.RoleValue = arr_two;
      let arr_three = [...this.RoleData, ...arr_one];
      let arr_four = this.Getonly(arr_three);
      this.RoleData = arr_four;
      this.dialogFive = true;
    },
    //点击重置密码
    handleClickseven(r) {
      this.form_six = {
        pass:""
      }
      this.dialogSix = true;
      this.Accountid = r.id;
    },
    //点击增加用户组
    AddGroup() {
      this.form_one = {
        name: "",
        GroupValue: [],
      };
      this.dialogOne = true;
    },
    //点击确定
    DeterOne(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          let arr = [];
          this.form_one.GroupValue.forEach((value, index) => {
            arr.push({ id: value });
          });
          let json = {
            Modular: "AccountManage",
            MN: "SaveAccountGroup",
            DataContent: {
              id: "0",
              groupName: this.form_one.name,
              accountList: arr,
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
    //点击弹窗取消
    Cancer(r) {
      this.$refs[r].resetFields();
      this.dialogOne = false;
      this.dialogTwo = false;
      this.dialogThree = false;
      this.dialogFour = false;
      this.dialogFive = false;
      this.dialogSix = false;
      this.dialogSeven = false;
      this.dialogEight = false;
    },
    //点击新增用户
    AddUser() {
      this.form_two = {
        name: "",
        password: "",
        status: 0,
        statu: 0,
        group: "",
        Description: "",
      };
      this.dialogTwo = true;
    },
    //点击确定
    DeterTwo(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          let json = {
            Modular: "AccountManage",
            MN: "SaveAccount",
            DataContent: {
              id: "0",
              userName: this.form_two.name,
              password: this.form_two.password,
              accountSource: "0",
              online: 0,
              status: this.form_two.statu,
              agId: this.form_two.group,
              remark: this.form_two.Description,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
    //点击修改组确定
    DeterThree(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          let arr = [];
          this.form_three.GroupValue.forEach((value, index) => {
            arr.push({ id: value });
          });
          let json = {
            Modular: "AccountManage",
            MN: "SaveAccountGroup",
            DataContent: {
              id: this.Initid,
              groupName: this.form_three.name,
              accountList: arr,
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
    //点击用户组授权确定
    DeterFour(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          let arr = [];
          this.form_four.RoleValue.forEach((v, i) => {
            arr.push({ id: v });
          });
          let json = {
            Modular: "AccountManage",
            MN: "AccountOrGroupAuthorize",
            DataContent: {
              type: "0",
              agId: this.Initid,
              roleList: arr,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
    //点击用户授权确定
    DeterFive(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          let arr = [];
          this.form_five.RoleValue.forEach((v, i) => {
            arr.push({ id: v });
          });
          let json = {
            Modular: "AccountManage",
            MN: "AccountOrGroupAuthorize",
            DataContent: {
              type: "1",
              agId: this.Accountid,
              roleList: arr,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
    //点击重置密码确定
    DeterSix(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          let json = {
            Modular: "AccountManage",
            MN: "ResetAccountPassword",
            DataContent: {
              id: this.Accountid,
              newPassword: this.form_six.pass,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
    //点击查看用户确定
    DeterSeven() {
      this.dialogSeven = false;
    },
    //点击编辑用户确定
    DeterEight(r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          // let arr = [];
          // this.tableData.forEach((value, index) => {
          //   if (value.id == this.Accountid) {
          //     arr = value.roleList;
          //   }
          // });
          let json = {
            Modular: "AccountManage",
            MN: "SaveAccount",
            DataContent: {
              id: this.Accountid,
              userName: this.form_eight.name,
              password: this.form_eight.password,
              online: this.form_eight.accountstatus,
              status: this.form_eight.accountstatu,
              accountSource: "0",
              agId: this.form_eight.group,
              // roleList: arr,
              remark: this.form_eight.Description,
            },
          };
          this.MIX_send(json);
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    //请求用户组列表
    let json = {
      Modular: "AccountManage",
      MN: "GetAccountGroupList",
      DataContent: {},
    };
    this.MIX_send(json);
    //请求可选择用户列表
    let json_one = {
      Modular: "AccountManage",
      MN: "GetSetUpAccountList",
      DataContent: {
        id: "0",
      },
    };
    this.MIX_send(json_one);
    //请求员工列表
    // let json_three = {
    //   Modular: "AccountManage",
    //   MN: "GetPersonnelList",
    //   DataContent: {},
    // };
    // this.MIX_send(json_three);
    //查询角色列表
    let json_four = {
      Modular: "AccountManage",
      MN: "GetRoleList",
      DataContent: {},
    };
    this.MIX_send(json_four);
  },
  watch: {
    //监听Initid的变化
    Initid: function () {
      this.Getaccount();
    },
    "$store.state.Permission.MNvalue.GetPersonnelByIdForCollector": function (
      data
    ) {
      sessionStorage.setItem(
        "GetPersonnelByIdForCollector",
        JSON.stringify(data)
      );
    },
    //用户组列表回调
    "$store.state.Permission.MNvalue.GetAccountGroupList": function (data) {
      if (data.Code == "0") {
        if (data.ReturnData.length > 0) {
          this.groupdata = data.ReturnData;
          this.Initid = this.groupdata[0].id;
          this.initdex = "0";
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //用户列表回调
    "$store.state.Permission.MNvalue.GetAccountList": function (data) {
      if (data.Code == "0") {
        this.allarr = data.ReturnData;
        let newarr = [];
        newarr = data.ReturnData;
        if (newarr instanceof Array) {
          newarr.forEach((value, index) => {
            newarr[index].online =
              newarr[index].online == "0"
                ? "待审核"
                : newarr[index].online == "1"
                ? "离线"
                : newarr[index].online == "2"
                ? "在线"
                : newarr[index].online == "3"
                ? "已删除"
                : "已删除";
            newarr[index].accountSource =
              newarr[index].accountSource == "0"
                ? "管理员添加"
                : newarr[index].accountSource == "1"
                ? "用户注册"
                : newarr[index].accountSource == "2"
                ? "内部应用注册"
                : "内部应用注册";
            let role = [];
            newarr[index].hasOwnProperty("roleList") &&
              newarr[index].roleList.forEach((v, i) => {
                role.push(v.roleName);
              });
            newarr[index].rolesname = role.join(",");
          });
        }
        this.tableData = newarr;
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //重置密码回调
    "$store.state.Permission.MNvalue.ResetAccountPassword": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "重置密码成功",
        });
        this.$refs.form_six.resetFields();
        this.dialogSix = false;
        //重新请求用户列表
        this.Getaccount();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //强制下线/审核用户
    "$store.state.Permission.MNvalue.UpdateAccountStatus": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        //重新请求用户列表
        this.Getaccount();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //删除用户
    "$store.state.Permission.MNvalue.DeleteAccount": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "删除用户成功",
        });
        //重新请求用户列表
        this.Getaccount();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //获取可选用户
    "$store.state.Permission.MNvalue.GetSetUpAccountList": function (data) {
      if (data.Code == "0") {
        // let arr = []
        // this.Getonly(data.ReturnData).forEach((i,v)=>{
        //   arr.push(i.id)
        // })
        // console.log(arr,"6464646")
        //去重
        this.UserData = this.Getonly(data.ReturnData);
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //新增用户组
    "$store.state.Permission.MNvalue.SaveAccountGroup": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        this.dialogOne = false;
        this.dialogThree = false;
        //重新请求用户组列表
        this.Getgroup();
        this.Getaccount();
        this.initdex = "0";
        let json_one = {
          Modular: "AccountManage",
          MN: "GetSetUpAccountList",
          DataContent: {
            id: "0",
          },
        };
        this.MIX_send(json_one);
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //删除组
    "$store.state.Permission.MNvalue.DeleteAccountGroup": function (data) {
      if (data.Code == "0") {
        //重新请求用户组列表
        this.Getgroup();
        let json_one = {
          Modular: "AccountManage",
          MN: "GetSetUpAccountList",
          DataContent: {
            id: "0",
          },
        };
        this.MIX_send(json_one);
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //请求员工回调
    "$store.state.Permission.MNvalue.GetPersonnelList": function (data) {
      if (data.Code == "0") {
        this.EmployData = data.ReturnData;
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //新增员工/修改
    "$store.state.Permission.MNvalue.SaveAccount": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        this.dialogTwo = false;
        this.dialogEight = false;
        //重新请求用户数据
        this.Getaccount();
        let json_one = {
          Modular: "AccountManage",
          MN: "GetSetUpAccountList",
          DataContent: {
            id: "0",
          },
        };
        this.MIX_send(json_one);
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //查询角色回调
    "$store.state.Permission.MNvalue.GetRoleList": function (data) {
      if (data.Code == "0") {
        this.RoleData = data.ReturnData;
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    "$store.state.Permission.MNvalue.AccountOrGroupAuthorize": function (data) {
      if (data.Code == "0") {
        this.dialogFour = false;
        this.dialogFive = false;
        //重新请求用户组
        this.Getgroup();
        //重新请求用户数据
        this.Getaccount();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.btn_body {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.btn_item {
  flex: 1;
}
#user {
  width: 100%;
  height: 100%;
  background: white;
  padding: 0 20px;
  box-sizing: border-box;
}
.head {
  width: 100%;
  height: 40px;
  display: flex;
  // justify-content: flex-end;
  justify-content: space-between;
  margin-top: 20px;
}
.checkboxs {
  height: 40px;
  line-height: 40px;
  margin-right: 50px;
}
// .buttons {

// }
.el-button--primary {
  color: #fff;
  background-color: #0060a0;
  border-color: #0060a0;
  width: 6.8125rem;
  height: 2.6875rem;
}
/deep/ .el-dialog__header {
  margin: 0 2rem;
  padding: 20px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    margin-left: 20px;
    color: #4d6474;
    font-size: 18px;
    font-weight: 400;
  }
}
.content {
  margin-top: 40px;
  width: 100%;
  height: 620px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
.leftcontent {
  width: 230px;
  height: 620px;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid rgb(230, 230, 230);
}
.rightcontent {
  width: calc(100% - 230px);
  flex: 1;
  height: 620px;
  overflow-y: auto;
  overflow-x: hidden;
}
.bg {
  background: #0060a0;
  color: white;
}
.Colorbutton {
  font-size: 14px;
  color: #0060a0;
  font-weight: 500;
}
</style>
<style>
</style>