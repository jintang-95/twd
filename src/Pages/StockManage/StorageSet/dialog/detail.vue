<template>
    <el-dialog
    :title="title"
    :visible.sync="show"
    width="897px"
    @close="cancelAdd"
    append-to-body
    center>
        <el-row style="margin-top: 10px;">
            <el-col :span="12">
                <div width="100%" style="height: 40px;"></div>
            </el-col>
            <el-col :span="12">
                <el-input
                    placeholder="请输入搜索关键字"
                    prefix-icon="el-icon-search"
                    v-model="keyword"
                    @input="inputChange"
                    >
                </el-input>
            </el-col>
        </el-row>
        <table-cmp
        style="width:100%"
        class="table_cmp"
        :table-data="tableData"
        Height='300'
        :table-label="tableLabel"
        >
        </table-cmp>
    <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelAdd">确 定</el-button>
    </span> -->
    </el-dialog>
</template>

<script>
export default {
  name: 'detail',
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
      title: {
          type: String,
          default: ''
      },
      type: {
          type: String,
          default: '1'
      }
  },
  data() {
      return {
          formData: {},
          show: false,
          keyword: '',
          tableData: [],
          tableLabel: [],
          shelfLabel: [
            { label: '物料编码', param: 'MaterielNo',  align: 'center', sortable: false},
            { label: '物料名称', param: 'MaterielName',  align: 'center', sortable: false},
            { label: '规格', param: 'MaterielSpec',  align: 'center', sortable: false},
            { label: '型号', param: 'MaterielModel',  align: 'center', sortable: false},
            { label: '生产批次', param: 'Batch',  align: 'center', sortable: false},
            { label: '货架', param: 'WarehouseName',  align: 'center', sortable: false},
            { label: '数量', param: 'Stock',  align: 'center', sortable: false},
            { label: '单位', param: 'UnitId',  align: 'center', sortable: false},
          ],
          occupyLabel: [
            { label: '占用类型', param: 'MaterielNo',  align: 'center', sortable: false},
            { label: '源单编号', param: 'MaterielName',  align: 'center', sortable: false},
            { label: '占用部门', param: 'MaterielSpec',  align: 'center', sortable: false},
            { label: '占用时间', param: 'MaterielModel',  align: 'center', sortable: false},
            { label: '占用人', param: 'Batch',  align: 'center', sortable: false},
            { label: '数量', param: 'Batch',  align: 'center', sortable: false},
            { label: '单位', param: 'Batch',  align: 'center', sortable: false},
          ]
      }
  },
  watch: {
      addData: {
          handler(newVal, oldVal) {
            this.formData = newVal
            if(this.type == 1) {
                this.tableData = this.formData.StockDetail
                this.tableLabel = this.shelfLabel
            } else {
                this.tableData = this.formData.OccupiedDetail
                this.tableLabel = this.occupyLabel
            }
          },
          deep: true
      },
      visible(newValue, oldValue) {
          this.show = newValue
      }
  },
  methods: {
      cancelAdd() {
          this.$emit('addMateria')
      },
      inputChange (value) {
        if (this.type == '1') {
            this.tableData = this.formData.StockDetail.filter(item => item.MaterielName.indexOf(value) !== -1 || item.WarehouseName.indexOf(value) !== -1)
        }
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