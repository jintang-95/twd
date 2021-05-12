<template>
    <el-dialog
    :visible.sync="shows"
     @close="cancelAdd"
    :title="type == 1 ? '新增单位换算' : '编辑单位换算'"
    width="460px"
    append-to-body
    >
        <el-form ref="form" :rules="rules" label-width="80px" label-position="left">
            <el-form-item label="单位名称" prop="Name" label-position="left">
                <el-input  placeholder="请输入单位名称" v-model="formData.Name"></el-input>
            </el-form-item>
            <el-form-item label="换算数量" prop="Number" label-position="left">
                <el-input type="number" placeholder="请输入换算数量" v-model="formData.Number"></el-input>
            </el-form-item>
            <el-form-item label="是否标准单位" prop="IsBase" label-position="left">
                <el-switch v-model="formData.IsBase">
                </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="Remark">
                <el-input type="textarea" v-model="formData.Remark"  placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
 <span slot="footer" class="dialog-footer" style="  margin-left: 10.1rem;">
      <button
        @click="cancelAdd"
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
      >取 消</button>
      <button
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
        type="primary"
        @click="submitAdd"
      >确 定</button>
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
          rules:{},
        //   rules: {
        //   Name: [
        //     { required: true, message: '请输入单位名称', trigger: 'change' },
        //   ],
        //   Number: [
        //     { required: true, message: '请输入换算数量', trigger: 'change' },
        //   ],
        //   },
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
button:hover {
  cursor: pointer;
}
</style>