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
          <el-form-item v-if="item.type==='string'" label-position="left" :label="item.lable" :prop="item.key">
            <el-input
              v-model="value[item.key]"
              :placeholder="'请输入'+item.lable"
              :readonly="item.readonly||false"
              :type="item.inputType||''"
            />
            
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
          <el-form-item v-if="item.type==='remark'" :label="item.lable" :prop="item.key">
            <el-input
              v-model="value[item.key]"
              :type="flex?'':'textarea'"
              :placeholder="'请输入'+item.lable"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="tabs_body" v-if="fromData.tabPane&&fromData.tabPane.length>0">
      <button
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
          <!-- 使用插槽tabPane+index(索引)来使用 -->
          <slot v-if="tabsindex==index" :name="'tabPane'+index"></slot>
          <!-- <component :is="item.content"  v-on="item.listen"></component> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopFrom",
  data() {
    return {
      tabsindex: 0,
      value: {},
      fromComponent:
        JSON.parse(JSON.stringify(this.fromData.fromComponent)) || [],
    };
  },
  watch: {
    "value.SourceTable": function (val) {
      console.log(val)
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
  },
  props: {
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
  methods: {
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
      console.log(obj)
      this.value = obj;
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
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.InitValue();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="less">
/* @import url(); 引入css类 */
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
/deep/ .el-dialog .el-dialog__header {
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
</style>
