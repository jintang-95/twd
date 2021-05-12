<!--  -->
<template>
  <div>
    <div v-if="fromData&&fromComponent">
      <el-form
        :class="flex?'formContainer':''"
        size="small"
        :disabled="disabled"
        label-position="left"
        :label-width="flex?'':'80px'"
        :model="value"
        ref="ruleForm"
        :rules="fromData.rules||{}"
      >
        <div
          :class="flex?'formContainerItem':''"
          v-for="(item,index) in fromComponent"
          :key="index"
        >
          <el-form-item v-if="item.type==='string'" :label="item.lable" :prop="item.key">
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
      <el-button :disabled="disabled" type="primary" @click="add" class="add_btn" size="small">新增</el-button>
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
        JSON.parse(JSON.stringify(this.fromData.fromComponent)) || []
    };
  },
  watch: {
    "value.SourceTable": function(val) {
      if (val == "5") {
        this.fromComponent.forEach((element, index) => {
          if (element.key == "SourceTableId") {
            this.fromComponent.splice(index, 1);
          }
        });
      } else {
        let isfalse = false;
        this.fromComponent.forEach(element => {
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
    "value.Number": function(val) {
      if (val !== "" && this.value.Price !== "") {
        this.$set(this.value, "Amount", val * this.value.Price);
      }
    },
    "value.Price": function(val) {
      if (val !== "" && this.value.Number !== "") {
        this.$set(this.value, "Amount", val * this.value.Number);
      }
    }
  },
  props: {
    fromData: Object,
    flex: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
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
      this.fromData.fromComponent.forEach(element => {
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
    // 修改select中的optios
    Changeoptions(val, index) {
      this.fromComponent.forEach((item, i) => {
        if (index == i) {
          item.options = val;
        }
      });
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.InitValue();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.formContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
</style>
