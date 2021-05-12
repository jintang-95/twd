<!-- 进入审批弹窗 -->
<template>
    <el-dialog :title="textMap.update" :visible.sync="dialogFormVisible" center width="460px" @close = 'cancel'>
      <!-- <el-form ref="ruleForm" :rules="rules" :model="form" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">
        <el-form-item label="名称:" prop="Name">
          <el-input v-model="form.Name" auto-complete="off" placeholder="组织名称"/>
        </el-form-item>
        <el-form-item label="别名" prop="OtherName">
          <el-input v-model="form.OtherName" auto-complete="off" placeholder="组织别名" />
        </el-form-item>
        <el-form-item label="类型" prop="Type">
          <el-select :disabled="formtype =='2'" v-model="form.Type" class="filter-item" placeholder="请选择类型" style="width: 230px">
             <el-option :label="item.label" :value="item.value" v-for="(item,index) in $optiondata.OrganType" :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隶属" prop="ParentId" v-if="form.Type=='2'">
          <el-select :disabled="formtype =='2'" v-model="form.ParentId" class="filter-item" placeholder="请选择隶属关系" style="width: 230px">
            <el-option :label="item.Name" :value="item.Id" v-for="(item,index) in option" :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="Desc">
          <el-input v-model="form.Desc" auto-complete="off" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="关于组织描述" />
        </el-form-item>
      </el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="commit">
          提交
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
  return {
        formtype: 1,
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
        option:{},
        form: {
          id: undefined,
          Name: '',
          Type: '1',
          ParentId: '0',
          OtherName: '',
          Desc: '',
        },
        dialogFormVisible: false,
        dialogStatus: '待我审批',
        center:true,
        textMap: {
          update: '待我审批',
          create: '我审批的'
        }
      }
  },
  created() {
    },
  watch: {
    // "$store.state.Humanmanage.SaveOrganization":function (data){
    //     if (data.Code==0) {
    //       this.$message({
    //       showClose: true,
    //       message: this.formtype=='1'?'添加成功':'编辑成功',
    //       type: 'success'
    //     });
    //     this.$parent.getOrganizationTree();
    //     this.$parent.getlistdata();
    //     this.cancel();
    //     }
    // },
  },
  methods: {
    cancel() {
      this.form = {
        Name: '',
        Type: '1',
        ParentId: '',
        OtherName: '',
        Desc: '',
      }
      this.dialogFormVisible = false
    },
    commit() {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let obj = {
                  "MN":"SaveOrganization",
                  "RequestId":1,
                  "UserId":1,
                  "DataContent":this.form
                 }
            this.MIX_send(obj);
          } else {
            return false;
          }
        });
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
