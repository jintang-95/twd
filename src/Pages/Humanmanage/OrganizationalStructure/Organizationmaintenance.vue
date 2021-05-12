<!-- 组织维护 start -->
<template>
  <div id="organiza">
    <pageTop :title="title"></pageTop>
    <div class="filter-container">
      <div class="operation">
        <div class="buttons">
          <el-button type="primary" @click="addgroup">新增</el-button>
          <!-- <el-button type="primary">导入</el-button>
          <el-button type="primary">配置</el-button>-->
        </div>
        <div class="inputs">
          <div>
            <!-- <el-select v-model="typeValue" placeholder="状态:选择状态" @change="currentSel">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.Status">
              </el-option>
            </el-select>-->
            <!-- 选择部门多级下拉 -->
            <el-cascader
              v-model="Init"
              placeholder="选择部门"
              :options="menus"
              :props="optionProps"
              @change="GetTableId"
              filterable
              clearable
              style="width: 200px;float: right;margin-right: 20px;"
            ></el-cascader>
          </div>
          <div class="check">
            <el-input v-model="KeyWord" placeholder="请输入搜索关键字" maxlength="15" style="width:250px;"></el-input>
            <i class="iconfont icon-sousuo" @click="sendinput"></i>
          </div>
        </div>
      </div>
    </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      fit
      highlight-current-row
      style="margin-top:20px;"
      :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
      class="tableBox"
      @handleButton="handleButton"
      @rowClick="rowClick"
      @cellClick="cellClick"
      @handleSortChange="handleSortChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.OtherName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <span v-if="row.Type=='1'">部门</span>
          <span v-if="row.Type=='2'">项目组</span>
        </template>
      </el-table-column>
      <el-table-column label="隶属部门" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ParentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable="custom" align="center" class-name="status-col">
        <template slot-scope="{row}">
          <div v-if="row.Status=='0'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">草稿</span>
          </div>
          <div v-if="row.Status=='1'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">待审批</span>
          </div>
          <div v-if="row.Status=='2'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle;color:#8CD16B">已启用</span>
          </div>
          <div v-if="row.Status=='3'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle;color:#F56262">已停用</span>
          </div>
          <div v-if="row.Status=='4'" :type="row.Status | statusFilter">
            <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">已删除</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.Status!='0'" type="text" size="mini" @click="dyapiDetail(row)">
            <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">编辑</span>
          </el-button>
          <el-button v-if="row.Status =='3'" size="mini" type="text" @click="start(row)">
            <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">启用</span>
          </el-button>
          <el-button v-if="row.Status=='2'" size="mini" type="text" @click="stop(row)">
            <img src="../../../assets/images/stop_icon.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">停用</span>
          </el-button>
          <el-button
            v-if="row.Status=='3'||row.Status=='0'"
            size="mini"
            type="text"
            @click="deletedata(row)"
          >
            <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt />
            <span style="vertical-align:middle">删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;position: absolute;calc(100vh - 20px);right: 10px;">
      <el-pagination
        background
        v-if="tatolpage > 10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listfrom.PageIndex"
        layout=" total,prev, pager, next"
        :total="tatolpage"
      ></el-pagination>
    </div>
    <!-- 新增组织维护 -->
    <organ ref="organ" @getlistdata="getlistdata"></organ>
  </div>
</template>

<script>
import organ from './dialog/organ'
import pageTop from '@/components/pageTop.vue'
export default {
  name: 'Organizationmaintenance',
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'info',
        1: 'info',
        2: 'success',
        3: 'danger',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      Init: ['0'],
      title: '',
      tableKey: 0,
      input_one: '',
      modal12: false,
      loading: false,
      checked: true,
      tatolpage: 0,
      PageSize: 10,
      PageIndex: 1,
      currentId: 0,
      IsStop: '',
      KeyWord: '',
      tableData: [],
      listfrom: {
        "Id": '0',
        "KeyWord": '',
        "IsStop": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      fromData: {},
      columns: [],
      menus: [],
      optionProps: {
        value: 'Id',
        label: 'Name',
        children: 'Children',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    };
  },
  components: {
    organ,
    pageTop
  },
  watch: {
    "$store.state.Humanmanage.QueryOrganization": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
      this.tatolpage = data.ReturnData.DataCount;

    },
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.menus = data.ReturnData;
      this.menus.unshift({ Id: "0", Name: "无" })
      console.log('组织数据', this.menus)
      // this.menus = this.removechild(this.menus);
    },
    "$store.state.Humanmanage.RemoveOrganization": function (data) {
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
      this.getlistdata();
      this.getOrganizationTree();
    },
    "$store.state.Humanmanage.UnCancelOrganization": function (data) {
      this.$message({
        type: 'success',
        message: '操作成功!'
      });
      this.getlistdata();
    },
    "$store.state.Humanmanage.CancelOrganization": function (data) {
      this.$message({
        type: 'success',
        message: '操作成功!'
      });
      this.getlistdata();
    },
    "checked": function (data) {
      this.getlistdata()
    },
  },
  methods: {
    // 编辑组织
    dyapiDetail (row) {
      this.$refs.organ.dialogFormVisible = true;
      this.$refs.organ.formtype = 2;
      this.$refs.organ.option = this.menus;
      this.$refs.organ.form = JSON.parse(JSON.stringify(row));
      console.log(row)
    },
    // 添加组织
    addgroup () {
      this.$refs.organ.dialogFormVisible = true;
      this.$refs.organ.formtype = 1;
      this.$refs.organ.option = this.menus;
    },
    // 启用
    start (row) {
      let that = this;
      this.$confirm('此操作将启用该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "SN": "Organization",
          "MN": "UnCancelOrganization",
          "SN": "Organization",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            'Ids': row.Id
          }
        }
        that.MIX_send(obj);
      }).catch((error) => {
        console.log(row);
      });
    },

    // 删除
    deletedata (row) {
      let that = this;
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "SN": "Organization",
          "MN": "RemoveOrganization",
          "SN": "Organization",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            'Ids': row.Id
          }
        }
        that.MIX_send(obj);
      }).catch(() => {
      });
    },

    // 停用
    stop (row) {
      let that = this;
      this.$confirm('此操作将停用该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          "SN": "Organization",
          "MN": "CancelOrganization",
          "SN": "Organization",
          "RequestId": 1,
          "UserId": 1,
          "DataContent": {
            'Ids': row.Id
          }
        }
        that.MIX_send(obj);
      }).catch(() => {
      });

    },
    //获取列表数据
    getlistdata () {
      // if (this.checked) {
      //   this.listfrom.IsStop = '';
      // } else {
      //   this.listfrom.IsStop = '1';
      // }
      let obj = {
        "SN": "Organization",
        "MN": "QueryOrganization",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {
          Id: this.currentId,
          KeyWord: this.KeyWord,
          PageIndex: this.listfrom.PageIndex,
          PageSize: this.listfrom.PageSize,
          IsStop: this.IsStop,
        }
      }
      this.MIX_send(obj);
    },

    //获取组织树数据
    getOrganizationTree () {
      let objor = {
        "SN": "Organization",
        "MN": "QueryOrganizationTree",
        "SN": "Organization",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": {}
      }
      this.MIX_send(objor);
    },

    rowClick (data) { },

    // 点击分页
    handleCurrentChange (data) {
      this.listfrom.PageIndex = data;
      this.getlistdata();
    },

    // 直接跳转到哪一页
    handleSizeChange (data) {
      // console.log(data,'handleSizeChange');
      this.listfrom.PageSize = data;
      this.getlistdata();
    },
    handleButton (data) { },
    cellClick (data) { },
    handleSortChange (data) { },
    handleSelectionChange (data) { },

    //通过部门类型筛选
    GetTableId (value) {
      this.listfrom.PageIndex = 1;
      this.listfrom.Id = value[0];
      this.getlistdata();
      // console.log(data);
    },

    // 重新加载列表数据
    Toreload () {
      this.listfrom = {
        "Id": '0',
        "KeyWord": '',
        "IsStop": '',
        "PageSize": 10,
        "PageIndex": 1
      }
      this.getlistdata();
    },

    // 搜索
    sendinput () {
      this.getlistdata();
      this.getOrganizationTree();
    },

    // 表格上方筛选slot的事件回调
    add () {
      console.log("表格上方筛选slot的事件回调");
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
    }

  },
  //生命周期 - 创建完成（访问当前this实例）
  created () {
    this.getlistdata();
    this.getOrganizationTree();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted () {
    this.getlistdata();
    this.title = this.$route.meta.title;
  }
}
</script>
<style scoped>
#organiza {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 0 20px;
  overflow-y: auto;
  box-sizing: border-box;
}
.app-container {
  width: 100%;
  height: 100%;
  /* background-color:; */
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
}
.operation {
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  /*  padding-left: 20px;
  padding-right: 20px; */
}
.buttons {
  width: 310px;
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
  width: 250px;
  height: 38px !important;
  position: relative;
}
.check > input {
  height: 38px;
  border: none;
  line-height: 40px;
  width: 250px;
  border: 1px solid gray;
}
.check > i {
  position: absolute;
  right: 20px;
  color: #5c87a4;
}
.Pages {
  margin-top: 20px;
  position: absolute;
  right: 100px;
}
.el-button--primary {
  color: #fff;
  background-color: #0060a0;
  border-color: #0060a0;
  width: 6.8125rem;
  height: 2.6875rem;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
.info {
  color: #dfe4ed;
}
.warn {
  color: #ffba00;
}
.el-tag {
  border: none;
  background: none !important;
  font-size: 14px;
}
.el-tag img {
  display: inline-block;
  margin-right: 5px;
}
.el-button--text {
  color: #0060a0;
  font-size: 14px;
}
.el-button--text img {
  display: inline-block;
  margin-right: 5px;
  width: 13px;
}
</style>
