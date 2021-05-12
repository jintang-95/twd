<template>
    <el-dialog
    :visible.sync="shows"
    append-to-body custom-class="classdialog"
    :title="type == 1?'新增物料清单':'编辑物料清单'"
    width="460px"
    @close="cancelAdd"
    >
        <el-form ref="form" label-width="80px" label-position="left">
            <el-form-item label="物料名称" label-position="left">
                <el-select v-model="formData.MaterielName" @change="selectChange" filterable remote reserve-keyword :remote-method="remoteMethod" placeholder="请选择或者输入物料名称">
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
            <el-form-item label="数量" label-position="left">
                <el-input type="Number"  placeholder="请输入数量" v-model="formData.Number"></el-input>
            </el-form-item>
            <el-form-item label="单位" label-position="left">
                <el-select v-model="formData.UnitName" @change="selectUnit">
                    <el-option
                    v-for="(item,index) in unitList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否必须" label-position="left">
                <el-switch v-model="formData.Required">
                </el-switch>
            </el-form-item>
        </el-form>
    <span slot="footer"  style="  margin-left: 12.1rem;" class="dialog-footer">
        <button
        @click="cancelAdd"
        style="width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;outline: none;"
      >取 消</button>
        <button
        type="primary"
        style="width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;outline: none;"
        @click="submitAdd"
      >确 定</button>
    </span>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'materielBom',
  props: {
      addData: {
          type: Object,
          default () {
              return {}
          }
      },
      visible: {
          type:Boolean,
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
          optionList: [],
          unitList: []
      }
  },
  computed: {
      ...mapGetters([
          'GetMaterielsByKeyWord',
          'GetUnitConvertsByMaterielId'
      ])
  },
  watch: {
      addData(newVal, oldVal) {
          this.formData = newVal
          console.log(newVal)
          if (newVal.hasOwnProperty('MaterialScienceId')) {
              this.getUnitList(newVal.MaterialScienceId)
          }
      },
      visible(newVal, oldVal) {
          this.shows = newVal
      },
      GetMaterielsByKeyWord(newVal, oldVal) {
          if (newVal.Code === 0) {
            this.optionList = newVal.ReturnData.Data
          }
      },
      GetUnitConvertsByMaterielId (newValue, oldValue) {
          if (newValue.Code === 0) {
              this.unitList = newValue.ReturnData
          }
      }
  },
  methods: {
      cancelAdd () {
          this.$emit('closePropMask',false)
      },
      submitAdd() {
          let required = this.formData['Required'] ? '1' : '0'
          let form = {
              MaterielNo: this.formData['MaterielNo'],
              MaterielName: this.formData['MaterielName'],
              Number: this.formData['Number'],
              UnitId: this.formData['UnitId'],
              MaterialScienceId: this.formData['MaterialScienceId'],
              UnitName: this.formData['UnitName'],
              Required: required
          }
          if (this.formData.hasOwnProperty('Id')) {
              form.Id = this.formData.Id
          }
          this.$emit('dataSubmit', form)
          this.formData = {
              MaterielNo: '',
              MaterielName: '',
              Number: '',
              UnitId: '',
              Required: false
          }
      },
      getUnitList(Id) {
          let json = {
            MN: "GetUnitConvertsByMaterielId",
            DataContent: {
                MaterielId: Id
            }
        };
        this.MIX_send(json);
      },
      selectChange (Id) {
          let No = '', Name = ''
          this.optionList.map(item => {
              if (item.Id == Id) {
                  No = item.No
                  Name = item.Name
              }
          })
          this.formData.MaterialScienceId = Id
          this.formData.MaterielNo = No
          this.formData.MaterielName = Name
          this.getUnitList(Id)
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
      },
      selectUnit (Id) {
          this.formData.UnitId = Id
          let Name = ''
          this.unitList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.formData.UnitName = Name
      }
  }
}
</script>
<style scoped>
.el-switch {
    margin-top: 10px;
}
.el-select{
    width: 100% !important;
}
</style>