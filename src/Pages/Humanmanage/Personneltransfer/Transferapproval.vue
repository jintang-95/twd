<template>
  <div style="padding:20px">
    <div slot="operation" class="Head_Top">
      <div class="Top_one">
        <!-- <el-button @click="addgroup" size="small" type="primary"
          >新增</el-button
        > -->
      </div>
      <div class="Top_two">
        <div class="Top_two_radio">
          <el-checkbox v-model="checked1">待审批</el-checkbox>
          <el-checkbox v-model="checked2">审批通过</el-checkbox>
          <el-checkbox v-model="checked3">审批不通过</el-checkbox>
        </div>
        <div class="Top_two_one">
          <el-input placeholder="请输入内容" v-model="listfrom.KeyWord">
            <i
              slot="suffix"
              @click="getlistdata"
              class="el-input__icon el-icon-search"
            ></i>
          </el-input>
        </div>
        <div class="Top_two_two1">
          <el-button
            icon="el-icon-refresh"
            size="small"
            class="refresh"
            @click="getlistdata"
          ></el-button>
          <!-- <i class="iconfont icon-shuaxin" @click="Toreload"></i> -->
        </div>
      </div>
      <!-- <el-button @click="modal12 = true" type="primary">点击编辑</el-button> -->
    </div>
    <div slot="table">
      <table-cmp
        style="width:100%"
        class="table_cmp"
        :loading="loading"
        :table-data="tableData"
        :table-label="tableLabel"
        @handleButton="handleButton"
        @rowClick="rowClick"
        @cellClick="cellClick"
        @handleSortChange="handleSortChange"
        @handleSelectionChange="handleSelectionChange"
      ></table-cmp>
      <div style="text-align: right;">
        <el-pagination
          v-if="tatolpage > 10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listfrom.PageIndex"
          layout=" prev, pager, next"
          :total="tatolpage"
        >
        </el-pagination>
      </div>
    </div>
    <approval ref="approval"></approval>
  </div>
</template>

<script>
var occupancyDisplay = {
  template: `<div>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
  
  </div>`,
  props: ['row'],
  created() {
  },
  methods: {
    shenhDetail(row) {
      this.$emit('shenh-detail', row);
      // console.log(this.row,'1111111');

    },
    seeDetail(row) {
      this.$emit('see-detail', row);
      // console.log(this.row,'1111111');

    }
  }
};
var that
import approval from "./dialog/approval";
export default {
  name: "",
  data() {
    return {
      modal12: false,
      loading: false,
      checked1: true,
      checked2: true,
      checked3: true,
      tatolpage: 0,
      tableData: [],
      listfrom: {
        "Status": '',
        "KeyWord": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      tableLabel: [
        { label: '状态', param: 'Status', width: '100', align: 'center', sortable: false, render: (row) => {
            if (row.Status == 0) {
              return '草稿'
            } else if (row.Status == 1) {
              return '待审批'
            } else if (row.Status == 2) {
              return '审核通过'
            } else if (row.Status == 3) {
              return '审核不通过'
            }
          }
        },
        { label: '申请单号', param: 'No', align: 'center', sortable: false },
        { label: '申请时间', param: 'ApplyDate', align: 'center', width: '150',},
        { label: '申请人', param: 'ApplyStaffName', align: 'center', width: '150',},
        { label: '所在部门', param: 'OrganizationName', align: 'center', width: '150',},
        { label: '所在岗位', param: 'JobsName', align: 'center', width: '150',},
        { label: '调动至部门', param: 'MOrganizationName', align: 'center', width: '150',},
        { label: '调动至岗位', param: 'MJobsName', align: 'center', width: '150',},
        // { label: '描述', param: 'Remark', align: 'center' },
        { label: '操作', align: 'center', width: '300',
          component: occupancyDisplay, listeners: {
            'dyapi-detail'(row) {
              that.dyapiDetail(row);
            },
            'delete-detail'(row) {
              that.deleteDetail(row);
            }
          }
        }
      ],
      fromData: {},
      columns: [],
      menus: []
    };
  },
  components: {
    approval
  },
  watch: {
    "checked1":function(){
      this.getlistdata();
    },
    "checked2":function(){
      this.getlistdata();
    },
    "checked3":function(){
      this.getlistdata();
    },
    "$store.state.Humanmanage.QueryStaffMoveApprove": function (data) {
      this.tatolpage = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
    },
  },
  methods: {
    // 添加组
    addgroup() {
      this.$refs.approval.dialogFormVisible = true;
    },
    getlistdata() {
      this.listfrom.Status = this.getStatus();
      let obj = {
		"SN":"Organization",
        "MN": "QueryStaffMoveApprove",
        "RequestId": 1,
        "UserId": 1,
        "DataContent": this.listfrom
      }
      this.MIX_send(obj);
    },
    getStatus(){
      let arr= [];
      if (this.checked1) {
        arr.push('1')
      }
      if (this.checked2) {
        arr.push('2')
      }
      if (this.checked3) {
        arr.push('3')
      }
      return arr.toString();
    },
    rowClick(data) { },
    handleCurrentChange(data) {
      this.listfrom.PageIndex = data;
      this.getlistdata();
    },
    handleSizeChange(data) {
      // console.log(data,'handleSizeChange');
      this.listfrom.PageSize = data;
      this.getlistdata();
    },
    handleButton(data) { },
    cellClick(data) { },
    handleSortChange(data) { },
    handleSelectionChange(data) { },
    GetTableId(data) {
      console.log(data);
    },
    // 表格上方筛选slot的事件回调
    add() {
      console.log("表格上方筛选slot的事件回调");
    },
    // 弹出框表单提交
    Commit() {
      // console.log(this.$refs.PopForm.value);
    },
    // 弹出框底部标签页组件事件的回调
    edit(val) {
      console.log(val);
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    that = this;
    this.getlistdata();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() { }
}
</script>

<style lang='less' scoped>
.Head_Top {
  width: 100%;
  height: 51px;
  // overflow: hidden;
  display: flex;
  justify-content: space-between;
  .Top_one {
    width: 100px;
  }
  .Top_two {
    // flex: 1;
    display: flex;
    .Top_two_two {
      padding: 10px;
    }
  }
  .Top_three {
    width: 50px;
  }
}
</style>