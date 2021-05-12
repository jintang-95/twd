<template>
  <div>
    <el-dialog
      @close="cancelSubmit"
      :before-close='cancelSubmit'
      :title="type == 1 ? '新增资产申领' : type==2?'编辑资产申领':'查看资产申领'"
      :visible.sync="show"
      width="1050px"
      center
      style="border-radius:'10px'"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
        <el-row :span="20">
         
          <el-col :span="8">
            <el-form-item label="领用日期" >
              <el-date-picker
                v-model="form.CollectDate"
                type="date"
                placeholder="选择领用日期"
                value-format="yyyy-MM-dd"
                v-show="type==1||type==2"
              ></el-date-picker>
              <el-input v-model="form.CollectDate"  v-show="type==3" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用部门" label-position="left" >
              <!-- <el-input v-model="form.Department" placeholder="请输入领用部门" v-show="type==1||type==2"></el-input> -->
              <el-input v-model="form.DepartmentName" placeholder="请输入领用部门"  disabled ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用员工" label-position="left"   >
              <!-- <el-input v-model="form.StaffId" placeholder="请输入领用员工"  v-show="type==1||type==2"></el-input> -->
              <chooseStaff class="chooseStaff"  v-show="type==1||type==2" :stuffId="YGid" :isCustomer='true' style="width: 190px" :isMultipleChoice="false" @getToFather="getToId"></chooseStaff>
              <el-input v-model="form.StaffName" placeholder="请输入领用员工"  disabled v-show="type==3"></el-input>
            </el-form-item >
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="领用单号" label-position="left" prop="CollectNo" v-show="type==3">
              <el-input v-model="form.CollectNo"   disabled ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单时间" >
              <!-- <el-date-picker
                v-model="form.VoucherTime"
                type="datetime"
                placeholder="选择制单时间"
                value-format="yyyy-MM-DD  HH:mm:ss"
                v-show="type==1"
              ></el-date-picker> -->
              <el-input v-model="form.VoucherTime"   disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="制单人员" label-position="left" prop="VoucherName">
              <!-- <el-input v-model="form.Voucher" placeholder="请输入制单人员" v-show="type==1||type==2"></el-input> -->
              <el-input v-model="form.VoucherName" placeholder="请输入制单人员"  disabled ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         
        <el-row :span="20">
          <el-form-item label="申领原因" prop="Remark" label-width="90">
            <!-- <el-input v-model="form.Remark" type="textarea" placeholder="请输入申领原因" v-show="type==1||type==2"></el-input> -->
            <el-input v-model="form.Remark" type="textarea" placeholder="请输入申领原因" :disabled="type==3" ></el-input>
          </el-form-item>
        </el-row>
        <el-row :span="20">
          <el-col :span="23">
            <el-tabs type="card">
              <el-tab-pane label="资产明细" >
                <el-table :data="newTableData" style="width: 100%" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
                  <!-- <el-table-column align="center" prop="MaterielId" label="资产ID" width="100"></el-table-column> -->
                  <el-table-column align="center" prop="Name" label="资产名称"></el-table-column>
                  <el-table-column align="center" prop="AssetsNo" label="资产编号" width="150"></el-table-column>
                  <el-table-column align="center" prop="AssetsId" label="资产ID"></el-table-column>
                  <el-table-column align="center" prop="Spec" label="规格"></el-table-column>
                  <el-table-column align="center" prop="Model" label="型号"></el-table-column>
                  <el-table-column align="center" prop="Unit" label="单位"></el-table-column>
                  <el-table-column align="center" prop="Price" label="单价"></el-table-column>
                  <el-table-column align="center" prop="BuyNum" label="库存"></el-table-column>
                  <el-table-column align="center" prop="Num" label="申领数量"  v-if="type==2||type==1">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="Num" label="申领数量"  v-if="type==3" >
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
      <span slot="footer" class="dialog-footer" v-if="type==1||type==2">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitData('form')">确 定</el-button>
      </span>
       <span slot="footer" class="dialog-footer" v-if="type==3">
        <el-button type="primary" @click="cancelSubmit">关闭</el-button>
      </span>
    </el-dialog>
    <!-------资产申领明细----->
    <el-dialog title="资产档案" :visible.sync="showMX" width="50%" >
      <!-- <el-row :span="24">
        <el-col :span="6">
          <el-input v-model="zcname" placeholder="请输入资产名搜索"></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row> -->
      
        <el-table :data="zcmx" style="width: 100%" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
          <el-table-column align="center" prop="Name" label="资产名称" ></el-table-column>
          <el-table-column align="center" prop="AssetsNo" label="资产编号" width="150"></el-table-column>
          <el-table-column align="center" prop="Spec" label="规格" ></el-table-column>
          <el-table-column align="center" prop="Model" label="型号" ></el-table-column>
          <el-table-column align="center" prop="Unit" label="单位" ></el-table-column>
          <el-table-column align="center" prop="Price" label="单价" ></el-table-column>
          <el-table-column align="center" label="操作" >
            <template slot-scope="scope">
              <el-button type="text" size="small" class="operationTtn" @click="addMX(scope.row)">
                <span>添加</span>
              </el-button>
            </template>
          </el-table-column>
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
import chooseStaff from "@/components/chooseStaff.vue"
import moment from 'moment'
// import { delete } from 'vue/types/umd';

export default {
  name: "addretire",
  data() {
    return {
      // stuffId:this.form.StaffId+"",
      YGid:"",
      show: false,
      showMX: false,
      form: {DepartmentName:'',VoucherName:''},
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
        Remark:[{ required: true, message: '请输入申领原因', trigger: 'blur' }],
        CollectDate:[{ required: true, message: '请输入申请日期', trigger: 'change' }],
        Department:[{ required: true, message: '请输入申请部门', trigger: 'change' }],
        StaffId:[{ required: true, message: '请输入申请人', trigger: 'change' }],
        Voucher:[{ required: true, message: '请输入制单人员', trigger: 'change' }],
        VoucherTime:[{ required: true, message: '请输入制单时间', trigger: 'change' }]
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
         this.MRdata()
    },
    seeData(newVal, oldVal){
      console.log(newVal)
      //  this.form.VoucherTime = moment(date).format('YYYY-MM-DD  HH:mm:ss')
      // this.form.StaffId=newVal.StaffId
      // this.form.Remark=newVal.Remark
      // this.form.Department=newVal.Department
      // this.form.DepartmentName=newVal.DepartmentName
      // this.form.CollectDate=newVal.CollectDate
      // this.form.VoucherTime=newVal.VoucherTime
      // this.form.Voucher=newVal.Voucher  
      // this.form.VoucherName =newVal.VoucherName
      // this.form.CollectNo=newVal.CollectNo 
      this.form={...newVal}
      this.newTableData=newVal.AssetColleInfos
      this.YGid=newVal.StaffId
    },
    AssetsDetailGetList(newVal, oldVal){
      this.zcmx=newVal.ReturnData.Data
      this.total=newVal.ReturnData.DataCount
    }
  },
  components: {
    chooseStaff
  },
  created(){
  },
  methods: {
    //默认
    MRdata(){
      let date = new Date()
      this.form.VoucherTime=moment(date).format('YYYY-MM-DD  HH:mm:ss'),
      this.form.Voucher=JSON.parse(sessionStorage.getItem("UserDetial")).Id
      this.form.VoucherName=JSON.parse(sessionStorage.getItem("UserDetial")).Name
    },
      //获取员工Id
    getToId(val) {
      this.form.StaffId = val.keyId*1
      this.form.Department=val.OrganizationId*1
      this.form.Departmentname=val.OrganizationName
    },
    //新增明细分页
    current_change(currentPage){
      this.currentPage=currentPage
    },
    //新增明细
    addMX(item) {
      // console.log(item);
      item.AssetsId = item.Id;
      this.newTableData.push(item);
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
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
       this.$refs.form.clearValidate()
      this.form={}
      this.newTableData=[]
    },

    submitData(formName) {
       if(this.newTableData==""||!this.newTableData){
        this.$message.error('请添加申领资产明细')
        return
      }
      if(!this.form.StaffId){
        this.$message.error('请添加领用员工')
        return
      }
     
       if(!this.form.CollectDate){
        this.$message.error('请添加领用')
        return
      }
      for( let i=0;i<this.newTableData.length;i++){
            if(this.newTableData[i].Num==""||!this.newTableData[i].Num){
        this.$message.error('请输入申领数量')
        return
      }
      }
       this.$refs[formName].validate((valid) => {
          if (valid) {            
      let arr=[]
       for(let i=0;i<this.newTableData.length;i++){
         arr.push({AssetsId:1,Num:'1'})
         
       }
       
          for (let i=0;i<this.newTableData.length;i++){
               arr[i].AssetsId=this.newTableData[i].AssetsId
               arr[i].Num=this.newTableData[i].Num        
         
       }
     
      let adddata={...this.form,AssetColleInfos:arr}
      this.$emit("addMateria", adddata);
       this.$refs.form.resetFields();
          } else {
          
            return false;
          }
        });
     
    },
  },
};
</script>
<style scoped lang='less'>
/deep/.chooseStaff{
 margin-top: -.5rem;
 width: 250px !important;
}
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