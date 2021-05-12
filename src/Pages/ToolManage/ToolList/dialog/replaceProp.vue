<template>
    <el-dialog
    :visible.sync="shows"
    @close="cancelAdd"
    :title="type == 1 ? '新增替代件' : '编辑替代件'"
    width="460px"
    append-to-body
    >
        <el-form label-width="80px" label-position="left">
            <el-form-item label="优先级" label-position="left">
                <el-input type="number" v-model="formData.Level" placeholder="请输入优先级（数字越大，优先级越低）"></el-input>
            </el-form-item>
            <el-form-item label="物料名称" label-position="left">
                <el-select v-model="formData.MaterielName" @change="selectChange" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请选择或者输入物料名称">
                    <el-option
                    v-for="(item,index) in optionList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物料编码" label-position="left">
                <el-input  placeholder="请输入物料编码" v-model="formData.MaterielNo"></el-input>
            </el-form-item>
            <el-form-item label="备注">
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
import { mapGetters } from 'vuex'
export default {
  name: 'replaceProp',
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
      }
  },
  computed: {
      ...mapGetters([
          'GetMaterielsByKeyWord'
      ])
  },
  data() {
      return {
          formData: {},
          shows: false,
          loading: false,
          optionList: []
      }
  },
  watch: {
      addData(newVal, oldVal) {
          this.formData = newVal
      },
      visible(newVal, oldVal) {
          this.shows = newVal
          console.log(this.shows)
      },
      GetMaterielsByKeyWord(newVal, oldVal) {
          console.log(newVal)
          this.optionList = newVal.ReturnData.Data
      }
  },
  methods: {
      cancelAdd () {
          this.$emit('closePropMask', false)
      },
      submitAdd() {
          this.$emit('dataSubmit', this.formData)
      },
      selectChange (Id) {
          let No = '', Name = ''
          this.optionList.map(item => {
              if (item.Id == Id) {
                  No = item.No
                  Name = item.Name
              }
          })
          this.formData.ReplaceMaterielId = Id
          this.formData.MaterielNo = No
          this.formData.MaterielName = Name
      },
      remoteMethod (keyword) {
          let json = {
            MN: "GetMaterielsByKeyWord",
            DataContent: {
            "CategoryId": '',
            "Status":'',
            "KeyWord":keyword,
            "PageSize":10,
            "PageIndex":1
            }
        };
        this.MIX_send(json);
      }
  }
}
</script>
<style scoped>
.el-select{
    width: 100% !important;
}
button:hover {
  cursor: pointer;
}
</style>