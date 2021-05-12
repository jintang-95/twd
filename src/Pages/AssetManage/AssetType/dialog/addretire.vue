<template>
  <div>
    <el-dialog
      @close="cancelSubmit"
      :title="type == 1 ? '新增资产报废' : type==2?'编辑资产报废':'查看资产报废'"
      :visible.sync="show"
      width="1050px"
      center
      style="border-radius:'10px'"
       :before-close="cancelSubmit"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row :span="20">
          <!-- <el-col :span="8">
            <el-form-item label="报废单号" label-position="left" prop="ScrapNo">
              <el-input v-model="form.ScrapNo" placeholder="请输入报废单号"   disabled></el-input>
            </el-form-item>
          </el-col> -->
           <!-- <el-col :span="8">
            <el-form-item label="申请人" label-position="left" prop="AgentName">
              <el-input v-model="form.AgentName" placeholder="请输入申请人"  disabled></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8" >
            <el-form-item label="申请日期" prop="applyDate" label-width="100">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                placeholder="选择申请日期"
                value-format="yyyy-MM-dd"
                v-show="type==1||type==2"
              ></el-date-picker>
              <el-input v-model="form.applyDate"  v-show="type==3" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废原因" prop="Remarks" label-width="88"> 
            <el-input v-model="form.Remarks" type='textarea' placeholder="请输入报废原因" v-show="type==1||type==2" style="width:400px"></el-input>
            <el-input v-model="form.Remarks" type='textarea' placeholder="请输入报废原因" disabled v-show="type==3" style="width:400px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span='20'>
          <!-- <el-col :span="12">
            <el-form-item label="报废原因" prop="Remarks" label-width="80"> 
            <el-input v-model="form.Remarks" type="textarea" placeholder="请输入报废原因" v-show="type==1||type==2"></el-input>
            <el-input v-model="form.Remarks" type="textarea" placeholder="请输入报废原因" disabled v-show="type==3"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :span="20">
          <el-col :span="23">
            <el-tabs type="card">
              <el-tab-pane label="资产明细" >
                <el-table :data="newTableData" style="width: 100%" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
                  <!-- <el-table-column align="center" prop="MaterielId" label="资产ID" width="100"></el-table-column> -->
                  <el-table-column align="center" prop="Name" label="资产名称" ></el-table-column>
                  <el-table-column align="center" prop="AssetsNo" label="资产编号" width="150"></el-table-column>
                  <el-table-column align="center" prop="Spec" label="规格" ></el-table-column>
                  <!-- <el-table-column align="center" prop="Model" label="型号" ></el-table-column> -->
                  <el-table-column align="center" prop="Unit" label="单位" ></el-table-column>
                  <el-table-column align="center" prop="Price" label="单价" ></el-table-column>
                  <!-- <el-table-column align="center" prop="BuyNum" label="库存" ></el-table-column> -->
                  <el-table-column align="center" prop="Num" label="报废数量"   v-if="type==2||type==1">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="Num" label="报废数量"   v-if="type==3" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" disabled></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="100" v-if="type==1||type==2" >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        class="operationTtn"
                        @click="RemoveMateriels(scope.row)"
                      >
                        <span>删除</span>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="1">
            <el-button size="mini" style="background:#0060A0" @click="openMX" v-show="type==1||type==2">
              <i class="el-icon-plus" style="color:#fff"></i>
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="type==1">
        <!-- <el-button type="primary" @click="save">存为草稿</el-button> -->
        
        <el-button type="primary" @click="submitData('form')">确 定</el-button>
        <el-button @click="cancelSubmit">取 消</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="type==2">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitData('form')">确 定</el-button>
      </span>
       <span slot="footer" class="dialog-footer" v-if="type==3">
        <el-button type="primary" @click="cancelSubmit">关闭</el-button>
      </span>
    </el-dialog>
    <!-------资产报废明细----->
    <el-dialog title="资产档案" :visible.sync="showMX" width="45%" >
      <!-- <el-row :span="24">
        <el-col :span="6">
          <el-input v-model="zcname" placeholder="请输入资产名搜索"></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row> -->
      
        <el-table :data="zcmx" style="width:100%" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="operationTtn" @click="addMX(scope.row)">
                <span>添加</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="Name" label="资产名称" ></el-table-column>
          <el-table-column align="center" prop="AssetsNo" label="资产编号" ></el-table-column>
          <el-table-column align="center" prop="Spec" label="规格" ></el-table-column>
          <el-table-column align="center" prop="Model" label="型号" ></el-table-column>
          <el-table-column align="center" prop="Unit" label="单位" ></el-table-column>
          <el-table-column align="center" prop="Price" label="单价" ></el-table-column>
          
        </el-table>
        <!-- <div style="text-align: right;margin-top: 30px;">
          <el-pagination
          :hide-on-single-page="true"
          :page-size="pagesize"
          :pager-count="7"
          layout="prev, pager, next"
          :total="total"
          @current-change="current_change"
        ></el-pagination>
        </div> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="showMX = false">取 消</el-button>
        <el-button type="primary" @click="showMX = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "addretire",
  data() {
    return {
      show: false,
      showMX: false,
      form: {
        // Agent:JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        // AgentName:JSON.parse(sessionStorage.getItem("UserDetial")).Name
      },
      radio: "1",
      dj: [
        { name: "草稿", id: 0 },
        { name: "待审批", id: 1 },
        { name: "审批结束", id: 2 },
        { name: "停用", id: 3 },
        { name: "已删除", id: 4 },
      ],
      newTableData: [],
      zcname: "",
      zcmx: [],
      total: 30,
      currentPage: "1",
      pagesize: 10,
      rules:{
        Remarks:[{ required: true, message: '请输入报废原因', trigger: 'blur' }],
        applyDate:[{ required: true, message: '请输入申请日期', trigger: 'change' }],
      }
    };
  },
   computed: {
    ...mapGetters([
      'AssetScrapGetList',
      'AssetsDetailGetList'
    ]),
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "1",
    },
    seeData:{
      type: Object,
      default() {
        return {};
      },
    }
  },
  watch: {
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    seeData(newVal, oldVal){
      console.log(newVal)
      this.form=newVal
      // this.form.Agent=newVal.Agent
      // this.form.Remarks=newVal.Remarks
      // this.form.ScrapNo=newVal.ScrapNo
      // this.form.applyDate=newVal.applyDate
      this.newTableData=newVal.AssetScrapInfos
    },
    AssetsDetailGetList(newVal, oldVal){
      this.zcmx=newVal.ReturnData.Data
      this.total=newVal.ReturnData.DataCount
    }
  },
  methods: {
    //新增明细分页
    current_change(currentPage){
      this.currentPage=currentPage
      this.MXreq()
      // let json = {
      //   MN: "AssetScrapGetList",
      //   SN: "Assets",
      //   DataContent: {
      //     Status: this.checkData,
      //     KeyWord: this.keyWord,
      //     PageSize: this.pageSize,
      //     PageIndex: this.currentPage,
      //   },
      // };
      // this.MIX_send(json);
    },
    //新增明细
    addMX(item) {
      // console.log(item);
      this.newTableData.push(item);
      this.newTableData.forEach(item=>{
        item.AssetsNo=item.Id
      })
      this.showMX = false
    },
    RemoveMateriels(val) {
      for (let index = 0; index < this.newTableData.length; index++) {
        const element = this.newTableData[index];
        if (element.Name == val.Name) {
          this.newTableData.splice(index, 1);
        }
      }
    },
    MXreq(){
       let json = {
        MN: "AssetsDetailGetList",
        SN: "Assets",
        DataContent: {
          "Status":-1,
          "KeyWord":"",
          "PageSize":this.pagesize,
          "PageIndex":this.page,
        },
      };
      this.MIX_send(json);
    },
    openMX() {
      this.MXreq()
      this.showMX = true;
    },
    handleNodeClick(data) {
      console.log(data);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
       this.$refs.form.clearValidate()
      this.form={}
      this.newTableData=[]
    },
    save(){
       if(this.newTableData==""||!this.newTableData){
        this.$message.error('请添加报废资产明细')
        return
      }
      for( let i=0;i<this.newTableData.length;i++){
            if(this.newTableData[i].Num==""||!this.newTableData[i].Num){
        this.$message.error('请输入报废数量')
        return
      }
      }
      let adddata={...this.form,AssetScrapInfos:this.newTableData}
      this.$emit("saveData", adddata);
    },
    submitData(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.newTableData==""||!this.newTableData){
        this.$message.error('请添加报废资产明细')
        return
      }
      for( let i=0;i<this.newTableData.length;i++){
            if(this.newTableData[i].Num==""||!this.newTableData[i].Num){
        this.$message.error('请输入报废数量')
        return
      }
      }
      // this.form.StaffId=JSON.parse(sessionStorage.getItem("UserDetial")).Id;
      let adddata={...this.form,AssetScrapInfos:this.newTableData}
      this.$emit("addMateria", adddata);
       this.$refs.form.resetFields();
      console.log(adddata)
          } else {
        
            return false;
          }
        });
    },
  },
};
</script>
<style scoped lang='less'>
.dialog-footer .ownbutton {
  width: 170px;
}
.addButton {
  // cursor: pointer;
  .el-icon-plus:before {
    content: "\E6D9";
    color: white;
  }
}
.el-table th{
  background-color: #F0F7FB;
}
</style>
<style >
.el-dialog {
  border-radius: 4px;
}
.el-cascader {
  width: 290px;
}
.addButton {
  background-color: #0060a0;
  width: 24px;
  /* height: 24px; */
  padding-left: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addButton i {
  position: absolute;
  top: 0;
  margin: auto;
  bottom: 0;
  display: flex;
  align-items: center;
}
</style>