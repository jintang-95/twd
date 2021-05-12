<template>
    <el-dialog
    :visible.sync="shows"
     @close="cancelAdd"
    :title="type == 1 ? '新增单位换算' : '编辑单位换算'"
    width="460px"
    append-to-body
    center>
        <el-form ref="form" label-width="80px">
            <el-form-item label="单位名称" label-position="left">
                <el-input  placeholder="请输入单位名称" v-model="formData.Name"></el-input>
            </el-form-item>
            <el-form-item label="换算数量" label-position="left">
                <el-input type="number" placeholder="请输入换算数量" v-model="formData.Number"></el-input>
            </el-form-item>
            <el-form-item label="是否标准单位" label-position="left">
                <el-switch v-model="formData.IsBase">
                </el-switch>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="formData.Remark"  placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'unitTransfor',
  props: {
      addData: {
          type: Object,
          default () {
              return {
                  shows: false
              }
          }
      },
      visible: {
          type: Boolean,
          default: false
      },
      type: {
          type: String,
          default: '1'
      }
  },
  data() {
      return {
          formData: {},
          shows: false
      }
  },
  watch: {
      addData(newVal, oldVal) {
          this.formData = newVal
      },
      visible(newVal, oldVal) {
          this.shows = newVal
      }
  },
  methods: {
      cancelAdd () {
          this.$emit('closePropMask', false)
      },
      submitAdd() {
         let base = this.formData['IsBase'] ? '1' : '0'
          let form =  {
             Name: this.formData['Name'],
             Number: this.formData['Number'],
             Remark: this.formData['Remark'],
             IsBase: base
          }
         this.$emit('dataSubmit', form)
         this.formData = {
             Name: '',
             Number: '',
             Remark: '',
             IsBase: false
         }
      }
  }
}
</script>
<style scoped>
.el-switch {
    margin-top: 10px;
}
</style>