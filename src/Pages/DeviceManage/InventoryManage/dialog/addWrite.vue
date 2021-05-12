<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增盘点录入单' : type == '2' ? '编辑盘点录入单' : '查看盘点录入单'"
    :visible.sync="show"
    width="897px"
    center>
    <div>
        <el-form ref="form" :model="form" label-width="100px" class="formContainer">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="单据编号" label-position="left">
                        <el-input v-model="form.No" :disabled="type == 3" placeholder="请输入计划编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属计划" label-width="100px" label-position="left">
                        <el-select v-model="form.InventoryPlanId" @change="selectChange" :disabled="type == 3" filterable  placeholder="请选择所属计划">
                            <el-option v-for="(item, index) in planList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="负责人" label-width="100px">
                        <el-select v-model="form.ResponsiblerName" @change="selectChange" :disabled="type == 3" filterable remote :remote-method="getResponsiblerList" placeholder="请输入负责人姓名搜索">
                            <el-option v-for="(item, index) in staffList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
              </el-row>
              </el-row>
              <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="盘点部门" label-width="100px">
                        <el-select v-model="form.Dept"  :disabled="type == 3" placeholder="请选择盘点部门">
                            <el-option v-for="(item, index) in list" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开始时间" label-width="100px">
                        <el-date-picker
                        :disabled="type == 3"
                        v-model="form.StartDate"
                        value-format="yyyy/MM/dd hh:mm:ss"
                        type="datetime"
                        placeholder="选择开始时间">
                        </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="结束时间" label-width="100px">
                        <el-date-picker
                        :disabled="type == 3"
                        v-model="form.EndDate"
                        value-format="yyyy/MM/dd hh:mm:ss"
                        type="datetime"
                        placeholder="选择结束时间">
                        </el-date-picker>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述" >
                      <el-input type="textarea" :disabled="type == 3" v-model="form.Desc" placeholder="请输入分类描述"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="tabs" >
            <el-button type="primary" style="float: right;z-index: 100;position: absolute;right: 20px;" @click="addNew" v-if="type != 3">新增</el-button>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="盘点明细" name="inventory">
                    <div class="replaceList">
                        <table-cmp
                    style="width:100%"
                    class="table_cmp"
                    :loading="false"
                    :table-data="form.AssetsInventoryDetail"
                    Height='166'
                    :table-label="inventoryLabel"
                    ></table-cmp>
                    </div>
                </el-tab-pane>
              </el-tabs>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit" v-if="type != 3">取 消</el-button>
        <el-button type="primary" plain @click="saveAsDraft" v-if="type != 3">保存为草稿</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
    </span>
    <Detail :visible="showMask" :type="formType" :typeList="shelevsList" :allData="form.AssetsInventoryDetail" :addData="maskData" @closePropMask="closePropMask" @dataSubmit="dataSubmit"></Detail>
    </el-dialog>
</template>
<script>
import Detail from './detail.vue'
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
  name: 'addWrite',
  data() {
    return {
        activeName: 'inventory',
        show: false,
        showMask: false,
        maskData: {},
        formType: '1',
        currentIndex: '',
        form: {
            // No: '',
            // Name: '',
            // StartMode: '',
            // ResponsibleDept: '',
            // Responsibler: '',
            // WarehouseId: '',
            // StartDate: '',
            // EndDate: '',
            // Desc: '',
            // JobsId: '',
            // AssetsInventoryDetail: []
        },
        inventoryLabel: [
            { label: '资产编码', param: 'AssetsNo',  align: 'center', sortable: false},
            { label: '资产名称', param: 'AssetsName',  align: 'center', sortable: false},
            { label: '负责人', param: 'ResponsiblerName',  align: 'center', sortable: false},
            { label: '状态', param: 'Status',  align: 'center', sortable: false,render:(row) => {
                if (row.Status == '0') {
                    return '损坏'
                } else{
                    return '正常'
                }
            }},
            {label: '操作', align: 'center', width: '200',component:process}
        ],
        jobList: [],
        organList: [],
        staffList: [],
        planList: [],
        shelevsList: [],
    }
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
      formData: {
          type: Object,
          default () {
              return {}
          }
      },
      list: {
          type: Array,
          default () {
              return []
          }
      },
     
  },
  computed: {
      ...mapGetters([
          'QueryOrganization',
          'QueryJobs',
          'QueryStaff',
          'GetInventoryPlans',
          'GetWarehouseById',
      ])
  },
  watch: {
      GetWarehouseById(newVal, oldVal) {
        if (newVal.Code == 0) {
            this.shelevsList = newVal.ReturnData.hasOwnProperty('ShelfDetail') ? newVal.ReturnData.ShelfDetail : []
        }
      },
      GetInventoryPlans(newVal, oldVal) {
          if (newVal.Code == 0) {
              this.planList = newVal.ReturnData.Data
          }
      },
      visible(newVal, oldVal) {
        this.show = newVal
        if (this.show) {
            this.getPlanList()
        }
      },
      formData(newVal, oldVal) {
        this.form = newVal
      },
      QueryOrganization(newVal, oldVal) {
          if(newVal.Code === 0) {
              this.organList = newVal.ReturnData.Data
          }
      },
      QueryJobs(newVal, oldVal) {
          if(newVal.Code === 0) {
              this.jobList = newVal.ReturnData.Data
          }
      },
      QueryStaff(newVal, oldVal) {
        if(newVal.Code === 0) {
            this.staffList = newVal.ReturnData.Data
        }
      },
      type (newVal, oldVal) {
          let arr = this.inventoryLabel.filter(item => item.label == '操作')
          if (newVal != '3') {
              if (arr.length == 0) {
                  this.inventoryLabel.push({label: '操作', align: 'center', width: '200',component:process})
              }  
          } else {
              if (arr.length != 0) { 
                this.inventoryLabel.splice(this.inventoryLabel.length - 1, 1)
              }         
          }
      }
  },
  created() {
      that = this
      this.form = this.formData
  },
  methods: {
      getPlanList () {
          let json = {
            MN: "GetInventoryPlans",
            DataContent: {
            "Id": '',
            "Status":'',
            "KeyWord":'',
            "PageSize":999,
            "PageIndex":1,
            "TableType": "3",
            }
        };
        this.MIX_send(json);
      },
      deptChange(Id){
          let Name = ''
          this.organList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
          this.form.ResponsibleDept = Id
          this.form.ResponsibleDeptName = Name
      },
      jobChange(Id) {
          let Name = ''
          this.jobList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
        this.form.JobsId = Id
        this.form.JobsName = Id
      },
      selectChange(Id) {
          let Name = ''
          this.staffList.map(item => {
              if (item.Id == Id) {
                  Name = item.Name
              }
          })
        this.form.Responsibler = Id
        this.form.ResponsiblerName = Name
      },
      warehouseChange (Id) {
          let json = {
              MN: "GetWarehouseById",
              DataContent: {
                  Id: Id
              }
          }
          this.MIX_send(json)
      },
    submitData () {
        if (this.type == 3) {
            this.cancelSubmit()
            return
        }
        let form = {
           "No":this.form.No,
           "InventoryPlanId": this.form.InventoryPlanId,
           "Responsibler": this.form.Responsibler,
           "Dept": this.form.Dept,
           "StartDate": this.form.StartDate,
           "EndDate": this.form.EndDate,
           "Desc": this.form.Desc,
           "TableType": '3',
           "AssetsInventoryDetail": this.form.AssetsInventoryDetail
        }
        if(this.form.Id !== '') {
            form.Id = this.form.Id
        }
        this.$emit('addMateria', form)
    },
    saveAsDraft () {
        let form = {
           "Status": 0,
           "No":this.form.No,
           "InventoryPlanId": this.form.InventoryPlanId,
           "Responsibler": this.form.Responsibler,
           "Dept": this.form.Dept,
           "StartDate": this.form.StartDate,
           "EndDate": this.form.EndDate,
           "Desc": this.form.Desc,
           "TableType": "3",
           "AssetsInventoryDetail": this.form.AssetsInventoryDetail
        }
        if(this.form.Id !== '') {
            form.Id = this.form.Id
        }
        console.log(form)
        this.$emit('addMateria', form)
    },
    cancelSubmit () {
        this.$emit('closeMask', false)
    },
    addNew () {
        this.formType = '1'
        this.maskData = {

        }
        this.showMask = true
    },
    getResponsiblerList(keyword) {
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
    getOrganList(keyword) {
        let json = {
            MN: "QueryOrganization",
            DataContent: {
              KeyWord: keyword,
              PageIndex: '1',
              PageSize: '10'
            }              
        }
        this.MIX_send(json)
    },
    getJobList(keyword) {
        let json = {
            MN: "QueryJobs",
            DataContent: {
              KeyWord: keyword,
              PageIndex: '1',
              PageSize: '10'
            }              
        }
        this.MIX_send(json)
    },
    closePropMask() {
        this.showMask = false
    },
    dataSubmit(data) {
        console.log(this.form)
        if (this.formType == '1') {
            this.form.AssetsInventoryDetail.push(data)
        } else {
            this.form.AssetsInventoryDetail.splice(this.currentIndex, 1, data)
        }
        this.maskData = {}
        this.showMask = false
    },
    // 表格编辑和假删除
    clickEdit (row, index) {
        this.currentIndex = index
        this.formType = '2'
        this.maskData = this.form.AssetsInventoryDetail[index]
        this.maskData.Status = this.maskData.Status == '1'
        console.log(this.maskData)
        this.showMask = true
    },
    clickDel (row, index) {
        this.form.AssetsInventoryDetail.splice(index, 1)
    }
  },
  components: {
      Detail
  }
}
</script>
<style scoped>
.el-row {
    width: 100% !important;
}
.el-input {
    width: 100% !important;
}
</style>
<style lang="">
.table_cmp .el-table__body-wrapper {
  overflow-y: scroll !important;
}
</style>