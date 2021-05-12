<template>
  <div>
    <el-table
      ref="table"
      v-if="height"
      v-loading="loading"
      element-loading-text="Loading"
      :data="tableData"
      :height="height"
      fit
      highlight-current-row
      tooltip-effect="dark"
      style="width:100%"
      class="tabl_cmp"
      @cell-click="cellClick"
      @row-click="rowClick"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
    >
      <el-table-column v-if="selection" :selectable="checkSelectable" type="selection" width="40"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        v-for="(item,index) in tableLabel"
        :width="item.width ? item.width : ''"
        :key="index"
        :align="item.align"
        :label="item.label"
        :prop="item.param"
        :sortable="item.sortable ? 'custom' : false"
      >
        <el-button>上边</el-button>
        <template slot-scope="scope">
          <span v-if="item.render">{{item.render(scope.row)?item.render(scope.row):'-'}}</span>
          <component
            v-else-if="item.component"
            :is="item.component"
            :row="scope.row"
            :keyindex="scope.$index"
            v-on="item.listeners"
          ></component>
          <span v-else>{{scope.row[item.param]?scope.row[item.param]:'-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      ref="table"
      v-else
      v-loading="loading"
      element-loading-text="Loading"
      :data="tableData"
      fit
      highlight-current-row
      tooltip-effect="dark"
      style="width:100%"
      class="tabl_cmp"
      @cell-click="cellClick"
      @row-click="rowClick"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="selection" :selectable="checkSelectable" type="selection" width="40"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        v-for="(item,index) in tableLabel"
        :width="item.width ? item.width : ''"
        :key="index"
        :align="item.align"
        :label="item.label"
        :prop="item.param"
        :sortable="item.sortable ? 'custom' : false"
      >
        <el-button>上边</el-button>
        <template slot-scope="scope">
          <span v-if="item.render">{{item.render(scope.row)?item.render(scope.row):'-'}}</span>
          <component
            v-else-if="item.component"
            :is="item.component"
            :row="scope.row"
            :keyindex="scope.$index"
            v-on="item.listeners"
          ></component>
          <span v-else>{{scope.row[item.param]?scope.row[item.param]:'-'}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Boolean,
      default: false,
    },
    FlowControlStatus: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "200px",
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableLabel: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {},
  watch: {
    // tableData: (e) => {
    //   console.log(e, "object");
    // },
  },
  methods: {
    checkSelectable(row) {
      return row[this.FlowControlStatus] == "false";
    },
    getCptBind({ row, column }, col) {
      const props = { row, col, column };
      const handler = col.propsHandler;
      return (handler && handler(props)) || props;
    },
    cellClick(methods, row, index) {
      // 某个单元格被点击时会触发该事件
      this.$emit("cellClick", { methods: methods, row: row, index: index });
    },
    rowClick(methods, row, index) {
      // 某个单元格被点击时会触发该事件
      this.$emit("rowClick", { methods: methods, row: row, index: index });
    },
    handleButton(methods, row, index) {
      // 按钮事件
      this.$emit("handleButton", { methods: methods, row: row, index: index });
    },
    handleSortChange(val) {
      // 排序
      this.$emit("handleSortChange", val);
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
  },
};
</script>
