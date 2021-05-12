<!--  -->
<template>
  <div>
    <div v-if="aType==1">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[0].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].No}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[1].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].CreatedUserName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[2].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Dept}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[3].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Station}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[4].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].CreatedTime}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[5].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Reason}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[6].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Status}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="aType==2">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[0].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].No}}</span>
          </div>
        </el-col>
        <el-col :span="8">label
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[1].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].CreatedUserName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[2].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Dept}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[3].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].InWarehouseName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[4].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Station}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[5].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].CreatedTime}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[6].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].DelTime}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[7].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Reason}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="font-size: 14px;color: #4D6474 ;">{{columns[8].title}} :</label>
            <span style="font-size: 14px;color: #798B97 ;">{{seeMsg[0].Status}}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="tabs_body" style="height:200px;overflow: scroll;">
      <div
        style=" color: #4d6474 !important; width:100%; border-bottom: 1px solid #E4E7ED; height: 54px;
    line-height: 54px;
    font-size: 16px;"
      >| 物料申领明细查看</div>
      <el-table
        :data="detailedTable"
        :header-cell-style="{background:'#F0F7FB',color:'#5C87A4'}"
        style="width: 100%; height:400px;overflow:scroll;"
        tooltip-effect="dark"
        fit
      >
        <el-table-column align="center" prop="No" label="物料编码"></el-table-column>
        <el-table-column align="center" prop="Name" label="物料名称"></el-table-column>
        <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
        <el-table-column align="center" prop="Model" label="型号"></el-table-column>
        <el-table-column align="center" prop="Number" label="数量"></el-table-column>
        <el-table-column align="center" prop="UnitId" label="单位"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopFrom",
  data() {
    return {
      materielTable: [],
      top: true,
      footer: false,
      showTabs: false,
      tabsindex: 0,
      value: {},
      from: {},
      fromComponent:
        JSON.parse(JSON.stringify(this.fromData.fromComponent)) || [],
    };
  },
  watch: {
    detailedTable(newVal, oldVal) {
      console.log(newVal);
    },
    "value.SourceTable": function (val) {
      console.log(val);
      if (val == "5") {
        this.fromComponent.forEach((element, index) => {
          if (element.key == "SourceTableId") {
            this.fromComponent.splice(index, 1);
          }
        });
      } else {
        let isfalse = false;
        this.fromComponent.forEach((element) => {
          if (element.key == "SourceTableId") {
            isfalse = true;
          }
        });
        if (!isfalse) {
          this.fromComponent = JSON.parse(
            JSON.stringify(this.fromData.fromComponent)
          );
        }
      }
    },
    "value.Number": function (val) {
      if (val !== "" && this.value.Price !== "") {
        this.$set(this.value, "Amount", val * this.value.Price);
      }
    },
    "value.Price": function (val) {
      if (val !== "" && this.value.Number !== "") {
        this.$set(this.value, "Amount", val * this.value.Number);
      }
    },
    fromData(newVal, oldVal) {
      console.log(newVal);
    },
  },
  props: {
    detailedTable: Array,
    aType: Number,
    seeMsg: Array,
    fromData: Object,
    columns: Array,
  },
  methods: {
    showTabsFun() {
      this.showTabs = true;
      this.top = false;
      this.footer = true;
    },
    visTabsFun() {
      this.showTabs = false;
      this.top = true;
      this.footer = false;
    },
    add() {
      this.$emit("addbtn", this.tabsindex);
    },
    tabclick(e) {
      this.tabsindex = e.index;
      // console.log(e.index);
    },
    InitValue() {
      let obj = {};
      this.fromData.fromComponent.forEach((element) => {
        obj[element.key] = "";
        if (element.type == "date") {
          let data = new Date();
          let datas =
            data.getFullYear() +
            "-" +
            (data.getMonth() + 1 < 10
              ? "0" + (data.getMonth() + 1)
              : data.getMonth() + 1) +
            "-" +
            data.getDate();
          obj[element.key] = datas;
        }
      });
      this.value = obj;
    },
    assignment() {
      this.value.No = this.NumNo;
    },
    // 修改select中的optios
    Changeoptions(val, index) {
      this.fromComponent.forEach((item, i) => {
        if (index == i) {
          item.options = val;
        }
      });
    },
  },
  beforeCreate() {},
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.InitValue();
    console.log(JSON.stringify(this.fromData.tabPane[0].columns));
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="less">
/* @import url(); 引入css类 */
// /deep/ .el-row>.el-col>span:nth-of-type(1){
//     font-size: 14px;
//     color: #4D6474 !important;
// }
// /deep/ .el-row>.el-col>span:nth-of-type(2){
// font-size: 14px;
// color: #798B97 ;
// }
// .footer {
//   color: #92b3c9;
//   cursor: pointer;
//   font-size: 14px;
//   display: flex;
//   justify-content: center;
//   div {
//     float: left;
//   }
//   .footerSon {
//     transform: rotate(270deg);
//   }
//   margin-top: 20px;
// }
// .top {
//   color: #92b3c9;
//   cursor: pointer;
//   font-size: 14px;
//   display: flex;
//   justify-content: center;
//   div {
//     float: left;
//   }
//   .topSon {
//     transform: rotate(90deg);
//   }
// }
// .formContainer {
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   padding: 5px;
// }
// .formContainerItem {
//   /* margin-right: 6px; */
// }
// .add_btn {
//   z-index: 12;
//   position: absolute;
//   right: 10px;
//   top: 0px;
// }
// .tabs_body {
//   position: relative;
//   width: 100%;
// }
// /deep/ .el-dialog__header {
//   border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
//   color: #4d6474;
// }
// button:hover {
//   cursor: pointer;
// }
// // element的input,select样式修改
// /deep/ .formContainerItem .el-input__inner:focus,
// .formContainerItem .el-select:focus {
//   border-color: none;
//   box-shadow: none;
// }
// /deep/ .formContainerItem .el-input__inner:hover,
// .formContainerItem .el-select:hover,
// .formContainerItem .el-select .el-input__inner:focus {
//   border-right-color: #dde4f1;
//   border-left-color: #dde4f1;
//   border-top-color: #dde4f1;
//   border-bottom-color: #dde4f1;
// }
// /deep/ .formContainerItem .el-input__inner,
// .formContainerItem .el-select {
//   border-left-color: #dde4f1;
//   border-right-color: #dde4f1;
//   border-top-color: #dde4f1;
//   border-bottom-color: #dde4f1;
// }
// /deep/ .formContainerItem .is-disabled .el-input__inner:hover,
// .formContainerItem .el-select .is-disabled .el-input__inner:hover,
// .formContainerItem .is-disabled .el-select .el-input__inner:focus {
//   border-right-color: #dde4f1;
//   border-left-color: #dde4f1;
//   border-top-color: #dde4f1;
//   border-bottom-color: #dde4f1 !important;
// }
// /deep/ .formContainerItem .is-disabled .el-input__inner,
// .formContainerItem .is-disabled .el-select {
//   background-color: #dde4f1;
//   color: #c0c4cc;
//   cursor: not-allowed;
//   border-left-color: #dde4f1;
//   border-right-color: #dde4f1;
//   border-top-color: #dde4f1;
//   border-bottom-color: #dde4f1;
// }
// /deep/ .formContainerItem .is-error .el-input__inner,
// .formContainerItem .is-error .el-select {
//   border-left-color: #dde4f1;
//   border-right-color: #dde4f1;
//   border-top-color: #dde4f1;
//   border-bottom-color: #dde4f1;
// }
// /ddep/
//   .el-form-item.is-required:not(.is-no-asterisk)
//   .el-form-item__label-wrap
//   > .el-form-item__label:before,
// .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
//   content: "" !important;
//   color: white !important;
//   margin-right: 4px;
// }
// // /deep/ .el-form-item__label{
// //     float: left !important;
// // }

// // /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
// //     background-color: #9FB6CD;
// // }
// /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
//   border: none;
//   color: #4d6474 !important;
// }
// /deep/
//   .el-tabs--top.el-tabs--card
//   > .el-tabs__header
//   .el-tabs__item:last-child {
//   color: #4d6474 !important;
//   font-size: 16px;
// }
// .success {
//   color: #8cd16b;
// }
// .danger {
//   color: #f56262;
// }
// .el-row {
//   margin-top: 20px;
// }
// .el-row:nth-last-child(1) {
//   margin-bottom: 20px;
// }
// label{
//   font-weight: 600;
// }
</style>
