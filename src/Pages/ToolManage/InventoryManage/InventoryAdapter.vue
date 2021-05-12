<template>
  <div class="materiaType">
      <right-container 
        @selectType="selectType"
        @pageSizeToggle="pageSizeToggle"
        @pageToggle="pageToggle"
        @pagePrev="pagePrev"
        @pageNext="pageNext"
        @statusChange="statusChange"
        @inputChange="inputChange"
        @refreshPage="refreshPage"
        @addNew="addNew"
       :showTree="false"
       :page="page" 
       :pageSize="pageSize" 
       :total="total"
       :checkList="checkList" 
       :process="process"  
       :menuList="treeData" 
       title="">
       <el-table  :data="tableData" stripe header-row-class-name="headerClass" slot="table" align="center" cell-class-name="elliplise">
          <el-table-column :show-overflow-tooltip="true" v-for="(item, index) in columns" :width="item.width" :prop="item.prop" :label="item.label" :key="index"></el-table-column>
          <el-table-column
              label="操作"
              width="150">
              <template  slot-scope="scope">
                  <div v-if="scope.row.Status == 0" >
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-popconfirm
                    icon="el-icon-info"
                    iconColor="red"
                    title="确定删除吗？"
                    @onConfirm="del(scope.row)"
                  >
                    <el-button slot="reference" type="text" size="small">删除</el-button>
                  </el-popconfirm>
                  <el-button type="text" size="small" style="margin-left: 0;" @click="start(scope.row)">启动</el-button>
                  </div>
                  <div v-if="scope.row.Status == 1">
                    <el-button type="text" size="small"  @click="stop(scope.row)">停用</el-button>
                    <el-button type="text" size="small"  @click="see(scope.row)">查看</el-button>
                  </div>
                   <div v-if="scope.row.Status == 3">
                     <el-button type="text" size="small"  @click="start(scope.row)">启动</el-button>
                     <el-button type="text" size="small"  @click="see(scope.row)">查看</el-button>
                   </div>
                   <div v-if="scope.row.Status == 2">
                     <el-button type="text" size="small"  @click="see(scope.row)">查看</el-button>
                   </div>
              </template>
          </el-table-column>
      </el-table>
      </right-container>
      <AddAdapter :visible="showMask" :list="typeList" :type="formType" :formData="formData" @closeMask="closeMask" @addMateria="addMateria"></AddAdapter>
  </div>
</template>

<script>
import RightContainer from '@/components/rightContainer.vue'
import AddAdapter from './dialog/addAdapter.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'InventoryAdapter',//调整单
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      formData: {
        No: '',
        InventoryPlanId: '',
        Remark: '',
        AdjustmentDetail: [],
        AdjustmentInfo: {
          AdjustmentTotal: '',
          AdjustmentAmount: '',
          SurplusTotal: '',
          SurplusAmount: '',
          LossTotal: '',
          LossAmount: ''
        }
      },
      formType: '1',
      process: ['Add','search'],
      checkData: [],
      lastData: [],
      keyWord: '',
      tableData: [],
      checkList: [
        {
          title: '草稿',
          statu: 0
        },
        {
          title: '启动',
          statu: 1
        },
        {
          title: '停用',
          statu: 3
        },
        {
          title: '已结束',
          statu: 2
        }
      ],
      treeData: [],
      columns: [
        {
          label: '调整单号',
          prop: 'No'
        },
        {
          label: '所属盘点计划',
          prop: 'InventoryPlanName'
        },
        {
          label: '盘盈总数量',
          prop: 'AdjustmentTotal'
        },
        {
          label: '盘盈总价值',
          prop: 'AdjustmentAmount',
          width: '100'
        },
        {
          label: '盘亏总数量',
          prop: 'LossTotal'
        },
        {
          label: '盘亏总价值',
          prop: 'LossAmount'
        },
        {
          label: '盈亏总数',
          prop: 'SurplusTotal'
        },
        {
          label: '盈亏总价值',
          prop: 'SurplusAmount'
        },
        {
          label: '备注',
          prop: 'Remark',
          width: '300'
        }
      ]
    };
  },
  async created() {
    await this.getTableData()
  },
  computed: {
    ...mapGetters([
      'GetAdjustments',
      'SaveAdjustment',
      'RemoveAdjustment',
      'GetAdjustmentById'
    ])
  },
  watch: {
    GetAdjustments (newValue, oldValue) {
      if (newValue.Code === 0) {
        this.tableData = newValue.ReturnData.Data
        this.total = newValue.ReturnData.DataCount
      } else {
        // 失败
      }
    },
    UnCancelInventoryPlan(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "启用成功",
          type: 'success'
        });
        this.getTableData()
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "启用失败",
          type: 'fail'
        });
      }
    },
    CancelInventoryPlan(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "停用成功",
          type: 'success'
        });
        this.getTableData()
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: "停用失败",
          type: 'fail'
        });
      }
    },
    async RemoveAdjustment(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'success'
        });
        await this.getTableData()
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'fail'
        });
      }
    },
    async SaveAdjustment(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: 'success'
        });
        await this.getTableData()
        this.showMask = false
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'fail'
        });
      }
    },
    GetAdjustmentById(newValue, oldValue) {
      if (newValue.Code === 0) {
          this.editForm = newValue.ReturnData
          this.formData.AdjustmentDetail = this.editForm.AdjustmentDetail
          console.log(this.formData)
          this.openEdit()
      } else {
        // 失败
      }
    }
  },
  methods: {
    selectType(data) {
      this.currentId = data
      this.treeData = []
      this.treeData = this.lastData
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetAdjustments",
        DataContent: {
          "Status":this.checkData.join(','),
          "KeyWord":this.keyWord,
          "PageSize":this.pageSize,
          "PageIndex":this.page,
          "TableType": "2",
        }
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria (id) {
      let json = {
        MN: "CancelInventoryPlan",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria (id) {
      let json = {
        MN: "UnCancelInventoryPlan",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria (id) {
      let json = {
        MN: "RemoveAdjustment",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType (data) {
      let json = {
        MN: "SaveAdjustment",
        DataContent: data
      };
      this.MIX_send(json);
    },
    // 页面Size切换
    pageSizeToggle(data) {
      this.pageSize = pageSize
      this.getTableData()
    },
    // 页面切换
    pageToggle(data) {
      this.page = data
      this.getTableData()
    },
    // 上一页回调
    pagePrev(data) {
      this.page = data
      this.getTableData()
    },
    // 下一页回调
    pageNext(data) {
      this.page = data
      this.getTableData()
    },
    // 顶部复选框过滤
    statusChange (data) {
      this.checkData = data
      this.getTableData()
    },
    // 输入框回车键
    inputChange(data) {
      this.keyWord = data
      console.log(data)
      this.getTableData()
    },
    // 刷新回调
    async refreshPage() {
      await this.getTableData()
    },
    getPlanById(Id) {
      let json = {
        MN: "GetAdjustmentById",
        DataContent:{
          Id: Id
        }
      }
      this.MIX_send(json)
    },
    openEdit() {
      this.showMask = true
    },
    /**
     * 表格处理函数
     * */
    // 编辑
    edit(row) {
      this.formType = '2'
      this.formData = row
      this.getPlanById(row.Id)
    },
    see(row) {
      this.formType = '3'
      this.formData = row
      this.formData.AdjustmentInfo = {
        AdjustmentTotal: row.AdjustmentTotal,
        AdjustmentAmount: row.AdjustmentAmount,
        SurplusTotal: row.SurplusTotal,
        SurplusAmount: row.SurplusAmount,
        LossTotal: row.LossTotal,
        LossAmount: row.LossAmount
      }
      this.getPlanById(row.Id)
      // this.showMask = true
    },
    // 停用
    stop(row) {
      this.stopMateria(row.Id)
    },
    // 删除
    del(row) {
      this.removeMateria(row.Id)
    },
    // 回收
    reCover(row) {

    },
    // 启用
    start(row) {
      this.startMateria(row.Id)
    },
    // 清除
    clear(row) {

    },
    // 新增
    addNew() {
      this.formType = '1'
      for (let key in this.formData) {
        if (key != 'Id') {
          this.formData[key] = this.formData[key] instanceof Array ? [] : typeof this.formData[key] == 'Object' ? {} : ''
        } else {
          delete this.formData[key]
        }        
      }
      this.showMask = true
    },
    // 取消新增或者取消编辑
    closeMask (data) {
      this.formData = {
        No: '',
        InventoryPlanId: '',
        Remark: '',
        AdjustmentDetail: [],
        AdjustmentInfo: {
          AdjustmentTotal: '',
          AdjustmentAmount: '',
          SurplusTotal: '',
          SurplusAmount: '',
          LossTotal: '',
          LossAmount: ''
        }
      }
      this.showMask = false
    },
    // 新增或者编辑
    addMateria (data) {
      this.addMateriaType(data)
    },
  },
  components: {
    RightContainer,
    AddAdapter
  }
}
</script>

<style scoped lang="less">
.processBtn {
  display: flex;

}
</style>