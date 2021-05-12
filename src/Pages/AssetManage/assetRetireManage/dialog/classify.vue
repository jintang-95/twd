<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增资产分类' : '编辑资产分类'"
    :visible.sync="show"
    width="460px"
    center>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="分类编码" label-position="left">
                <el-input v-model="form.No" placeholder="请输入分类编码"></el-input>
            </el-form-item>
            <el-form-item label="分类名称" label-position="left">
                <el-input v-model="form.Name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="所属分类">
                <el-select v-model="form.ParentId" placeholder="请选择所属分类">
                    <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通用设置">
                <el-checkbox label="自动编码" name="type" v-model="form.AutoCode"></el-checkbox>
                <el-checkbox label="单位换算" name="type" v-model="form.UnitConvert"></el-checkbox>
                <el-checkbox label="作业标准" name="type" v-model="form.OperationStandard"></el-checkbox>
                <el-checkbox label="BOM清单" name="type" v-model="form.MaterielBOM"></el-checkbox>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.Desc" placeholder="请输入分类描述"></el-input>
            </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
         <!-- <el-button @click="Submitdraft">保存为草稿</el-button> -->
        <el-button type="primary" @click="cancelSubmit" class="ownbutton">取 消</el-button>
        <el-button type="primary" @click="submitData" class="ownbutton">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'classify',
  data() {
    return {
        show: false,
        form: {
            No: '',
            Name:'',
            User: '',
            ParentId: '',
            department:'',
            Number:'',
            Device:'',
            Tasknum:'',
            Taskname:'',
            Desc: '',
            AutoCode: '',
            UnitConvert: '',
            OperationStandard: '',
            MaterielBOM: ''
        }
    };
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
        default() {
            return []
        }
      },
    //   deparList:{
    //     type: Array,
    //     default() {
    //         return []
    //     }
    //   },
      formData: {
          type: Object,
          default () {
              return {}
          }
      }
  },
  watch: {
      visible(newVal, oldVal) {
        this.show = newVal
      },
      formData(newVal, oldVal) {
        this.form = newVal
      }
  },
  methods: {
      cancelSubmit () {
          this.$emit('closeMask', false)
          this.form={}
      },
      Submitdraft(){

      },
      submitData () {
          this.form['AutoCode'] = this.form['AutoCode'] ? '1':'0'
          this.form['UnitConvert'] = this.form['UnitConvert'] ? '1':'0'
          this.form['OperationStandard'] = this.form['OperationStandard'] ? '1':'0'
          this.form['MaterielBOM'] = this.form['MaterielBOM'] ? '1':'0'
          this.form['ParentId'] = !this.form['ParentId'] ? '0':this.form['ParentId']
        //   this.form['department'] = !this.form['department']? '0':this.form['department']
          this.$emit('addMateria', this.form)
      }
  },
}
</script>
<style scoped lang='less'>
.dialog-footer .ownbutton{
    width:200px;
}
</style>