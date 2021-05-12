<template>
    <el-dialog
    :title="type == 1? '新增盘点明细' : '编辑盘点明细'"
    :visible.sync="show"
    width="460px"
    @close="cancelAdd"
    append-to-body
    center>
        <el-form ref="form" label-width="80px">
            <el-form-item label="资产名称" label-position="left">
                <el-select v-model="form.AssetsName" @change="assetsChange" filterable remote :remote-method="assetsMethod" placeholder="请输入物料名称">
                    <el-option
                    v-for="(item,index) in assetList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产编码" label-position="left">
                <el-input  placeholder="请输入物料编码" readonly v-model="form.AssetsNo"></el-input>
            </el-form-item>
            <el-form-item label="负责人" label-position="left">
                <el-select v-model="form.ResponsiblerName" @change="selectChange" filterable remote :remote-method="remoteMethod" placeholder="请输入负责人搜索">
                    <el-option
                    v-for="(item,index) in staffList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" label-position="left">
                <el-switch v-model="form.Status" active-text="正常" inactive-text="损坏">
                </el-switch>
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
          assetList: [],
          staffList: []
      }
  },
  computed: {
      ...mapGetters([
          'GetAssetsDetails',
          'QueryStaff'         
      ])
  },
  watch: {
      QueryStaff(newValue, oldValue) {
          if (newValue.Code === 0) {
              this.staffList = newValue.ReturnData.Data
          }
      },
      addData(newVal, oldVal) {
          this.form = newVal
      },
      visible(newValue, oldValue) {
          this.show = newValue
      },
      GetAssetsDetails(newValue, oldValue) {
          if (newValue.Code === 0) {
            this.assetList = newValue.ReturnData.Data
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
            MN: "QueryStaff",
            DataContent: {
            "KeyWord":keyword,
            "PageSize":10,
            "PageIndex":1
            }
        };
        this.MIX_send(json);
      },
      assetsMethod(keyword) {
          let json = {
            MN: "GetAssetsDetails",
            DataContent: {
            "KeyWord":keyword,
            "PageSize":10,
            "PageIndex":1
            }
        };
        this.MIX_send(json);
      },
      assetsChange(Id) {
          let No = '' , Name = ''
          this.assetList.map(item => {
              if (item.Id == Id) {
                  No = item.No
                  Name = item.Name
              }
          })
          this.form.AssetsDetailId = Id
          this.form.AssetsNo = No
          this.form.AssetsName = Name
      },
      selectChange (Id) {
          let No = '', Name = ''
          this.staffList.map(item => {
              if (item.Id == Id) {
                  No = item.No
                  Name = item.Name
              }
          })
          this.form.Responsibler =Id
          this.form.ResponsiblerName = Name
      },
      cancelAdd () {
          this.$emit('closePropMask',false)
          this.form = {
              AssetsName: '',
              AssetsNo: '',
              ResponsiblerName: '',
              Status: '',
          }
          this.unitList = []
      },
      submitAdd() {
          this.form['Status'] = this.form['Status']? '1' : '0'
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