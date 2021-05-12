<template>
  <div id="per">
    <pageTop :title="title"></pageTop>
    <div class="head">
      <div style="width:100px;">
        <el-button type="primary" size="small" @click="Addper" v-permission="['Per_Addper']">新增</el-button>
      </div>
      <div class="inputs">
        <el-select
          v-model="Statusvalue"
          clearable
          placeholder="请选择状态"
          style="width:200px;margin-right:20px"
        >
          <el-option
            v-for="item in statudata"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="Typevalue"
          clearable
          placeholder="请选择类型"
          style="width:200px;margin-right:20px"
        >
          <el-option
            v-for="item in Typedata"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
    <el-table
      :data="tableData"
      row-key="id"
      style="width:100%;margin-top:20px;"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      class="tabl_cmp"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            class="Colorbutton"
            v-if="scope.row.Allstatus =='启用'"
            @click="handleClickone(scope.row)"
            type="text"
            size="small"
            v-permission="['Per_Editorper']"
          >
            <span class="Icon-iconedit IconFont"></span>&nbsp;编辑
          </el-button>
          <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='启用'"></span>
          <el-button
            class="Colorbutton"
            v-if="scope.row.Allstatus =='启用'"
            @click="handleClicktwo(scope.row)"
            type="text"
            size="small"
            v-permission="['Per_Deleteper']"
          >
            <span class="Icon-icondelete IconFont" v-if="scope.row.Allstatus =='启用'"></span>&nbsp;删除
          </el-button>
          <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='启用'"></span>
          <el-button
            class="Colorbutton"
            v-if="scope.row.Allstatus =='失效'"
            @click="handleClickthree(scope.row)"
            type="text"
            size="small"
          >
            <span class="Icon-icondelete IconFont"></span>&nbsp;清除
          </el-button>
          <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='失效'"></span>
          <el-button
            class="Colorbutton"
            v-if="scope.row.Allstatus =='失效'"
            @click="handleClickfour(scope.row)"
            type="text"
            size="small"
          >
            <span class="iconhuishou IconFont"></span>&nbsp;回收
          </el-button>
          <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='失效'"></span>
          <el-button
            class="Colorbutton"
            v-if="scope.row.Allstatus =='禁用'"
            @click="handleClickfive(scope.row)"
            type="text"
            size="small"
          >
            <span class="iconuse IconFont"></span>&nbsp;启用
          </el-button>
          <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='禁用'"></span>
          <el-button
            class="Colorbutton"
            v-if="scope.row.Allstatus =='启用'"
            @click="handleClicksix(scope.row)"
            type="text"
            size="small"
          >
            <span class="iconnotuse IconFont"></span>&nbsp;禁用
          </el-button>
          <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='启用'"></span>
          <el-button
            class="Colorbutton"
            @click="handleClickseven(scope.row)"
            type="text"
            size="small"
            v-permission="['Per_Addper']"
          >
            <span class="iconadd IconFont"></span>&nbsp;新增
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增权限弹出框 -->
    <el-dialog :title="dialogname" :visible.sync="dialogone" width="1000px">
      <el-form label-width="70px" :model="formone" :rules="ruleAddPer" ref="formone">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="formone.name" placeholder="请输入权限项名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" prop="type">
              <el-select
                v-model="formone.type"
                placeholder="请选择类型"
                style="width:100%;"
                @change="TypeChange"
              >
                <el-option
                  v-for="item in Typedata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父权限:" prop="parent">
              <el-select v-model="formone.parent" placeholder="请选择父权限" style="width:100%;">
                <el-option
                  v-for="item in Parentdata"
                  :key="item.id"
                  :label="item.authorityName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select v-model="formone.status" placeholder="请选择状态" style="width:100%;">
                <el-option
                  v-for="item in statudata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="接口:">
          <el-select v-model="Inter" placeholder="请选择接口" style="width:100%;" disabled>
            <el-option v-for="item in Interdata" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源:">
          <el-input v-model="formone.resourse" placeholder="请输入资源"></el-input>
        </el-form-item>
        <div v-if="false">数据列</div>
        <div class="Datacolumn" v-if="false">
          <div class="leftcolu">
            <el-tree
              :data="DataTable"
              :props="defaultProps"
              ref="tree"
              node-key="nid"
              check-strictly
              :default-expanded-keys="Initexpand"
              @check="handleCheckChange"
            >
              <span slot-scope="{  data }">
                <input
                  type="checkbox"
                  v-if="data.show"
                  v-model="data.checked"
                  @change="Checknode(data)"
                />
                <span>{{data.tableName}}</span>
              </span>
            </el-tree>
          </div>
          <div class="centercolu">
            <el-button
              style="color: #FFF;background-color:#0060A0;border-color:#0060A0;width:80px;"
              size="small"
              @click="Clickinport"
            >导入</el-button>
          </div>
          <div class="rightcolu">
            <div class="colurig" v-for="(item,index) in linedata" :key="index">
              <div>
                <el-tooltip class="item" effect="dark" :content="item.label" placement="left">
                  <el-input v-model="item.label" style="width:200px" disabled></el-input>
                </el-tooltip>
              </div>
              <div>
                <i
                  class="el-icon-error"
                  style="line-height:40px;font-size:24px"
                  @click="CancerContent(item,index)"
                ></i>
              </div>
              <div>
                显示名称:
                <el-input placeholder="请输入名称" v-model="item.name" style="width:200px"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div v-if="false">
          数据行
          <el-button
            size="small"
            style="width:80px;margin-left:20px;color: #FFF;background-color:#0060A0;border-color:#0060A0;"
            @click="clickAdd"
          >新增</el-button>
        </div>
        <el-table
          v-if="false"
          :data="tableData_two"
          style="width:100%;margin-top:20px;margin-bottom:20px;"
          height="200"
          show-overflow-tooltip
          :header-cell-style="{background:'#F5F5F5'}"
        >
          <el-table-column prop="name" label="显示名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="condition" label="条件" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.condition |SetCondition}}</template>
          </el-table-column>
          <el-table-column prop label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button class="Colorbutton" @click="Clickone(scope.row)" type="text" size="small">
                <span class="Icon-iconedit IconFont"></span>编辑
                <span class="Icon-iconline IconFont"></span>
              </el-button>
              <el-button class="Colorbutton" @click="Clicktwo(scope.row)" type="text" size="small">
                <span class="Icon-iconedelete IconFont"></span>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="formone.des" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer('formone')">取消</el-button>
          <el-button
            @click="Deter('formone')"
            style="color: #FFF;background-color:#0060A0;border-color:#0060A0;"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="titletwo" :visible.sync="dialogtwo" width="800px">
      <el-form label-width="100px" :model="formtwo">
        <el-form-item label="显示名称:">
          <el-input v-model="formtwo.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="添加条件组:">
          <i
            class="el-icon-circle-plus"
            style="font-size:24px;margin-top:8px"
            @click="Addcondition"
          ></i>
        </el-form-item>
        <div
          class="DataRow"
          v-for="(item,index) in tableOne"
          :key="index"
          style="margin-bottom:5px;"
        >
          <div class="DataRowHead" style="margin-bottom:5px;">
            <div style="width:80px;">
              <el-select v-model="item.relation" v-if="index != '0'">
                <el-option
                  v-for="item in relationGroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-button plain size="mini" @click="AddContent(index)">添加条件</el-button>
              <el-button plain size="mini" @click="DeleteG(index)">删除分组</el-button>
            </div>
          </div>
          <div class="DtataRowContent">
            <div v-for="(val,dex) in item.conditionData" :key="dex">
              <div>
                <div style="width:80px;margin-left:10px;margin-bottom:5px;">
                  <el-select v-model="val.relation" v-if="dex != '0'">
                    <el-option
                      v-for="item in relationGroup"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="Checkdata">
                <div style="margin-left:10px">
                  <el-select v-model="val.Name" style="width:300px;">
                    <el-option
                      v-for="item in linedata"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </div>
                <div>
                  <el-select v-model="val.Condition" style="width:120px;">
                    <el-option
                      v-for="item in choosedata"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div>
                  <el-input v-model="val.Value" placeholder="请输入参数名称" style="width:200px;"></el-input>
                </div>
                <div style="margin-right:10px">
                  <i
                    class="el-icon-error"
                    style="font-size:24px;line-height:40px"
                    @click="Delete(index,dex)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-button
          style="color: #FFF;background-color:#0060A0;border-color:#0060A0;margin:5px 0"
          size="small"
          @click="Lookresult"
        >查看条件组装</el-button>
        <el-form-item label="条件组装:">
          <el-input type="textarea" v-model="formtwo.Allcondition"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;margin-top:20px">
          <el-button @click="Cancertable">取消</el-button>
          <el-button
            @click="Detertable"
            style="color: #FFF;background-color:#0060A0;border-color:#0060A0;"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { delete } from 'vue/types/umd';
import pageTop from '../../../components/pageTop.vue'
export default {
  name: "perIndex",
  data () {
    return {
      title: "权限维护",
      Initexpand: "",
      DataTable: [],
      tableOne: [],
      InputValue: "",
      statudata: [
        { label: "启用", value: 0 },
        { label: "禁用", value: 1 },
        { label: "失效", value: 2 },
        { label: "删除", value: 3 },
      ],
      Statusvalue: "",
      Typedata: [
        { label: "接口", value: 0 },
        { label: "模块", value: 1 },
        { label: "组件", value: 2 },
        { label: "控件", value: 3 },
      ],
      Typevalue: "",
      tableTitle: [
        { name: "名称", tableprop: "authorityName" },
        { name: "状态", tableprop: "Allstatus" },
        { name: "类型", tableprop: "Alltype" },
        { name: "父权限", tableprop: "parentName" },
        { name: "资源", tableprop: "resources" },
        { name: "接口名称", tableprop: "interfaceUrl" },
        { name: "描述", tableprop: "remark" },
      ],
      tableData: [],
      dialogone: false,
      dialogname: "",
      formone: {
        name: "",
        type: "",
        parent: "",
        status: "",
        resourse: "",
        des: "",
      },
      Inter: "",
      Initid: "",
      InterName: "",
      Parentdata: [],
      Interdata: [],
      tableData_two: [],
      dialogtwo: false,
      formtwo: {
        name: "",
        Allcondition: "",
      },
      linedata: [],
      SendRowData: [],
      choosedata: [
        { label: "大于", value: ">" },
        { label: "小于", value: "<" },
        { label: "等于", value: "=" },
        { label: "大于等于", value: ">=" },
        { label: "小于等于", value: "<=" },
        { label: "不等于", value: "!=" },
        { label: "包含", value: "in" },
        { label: "不包含", value: "not in" },
      ],
      RequestId:"",
      relationGroup: [
        { label: "并且", value: "and" },
        { label: "或者", value: "or" },
      ],
      titletwo: "",
      tableNum: "",
      defaultProps: {
        children: "dataPropertyList",
        label: "tableName",
      },
      //新增编辑权限弹出框表单验证
      ruleAddPer: {
        name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        parent: [
          { required: true, message: "请选择父权限", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  filters: {
    SetCondition (val) {
      let arr = JSON.parse(JSON.stringify(val));
      delete arr[0].relation;
      arr.forEach((item, index) => {
        delete item.conditionData[0].relation;
      });
      let str = "";
      let Allstr = "";
      arr.forEach((item, index) => {
        str = "";
        item.conditionData.forEach((v, i) => {
          if (!v.relation) {
            str =
              str +
              "(" +
              v.Name +
              " " +
              v.Condition +
              " " +
              "@" +
              v.Value +
              ")";
          } else {
            str =
              str +
              " " +
              v.relation +
              " " +
              "(" +
              v.Name +
              " " +
              v.Condition +
              " " +
              "@" +
              v.Value +
              ")";
          }
        });
        if (!item.relation) {
          Allstr = Allstr + `(${str})`;
        } else {
          Allstr = Allstr + " " + item.relation + " " + `(${str})`;
        }
      });
      return Allstr;
    },
  },
  components: {
    pageTop
  },
  methods: {
    //请求接口下拉数据
    getInter () {
      let json = {
        MN: "GetApis",
        DataContent: { KeyWord: "", PageSize: 10000000, PageIndex: 1 },
      };
      this.MIX_send(json);
    },
    //生成树级数据
    toTree (data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children;
      });

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function (item) {
        map[item.id] = item;
      });
      //        console.log(map);
      var val = [];
      data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    },
    //获取类型状态
    InitType (Typevalue) {
      if (Typevalue != null) {
        return Typevalue;
      } else {
        return "";
      }
    },
    //请求权限列表
    Togetdata (RequestId) {
      this.RequestId = RequestId;
      let json = {
        Modular: "AuthorityManage",
        MN: "GetAuthorityList",
        DataContent: {
          status: RequestId == "1" ? "" : this.Statusvalue,
          type: RequestId == "1" ? "" : this.InitType(this.Typevalue),
          keyword: RequestId == "1" ? "" : this.InputValue,
        },
      };
      this.MIX_send(json);
    },
    //点击搜索关键字
    getValue () {
      this.Togetdata(2);
    },
    //点击新增
    Addper () {
      this.dialogname = "新增权限项";
      this.formone = {
        name: "",
        name: "",
        type: 1,
        parent: 0,
        status: 0,
        resourse: "",
        des: "",
      }
      this.linedata = [];
      this.tableData_two = [];
      this.Togetdata(1);
      this.dialogone = true;
    },
    //点击表格编辑
    handleClickone (r) {
      console.log(r);
      console.log(this.Parentdata);
      this.Togetdata(1);
      this.dialogname = "编辑权限项";
      this.Initid = r.id;
      this.formone.name = r.authorityName;
      this.formone.type = Number(r.type);
      this.formone.parent = Number(r.parentId);
      this.formone.status = Number(r.status);
      this.Inter = r.type == "0" ? r.interfaceUrl : "";
      this.formone.resourse = r.resources;
      if (r.dataColomn) {
        this.linedata = JSON.parse(r.dataColomn);
        this.Initexpand = [this.linedata[0].value];
        let DataTable = JSON.parse(JSON.stringify(this.DataTable));
        this.linedata.forEach((item, index) => {
          DataTable.forEach((v, i) => {
            if (item.TableName == v.tableName) {
              v.dataPropertyList.forEach((val, dex) => {
                if (item.value == val.nid) {
                  val.checked = true;
                }
              });
            }
          });
        });
        this.DataTable = [];
        setTimeout(() => {
          this.DataTable = DataTable;
        }, 10);
      }
      if (r.dataRow) this.tableData_two = JSON.parse(r.dataRow);
      this.formone.des = r.remark;
      this.dialogone = true;
    },
    //点击表格删除
    handleClicktwo (r) {
      this.$confirm("是否删除此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "AuthorityManage",
            MN: "UpdateAuthorityStatus",
            DataContent: {
              id: r.id,
              status: "2",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => { });
    },
    //点击表格清除
    handleClickthree (r) {
      this.$confirm("是否清除此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "AuthorityManage",
            MN: "UpdateAuthorityStatus",
            DataContent: {
              id: r.id,
              status: "3",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => { });
    },
    //点击表格回收
    handleClickfour (r) {
      this.$confirm("是否回收此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "AuthorityManage",
            MN: "UpdateAuthorityStatus",
            DataContent: {
              id: r.id,
              status: "4",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => { });
    },
    //点击表格新增
    handleClickseven (r) {
      this.Addper();
      this.Togetdata(1);
      this.formone.parent = r.id;
    },
    //点击启用
    handleClickfive (r) {
      this.$confirm("是否启用此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "AuthorityManage",
            MN: "UpdateAuthorityStatus",
            DataContent: {
              id: r.id,
              status: "0",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => { });
    },
    //点击禁用
    handleClicksix (r) {
      this.$confirm("是否禁用此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "AuthorityManage",
            MN: "UpdateAuthorityStatus",
            DataContent: {
              id: r.id,
              status: "1",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => { });
    },
    //点击弹窗确定
    Deter (r) {
      this.$refs[r].validate((valid) => {
        if (valid) {
          //判断是新增还是编辑
          console.log(this.linedata);
          console.log(this.tableData_two);
          let json = {
            Modular: "AuthorityManage",
            MN: "SaveAuthority",
            DataContent: {
              id: this.dialogname == "新增权限项" ? "0" : this.Initid,
              authorityName: this.formone.name,
              type: this.formone.type,
              parentId: this.formone.parent,
              resources: this.formone.resourse,
              status: this.formone.status,
              interfaceUrl: this.InterName,
              dataColomn: JSON.stringify(this.linedata),
              dataRow: JSON.stringify(this.tableData_two),
              remark: this.formone.des,
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
    Cancer (r) {
      this.$refs[r].resetFields();
      this.Inter = "";
      this.formone.resourse = "";
      this.linedata = [];
      this.DataTable.forEach((v, o) => {
        if (v.dataPropertyList) {
          v.dataPropertyList.forEach((val, index) => {
            val.checked = false;
          });
        }
      });
      this.tableData_two = [];
      this.formone.des = "";
      this.dialogone = false;
    },
    //点击导入
    Clickinport () {
      this.linedata = [];
      let arr = [];
      this.DataTable.forEach((v, i) => {
        v.dataPropertyList.forEach((val, index) => {
          if (val.checked) {
            let obj = {
              label: val.name,
              value: val.nid,
              TableName: val.TableName,
              fible: val.tableName,
              name: "",
            };
            arr.push(obj);
          }
        });
      });
      this.linedata = arr;
      console.log(this.linedata);
    },
    //点击表单新增
    clickAdd () {
      this.titletwo = "新增数据行";
      this.formtwo.name = "";
      this.formtwo.Allcondition = "";
      this.tableOne = [];
      this.dialogtwo = true;
    },
    //点击表单内表格的编辑
    Clickone (r) {
      this.tableNum = r.id;
      this.titletwo = "编辑数据行";
      this.formtwo.name = r.name;
      this.formtwo.Allcondition = "";
      this.tableOne = r.condition;
      this.dialogtwo = true;
    },
    //点击表单内表格的删除
    Clicktwo (r) {
      this.tableData_two.forEach((v, i) => {
        if (r.id == v.id) {
          this.tableData_two.splice(i, 1);
        }
      });
    },
    //点击添加条件
    AddContent (index) {
      let obj = {
        relation: this.tableOne[index].conditionData.length ? "and" : "",
        Name: "",
        Condition: "",
        Value: "",
      };
      this.tableOne[index].conditionData.push(obj);
    },
    //点击删除分组
    DeleteG (index) {
      this.tableOne.splice(index, 1);
    },
    //点击查看条件组装
    Lookresult () {
      let arr = JSON.parse(JSON.stringify(this.tableOne));
      delete arr[0].relation;
      arr.forEach((item, index) => {
        delete item.conditionData[0].relation;
      });
      this.SendRowData = arr;
      let str = "";
      let Allstr = "";
      arr.forEach((item, index) => {
        str = "";
        item.conditionData.forEach((v, i) => {
          if (!v.relation) {
            str =
              str +
              "(" +
              v.Name +
              " " +
              v.Condition +
              " " +
              "@" +
              v.Value +
              ")";
          } else {
            str =
              str +
              " " +
              v.relation +
              " " +
              "(" +
              v.Name +
              " " +
              v.Condition +
              " " +
              "@" +
              v.Value +
              ")";
          }
        });
        if (!item.relation) {
          Allstr = Allstr + `(${str})`;
        } else {
          Allstr = Allstr + " " + item.relation + " " + `(${str})`;
        }
      });
      this.formtwo.Allcondition = Allstr;
    },
    //点击加号
    Addcondition () {
      if (
        this.tableOne.length != 0 &&
        this.tableOne[this.tableOne.length - 1].conditionData &&
        this.tableOne[this.tableOne.length - 1].conditionData.length == 0
      ) {
        this.$message({
          showClose: true,
          message: "请优先选择当前组条件!",
        });
        return;
      }
      let obj = {
        relation: this.tableOne.length ? "and" : "",
        conditionData: [],
      };
      this.tableOne.push(obj);
    },
    //点击×
    Delete (index, dex) {
      this.tableOne[index].conditionData.splice(dex, 1);
    },
    //点击数据行表单确定
    Detertable () {
      if (this.titletwo == "新增数据行") {
        console.log(this.tableOne);
        this.tableData_two.push({
          id: new Date().getTime(),
          name: this.formtwo.name,
          condition: this.tableOne,
        });
        console.log(this.tableData_two);
        this.dialogtwo = false;
      } else {
        this.tableData_two.forEach((v, i) => {
          if (v.id == this.tableNum) {
            v.condition = this.tableOne;
            v.name = this.formtwo.name;
          }
        });
        this.dialogtwo = false;
      }
    },
    //点击数据行表单取消
    Cancertable () {
      this.dialogtwo = false;
    },
    // 设置勾选
    setCheckedKeys () {
      this.$refs.tree.setCheckedKeys([7, 8]);
    },
    //勾选数据列
    Checknode (val) {
      console.log(val);
    },
    //获取父NID
    GetP (nid) {
      for (let index = 0; index < this.DataTable.length; index++) {
        if (this.DataTable[index].dataPropertyList) {
          for (
            let i = 0;
            i < this.DataTable[index].dataPropertyList.length;
            i++
          ) {
            if (this.DataTable[index].dataPropertyList[i].nid == nid) {
              return this.DataTable[index].nid;
            }
          }
        }
      }
    },
    //勾选数据列
    handleCheckChange (r, i) {
      console.log(r);
      console.log(i);
      console.log(r.nid);
      console.log(i.checkedKeys);
      // let pnid = "";
      // if (!r.dataPropertyList) {

      // }else{
      //   pnid = r.nid;
      // }
      // console.log(pnid)
      // this.setCheckedKeys()
    },
    //点击取消
    CancerContent (item, index) {
      this.linedata.splice(index, 1);
      let DataTable = JSON.parse(JSON.stringify(this.DataTable));
      DataTable.forEach((v, i) => {
        v.dataPropertyList.forEach((val, ind) => {
          if (val.nid == item.value) {
            val.checked = false;
            this.Initexpand = [v.nid];
          }
        });
      });
      this.DataTable = [];
      setTimeout(() => {
        this.DataTable = DataTable;
      }, 10);
    },
    TypeChange () {
      this.formone.resourse = "";
      this.Inter = "";
      this.linedata = [];
      this.tableData_two = [];
      this.DataTable.forEach((v, o) => {
        if (v.dataPropertyList) {
          v.dataPropertyList.forEach((val, index) => {
            val.checked = false;
          });
        }
      });
    },
  },
  mounted () {
    //请求用户权限列表
    this.Togetdata(2);
    //获取数据库表
    // let json = {
    //   Modular: "AuthorityManage",
    //   MN: "GetDataTableList",
    //   DataContent: {},
    // };
    // this.MIX_send(json);
    //请求接口列表
    // this.getInter();
  },
  watch: {
    //监听接口的变化
    Inter: function () {
      this.Interdata.forEach((v, i) => {
        if (this.Inter == v.Id) {
          this.formone.resourse = v.Path;
          this.InterName = v.Name;
        }
      });
    },
    //监听Statusvalue变化
    Statusvalue: function () {
      this.Togetdata(2);
    },
    //监听Typevalue变化
    Typevalue: function () {
      this.Togetdata(2);
    },
    //用户列表回调函数
    "$store.state.Permission.MNvalue.GetAuthorityList": function (data) {
      if (data.Code == "0") {
        data.ReturnData.forEach((v, i) => {
          v.Allstatus =
            v.status == "0"
              ? "启用"
              : v.status == "1"
                ? "禁用"
                : v.status == "2"
                  ? "失效"
                  : v.status == "3"
                    ? "删除"
                    : "删除";
          v.Alltype =
            v.type == "0"
              ? "接口"
              : v.type == "1"
                ? "模块"
                : v.type == "2"
                  ? "组件"
                  : v.type == "3"
                    ? "控件"
                    : "控件";
        });
        if(this.RequestId == "1"){
          this.Parentdata = JSON.parse(JSON.stringify(data.ReturnData));
          this.Parentdata.unshift({ authorityName: "无", id: 0 });
        }else{
           this.tableData = this.toTree(data.ReturnData);
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    "$store.state.Permission.MNvalue.UpdateAuthorityStatus": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        //重新请求权限列表
        this.Togetdata(2);
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //新增/修改权限回调
    "$store.state.Permission.MNvalue.SaveAuthority": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        this.$refs.formone.resetFields();
        this.Inter = "";
        this.formone.resourse = "";
        this.linedata = [];
        this.tableData_two = [];
        this.DataTable.forEach((v, o) => {
          if (v.dataPropertyList) {
            v.dataPropertyList.forEach((val, index) => {
              val.checked = false;
            });
          }
        });
        this.formone.des = "";
        this.dialogone = false;
        this.Statusvalue = "";
        this.Typevalue = "";
        this.InputValue = "";
        this.Togetdata(2);
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //数据库表回调
    "$store.state.Permission.MNvalue.GetDataTableList": function (data) {
      if (data.Code == "0") {
        this.DataTable = data.ReturnData;
        let i = 0;
        this.DataTable.forEach((v, o) => {
          v.nid = ++i;
          v.show = false;
          if (v.dataPropertyList) {
            v.dataPropertyList.forEach((val, index) => {
              val.tableName = val.propertyName;
              val.nid = v.nid + index + 1;
              val.checked = false;
              val.show = true;
              val.name = v.tableName + "." + val.tableName;
              val.TableName = v.tableName;
            });
          }
          i = v.dataPropertyList[v.dataPropertyList.length - 1].nid;
        });
        console.log(this.DataTable);
        this.Initexpand = [this.DataTable[0].nid];
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    "$store.state.Permission.MNvalue.GetApis": function (data) {
      if (data.Code == "0") {
        this.Interdata = data.ReturnData.Data;
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
<style scoped lang="less">
#per {
  min-width: 1100px;
  height: 100%;
  padding: 0 20px;
  background: white;
  box-sizing: border-box;
}
.head {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.inputs {
  height: 40px;
  line-height: 40px;
}
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
.Datacolumn {
  width: 100%;
  height: 350px;
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  align-items: center;
}
.leftcolu {
  height: 350px;
  width: 300px;
  border: solid 1px gray;
  overflow: auto;
}
.rightcolu {
  height: 350px;
  width: 500px;
  padding: 0 5px;
  border: solid 1px gray;
  overflow: auto;
}
.Checkdata {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.colurig {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
.DataRow {
  width: 100%;
}
.DataRowHead {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
}
.DtataRowContent {
  width: 100%;
  min-height: 50px;
  border: 1px solid gray;
  padding: 5px 0;
}
.Colorbutton {
  font-size: 14px;
  color: #0060a0;
  font-weight: 500;
}
</style>