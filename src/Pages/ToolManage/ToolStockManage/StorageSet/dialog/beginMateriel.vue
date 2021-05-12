<template>
    <el-dialog
    :title="type == 1? '新增期初设置' : '编辑期初设置'"
    :visible.sync="show"
    width="460px"
    @close="cancelAdd"
    append-to-body
    center>
        <el-form ref="form" label-width="80px">
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
             <el-form-item label="规格" label-position="left">
                <el-input  placeholder="请输入规格" readonly v-model="form.MaterielSpec"></el-input>
            </el-form-item>
            <el-form-item label="型号" label-position="left">
                <el-input  placeholder="请输入型号" readonly v-model="form.MaterielModel"></el-input>
            </el-form-item>
            <el-form-item label="所在仓库" label-position="left">
                <el-select v-model="form.WarehouseId" filterable  placeholder="请选择所在仓库">
                    <el-option
                    v-for="(item,index) in typeList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格" label-position="left">
                <el-input  placeholder="请输入价格" v-model="form.Price" @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" label-position="left">
                <el-input  placeholder="请输入库存数量" v-model="form.Stock" @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item label="金额" label-position="left">
                <el-input  placeholder="金额" readonly v-model="form.Amount"></el-input>
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
      formData: {
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
      formData(newVal, oldVal) {
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
          this.form.Amount = this.form.Price * this.form.Stock
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
          this.form.MaterielSpec = spec
          this.form.MaterielModel = model
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
      cancelAdd () {
          this.$emit('closeMask',false)
          this.form = {
              MaterielName: '',
              MaterielNo: '',
              MaterielSpec: '',
              MaterielModel: '',
              WarehouseId: '',
              Price: '',
              Stock: '',
              Amount: '',
              UnitId: '',
              MaterielId: ''
          }
          this.unitList = []
      },
      submitAdd() {
          this.form['IsTool'] = '1'
          this.form['IsAssets'] = '0'
          this.form['IsReplaceMateriel'] = '0'
          this.$emit('addMateria',this.form)
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