<template>
  <div id="group">
    <div class="operation">
      <div class="buttons">
        <el-button type="primary" @click="OpenAdd">新增</el-button>
        <el-button type="primary">导入</el-button>
      </div>
      <div class="inputs">
        <div style="margin-right:30px;">
          <input type="checkbox" :checked="getcheck" @click="ClickChange" />已删除
        </div>
        <div class="check" style="margin-right:10px;">
          <!-- <input type="text" placeholder="请输入搜索关键字" v-model="inputvalue" />
          <i class="iconfont icon-sousuo" @click="ToGetData"></i> -->
          <el-input v-model="inputvalue" placeholder="请输入搜索关键字" maxlength="15" style="width:330px;"></el-input>
          <i class="iconfont icon-sousuo" @click="ToGetData"></i>
        </div>
        <div>
          <i class="iconfont icon-shuaxin" style="margin-right:0px;" @click="reload"></i>
        </div>
      </div>
    </div>
    <el-table
      :data="groupdata"
      :header-cell-style="{background:'#F5F5F5'}"
      style="padding-left:20px;padding-right:20px;margin-top:20px;"
      show-overflow-tooltip
    >
    <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="540">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.GState =='启用'"
            type="text"
            size="small"
            @click="clickedit(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.GState =='启用'"
            type="text"
            size="small"
            @click="clickdelete(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.GState =='已删除'"
            type="text"
            size="small"
            @click="clickclear(scope.row)"
          >清除</el-button>
          <el-button
            v-if="scope.row.GState =='已删除'"
            type="text"
            size="small"
            @click="clickrecy(scope.row)"
          >回收</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增组弹框 -->
    <el-dialog title="新增组" center :visible.sync="dialogOne" width="30%">
      <el-form label-width="80px" :model="FormOne">
        <el-form-item label="组名称:">
          <el-input v-model="FormOne.GName" placeholder="请输入组名称"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="FormOne.Description"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button type="primary" @click="clickdeter">确定</el-button>
          <el-button style @click="clickcancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑组弹框 -->
    <el-dialog title="编辑组" center :visible.sync="dialogTwo" width="30%">
      <el-form label-width="80px" :model="FormTwo">
        <el-form-item label="组名称:">
          <el-input v-model="FormTwo.GName" placeholder="请输入组名称"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="FormTwo.Description"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button type="primary" @click="deter_two">确定</el-button>
          <el-button style @click="cancel_two">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- <div class="Pages">
      <el-pagination
        :hide-on-single-page='true'
        :page-size="pagesize"
        :pager-count="9"
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>-->
  </div>
</template>

<script>
export default {
  name: "Group",
  data() {
    return {
      // total: 0,
      // pagesize: 10,
      groupdata: [],
      tableTitle:[
        {name:"状态",tableprop:"GState"},
        {name:"组名",tableprop:"GName"},
        {name:"描述",tableprop:"Description"},
      ],
      inputvalue: "",
      getcheck: true,
      CheckValue: "1",
      dialogOne: false,
      dialogTwo: false,
      FormOne: {
        GName: "",
        Description: ""
      },
      FormTwo: {
        GName: "",
        Description: "",
        GId: ""
      }
    };
  },
  methods: {
    ClickChange() {
      if (this.getcheck) {
        this.getcheck = false;
        this.CheckValue = "0";
      } else {
        this.getcheck = true;
        this.CheckValue = "1";
      }
    },
    current_change(currentPage) {
      let json = {
        MN: "QueryGroup",
        DataContent: {
          KeyWord: "",
          IsDel: this.CheckValue,
          PageIndex: currentPage
        }
      };
      this.MIX_send(json);
    },
    ToGetData() {
      let json = {
        MN: "QueryGroup",
        DataContent: {
          KeyWord: this.inputvalue
        }
      };
      this.MIX_send(json);
    },
    reload() {
      this.$router.go(0);
    },
    OpenAdd() {
      this.dialogOne = true;
    },
    clickdeter() {
      if (this.FormOne.GName) {
        let json = {
          MN: "AddGroup",
          DataContent: {
            GName: this.FormOne.GName,
            Description: this.FormOne.Description,
            Groleid: ""
          }
        };
        this.MIX_send(json);
        this.dialogOne = false;
      } else {
        this.$message({
          showClose: true,
          message: "请填写完整基本信息!!!"
        });
      }
    },
    clickcancel() {
      this.FormOne.GName = "";
      this.FormOne.Description = "";
      this.dialogOne = false;
    },
    //点击删除
    clickdelete(r) {
      this.$confirm("是否删除此组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let json = {
            MN: "DelGroup",
            DataContent: {
              GId: r.GId
            }
          };
          this.MIX_send(json);
        })
        .catch(() => {});
    },
    //点击清除
    clickclear(r) {
      this.$confirm("是否清除此组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击回收
    clickrecy(r) {
      this.$confirm("是否回收此组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击编辑
    clickedit(r) {
      this.dialogTwo = true;
      this.FormTwo.GName = r.GName;
      this.FormTwo.Description = r.Description;
      this.FormTwo.GId = r.GId;
    },
    //点击编辑取消
    cancel_two() {
      this.dialogTwo = false;
    },
    //点击编辑确定
    deter_two() {
      let json = {
        MN: "UpdateGroup",
        DataContent: {
          GId: this.FormTwo.GId,
          GName: this.FormTwo.GName,
          GRoleid: ""
        }
      };
      this.MIX_send(json);
      this.dialogTwo = false;
    }
  },
  mounted() {
    //添加数据请求
    let json = {
      MN: "QueryGroup",
      DataContent: {
        KeyWord: "",
        IsDel: this.CheckValue,
        PageIndex: "1"
      }
    };
    this.MIX_send(json);
  },
  watch: {
    //监听勾选状态的变化
    CheckValue: function() {
      let json = {
        MN: "QueryGroup",
        DataContent: {
          KeyWord: "",
          IsDel: this.CheckValue,
          PageIndex: "1"
        }
      };
      this.MIX_send(json);
    },
    "$store.state.Permission.MNvalue.QueryGroup": function(data) {
      if (data.Code == "0") {
        // this.total = data.TotalCount;
        let arr = data.ReturnData;
        arr.forEach((value, index) => {
          arr[index].GState =
            arr[index].GState == "0"
              ? "已删除"
              : arr[index].GState == "1"
              ? "启用"
              : "";
        });
        this.groupdata = arr;
      } else {
        this.$message({
          showClose: true,
          message: data.Message
        });
      }
    },
    "$store.state.Permission.MNvalue.AddGroup": function(data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "新增组成功"
        });
        this.FormOne.GName = "";
        this.FormOne.Description = "";
        //添加重新请求数据
        let json = {
          MN: "QueryGroup",
          DataContent: {
            KeyWord: "",
            IsDel: this.CheckValue,
            PageIndex: "1"
          }
        };
        this.MIX_send(json);
      } else {
        this.$message({
          showClose: true,
          message: data.Message
        });
      }
    },
    "$store.state.Permission.MNvalue.DelGroup": function(data) {
      if (data.Code == "0") {
        this.$message({
          showClose: true,
          message: "删除组成功"
        });
        //添加重新请求数据
        let json = {
          MN: "QueryGroup",
          DataContent: {
            KeyWord: "",
            IsDel: this.CheckValue,
            PageIndex: "1"
          }
        };
        this.MIX_send(json);
      } else {
        this.$message({
          showClose: true,
          message: data.Message
        });
      }
    },
    "$store.state.Permission.MNvalue.UpdateGroup": function(data) {
      if (data.Code == "0") {
        //添加重新请求数据
        let json = {
          MN: "QueryGroup",
          DataContent: {
            KeyWord: "",
            IsDel: this.CheckValue,
            PageIndex: "1"
          }
        };
        this.MIX_send(json);
      } else {
        this.$message({
          showClose: true,
          message: data.Message
        });
      }
    }
  }
};
</script>

<style scoped>
#group {
  position: relative;
}
.operation {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
}
.buttons {
  width: 200px;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.buttons > div {
  width: 90px;
  height: 40px;
  color: white;
  line-height: 40px;
  text-align: center;
  background: #108cee;
}
.inputs {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.inputs > div {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.check {
  width: 330px;
  height: 38px !important;
  margin-left: 80px;
  position: relative;
}
.check > input {
  height: 38px;
  border: none;
  line-height: 40px;
  width: 310px;
  border: 1px solid gray;
}
.check > i {
  position: absolute;
  right: 20px;
}
.Pages {
  margin-top: 50px;
  position: absolute;
  right: 100px;
}
</style>