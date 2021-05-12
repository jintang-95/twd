<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增资产' : '编辑资产'"
    :visible.sync="show"
    width="896px"
    center>
    <div>
        <el-form ref="form" :model="form" label-width="100px" class="formContainer">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="资产编码" label-position="left">
                        <el-input v-model="form.No" placeholder="请输入资产编码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="资产名称" label-width="100px" label-position="left">
                        <el-input v-model="form.Name" placeholder="请输入资产名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="资产分类" label-width="100px">
                        <el-select v-model="form.Category" placeholder="请选择资产分类">
                            <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="标准单位" label-width="100px" label-position="left">
                        <el-select v-model="form.UnitId" @change="unitChange">
                            <el-option
                            v-for="(item,index) in unitList"
                            :key="index"
                            :label="item.Name"
                            :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所在部门" label-width="100px">
                        <el-select v-model="form.Dept" placeholder="请选择所在部门">
                            <el-option v-for="(item, index) in organList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="负责人" label-width="100px">
                        <el-select v-model="form.ResponsiblerName" @change="responseChange" filterable remote :remote-method="searchNoticer" placeholder="请输入负责人姓名">
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
                  <el-col :span="8">
                    <el-form-item label="所属物料" label-width="100px" label-position="left">
                        <el-select v-model="form.MaterielId" @change="materielChange" filterable remote :remote-method="searchMateriel" placeholder="请输入所属物料">
                            <el-option
                            v-for="(item,index) in materielList"
                            :key="index"
                            :label="item.Name"
                            :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                  <el-col :span="8">
                    <el-form-item label="有效期" label-position="left" label-width="100px" class="FormItem">
                        <el-input v-model="form.ValidityTime" placeholder="请输入有效期" ></el-input>
                        <el-select v-model="form.ValidityTimeUnit" placeholder="单位" class="Unit">
                            <el-option v-for="(item, index) in timeList" :label="item.Name" :key="index" :value="item.Id">{{ item.Name }}</el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="保管方式" label-width="100px">
                        <el-select v-model="form.ManageStyle" placeholder="请选择保管方式">
                            <el-option v-for="(item, index) in managerList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="品牌" label-width="100px">
                        <el-select v-model="form.Brand" placeholder="请选择品牌">
                            <el-option v-for="(item, index) in brands" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="规格" label-position="left" label-width="100px">
                        <el-input v-model="form.Spec" placeholder="请输入规格"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="型号" label-position="left" label-width="100px">
                        <el-input v-model="form.Model" placeholder="请输入型号"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述" >
                      <el-input type="textarea" v-model="form.Desc" placeholder="请输入资产描述"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelSubmit" class="ownbutton">取 消</el-button>
        <el-button type="primary" @click="submitData" class="ownbutton">确 定</el-button>
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
        // 指派类型
        typeList: [],
        // 负责岗位
        josList: [],
        // 负责人
        headList:[],
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
            type:'',
            jobs:'',
            head:'',
            // No: '',
            // Name: '',
            // ParentId: '',
            // Desc: '',
            // CategoryId:'',
            // IsReplaceMateriel: false,
            // IsTool: false,
            // IsAssets: false,
            // StandardUnitId: '',
            // DefaultWarehouseId:'',
            // Grade: '',
            // BrandId: '',
            // DefaultSupplierId: '',//默认供应商
            // ManageStyle:'',
            // Spec: '',
            // Model: '',
            // ValidityTime: '',
            // ValidityTimeUnit: ''
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
    //   typeList: {
    //     type: Array,
    //     default() {
    //         return []
    //     }
    //   },
    //   josList: {
    //     type: Array,
    //     default() {
    //         return []
    //     }  
    //   },
    //   headList: {
    //     type: Array,
    //     default() {
    //         return []
    //     }  
    //   },
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
.dialog-footer /deep/.ownbutton{
    width:420px;
}
.formContainer {
    /* display: flex;
    flex-wrap: wrap;
    justify-content: space-between; */
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