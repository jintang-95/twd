<template>
  <div id="organiza">
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
        :process="process"  
        :menuList="treeData" 
        :title="title">
        <el-table
          v-loading="loading"
          :data="tableData"
          fit
          slot="table"
          :header-cell-style="{background:'#F0F7FB','color':'#5C87A4','height':'60px'}"
          highlight-current-row
          class="tableBox">
          <el-table-column label="名称"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.Name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="别名" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.OtherName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="{row}">
              <span v-if="row.Type=='1'">部门</span>
              <span v-if="row.Type=='2'">项目组</span>
            </template>
          </el-table-column>
          <el-table-column label="隶属部门" align="center">
            <template slot-scope="{row}">
              <span>{{ row.ParentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" align="center">
            <template slot-scope="{row}">
              <span>{{ row.Desc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" sortable="custom" align="center" class-name="status-col">
            <template slot-scope="{row}">
              <div v-if="row.Status=='0'" :type="row.Status | statusFilter">
              <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">草稿</span> 
              </div>
              <div v-if="row.Status=='1'" :type="row.Status | statusFilter">
              <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle">待审批</span> 
              </div>
              <div v-if="row.Status=='2'" :type="row.Status | statusFilter">
              <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle;color:#8CD16B">已启用</span> 
              </div>
              <div v-if="row.Status=='3'" :type="row.Status | statusFilter">
              <img src="../../../assets/images/圆点-红色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle;color:#F56262">已停用</span> 
              </div>
              <div v-if="row.Status=='4'" :type="row.Status | statusFilter">
              <img src="../../../assets/images/圆点-绿色.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle">已删除</span> 
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button v-if="row.Status!='0'" type="text" size="mini" @click="dyapiDetail(row)">
              <img src="../../../assets/images/edit.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle" >编辑</span> 
              </el-button>
              <el-button v-if="row.Status =='3'" size="mini" type="text" @click="start(row)">
              <img src="../../../assets/images/start_icon.png" style="vertical-align:middle" alt=""> <span style="vertical-align:middle" >启用</span> 
              </el-button>
              <el-button v-if="row.Status=='2'" size="mini" type="text"  @click="stop(row)">
              <img src="../../../assets/images/stop_icon.png"  style="vertical-align:middle" alt="">  <span style="vertical-align:middle" >停用</span> 
              </el-button>
              <el-button v-if="row.Status=='3'||row.Status=='0'" size="mini" type="text" @click="deletedata(row)">
              <img src="../../../assets/images/delete.png" style="vertical-align:middle" alt="">  <span style="vertical-align:middle" >删除</span> 
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </right-container>
    </div>
    <!-- 新增弹框 -->
    <el-dialog
     :title="type == 1 ? '新增资产分类' : '编辑资产分类'"
     :visible="dialogVisible " center width="460px" @close ="cancel">
      <el-form ref="ruleForm"  :model="form" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">
        <el-form-item label="名称:" prop="Name">
          <el-input v-model="form.Name" auto-complete="off" placeholder="组织名称"/>
        </el-form-item>
        <el-form-item label="别名" prop="OtherName">
          <el-input v-model="form.OtherName" auto-complete="off" placeholder="组织别名" />
        </el-form-item>
        <el-form-item label="类型" prop="Type">
          <el-select :disabled="datatype =='2'" v-model="form.Type" class="filter-item" placeholder="请选择类型" style="width: 230px">
             <el-option :label="item.label" :value="item.value" v-for="(item,index) in $optiondata.OrganType" :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隶属" prop="ParentId" v-if="form.Type=='2'">
          <el-select :disabled="datatype =='2'" v-model="form.ParentId" class="filter-item" placeholder="请选择隶属关系" style="width: 230px">
            <el-option :label="item.Name" :value="item.Id" v-for="(item,index) in option" :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="Desc">
          <el-input v-model="form.Desc" auto-complete="off" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="关于组织描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="commit">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RightContainer from '@/components/rightContainer.vue'
// import Classify from './dialog/classify.vue'
// import organ from './dialog/organ'
import { treeToArray } from '@/util/util.js'
import { mapGetters } from 'vuex'
var that;
export default {
  name: 'materielArchives',//物料档案
  components: {
    RightContainer,
    // organ
  },
   filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'info',
        2: 'success',
        3: 'danger',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loading: false,
      title:'',
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      dialogVisible: false,
      typeList: [],
      editForm: {},
      wareHouse: [],//默认仓库列表
      brands: [],//品牌列表,
      formType: '1',
      process: ['Add','check','search'],
      checkData: [],
      lastData: [],
      keyWord: '',
      tableData: [],
      treeData: [],
      listfrom: {
        "Id": '',
        "KeyWord": '',
        "IsStop": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      form:{
        id: undefined,
        Name: '',
        Type: '1',
        ParentId: '0',
        OtherName: '',
        Desc: '',
      },
      type: '',
      datatype:'',
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
  created() {
    that = this;
    this.getTreeData();
    this.getlistdata();
    this.title = this.$route.meta.title;
  },
  watch: {
    // GetMaterielCategoryTree (newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     console.log(newValue,22222222)
    //     console.log(oldValue,33333333)
    //     this.treeData = newValue.ReturnData
    //     this.lastData = newValue.ReturnData
    //     this.typeList = treeToArray(newValue.ReturnData, [])
    //   } else {
    //     // 失败
    //   }
    // },
    // GetAssetsDetails (newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
    //       let unit = newValue.ReturnData.Data[i].ValidityTimeUnit == 0 ? '天' : newValue.ReturnData.Data[i].ValidityTimeUnit == 1 ? '月' : '年'
    //       newValue.ReturnData.Data[i].Status = newValue.ReturnData.Data[i].Status == 2 ? '启用' : '停用'
    //       newValue.ReturnData.Data[i].ValidityTime = newValue.ReturnData.Data[i].ValidityTime +  unit
    //     }
    //     this.tableData = newValue.ReturnData.Data
    //     this.total = newValue.ReturnData.DataCount
    //   } else {
    //     // 失败
    //   }
    // },
    // UnCancelAssetsDetail(newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     this.$message({
    //       showClose: true,
    //       message: "启用成功",
    //       type: 'success'
    //     });
    //     this.getTableData()
    //   } else {
    //     // 失败
    //     this.$message({
    //       showClose: true,
    //       message: "启用失败",
    //       type: 'fail'
    //     });
    //   }
    // },
    // CancelAssetsDetail(newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     this.$message({
    //       showClose: true,
    //       message: "停用成功",
    //       type: 'success'
    //     });
    //     this.getTableData()
    //   } else {
    //     // 失败
    //     this.$message({
    //       showClose: true,
    //       message: "停用失败",
    //       type: 'fail'
    //     });
    //   }
    // },
    // async RemoveAssetsDetail(newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     this.$message({
    //       showClose: true,
    //       message: newValue.Message,
    //       type: 'success'
    //     });
    //     await this.getTableData()
    //     this.getTreeData()
    //   } else {
    //     // 失败
    //     this.$message({
    //       showClose: true,
    //       message: newValue.Message,
    //       type: 'fail'
    //     });
    //   }
    // },
    // async SaveAssetsDetail(newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     this.$message({
    //       showClose: true,
    //       message: "保存成功",
    //       type: 'success'
    //     });
    //     await this.getTableData()
    //     this.getTreeData()
    //     this.resetFormData()
    //     this.showMask = false
    //   } else {
    //     // 失败
    //     this.$message({
    //       showClose: true,
    //       message: newValue.Message,
    //       type: 'fail'
    //     });
    //   }
    // },
    // GetAssetsDetailById(newValue, oldValue) {
    //   if (newValue.Code === 0) {
    //     this.editForm = newValue.ReturnData
    //     this.openEdit()
    //   } else {
    //     // 失败
    //     this.$message({
    //         showClose: true,
    //         message: '获取数据失败',
    //         type: 'fail'
    //     })
    //   }
    // },
    // GetBrands (newValue, oldValue) {
    //     if (newValue.Code === 0) {
    //         this.brands = newValue.ReturnData.Data
    //     } else {
    //         // 失败
    //     }
    // },
    "$store.state.Humanmanage.QueryOrganizationTree": function (data) {
      this.treeData = data.ReturnData;
      // console.log(this.treeData,"==========")
      // let DataContent = data.ReturnData.DataCount;
      // this.menus = data.ReturnData;
      // this.menus = this.removechild(this.menus);
      // console.log(this.menus);
    },
     "$store.state.Humanmanage.QueryOrganization": function (data) {
      let DataContent = data.ReturnData.DataCount;
      this.tableData = data.ReturnData.Data;
      this.tatolpage = data.ReturnData.DataCount;
    },
    
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
        "MN": "QueryOrganizationTree",
        "SN":"Organization",
        DataContent: {
            "IsAssets": '1'
        }
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getlistdata() {
      let json = {
        "MN": "QueryOrganization",
        "SN":'Organization',
        "DataContent": this.listfrom
      };
      console.log(json,111111111111)
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
      this.dialogVisible = true;
      console.log('111111111111111')
      // for (let key in this.formData) {
      //   if (key != 'Id') {
      //     this.formData[key] = this.formData[key] instanceof Array ? [] : typeof this.formData[key] == 'Object' ? {} : ''
      //   } else {
      //     delete this.formData[key]
      //   }        
      // }
      // console.log(this.formData)
      
    },
    // 取消
    cancel( ) {
      
    },
    commit() {

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
    },
    removechild(data){
      data.forEach((item,index) => {
        if (item.Children && item.Children.length > 0) {
          this.removechild(item.Children);
        } else {
          delete item.Children;
        }
      });
      return data;
    }
  },
}
</script>

<style scoped lang="less">
#organiza {
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