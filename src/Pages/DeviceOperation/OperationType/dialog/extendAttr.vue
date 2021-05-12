<template>
    <el-dialog
    :title="type == 1? '新增扩展属性' : '编辑扩展属性'"
    :visible.sync="show"
    width="460px"
    append-to-body
    center>
        <el-form ref="form" label-width="80px">
            <el-form-item label="属性名" label-position="left">
                <el-input  placeholder="请输入属性名" v-model="formData.Name"></el-input>
            </el-form-item>
            <el-form-item label="属性值" label-position="left">
                <el-input  placeholder="请输入属性值" v-model="formData.Value"></el-input>
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
  name: 'extendAttr',
  props: {
      addData: {
          type: Object,
          default () {
              return {}
          }
      },
      visible: {
          type: Boolean,
          default: []
      },
      type: {
          type: String,
          default: '1'
      }
  },
  data() {
      return {
          formData: {},
          show: false
      }
  },
  watch: {
      addData(newVal, oldVal) {
          this.formData = newVal
      },
      visible(newValue, oldValue) {
          this.show = newValue
      }
  },
  methods: {
      cancelAdd () {
          this.$emit('closePropMask',false)
      },
      submitAdd() {
          this.$emit('dataSubmit',this.formData)
          this.formData= {
              Name: '',
              Value: '',
              Remark: ''
          }
      }
  }
}
</script>
<style scoped>

</style>