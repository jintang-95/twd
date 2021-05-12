<!-- 新增组织FORM start -->
<template>
  <el-dialog
    :title="type == 1 ? '新增组织' : '编辑组织'"
    :visible="dialogFormVisible"
    width="460px"
    @close="cancel"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="70px"
      style="width: 300px; margin-left:50px;"
    >
      <el-form-item label="名称:" prop="Name">
        <el-input v-model="form.Name" auto-complete="off" placeholder="组织名称" />
      </el-form-item>
      <el-form-item label="别名" prop="OtherName">
        <el-input v-model="form.OtherName" auto-complete="off" placeholder="组织别名" />
      </el-form-item>
      <el-form-item label="类型" prop="Type">
        <el-select
          :disabled="datatype =='2'"
          v-model="form.Type"
          placeholder="请选择类型"
          style="width:230px"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in $optiondata.OrganType"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="隶属" prop="ParentId">
        <!-- <el-select :disabled="datatype =='2'" v-model="form.ParentId" placeholder="请选择隶属关系" style="width:230px">
            <el-option :label="item.Name" :value="item.Id" v-for="(item,index) in option" :key='index'></el-option>
        </el-select>-->
        <el-cascader
          v-model="form.ParentId"
          @change="GetTableId"
          placeholder="请选择隶属关系"
          :options="option"
          :props="optionProps"
          filterable
          clearable
          style="width:230px"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="描述" prop="Desc">
        <el-input
          v-model="form.Desc"
          auto-complete="off"
          :autosize="{ minRows: 2, maxRows: 4}"
          type="textarea"
          placeholder="关于组织描述"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" style="background:rgba(0,96,160,1)" @click="commit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
    }
  },
  name: 'organ',
  data () {
    return {
      datatype: 1,
      rules: {
        Name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        Type: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        OtherName: [
          { required: true, message: '请输入别名', trigger: 'blur' },
        ],
        Desc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
        ParentId: [
          { required: true, message: '请选择隶属关系', trigger: 'blur' },
        ],
      },
      option: {},
      form: {
        id: undefined,
        Name: '',
        Type: '1',
        ParentId: '',
        OtherName: '',
        Desc: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      center: true,
      textMap: {
        update: '修改组织',
        create: '新增组织'
      },
      optionProps: {
        value: 'Id',
        label: 'Name',
        children: 'Children',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '1'
    },
    typeList: {
      type: Array,
      default () {
        return []
      }
    },
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {
  },
  watch: {
    "$store.state.Humanmanage.SaveOrganization": function (data) {
      if (data.Code == 0) {
        this.$message({
          showClose: true,
          message: this.formtype == '1' ? '添加成功' : '编辑成功',
          type: 'success'
        });
        this.$parent.getOrganizationTree();
        this.$parent.getlistdata();
        this.cancel();
      }
    },
    visible (newVal, oldVal) {
      this.show = newVal
    },
    formData (newVal, oldVal) {
      this.form = newVal
    }
  },
  methods: {
    GetTableId (value) {
      this.form.ParentId = value[value.length - 1]
      // console.log(this.form.ParentId)
    },
    cancel () {
      this.form = {
        Name: '',
        Type: '1',
        ParentId: '',
        OtherName: '',
        Desc: '',
      }
      this.dialogFormVisible = false;
      //  this.$emit('update:dialogFormVisible',false)
    },
    commit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let obj = {
            "MN": "SaveOrganization",
            "SN": "Organization",
            "RequestId": 1,
            "UserId": 1,
            "DataContent": this.form
          }
          this.MIX_send(obj);
        } else {
          return false;
        }
      });
    },
    handleClose (done) {
      done();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  // display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/deep/ .el-dialog__header {
  margin: 0 2rem;
  padding: 20px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    margin-left: 20px;
    color: #4d6474;
    font-size: 18px;
    font-weight: 400;
  }
}
</style>
