<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增设备分组' : '编辑设备分组'"
    :visible.sync="show"
    width="460px"
    center>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="分类编码" label-position="left">
                        <el-input v-model="form.No" placeholder="请输入分类编码"></el-input>
                    </el-form-item>
                    <el-form-item label="分类名称"  label-position="left">
                        <el-input v-model="form.Name" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                    <el-form-item label="负责部门" >
                        <el-select v-model="form.Category" placeholder="请选择负责部门">
                            <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="负责人" >
                        <el-select v-model="form.Category" placeholder="请选择负责人">
                            <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属分组" >
                        <el-select v-model="form.Category" placeholder="请选择所属分组">
                            <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="通用设置">
                        <el-checkbox label="自动编码" name="type" v-model="form.AutoCode"></el-checkbox>
                        <el-checkbox label="单位换算" name="type" v-model="form.UnitConvert"></el-checkbox>
                        <el-checkbox label="作业标准" name="type" v-model="form.OperationStandard"></el-checkbox>
                        <el-checkbox label="BOM清单" name="type" v-model="form.MaterielBOM"></el-checkbox>
                    </el-form-item>
                  <el-form-item label="描述" >
                      <el-input type="textarea" v-model="form.Desc" placeholder="请输入资产描述"></el-input>
                  </el-form-item>
        </el-form>
    </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancelSubmit" class="ownbuttonarc">取 消</el-button>
            <el-button type="primary" @click="submitData" class="ownbuttonarc">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
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
import { mapGetters } from 'vuex'
export default {
  name: 'archives',
  data() {
    return {
        // 保管方式
        managerList: [
            {
                Id: 0,
                Name: '存放1'
            },
            {
                Id: 1,
                Name: '存放2'
            },
            {
                Id: 2,
                Name: '存放3'
            },
        ],
        // 部门
        organList: [],
        // 单位
        unitList: [],
        // 负责人
        staffList: [],
        // 物料列表
        materielList: [],
        // 默认供应商
        supplierList: [],
        // 
        show: false,
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
        ],
        form: {
            No: '',
            Name: '',
            ParentId: '',
            Desc: '',
            CategoryId:'',
            IsReplaceMateriel: false,
            IsTool: false,
            IsAssets: false,
            StandardUnitId: '',
            DefaultWarehouseId:'',
            Grade: '',
            BrandId: '',
            DefaultSupplierId: '',//默认供应商
            ManageStyle:'',
            Spec: '',
            Model: '',
            ValidityTime: '',
            ValidityTimeUnit: ''
        }
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
      },
      wareHouse: {
          type: Array,
          default () {
              return []
          }
      },
      brands: {
          type: Array,
          default() {
              return []
          }
      },
      manageStyle: {
          type: Array,
          default() {
              return []
          }
      }
  },
  computed: {
      ...mapGetters([
          'ULFB',
          'ULFE',
          'imgUrl',
          'QuerySupplier',
          'QueryStaff',
          'GetMateriels',
          'GetUnitConvertsByMaterielId',
          'QueryOrganization'
      ])
  },
  watch: {
      GetUnitConvertsByMaterielId (newValue, oldValue) {
          if (newValue.Code === 0) {
            let defaultUnit = ''
            this.unitList = newValue.ReturnData
            this.unitList.map(item => {
                if (item.IsBase == 1) {
                    defaultUnit = item.Id
                }
            })
            this.form.UnitId = defaultUnit
        } else {
            // 失败
        }
      },
      GetMateriels (newValue, oldValue) {
      if (newValue.Code === 0) {
        this.materielList = newValue.ReturnData.Data
      } else {
        // 失败
      }
    },
      QueryStaff(newValue, oldValue) {
          if (newValue.Code === 0) {
              this.staffList = newValue.ReturnData.Data
          }
      },
      visible(newVal, oldVal) {
        this.show = newVal
        if (this.show) {
            this.getOrganList()
        }
      },
      formData(newVal, oldVal) {
        this.form = newVal
        if (this.form.MaterielId != '' && this.type == 2) {
               this.getUnitList(this.form.MaterielId)
        }
      },
      QuerySupplier (newVal, oldVal) {
          if (newVal.Code === 0) {
            this.supplierList = newVal.ReturnData
          }
      },
      QueryOrganization(newVal, oldVal) {
          if(newVal.Code === 0) {
              this.organList = newVal.ReturnData.Data
          }
      },
  },
  created() {
      that = this
  },
  methods: {
      getOrganList() {
        let json = {
            MN: "QueryOrganization",
            DataContent: {
              KeyWord: '',
              PageIndex: '1',
              PageSize: '999'
            }              
        }
        this.MIX_send(json)
    },
        searchMateriel (keyword) {
            this.getMaterielList(keyword)
        },
        materielChange (Id) {
          let Name = ''
          this.materielList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.form.MaterielName = Name
          this.form.MaterielId = Id
          this.getUnitList(Id)
      },
      searchNoticer (keyword) {
          this.getStaffList(keyword)
      },
      responseChange (Id) {
          let Name = ''
          this.staffList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.form.ResponsiblerName = Name
          this.form.Responsibler = Id
      },
      unitChange (Id) {
          let Name = ''
          this.unitList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.form.UnitId = Id
          this.form.UnitName = Name
      },
      getUnitList(Id) {
          let json = {
              MN: "GetUnitConvertsByMaterielId",
              DataContent: {
                  MaterielId: Id
              }
          }
          this.MIX_send(json)
      },
      getMaterielList (keyword) {
        let json = {
            MN: "GetMateriels",
            DataContent: {
            "CategoryId": '',
            "Status":'',
            "KeyWord":keyword,
            "PageSize":10,
            "PageIndex":1
            }
        }
        this.MIX_send(json)
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
      selectChange (Id) {
        let Name = ''
        this.supplierList.map(item => {
            if (item.Id == Id) {
                Name = item.Name
            }
        })
        this.form.DefaultSupplierName = Name
        this.form.DefaultSupplierId = Id
    },
    remoteMethod(keyword) {
        let json = {
            MN: "QuerySupplier",
            DataContent: {
            "KeyWord":keyword
            }
        };
        this.MIX_send(json);
    },
    cancelSubmit () {
        
        this.$emit('closeMask', false)
        this.form={}
    },
    submitData () {
      delete this.form.Status
      this.$emit('addMateria', this.form)
    //   this.form = {}
    },
  },
  components: {
  }
}
</script>
<style scoped lang='less'>
.dialog-footer /deep/.ownbuttonarc{
    width: 200px;
}
.formContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.el-row {
    width: 100% !important;
}
.replaceList {
    width: 100%;
    height: 166px;
}
.imgList {
    width: 100%;
    height: 166px;
}
.Unit {
        width: 100px !important;
        margin-left: 10px !important;
    }
</style>
<style>
.FormItem .el-form-item__content {
    display: flex !important;
}
</style>