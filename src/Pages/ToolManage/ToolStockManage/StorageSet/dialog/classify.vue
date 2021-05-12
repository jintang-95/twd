<template>
    <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增工具仓库' : '编辑工具仓库'"
    :visible.sync="show"
    width="897px"
    center>
        <el-form ref="form" :model="form" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="名称" label-position="left">
                        <el-input v-model="form.Name" placeholder="请输入仓库名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="隶属仓库">
                        <el-select v-model="form.ParentId" :disabled="disable" placeholder="请选择隶属仓库">
                            <el-option v-for="(item, index) in typeList" :label="item.Name" :key="index" :value="item.Id">{{ item.Name }}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="类型" label-position="left">
                        <el-radio-group v-model="form.Category" @change="categoryChange">
                            <el-radio :label="0">虚拟仓</el-radio>
                            <el-radio :label="1">实体仓</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="仓库管理员">
                        <el-select v-model="form.StaffName" @change="selectChange" filterable remote :remote-method="searchNoticer" placeholder="请输入仓库管理员姓名搜索">
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
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.Desc" placeholder="请输入仓库描述"></el-input>
            </el-form-item>
        </el-form>
        <div class="tabs">
            <el-button type="primary" class="addTab" @click="addShelevs">新增</el-button>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="货架明细" name="goodsShelves">
                    <table-cmp
                    style="width:100%"
                    class="table_cmp"
                    :table-data="form.ShelfDetail"
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
        <Shelevs :visible="showMask" :type="formType" :allData="form.ShelfDetail" :addData="maskData" @closePropMask="closePropMask" @dataSubmit="dataSubmit"></Shelevs>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Shelevs from './shelevs.vue'
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
  name: 'classify',
  data() {
    return {
        formType: '1',
        currentIndex: '',
        show: false,
        showMask: false,
        maskData: {},
        staffList: [],
        disable: false,
        form: {
        },
        activeName: 'goodsShelves',
        shelevsLabel: [
            { label: '货架名称', param: 'Name',  align: 'center', sortable: false},
            { label: '描述', param: 'Desc',  align: 'center', sortable: false},
            { label: '操作', align: 'center', width: '300',
                component:process
            }
        ]
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
      QueryStaff(newVal, oldVal) {
        if (newVal.Code === 0) {
              this.staffList = newVal.ReturnData.Data
          }
      }
  },
  created () {
    that = this
    this.form = this.formData
  },
  methods: {
        categoryChange(value) {
            if (value == 0) {
                this.form.ParentId = ''
                this.disable = true
            } else {
                this.disable = false
            }
        },
        searchNoticer(keyword) {
          this.getStaffList(keyword)
        },
        selectChange(Id) {
          let Name = ''
          this.staffList.map(item => {
              if (item.Id == Id){
                  Name = item.Name
              }
          })
          this.form.ManagerId = Id
          this.form.StaffName = Name
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
          this.form['ParentId'] = !this.form['ParentId'] ? '0':this.form['ParentId']
          this.form['IsReplaceMateriel'] = '0'
          this.form['IsTool'] = '1'
          this.form['IsAssets'] = '0'
          this.$emit('addMateria', this.form)
      },
      addShelevs () {
        this.showMask = true
      },
      closePropMask (data) {
        this.showMask = false
      },
      dataSubmit(data) {
        if (this.currentIndex === '') {
            this.form.ShelfDetail.push(data)
        } else {
            this.form.ShelfDetail[this.currentIndex] = data
            this.currentIndex = ''
        }
        this.showMask = false
        this.maskData = {}
      },
    //  点击货架编辑
    clickEdit(row, index) {
        this.currentIndex = index
        this.formType = '2'
        this.maskData = row
        this.showMask = true
    },
    clickDel (row, index) {
        this.currentIndex = index
        this.form.ShelfDetail.splice(this.currentIndex, 1)
        console.log(this.form.ShelfDetail)
    }
  },
  components: {
    Shelevs
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
</style>