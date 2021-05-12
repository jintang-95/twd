<template>
  <div>
    <el-dialog
      @close="cancelSubmit"
      :title="type == 1 ? '新增资产报废' : type==2?'编辑资产报废':type==3?'查看资产报废':'审核资产报废'"
      :visible.sync="show"
      width="1050px"
      center
      style="border-radius:'10px'"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="报废单号" label-position="left">
              <el-input v-model="form.ScrapNo" placeholder="请输入报废单号"   disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                placeholder="选择申请日期"
                value-format="yyyy-MM-dd"
                v-show="type==1||type==2"
              ></el-date-picker>
              <el-input v-model="form.applyDate"  v-show="type==3" disabled></el-input>
              <el-input v-model="form.applyDate"  v-show="type==4" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人" label-position="left">
              <!-- <el-input v-model="form.Agent" placeholder="请输入经办人" v-show="type==1||type==2"></el-input> -->
              <el-input v-model="form.Agent" placeholder="请输入经办人"  disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-form-item label="报废原因">
            <el-input v-model="form.Remarks" type="textarea" placeholder="请输入报废原因" disabled v-show="type==3"></el-input>
            <el-input v-model="form.Remarks" type="textarea" placeholder="请输入报废原因" disabled v-show="type==4"></el-input>
          </el-form-item>
        </el-row>
        <el-row :span="20" >
          <el-col :span="10">
            <el-form-item label="审批意见" label-position="left">
              <el-radio-group v-model="form.jl" v-show="type==4">
                <el-radio :label="3">通过</el-radio>
                <el-radio :label="6">不通过</el-radio>
                <el-radio :label="9">打回修改</el-radio>
              </el-radio-group>
              <el-radio-group v-model="form.jl" v-show="type==3">
                <el-radio :label="3" disabled>通过</el-radio>
                <el-radio :label="6" disabled>不通过</el-radio>
                <el-radio :label="9" disabled>打回修改</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">
              <el-date-picker
                v-show="type==4"
                v-model="form.shdate"
                type="date"
                placeholder="选择申请日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
              <el-input v-model="form.shdate"  v-show="type==3" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-form-item label="审核意见">
            <el-input v-model="form.yj" type="textarea" placeholder="请输入审核意见"  v-show="type==4"></el-input>
            <el-input v-model="form.yj" type="textarea" placeholder="请输入审核意见" disabled v-show="type==3"></el-input>
          </el-form-item>
        </el-row>
        <el-row :span="20">
            <el-tabs type="card">
              <el-tab-pane label="资产明细">
                <el-table :data="newTableData" style="width: 100%" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
                  <!-- <el-table-column align="center" prop="MaterielId" label="资产ID" width="100"></el-table-column> -->
                  <el-table-column align="center" prop="Name" label="资产名称" width="100"></el-table-column>
                  <el-table-column align="center" prop="AssetsNo" label="资产编号" width="150"></el-table-column>
                  <el-table-column align="center" prop="Spec" label="规格" width="100"></el-table-column>
                  <el-table-column align="center" prop="Model" label="型号" width="100"></el-table-column>
                  <el-table-column align="center" prop="Unit" label="单位" width="100"></el-table-column>
                  <el-table-column align="center" prop="Price" label="单价" width="100"></el-table-column>
                  <el-table-column align="center" prop="BuyNum" label="库存" width="100"></el-table-column>
                  <el-table-column align="center" prop="Num" label="报废数量" width="100"  v-if="type==2||type==1">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="Num" label="报废数量" width="100"  v-if="type==3">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" disabled></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="100" v-if="type==1||type==2">
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
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="type==4">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
       <span slot="footer" class="dialog-footer" v-if="type==3">
        <el-button type="primary" @click="cancelSubmit">关闭</el-button>
      </span>
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
      form: {jl:0},
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
      this.form.Agent=newVal.Agent
      this.form.Remarks=newVal.Remarks
      this.form.ScrapNo=newVal.ScrapNo
      this.form.applyDate=newVal.applyDate
      this.newTableData=newVal.AssetScrapInfos
    },
    AssetsDetailGetList(newVal, oldVal){
      this.zcmx=newVal.ReturnData.Data
      this.total=newVal.ReturnData.DataCount
    }
  },
  methods: {
    //新增明细
    addMX(item) {
      // console.log(item);
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
      console.log(data);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
      this.form={}
      this.newTableData=[]
    },

    submitData() {
      // console.log(this.form);
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
      this.$emit("addMateria", adddata);
      this.form={}
      this.newTableData=[]
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