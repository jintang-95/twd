<template>
  <div>
    <div>
      <el-date-picker
        v-model="listfrom.Status"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2"
      >
      </el-date-picker>
      <el-button @click="exportdata" size="" type="primary">导出</el-button>
    </div>
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
        v-if="tatolpage < 10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listfrom.PageIndex"
        layout=" prev, pager, next"
        :total="tatolpage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tatolpage: 0,
      tableData: [],
      listfrom: {
        "Status": '',
        "KeyWord": '',
        "Status": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      tableLabel: [
        {          label: '状态', param: 'Status', width: '100', align: 'center', sortable: false, render: (row) => {
            if (row.Status == 0) {
              return '草稿'
            } else if (row.Status == 1) {
              return '待审批'
            } else if (row.Status == 2) {
              return '审核通过'
            } else if (row.Status == 3) {
              return '作废'
            }
          }
        },
        { label: '用户名称', param: 'Name', align: 'center', width: '200', sortable: false },
        {          label: '来源', param: 'Source', align: 'center', width: '150', render: (row) => {
            if (row.Source == 0) {
              return '用户注册'
            } else if (row.Source == 1) {
              return '管理员添加'
            }
          }
        },
        { label: '描述', param: 'Remark', align: 'center' },
      ],
    }
  },
  created() {

  },
  methods: {
    pickerOptions2() { },
    exportdata() { },
    handleButton() { },
    rowClick() { },
    cellClick() { },
    handleSortChange() { },
    handleSelectionChange() { },
    handleSizeChange() { },
    handleCurrentChange() { },
  },
}
</script>

<style lang="less" scoped>
</style>