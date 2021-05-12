<template>
    <el-dialog
    :title="type == 1? '新增货架明细' : '编辑货架属性'"
    :visible.sync="show"
    width="460px"
    append-to-body
    center>
        <el-form ref="form" label-width="80px">
            <el-form-item label="货架名称" label-position="left">
                <el-input  placeholder="请输入货架名称" v-model="formData.Name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="formData.Desc"  placeholder="请输入备注"></el-input>
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
  name: 'shelevs',
  props: {
      addData: {
          type: Object,
          default () {
              return {}
          }
      },
      visible: {
          type: Boolean,
          default: false
      },
      type: {
          type: String,
          default: '1'
      },
      allData: {
          type: Array,
          default(){
              return []
          }
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
          console.log(this.allData)
          if (this.type == '1') {
              for (let i = 0; i < this.allData.length; i++) {
                if (this.allData[i].Name == this.formData.Name.trim()) {
                    this.$message({
                        type: 'fail',
                        message: '该货架已存在',
                        showClose: true
                    })
                    return
                }  
            }
          }
          this.$emit('dataSubmit',this.formData)
          this.formData= {
              Name: '',
              Remark: ''
          }
      }
  }
}
</script>
<style scoped>

</style>