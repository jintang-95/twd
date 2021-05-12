<!--  -->
<template>
  <div>
    <div v-if="fromData&&fromComponent">
      <el-form
        :class="flex?'formContainer':''"
        size="small"
        :disabled="disabled"
        label-position="left"
        label-width="100px"
        :model="value"
        ref="ruleForm"
        :rules="fromData.rules||{}"
      >
        <div
          :class="flex?'formContainerItem':''"
          v-for="(item,index) in fromComponent"
          :key="index"
        >
          <el-form-item
            v-if="item.type==='string'"
            label-position="left"
            :label="item.lable"
            :prop="item.key"
          >
            <el-input
              v-model="value[item.key]"
              :placeholder="'请输入'+item.lable"
              :readonly="item.readonly||false"
              :type="item.inputType||''"
            />
          </el-form-item>
          <el-form-item
            v-if="item.key==='No'"
            style="display:none;"
            label-position="left"
            :label="item.lable"
            :prop="item.key"
          >
            <el-input
              v-model="value[item.key]"
              :placeholder="'请输入'+item.lable"
              :readonly="item.readonly||false"
              :type="item.inputType||''"
            />
          </el-form-item>
          <el-form-item
            class="staff"
            v-if="item.type==='staff'"
            label-position="left"
            :label="item.lable"
            :prop="item.key"
            style="cursor: pointer;"
          >
            <chooseStaff
              class="chooseStaff"
              :isCustomer="true"
              :isMultipleChoice="false"
              @getToFather="getToId"
              :stuffId="stuffId.Id"
            ></chooseStaff>
          </el-form-item>
          <el-form-item v-if="item.type==='select'" :label="item.lable" :prop="item.key">
            <el-select v-model="value[item.key]">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              >{{option.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.type==='cascader'" :label="item.lable" :prop="item.key">
            <!-- <el-select v-model="value[item.key]">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              >{{option.label}}</el-option>
            </el-select> -->
            <el-cascader
              placeholder="请选择"
              v-model="value[item.key]"
              :options="typeList"
              :props="optionProps"
              filterable
              clearable
              @change="typeChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item class="last" v-if="item.type==='Dept'" :label="item.lable" :prop="item.key">
            <el-cascader
              placeholder="选择部门"
              v-model="value[item.key]"
              :options="menus"
              :props="optionChildren"
              :show-all-levels="false"
              filterable
              cleartable
              style="width: 220px;"
            ></el-cascader>
          </el-form-item>
          <el-form-item v-if="item.type==='selectremote'" :label="item.lable">
            <slot name="selectremote"></slot>
          </el-form-item>
          <el-form-item v-if="item.type==='date'" :label="item.lable" :prop="item.key">
            <el-date-picker
              v-model="value[item.key]"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="'请选择'+item.lable"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="item.type==='time'" :label="item.lable" :prop="item.key">
            <el-time-select v-model="value[item.key]" :placeholder="'请选择'+item.lable"></el-time-select>
          </el-form-item>

          <el-form-item
            class="last"
            v-if="item.type==='remark'"
            :label="item.lable"
            :prop="item.key"
          >
            <el-input
              style="width:61rem"
              v-model="value[item.key]"
              :type="'textarea'"
              :placeholder="'请输入'+item.lable"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="tabs_body" v-if="fromData.tabPane&&fromData.tabPane.length>0">
      <button
      v-if="addTrue"
        :disabled="disabled"
        @click="add"
        class="add_btn"
        style="float: right;z-index: 100;position: absolute;right: 20px;width:24px;
height:24px; color:#fff;border:none;font-size:13px; outline: none;
background:rgba(0,96,160,1);
border-radius:2px;"
      >+</button>
      <el-tabs @tab-click="tabclick" type="card" value="tabPane0">
        <el-tab-pane
          v-for="(item,index) in fromData.tabPane"
          :key="'tabPane'+index"
          :label="item.label"
          :name="'tabPane'+index"
        >
          <slot v-if="tabsindex==index" :name="'tabPane'+index"></slot>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import chooseStaff from "./myStaff";
export default {
  name: "PopFrom",
  data() {
    return {
      listTable:[],
      myNowTime:'',
      stuffId: "",
      menus: [],
      optionChildren: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
      optionProps: {
        value: "Id",
        label: "Name",
        children: "ChildNodes",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
      tabsindex: 0,
      value: {},
      from: {},
      fromComponent:
        JSON.parse(JSON.stringify(this.fromData.fromComponent)) || [],
    };
  },
  props: {
    seeUpTable:{},
    clickType:{
      type:String
    },
    addTrue: {
      type: Boolean,
      default: true,
    },
    popVal: Object,
    typeList: Array,
    fromData: Object,
    flex: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      "GetWarehousesTree",
      "CreateBillNOByBillTypeCode",
      "QueryOrganizationTree",
    ]),
  },
  watch: {
      //获取单条数据
    seeUpTable(data){
      this.InitValue()
      let dataday = new Date()
      let year = dataday.getFullYear()
      let month = dataday.getMonth()+1
      let day = dataday.getDate()
      this.value.InStockDate = year+"-"+month+"-"+day
      this.value.SourceTableNo = data.No
      this.value.SourceTable = data.ResoureType
      this.value.DeliveryType="0"
      let mytime=dataday.toLocaleTimeString(); //获取当前时间
      this.value.CreatedTime==mytime.substring(2,mytime.length-3)
      console.log(this.value,"====----")
    },
    value(data){
      console.log(data)
    console.log(this.value)
    },
    clickType(data){
      if(data=="add"){
        //alert("判断9")
        this.InitValue()
        this.value.CreatedUser = this.stuffId.Id;
        this.value.CreatedUserName = this.stuffId.Id;
        this.set()
      }
    },
    //编辑数据
    popVal(data) {
      if(this.addTrue ==false){
      if(data.SourceTable&&data.No){
        //alert("判断5")
      this.value.SourceTable=data.SourceTable
      this.value.SourceTableNo=data.No
      this.value.DeliveryType="0"
      }else{
        //alert("判断6")
        this.value = this.popVal;
        this.value.SourceTableNo=0
      }}else if(this.clickType=="add"){
        this.value={}
        this.InitValue()
        //alert("判断7")
      }
      else{
        console.log(this.popVal)
        this.value=this.popVal
        this.value.SourceTableNo=0
        //alert("判断8")
      }
    },
    //获取组织树
    QueryOrganizationTree(newval, oldval) {
      //let DataContent = data.ReturnData.DataCount;
      this.menus = newval.ReturnData;
      //this.menus = this.removechild(this.menus);
    },
    CreateBillNOByBillTypeCode(newVal, oldVal) {},
    // "value.SourceTable": function (val) {
    //   if (val == "5") {
    //     this.fromComponent.forEach((element, index) => {
    //       if (element.key == "SourceTableNo") {
    //         this.fromComponent.splice(index, 1);
    //       }
    //     });
    //   } else {
    //     let isfalse = false;
    //     this.fromComponent.forEach((element) => {
    //       if (element.key == "SourceTableNo") {
    //         isfalse = true;
    //       }
    //     });
    //     if (!isfalse) {
    //       this.fromComponent = JSON.parse(
    //         JSON.stringify(this.fromData.fromComponent)
    //       );
    //     }
    //   }
    // },
    // "value.Number": function (val) {
    //   if (val !== "" && this.value.Price !== "") {
    //     this.$set(this.value, "Amount", val * this.value.Price);
    //   }
    // },
    "value.CreatedUser"(data){
      if(!data){
      this.value.CreatedUser = this.stuffId.Id;
      this.value.CreatedUserName = this.stuffId.Id;
      }
    }
    // "value.Price": function (val) {
    //   if (val !== "" && this.value.Number !== "") {
    //     this.$set(this.value, "Amount", val * this.value.Number);
    //   }
    // },
  },
  components: {
    chooseStaff,
  },
  methods: {
    //获取当前时间
    getNow(){
      let myDate = new Date();
      myDate.getYear(); //获取当前年份(2位)
      myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      myDate.getMonth(); //获取当前月份(0-11,0代表1月)
      myDate.getDate(); //获取当前日(1-31)
      myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
      myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
      myDate.getHours(); //获取当前小时数(0-23)
      myDate.getMinutes(); //获取当前分钟数(0-59)
      myDate.getSeconds(); //获取当前秒数(0-59)
      myDate.getMilliseconds(); //获取当前毫秒数(0-999)
      myDate.toLocaleDateString(); //获取当前日期
      let mytime=myDate.toLocaleTimeString(); //获取当前时间
      let myNow=myDate.toLocaleString( ); //获取日期与时间
      this.myNowTime=mytime.substring(2,mytime.length-3)
    },
    //获取组织树数据
    getOrganizationTree() {
      let objor = {
        MN: "QueryOrganizationTree",
        SN: "Organization",
        RequestId: 1,
        UserId: 1,
        DataContent: {},
      };
      this.MIX_send(objor);
    },
    //获取员工Id
    getToId(val) {
      console.log(val);
      this.value.CreatedUser = val.keyId;
      this.value.CreatedUserName = val.keyId;
    },
    //员工选择事件
    staffCheck() {
      console.log(212);
    },
    typeChange() {},
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
      this.value.No = "";
    },
    // 修改select中的optios
    Changeoptions(val, index) {
      this.fromComponent.forEach((item, i) => {
        if (index == i) {
          item.options = val;
        }
      });
    },
    //设置默认值
    set(){
    this.value.SupplierId = 0;
    this.value.SourceTableNo=0
    this.value.DeliveryPersonId = 0;
    this.value.DeliveryType = "0";
    this.value.Station = 0;
    this.value.Dept = 0;
    this.value.Mode="0"
    }
  },
  beforeCreate() {},
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.stuffId = JSON.parse(window.sessionStorage.getItem("UserDetial"));
    //alert(this.clickType)
    this.InitValue();
    //=============设置默认值 start
    this.set()
    this.value.CreatedUser = this.stuffId.Id;
    this.value.CreatedUserName = this.stuffId.Id;
    //alert( this.value.CreatedUser)
    //=============设置默认值结束
    this.getOrganizationTree();
    if(this.clickType == "add"){
      this.InitValue()
    }else if(this.clickType == "edit"){
      this.value = this.popVal;
      this.value.DeliveryType="0"
    }
    else{
    if(this.addTrue ==false){
      console.log(this.popVal)
      this.value.SourceTableNo=this.popVal.No
      this.value.SourceTable=this.popVal.SourceTable
      this.value.DeliveryType="0"
    }
    if(this.popVal&&!this.popVal.SourceTable){
      this.value = this.popVal;
      this.value.DeliveryType="0"
    }}
    
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="less">
/* @import url(); 引入css类 */
.staff {
  display: flex;
}
.last {
  input {
    width: 1000rem;
  }
}
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
.chooseStaff {
  margin-top: -0.8rem;
  margin-left: -7rem;
}
</style>
