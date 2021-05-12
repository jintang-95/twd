<template>
    <el-dialog
    :visible.sync="shows"
    width="460px"
    append-to-body
    :title="type == 1 ? '新增作业标准':'编辑作业标准'"
    center>
        <el-form ref="form" label-width="80px">
            <el-form-item label="周期" label-position="left">
                <el-input type="Number" placeholder="请输入周期" v-model="formData.Period"></el-input>
            </el-form-item>
            <el-form-item label="单位" label-position="left">
                <el-select v-model="formData.Unit" placeholder="请选择单位">
                    <el-option
                    v-for="(item,index) in timeList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="动作">
                <el-input  v-model="formData.Action"  placeholder="请输入动作"></el-input>
            </el-form-item>
            <el-form-item label="标准">
                <el-input v-model="formData.Standard"  placeholder="请输入标准"></el-input>
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
  name: 'operationStandard',
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
          shows: false,
          timeList: [
              {
                Name: '年',
                Id: '1'
            },
            {
                Name: '月',
                Id: '2'
            },
            {
                Name: '日',
                Id: '3'
            }
          ]
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
         this.$emit('dataSubmit', this.formData)
         this.formData= {
           Period: '',
           Unit: '',
           Action: '',
           Standard: ''
         }
      }
  }
}
</script>
<style scoped>
.el-select {
    width: 100% !important;
}
</style>