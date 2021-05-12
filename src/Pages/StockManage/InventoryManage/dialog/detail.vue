<template>
    <el-dialog
    :title="type == 1? '新增盘点明细' : '编辑盘点明细'"
    :visible.sync="show"
    width="460px"
    @close="cancelAdd"
    append-to-body
    >
        <el-form ref="form" label-width="80px" label-position="left">
            <el-form-item label="物料名称" label-position="left">
                <el-select v-model="form.MaterielName" @change="selectChange" filterable remote :remote-method="remoteMethod" placeholder="请输入物料名称">
                    <el-option
                    v-for="(item,index) in optionList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物料编码" label-position="left">
                <el-input  placeholder="请输入物料编码" readonly v-model="form.MaterielNo"></el-input>
            </el-form-item>
            <el-form-item label="生产批次" label-position="left">
                <el-input  placeholder="请输入生产批次" v-model="form.Batch"></el-input>
            </el-form-item>
            <el-form-item label="货架" label-position="left">
                <el-select v-model="form.WarehouseId" @change="shelevsChange" filterable  placeholder="请选择所在货架">
                    <el-option
                    v-for="(item,index) in typeList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="盘点数量" label-position="left">
                <el-input  placeholder="请输入盘点数量" v-model="form.Number" @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" label-position="left">
                <el-input  placeholder="请输入库存数量" v-model="form.Stock" @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item label="差异" label-position="left">
                <el-input  placeholder="差异" v-model="form.Diff"></el-input>
            </el-form-item>
            <el-form-item label="单位" label-position="left">
                <el-select v-model="form.UnitId" @change="unitChange"  placeholder="请选择单位">
                    <el-option
                    v-for="(item,index) in unitList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
   <span slot="footer" style="  margin-left: 10.1rem;" class="dialog-footer">
      <button    style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;" @click="cancelAdd">取 消</button>
      <button t style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;" @click="submitAdd">确 定</button>
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
      typeList: {
          type: Array,
          default() {
              return []
          }
      }
  },
  data() {
      return {
          form: {},
          show: false,
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
          this.form = newVal
          if (!!this.form.MaterielId) {
            this.getUnitList(this.form.MaterielId)
          } else {
              this.unitList = []
          }
      },
      visible(newValue, oldValue) {
          this.show = newValue
      },
      GetMaterielsByKeyWord(newValue, oldValue) {
          if (newValue.Code === 0) {
            this.optionList = newValue.ReturnData.Data
          }
      },
      GetUnitConvertsByMaterielId(newValue, oldValue) {
            if (newValue.Code === 0) {
              this.unitList = newValue.ReturnData
          }
      }
  },
  created() {
  },
  methods: {
      remoteMethod(keyword) {
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
      inputChange () {
          console.log(Number(this.form.Number), this.form.Stock)
          if (!this.form.Stock) {
              this.form.Diff = Number(this.form.Number)
          } else if (!this.form.Number) {
              this.form.Diff = 0 - Number(this.form.Stock)
          } else {
              this.form.Diff = Number(this.form.Number) - Number(this.form.Stock)
          }          
      },
      getUnitList(Id) {
          let json = {
            MN: "GetUnitConvertsByMaterielId",
            SN:"Materiel",
            DataContent: {
                MaterielId: Id
            }
        };
        this.MIX_send(json);
      },
      selectChange (Id) {
          let No = '', Name = '', spec = '', model = ''
          this.form.UnitId = ''
          this.optionList.map(item => {
              if (item.Id == Id) {
                  No = item.No
                  Name = item.Name
                  spec = item.Spec
                  model = item.Model
              }
          })
          this.form.MaterielId =Id
          this.form.MaterielNo = No
          this.form.MaterielName = Name
          this.getUnitList(Id)
      },
      unitChange(Id) {
          let UnitName = ''
          this.unitList.map(item => {
              if (item.Id == Id) {
                  UnitName = item.Name
              }
          })
          this.form.UnitName = UnitName
      },
      shelevsChange(Id) {
          let Name = ''
          this.typeList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.form.WareHouseName = Name
      },
      cancelAdd () {
          this.$emit('closePropMask',false)
          this.form = {
              MaterielName: '',
              MaterielNo: '',
              Batch: '',
              WarehouseId: '',
              WareHouseName: '',
              Number: '',
              Stock: '',
              Diff: '',
              UnitId: '',
              MaterielId: ''
          }
          this.unitList = []
      },
      submitAdd() {
          this.form['Diff'] = this.form['Diff'] == 0 ? '0' : this.form['Diff']
          this.$emit('dataSubmit',this.form)
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
</style>