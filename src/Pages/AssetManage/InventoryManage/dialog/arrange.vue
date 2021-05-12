<template>
    <el-dialog
    :title="type == 1? '新增盘点安排' : '编辑盘点安排'"
    :visible.sync="show"
    width="460px"
    @close="cancelAdd"
    append-to-body
    center>
        <el-form ref="form" label-width="80px">
            <el-form-item label="任务" label-position="left">
                <el-input  placeholder="请输入任务名" v-model="formData.Name"></el-input>
            </el-form-item>
            <el-form-item label="负责人" label-position="left">
                <el-select v-model="formData.ResponsiblerName" @change="selectChange" filterable remote :remote-method="remoteMethod" placeholder="请输入负责人搜索">
                    <el-option
                    v-for="(item,index) in staffList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" label-width="80px">
                <el-date-picker
                v-model="formData.StartDate"
                value-format="yyyy/MM/dd hh:mm:ss"
                type="datetime"
                placeholder="选择开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="80px">
                <el-date-picker
                v-model="formData.EndDate"
                value-format="yyyy/MM/dd hh:mm:ss"
                type="datetime"
                placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
import { treeToArray } from '@/util/util.js'
import { mapGetters } from 'vuex'
export default {
  name: 'AddMateriel',
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
          show: false,
          optionList: [],
          typeList: [],
          staffList: []
      }
  },
  computed: {
      ...mapGetters([
          'QueryStaff'
      ])
  },
  watch: {
      addData(newVal, oldVal) {
          this.formData = newVal
          console.log(this.formData)
      },
      visible(newValue, oldValue) {
          this.show = newValue
      },
      QueryStaff(newValue, oldValue) {
          if (newValue.Code === 0) {
              this.staffList = newValue.ReturnData.Data
          }
      }
  },
  created() {
      this.formData = this.addData
  },
  methods: {
      selectChange (Id) {
          let Name = ''
          this.staffList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.formData.ResponsiblerName = Name
          this.formData.Responsibler = Id
      },
      remoteMethod(keyword) {
          let json = {
            MN: "QueryStaff",
            DataContent: {
            "KeyWord":keyword,
            "PageSize":10,
            "PageIndex":1
            }
        };
        this.MIX_send(json);
      },
      cancelAdd () {
          this.$emit('closePropMask',false)
      },
      submitAdd() {
          console.log(this.formData)
          this.$emit('dataSubmit',this.formData)
      }
  },
  components: {
    
  }
}
</script>
<style scoped>
.el-select {
    width: 100% !important;
}
.el-input {
    width: 100% !important;
}
</style>