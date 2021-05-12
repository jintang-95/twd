<template>
    <el-dialog
    @close="cancelSubmit"
    :title="'库存监控'"
    :visible.sync="show"
    width="897px"
    center>
        <el-form ref="form" :model="form" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="监控频率" label-position="left" class="FormItem">
                        <el-input v-model="form.Frequency" placeholder="请输入监控频率"></el-input>
                        <el-select v-model="form.Unit" placeholder="年月日">
                            <el-option v-for="(item, index) in watchList" :label="item.label" :key="index" :value="item.Id">{{ item.label }}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!--<el-form-item label="通知方式">
                        <el-select v-model="form.ParentId" placeholder="请选择通知方式">
                            <el-option v-for="(item, index) in noticeList" :label="item.Name" :key="index" :value="item.Id">{{ item.Name }}</el-option>
                        </el-select>
                    </el-form-item>
                    -->
                    <el-form-item label="通知人">
                        <el-select v-model="form.NotifiedByName" @change="selectChange" filterable remote :remote-method="searchNoticer" placeholder="请输入通知人姓名">
                            <el-option
                            v-for="(item,index) in staffList"
                            :key="index"
                            :label="item.Name"
                            :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="手机号">
                      <el-input placeholder="请输入手机号" v-model="form.Mobile" maxlength="11"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="tabs">
            <el-button type="primary" class="addTab" @click="addMateriel">新增</el-button>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="物料列表" name="goodsShelves">
                    <table-cmp
                    style="width:100%"
                    class="table_cmp"
                    :table-data="form.StockMonitorDetail"
                    Height='166'
                    :table-label="shelevsLabel"
                    >
                    </table-cmp>
                </el-tab-pane>
            </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelSubmit">取 消</el-button>
            <el-button type="primary" @click="submitData">确 定</el-button>
        </span>
        <add-materiel :visible="showMask" :type="formType" :allData="form.StockMonitorDetail" :addData="maskData" @closePropMask="closePropMask" @dataSubmit="dataSubmit"></add-materiel>
        </el-dialog>
</template>

<script>
import AddMateriel from './addMateriel.vue'
import { mapGetters } from 'vuex'
var that;
var process = {
  template: `<div>
            <el-button type="text" size="small" @click="edit()">编辑</el-button>
            <el-button type="text" size="small" @click="del()">删除</el-button>
  
  </div>`,
  props:['row', 'keyindex'],
  methods: {
    edit() {
        that.clickEdit(this.row, this.keyindex)
    },
    del() {
        that.clickDel(this.row, this.keyindex)
    }
  }
}
export default {
  name: 'stockWatch',
  data() {
    return {
        formType: '1',
        currentIndex: '',
        show: false,
        showMask: false,
        maskData: {},
        form: {
        },
        activeName: 'goodsShelves',
        shelevsLabel: [
            { label: '物料编码', param: 'MaterielNo',  align: 'center', sortable: false},
            { label: '物料名称', param: 'MaterielName',  align: 'center', sortable: false},
            { label: '所属分类', param: 'MaterielCategoryName',  align: 'center', sortable: false},
            { label: '最小库存', param: 'MinStock',  align: 'center', sortable: false},
            { label: '最大库存', param: 'MaxStock',  align: 'center', sortable: false},
            { label: '单位', param: 'UnitName',  align: 'center', sortable: false},
            { label: '自动申购', param: 'IsAutoPurchase',  align: 'center', sortable: false,render:(row) => {
                if (row.IsAutoPurchase == '0') {
                    return '否'
                } else {
                    return '是'
                }
            }},
            { label: '禁止采购', param: 'IsforbidPurchase',  align: 'center', sortable: false,render:(row) => {
                if (row.IsforbidPurchase == '0') {
                    return '否'
                } else {
                    return '是'
                }
            }},
            { label: '描述', param: 'Desc',  align: 'center', sortable: false},
            { label: '操作', align: 'center', 
                component:process
            }
        ],
        watchList: [
            {
                label: '年',
                Id: '1'
            },
            {
                label: '月',
                Id: '2'
            },
            {
                label: '日',
                Id: '3'
            },
        ],
        staffList: [], //职工数据
    };
  },
  props: {
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
      },
      formData: {
          type: Object,
          default () {
              return {}
          }
      }
  },
  computed: {
      ...mapGetters([
          'QueryStaff'
      ])
  },
  watch: {
      visible(newVal, oldVal) {
        this.show = newVal
      },
      formData(newVal, oldVal) {
        this.form = newVal
      },
      QueryStaff(newValue, oldValue) {
          if (newValue.Code === 0) {
              this.staffList = newValue.ReturnData.Data
          }
      }
  },
  created () {
    that = this
    this.form = this.formData
  },
  methods: {
      searchNoticer(keyword) {
          this.getStaffList(keyword)
      },
      selectChange(Id) {
          let Name = ''
          this.staffList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.form.NotifiedBy = Id
          this.form.NotifiedByName = Name
      },
      getStaffList(keyword) {
          console.log(keyword)
          let json = {
              MN: "QueryStaff",
              DataContent: {
                KeyWord: keyword,
                PageIndex: '1',
                PageSize: '10'
              }              
          }
          this.MIX_send(json)
      },
      cancelSubmit () {
          this.$emit('closeMask', false)
      },
      submitData () {
          this.$emit('addMateria', this.form)
      },
      addMateriel () {
        this.showMask = true
      },
      closePropMask (data) {
        this.showMask = false
      },
      dataSubmit(data) {
        if (this.currentIndex === '') {
            this.form.StockMonitorDetail.push(data)
        } else {
            this.form.StockMonitorDetail[this.currentIndex] = data
            this.currentIndex = ''
        }
        this.showMask = false
        this.maskData = {}
      },
    //  点击货架编辑
    clickEdit(row, index) {
        this.formType = '2'
        this.currentIndex = index
        this.maskData = row
        this.showMask = true
    },
    clickDel (row, index) {
        this.currentIndex = index
        this.form.StockMonitorDetail.splice(this.currentIndex, 1)
        console.log(this.form.StockMonitorDetail)
    }
  },
  components: {
    AddMateriel 
  }
}
</script>
<style scoped>
.el-select {
    width: 100% !important;
}
.addTab {
    position: absolute;
    right: 20px;
    z-index: 100;
}
.FormItem .el-select {
    margin-left: 10px;
    width: 140px !important;
}

</style>
<style lang="">
    .FormItem .el-form-item__content {
        display: flex !important;
    }
    .table_cmp .el-table__body-wrapper {
    overflow-y: scroll !important;
}
</style>