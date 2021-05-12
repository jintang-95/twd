<template>
  <div id="postmain">
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
      :page="page" 
      :pageSize="pageSize" 
      :total="total"
      :checkList="checkList" 
      :process="process"  
      :menuList="treeData" 
      title="全部资产">
      <el-table :data="tableData" stripe header-row-class-name="headerClass" slot="table" align="center" cell-class-name="elliplise">
        <el-table-column :show-overflow-tooltip="true" v-for="(item, index) in columns" :width="item.width" :prop="item.prop" :label="item.label" :key="index"></el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template  slot-scope="scope">
            <div v-if="scope.row.Status == '启用'" >
              <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" style="margin-left: 0;" @click="stop(scope.row)">停用</el-button>
              <!-- <el-popconfirm
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
              @onConfirm="del(scope.row)"
                > -->
              <el-button type="text" @click="open(scope.row)">删除</el-button>
              <!-- <el-button slot="reference" type="text" size="small">删除</el-button> -->
            <!-- </el-popconfirm> -->
            </div>
            <div v-if="scope.row.Status == '停用'">
              <el-button type="text" size="small" @click="reCover(scope.row)">回收</el-button>
              <el-button type="text" size="small" style="margin-left: 0;" @click="start(scope.row)">启用</el-button>
              <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                title="确定清除吗？"
                @onConfirm="clear(scope.row)">
                  <el-button slot="reference" type="text" size="small">清除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </right-container>
    <!-- <Classify :visible="showMask" :brands="brands" :typeList="typeList" :type="formType" :formData="formData" @closeMask="closeMask" @addMateria="addMateria"></Classify> -->
  </div>
  </div>
 
</template>

<script>
import RightContainer from '@/components/rightContainer.vue'
// import Classify from './dialog/classify.vue'
import { treeToArray } from '@/util/util.js'
import { mapGetters } from 'vuex'
export default {
  name: 'materielArchives',//物料档案
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      typeList: [],
      formData: {
        // No: '',
        // Name: '',
        // Desc: '',
        // CategoryId:'',
        // IsReplaceMateriel: '',
        // IsTool: "",
        // IsAssets: "",
        // StandardUnitId: "",
        // DefaultWarehouseId: "",
        // ManagerId: "",
        // BrandId: "",
        // Spec: "",
        // Model: "",
        // ValidityTime: "",
        // ValidityTimeUnit: "",
        // Status: ""
      },
      editForm: {},
      wareHouse: [],//默认仓库列表
      brands: [],//品牌列表,
      formType: '1',
      process: ['Add','check','search'],
      checkData: [],
      lastData: [],
      keyWord: '',
      tableData: [],
      checkList: [
        {
          title: '全部下级',
          statu: 2
        },
        {
          title: '已停用',
          statu: 3
        }
      ],
      treeData: [],
      columns: [
        {
          label: '状态',
          prop: 'Status'
        },
        {
          label: '分类编码',
          prop: 'No'
        },
        {
          label: '分类名',
          prop: 'MaterielNo'
        },
        {
          label: '自动编码',
          prop: 'CategoryName',
          width: '100'
        },
        {
          label: '作业标准',
          prop: 'Name'
        },
         {
          label: 'BOM',
          prop: 'BrandName'
        },
        {
          label: '描述',
          prop: 'Spec'
        }
      ]
    };
  },
  async created() {
    this.resetFormData()
    await this.getTreeData()
    await this.getTableData()
    this.getBrandList()
  },
  computed: {
    ...mapGetters([
      'GetMaterielCategoryTree',
      'GetAssetsDetails',
      'UnCancelAssetsDetail',
      'CancelAssetsDetail',
      'RemoveAssetsDetail',
      'SaveAssetsDetail',
      'GetAssetsDetailById',
      'GetBrands'
    ])
  },
  watch: {
    GetMaterielCategoryTree (newValue, oldValue) {
      if (newValue.Code === 0) {
        this.treeData = newValue.ReturnData
        this.lastData = newValue.ReturnData
        this.typeList = treeToArray(newValue.ReturnData, [])
      } else {
        // 失败
      }
    },
    GetAssetsDetails (newValue, oldValue) {
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          let unit = newValue.ReturnData.Data[i].ValidityTimeUnit == 0 ? '天' : newValue.ReturnData.Data[i].ValidityTimeUnit == 1 ? '月' : '年'
          newValue.ReturnData.Data[i].Status = newValue.ReturnData.Data[i].Status == 2 ? '启用' : '停用'
          newValue.ReturnData.Data[i].ValidityTime = newValue.ReturnData.Data[i].ValidityTime +  unit
        }
        this.tableData = newValue.ReturnData.Data
        this.total = newValue.ReturnData.DataCount
      } else {
        // 失败
      }
    },
    UnCancelAssetsDetail(newValue, oldValue) {
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
    CancelAssetsDetail(newValue, oldValue) {
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
    async RemoveAssetsDetail(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'success'
        });
        await this.getTableData()
        this.getTreeData()
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'fail'
        });
      }
    },
    async SaveAssetsDetail(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: 'success'
        });
        await this.getTableData()
        this.getTreeData()
        this.resetFormData()
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
    GetAssetsDetailById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData
        this.openEdit()
      } else {
        // 失败
        this.$message({
            showClose: true,
            message: '获取数据失败',
            type: 'fail'
        })
      }
    },
    GetBrands (newValue, oldValue) {
        if (newValue.Code === 0) {
            this.brands = newValue.ReturnData.Data
        } else {
            // 失败
        }
    }
  },
  methods: {
    open(data) {
        this.$confirm('确定删除吗?删除后数据将不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.del(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    selectType(data) {
      this.currentId = data
      this.treeData = []
      this.treeData = this.lastData
      this.getTableData()
    },
    // 获取默认仓库数据
    getDefauktWareHouse () {
        let json = {
            MN: "GetWarehouses",
            DataContent: {
                "Id": "",
                "KeyWord":"",
                "PageSize":100,
                "PageIndex":1,
                "Status": ""
            }
        };
      this.MIX_send(json);
    },
    // 获取品牌
    getBrandList () {
        let json = {
            MN: "GetBrands",
            DataContent: {
                "KeyWord":"",
                "PageSize":100,
                "PageIndex":1,
                "Status": ""
            }
      };
      this.MIX_send(json);
    },
    // 通过Id获取数据
    getMaterielById(Id) {
        let json = {
            "MN":"GetMaterielById",
            "DataContent":
            {
                "Id": Id
            }
        }
        this.MIX_send(json);
    },
    // 获取树形结构数据
    getTreeData () {
      let json = {
        MN: "GetMaterielCategoryTree",
        DataContent: {
            "IsAssets": '1'
        }
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "DeviceTypeGetList",
        SN:'DeviceManage',
        DataContent: {
          "CategoryId": this.currentId,
          "Status":this.checkData.join(','),
          "KeyWord":this.keyWord,
          "PageSize":this.pageSize,
          "PageIndex":this.page
        }
      };
      this.MIX_send(json);
    },
    // 停用
    stopMateria (id) {
      let json = {
        MN: "CancelAssetsDetail",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 启用
    startMateria (id) {
      let json = {
        MN: "UnCancelAssetsDetail",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria (id) {
      let json = {
        MN: "RemoveAssetsDetail",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 新增分类
    addMateriaType (data) {
      let json = {
        MN: "SaveAssetsDetail",
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
      await this.getTreeData()
      this.getTableData()
    },
    /**
     * 表格处理函数
     * */
    // 编辑
    edit(row) {
      this.formType = '2'
      this.formData= row
      this.formData.ValidityTime = row.ValidityTime.substring(0, row.ValidityTime.length - 1)
      this.showMask = true
    },
    openEdit() {
        this.showMask = true
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
      console.log(this.formData)
      this.showMask = true
    },
    // 取消新增或者取消编辑
    closeMask (data) {
      this.showMask = false
      this.resetFormData()
    },
    // 新增或者编辑
    addMateria (data) {
      this.addMateriaType(data)
    },
    resetFormData() {
      this.formData={
      }
    }
  },
  components: {
    RightContainer,
    // Classify
  }
}
</script>

<style scoped lang="less">
#postmain {
  width:100%;
  height: 100%;
  padding:20px;
  box-sizing: border-box;
  background-color: #F8FAFF;
  border-radius: 5px;
  overflow-y: auto;
}
.materiaType{
  padding:20px;
  height:100%;
  border-radius: 5px;
  background-color:#fff;
}
</style>