<template>
  <div id="role">
    <pageTop :title="title"></pageTop>
    <div class="head">
      <div style="width:100px;">
        <el-button type="primary" size="small" @click="Addrole" v-permission="['Role_Addrole']">新增角色</el-button>
      </div>
      <div class="inputs">
        <el-select
          v-model="Statusvalue"
          placeholder="选择状态"
          style="width:200px;margin-right:20px"
          clearable
        >
          <el-option
            v-for="item in Statusdata"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input placeholder="请输入搜索关键字" v-model="InputValue" style="width:250px" clearable @keyup.enter.native="getValue">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- <el-button icon="el-icon-refresh" style="width:40px;padding-left:13px;"></el-button> -->
      </div>
    </div>
    <div class="content">
      <div class="ContentLeft">
        <div class="title">角色信息</div>
        <div class="table">
          <el-table
            :data="tableData"
            :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
            show-overflow-tooltip
            @row-click="ClickRow"
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
            <el-table-column prop label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  class="Colorbutton"
                  v-if="scope.row.Allstatus !='删除'"
                  @click="handleClickone(scope.row)"
                  type="text"
                  size="small"
                  v-permission="['Role_Editorrole']"
                >
                  <span class="Icon-iconedit IconFont"></span>&nbsp;编辑
                </el-button>
                <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus !='删除'"></span>
                <el-button
                  class="Colorbutton"
                  v-if="scope.row.Allstatus =='启用'"
                  @click="handleClicktwo(scope.row)"
                  type="text"
                  size="small"
                >
                  <span class="iconnotuse IconFont"></span>&nbsp;禁用
                </el-button>
                <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='启用'"></span>
                <el-button
                  class="Colorbutton"
                  v-if="scope.row.Allstatus =='禁用'"
                  @click="handleClickthree(scope.row)"
                  type="text"
                  size="small"
                >
                  <span class="iconuse IconFont"></span>&nbsp;启用
                </el-button>
                <span class="Icon-iconline IconFont" v-if="scope.row.Allstatus =='禁用'"></span>
                <el-button
                  class="Colorbutton"
                  v-if="scope.row.Allstatus !='删除'"
                  @click="handleClickfour(scope.row)"
                  type="text"
                  size="small"
                  v-permission="['Role_Deleterole']"
                >
                  <span class="Icon-icondelete IconFont"></span>&nbsp;删除
                </el-button>
                <el-button
                  class="Colorbutton"
                  v-if="scope.row.Allstatus =='删除'"
                  @click="handleClickfive(scope.row)"
                  type="text"
                  size="small"
                >
                  <span class="Icon-icondelete IconFont"></span>&nbsp;清除
                </el-button>
                <el-button
                  class="Colorbutton"
                  v-if="scope.row.Allstatus =='删除'"
                  @click="handleClicksix(scope.row)"
                  type="text"
                  size="small"
                >
                  <span class="iconhuishou IconFont"></span>&nbsp;回收
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="middle">
        <div class="title">
          权限列表
          <div style="position:absolute;right:50px;top:0px;">
            <el-button
              style="color: #FFF;background-color:#0060A0;border-color:#0060A0;width:50px;height:30px"
              size="mini"
              @click="Init=false"
              v-permission="['Role_Editorbutton']"
            >编辑</el-button>
            <el-button
              style="color: #FFF;background-color:#0060A0;border-color:#0060A0;width:50px;height:30px"
              size="mini"
              @click="Gopermission"
              v-permission="['Role_Editorbutton']"
            >返回</el-button>
          </div>
        </div>
        <div class="tree">
          <el-tree
            :data="treedata"
            node-key="id"
            ref="tree"
            highlight-current
            check-strictly
            :expand-on-click-node="false"
            :default-expanded-keys="Initexpand"
            :props="defaultProps"
          >
            <span slot-scope="{ data }">
              <input
                type="checkbox"
                v-model="data.checked"
                @change="changecheck(data)"
                :disabled="Init"
              />
              <span>{{ data.authorityName }}</span>
              <!-- <el-checkbox v-model="data.checked" @change="changecheck(data)" :disabled="Init"></el-checkbox> -->
            </span>
          </el-tree>
        </div>
      </div>
      <div class="right">
        <div class="title">数据权限</div>
        <div class="ColumnRowContent">
          <div class="ColumnRow" v-for="(item,index) in CData" :key="index">
          <div class="Dataname">
            <div style="margin-left:20px;">权限名称:<span style="margin-left:10px">{{item.authorityName}}</span></div>
            <div style="margin-left:100px;">接口地址:<span style="margin-left:10px">{{item.interfaceUrl}}</span></div>
          </div>
          <div class="column" style="margin-top:20px;margin-left:20px;">
            数据列:
            <el-checkbox
              style="margin-left:5px;margin-bottom:5px"
              disabled
              checked
              v-for="(val,dex) in item.dataColumn"
              :key="dex"
            >{{val.name}}</el-checkbox>
          </div>
          <div class="row" style="margin-top:20px;margin-left:20px;margin-bottom:15px;">
            数据行:
            <el-checkbox
              style="margin-left:5px;margin-bottom:5px"
              disabled
              checked
              v-for="(v,i) in item.dataRow"
              :key="i"
            >{{v.name}}</el-checkbox>
          </div>
        </div>
        </div>
      </div>
    </div>
    <!-- 新增，编辑角色弹出窗 -->
    <el-dialog :title="titlename" :visible.sync="dialogOne" width="600px">
      <el-form label-width="100px" :model="formone" :rules="ruleAddR" ref="formone">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="formone.name" placeholder="请输入角色名" ></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="formone.status" placeholder="请选择状态" style="width:100%;" >
            <el-option
              v-for="item in Statusdatas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="Cancer">取消</el-button>
          <el-button style="color: #FFF; background-color: #0060A0;border-color: #0060A0;" @click="Deter">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pageTop from '../../../components/pageTop.vue'
export default {
  name: "roleIndex",
  data() {
    return {
      title:"角色管理",
      Initexpand: [],
      Init: true,
      InitRID: "",
      Statusvalue: "",
      InputValue: "",
      Statusdatas: [
        { label: "启用", value: 0 },
        { label: "禁用", value: 1 },
        { label: "失效", value: 2 },
        { label: "删除", value: 3 },
      ],
      Statusdata: [
        { label: "启用", value: 0 },
        { label: "禁用", value: 1 },
        { label: "失效", value: 2 },
        { label: "删除", value: 3 },
      ],
      tableTitle: [
        { name: "状态", tableprop: "Allstatus" },
        { name: "角色名", tableprop: "roleName" },
      ],
      tableData: [],
      defaultProps: {
        children: "children",
        label: "authorityName",
      },
      treedata: [],
      dialogOne: false,
      titlename: "",
      formone: {
        name: "",
        status: "",
      },
      Allarr: [],
      CData: [],
      Newarr: [],
      //新增，修改角色表单验证
      ruleAddR: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        status: [
          { required: true, message: "请输入角色状态", trigger: "blur" },
        ],
      },
    };
  },
  components:{
    pageTop
  },
  methods: {
    Changestatus() {
      this.Allarr.forEach((v, i) => {
        if (v.checked) {
          v.status = "0";
        } else {
          v.status = "1";
        }
      });
    },
    //生成树级数据
    toTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children;
      });

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function (item) {
        // map[item.id] = JSON.parse(JSON.stringify(item));
        map[item.id] = item;
      });
      //        console.log(map);
      var val = [];
      data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          // (parent.children || (parent.children = [])).push(item);

          (parent.children || (parent.children = [])).push(item);
          // if (parent.authorityName == "用户管理") {
          //   console.log(parent.id, "=======", item)
          //   console.log(parent.children)
          // }
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      // console.log(val,'5555555555555')
      return val;
    },
    getValue() {
      this.Getrole();
    },
    //获取类型状态
    InitType(Typevalue) {
      if (Typevalue != null) {
        return Typevalue;
      } else {
        return "";
      }
    },
    //获取角色列表
    Getrole() {
      let json = {
        Modular: "RoleManage",
        MN: "GetRoleList",
        DataContent: {
          status: this.InitType(this.Statusvalue),
          keyword: this.InputValue,
        },
      };
      this.MIX_send(json);
    },
    //获取权限列表
    Getper() {
      let json = {
        Modular: "RoleManage",
        MN: "GetRoleAuthorityList",
        DataContent: {
          id: this.InitRID,
        },
      };
      this.MIX_send(json);
    },
    //获取数据权限列表
    GetCol() {
      let json = {
        Modular: "RoleManage",
        MN: "GetRoleDataAuthorityList",
        DataContent: {
          uId: this.InitRID,
        },
      };
      this.MIX_send(json);
    },
    //查询父级并勾上
    Checkparent(parentId) {
      let arr = this.Allarr;
      arr.forEach((v, i) => {
        if (v.id == parentId) {
          v.checked = true;
          v.status = "0";
          let json = {
            Modular: "RoleManage",
            MN: "SaveRoleAuthority",
            DataContent: {
              roleId: this.InitRID,
              authorityId: v.id,
              status: "0",
            },
          };
          this.MIX_send(json);
          if(v.parentId != '0'){
            this.Checkparent(v.parentId);
          }
        }
      });
      this.treedata = [];
      setTimeout(() => {
        this.treedata = this.toTree(arr);
      }, 5);
    },
    //勾选框
    changecheck(r) {
      console.log(r);
      this.Allarr.forEach((element, index, arr1) => {
        if (element.id == r.id) {
          var element11 = JSON.parse(JSON.stringify(r));
          this.$set(arr1, index, element11);
          this.Initexpand = [r.id];
        }
      });
      if (r.checked) {
        let json = {
          Modular: "RoleManage",
          MN: "SaveRoleAuthority",
          DataContent: {
            roleId: this.InitRID,
            authorityId: r.id,
            status: "0",
          },
        };
        this.MIX_send(json);
        this.Newarr = [];
        //勾选时添加到右侧数据权限
        this.Allarr.forEach((v, i) => {
          if (v.checked) {
            this.Newarr.push(v);
          }
        });
        this.Newarr.forEach((value, index) => {
          if (value.dataColumn && typeof value.dataColumn == "string") {
            value.dataColumn = JSON.parse(value.dataColumn);
          }
          if (value.dataRow && typeof value.dataRow == "string") {
            value.dataRow = JSON.parse(value.dataRow);
          }
        });
        this.CData = this.Newarr;
        this.Checkparent(r.parentId);
        this.Changestatus();
      } else {
        this.Changestatus();
        //取消时右侧数据权限消失
        this.CData.forEach((v, i) => {
          if (r.id == v.id) {
            this.CData.splice(i, 1);
          }
        });
        let json = {
          Modular: "RoleManage",
          MN: "SaveRoleAuthority",
          DataContent: {
            roleId: this.InitRID,
            authorityId: r.id,
            status: "1",
          },
        };
        this.MIX_send(json);
      }
    },
    //点击表格行
    ClickRow(val) {
      this.InitRID = val.id;
      this.Init = true;
    },
    //点击新增角色
    Addrole() {
      // this.Allarr.forEach((v,i)=>{
      //   v.checked = false;
      //   v.status = '1'
      // })
      // this.toTree(this.Allarr);
      // this.Init = false;
      this.titlename = "新增角色";
      this.formone = {
        name: "",
        status: "",
      };
      this.dialogOne = true;
    },
    //点击编辑
    handleClickone(r) {
      this.InitRID = r.id;
      this.titlename = "编辑角色";
      this.formone.name = r.roleName;
      this.formone.status = Number(r.status);
      this.dialogOne = true;
    },
    //点击禁用
    handleClicktwo(r) {
      this.InitRID = r.id;
      this.$confirm("是否禁用此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "RoleManage",
            MN: "UpdateRoleStatus",
            DataContent: {
              id: this.InitRID,
              status: "1",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击启用
    handleClickthree(r) {
      this.InitRID = r.id;
      this.$confirm("是否启用此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "RoleManage",
            MN: "UpdateRoleStatus",
            DataContent: {
              id: this.InitRID,
              status: "0",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击删除
    handleClickfour(r) {
      this.InitRID = r.id;
      this.$confirm("是否删除此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "RoleManage",
            MN: "UpdateRoleStatus",
            DataContent: {
              id: this.InitRID,
              status: "2",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击清除
    handleClickfive(r) {
      this.InitRID = r.id;
      this.$confirm("是否清除此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "RoleManage",
            MN: "UpdateRoleStatus",
            DataContent: {
              id: this.InitRID,
              status: "3",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击回收
    handleClicksix(r) {
      this.InitRID = r.id;
      this.$confirm("是否回收此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let json = {
            Modular: "RoleManage",
            MN: "UpdateRoleStatus",
            DataContent: {
              id: this.InitRID,
              status: "4",
              modifyAccount: JSON.parse(sessionStorage.getItem("UserInfor"))
                .UName,
            },
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击弹窗确定
    Deter() {
      this.$refs.formone.validate((valid) => {
        if (valid) {
          let json = {
            Modular: "RoleManage",
            MN: "SaveRole",
            DataContent: {
              id: this.titlename == "新增角色" ? "0" : this.InitRID,
              roleName: this.formone.name,
              status: this.formone.status,
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
    Cancer() {
      this.$refs.formone.resetFields();
      this.dialogOne = false;
    },
    //点击确定
    Gopermission() {
      this.Init = true;
    },
  },
  mounted() {
    //请求角色列表
    this.Getrole();
    //请求数据权限列表
    // this.GetCol();
  },
  watch: {
    //监听状态变化
    Statusvalue: function () {
      this.Getrole();
    },
    // 监听InitRID
    InitRID: function () {
      this.Init = true;
      //请求权限列表
      this.Getper();
      //请求数据权限列表
      // this.GetCol();
    },
    //角色列表
    "$store.state.Permission.MNvalue.GetRoleList": function (data) {
      if (data.Code == "0") {
        this.tableData = data.ReturnData;
        if (data.ReturnData.length > 0) {
          this.InitRID = this.tableData[0].id;
          this.tableData.forEach((v, i) => {
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
          });
        } else {
          this.treedata = [];
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //修改角色状态
    "$store.state.Permission.MNvalue.UpdateRoleStatus": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        this.Getrole();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //新增/编辑
    "$store.state.Permission.MNvalue.SaveRole": function (data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "操作成功",
        });
        this.$refs.formone.resetFields();
        this.dialogOne = false;
        this.Getrole();
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //权限列表
    "$store.state.Permission.MNvalue.GetRoleAuthorityList": function (data) {
      if (data.Code == "0") {
        data.ReturnData.forEach((v, i) => {
          v.checked =
            v.status == "0"
              ? true
              : v.status == "1" || v.status == null
              ? false
              : false;
        });
        this.Allarr = JSON.parse(JSON.stringify(data.ReturnData));
        console.log(this.Allarr,'97799779')
        this.Newarr = [];
        //勾选时添加到右侧数据权限
        this.Allarr.forEach((v, i) => {
          if (v.checked) {
            this.Newarr.push(v);
          }
        });
        this.Newarr.forEach((value, index) => {
          if (value.dataColumn && typeof value.dataColumn == "string") {
            value.dataColumn = JSON.parse(value.dataColumn);
          }
          if (value.dataRow && typeof value.dataRow == "string") {
            value.dataRow = JSON.parse(value.dataRow);
          }
        });
        this.CData = this.Newarr;
        this.treedata = this.toTree(this.Allarr);
        this.Initexpand = [this.treedata[0].id];
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //数据权限列表
    "$store.state.Permission.MNvalue.GetRoleDataAuthorityList": function (data) {
      if (data.Code == "0") {
        if (data.ReturnData.length > 0) {
          data.ReturnData.forEach((v, i) => {
            v.dataColumn = JSON.parse(v.dataColumn);
            v.dataRow = JSON.parse(v.dataRow);
          });
          this.CData = data.ReturnData;
        } else {
          this.CData = [];
        }
      } else {
        this.$message({
          showClose: true,
          message: data.Message,
        });
      }
    },
    //设置权限
    "$store.state.Permission.MNvalue.SaveRoleAuthority": function (data) {
      if (data.Code == "0") {
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
#role {
  width: 100%;
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
    color: #FFF;
    background-color: #0060A0;
    border-color: #0060A0;
  	width: 6.8125rem;
  	height:2.6875rem;
}
/deep/ .el-dialog__header{
  margin: 0 2rem;
  padding :20px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    margin-left: 20px;
    color:#4D6474;
    font-size: 18px;
    font-weight: 400;
  }
}
.content {
  width: 100%;
  height: 700px;
  display: flex;
  overflow: hidden;
  margin-top: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}
.ContentLeft {
  width: 500px;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.middle {
  width: 400px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.right {
  width: calc(100% - 900px);
  height: 100%;
  color: #606266;
}
.ColumnRowContent{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.title {
  height: 45px;
  line-height: 45px;
  width: 100%;
  background: rgba(16, 140, 238, 0.1);
  border-bottom: 1px solid #e6e6e6;
  // color: black;
  padding-left: 20px;
  position: relative;
}
.table {
  width: 100%;
  height: calc(100% - 45px);
  overflow-x: hidden;
  overflow-y: auto;
}
.tree {
  width: 100%;
  height: calc(100% - 46px);
  overflow-x: hidden;
  overflow-y: auto;
}
.ColumnRow {
  width: calc(100% - 40px);
  margin: 10px 20px;
  border-radius: 5px;
  border: 1px solid rgb(230, 230, 230);
  font-size: 14px;
}
.Dataname {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  flex-direction: row;
}
.Colorbutton{
  font-size: 14px;
  color:#0060A0;
  font-weight: 500;
}
</style>
<style>
.el-tree-node__content {
  height: 45px;
  margin-left: 20px;
}
</style>