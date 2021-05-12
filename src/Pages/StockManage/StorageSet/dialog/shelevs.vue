<template>
    <el-dialog
    :title="type == 1? '新增货架明细' : '编辑货架属性'"
    :visible.sync="show"
    width="460px"
    append-to-body
    @close="cancelAdd"
    >
        <el-form ref="form" label-width="80px" label-position="left">
            <el-form-item label="货架名称" label-position="left">
                <el-input  placeholder="请输入货架名称" v-model="formData.Name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="formData.Desc"  placeholder="请输入备注"></el-input>
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
button:hover {
  cursor: pointer;
}
</style>