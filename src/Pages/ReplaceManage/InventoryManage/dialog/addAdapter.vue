<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增盘点调整单' : type == '2' ? '编辑盘点调整单' : '查看盘点调整单'"
    :visible.sync="show"
    width="897px"
    center>
    <div>
        <el-form ref="form" :model="form" label-width="100px" class="formContainer">
            <el-row >
                <el-col :span="12">
                    <el-form-item label="单据编号" label-position="left">
                        <el-input v-model="form.No" :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属计划" label-width="100px" label-position="left">
                        <el-select v-model="form.InventoryPlanId" @change="selectChange" :disabled="type == 3" filterable  placeholder="请选择所属计划">
                            <el-option v-for="(item, index) in planList" :label="item.Name" :key="index" :value="item.Id">{{item.Name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="盘盈总数量" label-position="left">
                        <el-input v-model="form.AdjustmentInfo.AdjustmentTotal" readonly :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="盘盈总价值" label-width="100px" label-position="left">
                        <el-input v-model="form.AdjustmentInfo.AdjustmentAmount" readonly :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="盘亏总数量" label-position="left">
                        <el-input v-model="form.AdjustmentInfo.LossTotal" readonly :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="盘亏总价值" label-width="100px" label-position="left">
                        <el-input v-model="form.AdjustmentInfo.LossAmount" readonly :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="盈亏总数量" label-position="left">
                        <el-input v-model="form.AdjustmentInfo.SurplusTotal" readonly :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="盈亏总价值" label-width="100px" label-position="left">
                        <el-input v-model="form.AdjustmentInfo.SurplusAmount" readonly :disabled="type != 1" placeholder="请输入单据编号"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述" >
                      <el-input type="textarea" :disabled="type == 3" v-model="form.Remark" placeholder="请输入分类描述"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="tabs" >
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="调整明细" name="inventory">
                    <div class="replaceList">
                        <table-cmp
                    style="width:100%"
                    class="table_cmp"
                    :loading="false"
                    :table-data="form.AdjustmentDetail"
                    Height='266'
                    :table-label="inventoryLabel"
                    ></table-cmp>
                    </div>
                </el-tab-pane>
              </el-tabs>
        </div>
        <el-pagination
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            align="right"
            class="pagination"
            ></el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit" v-if="type != 3">取 消</el-button>
        <el-button type="primary" plain @click="saveAsDraft" v-if="type != 3">保存为草稿</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
import Detail from './detail.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'addAdapter',
  data() {
    return {
        activeName: 'inventory',
        show: false,
        showMask: false,
        maskData: {},
        formType: '1',
        currentIndex: '',
        currentPage: 1,
        currentId: '',
        total: 0,
        page: 1,
        pageSize: 5,
        form: {
            // No: '',
            // Name: '',
            // StartMode: '',
            // ResponsibleDept: '',
            // Responsibler: '',
            // WarehouseId: '',
            // StartDate: '',
            // EndDate: '',
            // Remark: '',
            // JobsId: '',
            // InventoryPlanDetail: []
        },
        inventoryLabel: [
            { label: '物料编码', param: 'MaterielNo',  align: 'center', sortable: false},
            { label: '物料名称', param: 'MaterielName',  align: 'center', sortable: false},
            { label: '生产批次', param: 'Batch',  align: 'center', sortable: false},
            { label: '所属仓库', param: 'WareHouseName',  align: 'center', sortable: false},
            { label: '单价', param: 'Price',  align: 'center', sortable: false},
            { label: '盈亏数量', param: 'Number',  align: 'center', sortable: false},
            { label: '调整数量', param: 'Diff',  align: 'center', sortable: false},
            { label: '单位', param: 'UnitName',  align: 'center', sortable: false}
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
          'GetInventoryPlans',
          'GetInventoryInfoById'
      ])
  },
  watch: {
      GetInventoryPlans(newVal, oldVal) {
          if (newVal.Code == 0) {
              this.planList = newVal.ReturnData.Data
              console.log(this.form)
          }
      },
      GetInventoryInfoById(newVal, oldVal) {
          if (newVal.Code == 0) {
              this.form.AdjustmentDetail = newVal.ReturnData.Data
              this.total = newVal.ReturnData.DataCount
              this.form.AdjustmentInfo = newVal.ReturnData.AdjustmentInfo
              console.log(this.form)
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
      }
  },
  created() {
      this.form = this.formData
  },
  methods: {
      handleCurrentChange (page) {
          this.CurrentPage = page
          this.getDetailById(this.currentId)
      },
      handlePrevClick (page) {
          this.CurrentPage = page
          this.getDetailById(this.currentId)
      },
      handleNextClick (page) {
          this.CurrentPage = page
          this.getDetailById(this.currentId)
      },
      getPlanList () {
          let json = {
            MN: "GetInventoryPlans",
            DataContent: {
            "Id": '',
            "Status":'',
            "KeyWord":'',
            "PageSize":this.pageSize,
            "PageIndex":this.page,
            "TableType": "1",
            }
        };
        this.MIX_send(json);
      },
      getDetailById (Id) {
          this.currentId = Id
          let json = {
            MN: "GetInventoryInfoById",
            DataContent: {
            "Id": Id,
            "PageSize":999,
            "PageIndex":1,
            }
        };
        this.MIX_send(json);
      },
      selectChange(Id) {
          this.getDetailById(Id)
      },
    submitData () {
        if (this.type == 3) {
            this.cancelSubmit()
            return
        }
        let form = {
           "No":this.form.No,
           "InventoryPlanId": this.form.InventoryPlanId,
           "Remark": this.form.Remark,
           "TableType": '1',
        //    "AdjustmentDetail": this.form.AdjustmentDetail
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
           "Remark": this.form.Remark,
           "TableType": "1",
        //    "AdjustmentDetail": this.form.AdjustmentDetail
        }
        if(this.form.Id !== '') {
            form.Id = this.form.Id
        }
        console.log(form)
        this.$emit('addMateria', form)
    },
    cancelSubmit () {
        this.$emit('closeMask', false)
    }
  },
  components: {

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
.el-select {
    width: 100% !important;
}
</style>
<style lang="">
.table_cmp .el-table__body-wrapper {
  overflow-y: scroll !important;
}
</style>