<!--  -->
<template>
  <div>
    <div v-if="aType==1">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[0].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].No}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[1].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Name}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[2].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].ResponsibleDeptName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[3].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].JobsName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[4].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].ResponsiblerName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[5].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].WarehouseName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[6].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].StartDate}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[7].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].EndDate}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[9].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].InventoryStatusName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[8].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Desc}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="aType==2">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[0].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].No}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[1].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].InventoryPlanName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[2].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].AdjustmentTotal}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[3].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].AdjustmentAmount}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[4].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].LossTotal}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[5].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].LossAmount}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[6].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].SurplusTotal}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[7].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].SurplusAmount}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span="24">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[8].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Remark}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
     <div v-if="aType==3">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[0].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].No}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[1].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].InventoryPlanId}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[2].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].ResponsiblerName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[3].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].ResponsiblerName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[4].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].WarehouseName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[5].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].CreatedTime}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[6].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].StartDate}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[7].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].EndDate}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[8].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].InventoryStatusName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="24">
          <div class="grid-content bg-purple">
            <span style="font-size: 14px;color: #4D6474 ;">{{columns[9].title}} :</span>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Desc}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopFrom",
  data() {
    return {
    };
  },
 
  props: {
    aType: Number,
    seeMsg: Array,
    columns: Array,
  },
  methods: {
  },
  beforeCreate() {},
  //生命周期 - 创建完成（访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="less">
/deep/ .el-row{
    margin-top: 20px;
}
/* @import url(); 引入css类 */
// /deep/ .el-row>.el-col>span:nth-of-type(1){
//     font-size: 14px;
//     color: #4D6474 !important;
// }
// /deep/ .el-row>.el-col>span:nth-of-type(2){
// font-size: 14px;
// color: #798B97 ;
// }
.formContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px;
}
.formContainerItem {
  /* margin-right: 6px; */
}
.add_btn {
  z-index: 12;
  position: absolute;
  right: 10px;
  top: 0px;
}
.tabs_body {
  position: relative;
  width: 100%;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: #4d6474;
}
button:hover {
  cursor: pointer;
}
// element的input,select样式修改
/deep/ .formContainerItem .el-input__inner:focus,
.formContainerItem .el-select:focus {
  border-color: none;
  box-shadow: none;
}
/deep/ .formContainerItem .el-input__inner:hover,
.formContainerItem .el-select:hover,
.formContainerItem .el-select .el-input__inner:focus {
  border-right-color: #dde4f1;
  border-left-color: #dde4f1;
  border-top-color: #dde4f1;
  border-bottom-color: #dde4f1;
}
/deep/ .formContainerItem .el-input__inner,
.formContainerItem .el-select {
  border-left-color: #dde4f1;
  border-right-color: #dde4f1;
  border-top-color: #dde4f1;
  border-bottom-color: #dde4f1;
}
/deep/ .formContainerItem .is-disabled .el-input__inner:hover,
.formContainerItem .el-select .is-disabled .el-input__inner:hover,
.formContainerItem .is-disabled .el-select .el-input__inner:focus {
  border-right-color: #dde4f1;
  border-left-color: #dde4f1;
  border-top-color: #dde4f1;
  border-bottom-color: #dde4f1 !important;
}
/deep/ .formContainerItem .is-disabled .el-input__inner,
.formContainerItem .is-disabled .el-select {
  background-color: #dde4f1;
  color: #c0c4cc;
  cursor: not-allowed;
  border-left-color: #dde4f1;
  border-right-color: #dde4f1;
  border-top-color: #dde4f1;
  border-bottom-color: #dde4f1;
}
/deep/ .formContainerItem .is-error .el-input__inner,
.formContainerItem .is-error .el-select {
  border-left-color: #dde4f1;
  border-right-color: #dde4f1;
  border-top-color: #dde4f1;
  border-bottom-color: #dde4f1;
}
/ddep/
  .el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "" !important;
  color: white !important;
  margin-right: 4px;
}
// /deep/ .el-form-item__label{
//     float: left !important;
// }

// /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
//     background-color: #9FB6CD;
// }
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
  color: #4d6474 !important;
}
/deep/
  .el-tabs--top.el-tabs--card
  > .el-tabs__header
  .el-tabs__item:last-child {
  color: #4d6474 !important;
  font-size: 16px;
}
.success {
  color: #8cd16b;
}
.danger {
  color: #f56262;
}
</style>
