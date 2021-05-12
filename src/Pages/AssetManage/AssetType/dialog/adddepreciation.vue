<template>
<div>
  <el-dialog
    custom-class="classdialog"
    @close="cancelSubmit"
    title="编辑档案+新增资产折旧"
    :visible.sync="show"
    width="950px"
  >
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        class="formContainer"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="资产编号" label-width="100px" label-position="left">
              <el-input v-model="form.AssetsNo" placeholder="请输入资产编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产名称" label-width="100px" label-position="left">
              <el-input v-model="form.Name" placeholder="请输入资产名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产单位" label-width="100px" label-position="left">
              <el-input v-model="form.Unit" placeholder="请输入资产单位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属物料" label-position="left" label-width="100px" prop="MaterielName">
              <el-input v-model="form.MaterielName" placeholder="请输入物料"  @focus="focusfns"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人" label-position="left" label-width="100px">
              <el-input v-model="form.BuyUser" placeholder="请输入经办人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="增长数量" label-position="left" label-width="100px">
              <el-input v-model="form.BuyNum" placeholder="请输入增长数量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="初始价值" label-position="left" label-width="100px">
              <el-input-number v-model="form.Price" placeholder="请输入初始价值" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="折旧方式" label-position="left" label-width="100px">
              <!-- <el-input v-model="form.depreciationType" placeholder="请输入折旧方式"></el-input> -->
              <el-select v-model="form.depreciationType" placeholder="请选择折旧方式">
                <el-option
                  v-for="item in depreciationType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="残值率" label-position="left" label-width="100px">
              <el-input v-model="form.ratio" placeholder="请输入残值率"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="残值" label-position="left" label-width="100px">
              <el-input-number v-model="form.ResidualValue" placeholder="请输入残值" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="资产状态" label-position="left" label-width="100px">
              <el-input v-model="form.Status" placeholder="请输入资产状态"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="8">
            <el-form-item label="规格" label-width="100px" label-position="left">
              <el-input v-model="form.Spec" placeholder="请输入规格"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="增加日期" label-width="100px">
              <el-date-picker
                v-model="form.BuyDate"
                type="date"
                placeholder="选择增加日期"
                value-format="yyyy-MM-dd"
                style='width: 190px'
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="创建人" label-position="left" label-width="100px">
              <el-input-number v-model="form.CreatedUser" placeholder="请输入创建人" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="增加方式" label-width="100px">
              <el-select v-model="form.Addtype" placeholder="请选择增加方式">
                <el-option
                  v-for="(item, index) in addway"
                  :label="item.TypeName"
                  :key="index"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属分类" label-width="100px">
              <el-cascader
                :options="treeData"
                :props="optionProps"
                clearable
                filterable
                style="width:190px;"
                v-model="form.AssetsType"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="资产描述" label-position="left" label-width="100px">
              <el-input v-model="form.Desc" placeholder="请输入资产描述" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row :span="20">
          <el-col :span="23">
            <el-tabs type="card">
              <el-tab-pane label="资产折旧明细">
                <el-table :data="newTableData" style="width: 100%" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
                  <!-- <el-table-column align="center" prop="MaterielId" label="资产ID" width="100"></el-table-column> -->
                  <el-table-column align="center" prop="ratio" label="折旧比例" ></el-table-column>
                  <el-table-column align="center" prop="Dprice" label="折旧金额" ></el-table-column>
                  <el-table-column align="center" prop="Cumulative" label="累计折旧" ></el-table-column>
                  <el-table-column align="center" prop="OutputValue" label="资金残值" ></el-table-column>
                  <!-- <el-table-column align="center" prop="CreateUser" label="创建人" ></el-table-column>
                  <el-table-column align="center" prop="CreatedTime" label="创建时间" ></el-table-column> -->
                  <el-table-column align="center" label="操作" width="100" >
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
            <el-button size="mini" style="background:#0060A0" @click="openMX" >
              <i class="el-icon-plus" style="color:#fff"></i>
            </el-button>
          </el-col>
        </el-row>
    <span slot="footer" class="dialog-footer" >
      <el-button @click="cancelSubmit" type="info">取 消</el-button>
      <el-button @click="submitData('form')" type="primary">确 定</el-button>
    </span>
  </el-dialog>
   <el-dialog title="新增资产折旧明细" :visible.sync="showMX" width="30%"  >
            <el-form ref="zjdata" :rules="rules"  :model="zjdata" label-width="80px" :header-cell-style="{background:'rgba(240, 247, 251, 1)'}">
              <el-form-item label="折旧比例" label-position="left" prop="ratio">
                <el-input-number v-model="zjdata.ratio" placeholder="请输入折旧比例" :controls="false"></el-input-number>
              </el-form-item>
              <el-form-item label="折旧金额" prop="Dprice">
                <el-input-number  v-model="zjdata.Dprice" placeholder="请输入折旧金额" :controls="false"></el-input-number>
              </el-form-item>
              <el-form-item label="累计折旧" label-position="left" prop="Cumulative">
                <el-input-number v-model="zjdata.Cumulative" placeholder="请输入累计折旧" :controls="false"></el-input-number>
              </el-form-item>
              <el-form-item label="资产残值" prop="OutputValue">
                <el-input-number  v-model="zjdata.OutputValue" placeholder="请输入资产残值" :controls="false"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="创建人" prop="CreateUser">
                <el-input-number  v-model="zjdata.CreateUser" placeholder="请输入创建人" :controls="false"></el-input-number>
              </el-form-item>
              <el-form-item label="创建时间" label-position="left"  prop="CreatedTime" required>
                <el-date-picker
                  v-model="zjdata.CreatedTime"
                  type="datetime"
                  placeholder="选择创建时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
            </el-form-item> -->
            </el-form>
            
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMX = false">取 消</el-button>
        <el-button type="primary" @click="indata">确 定</el-button>
      </span>
    </el-dialog>
    <replace-table
      :selectOptionList="selectOptionList"
      :visible="showReplace"
      :typeNum="1"
      :check="2"
      :title='title'
      :typeList="wltree"
      :showType="false"
      @closePropMask="closePropMask"
      @PopFormInit01="PopFormInit01"
      @addMaterielTable="addTable"
      @addCheck="addCheck"
    ></replace-table>
  </div>
</template>

<script>
import replaceTable from "@/components/replaceTable.vue";
import { mapGetters } from "vuex";
export default {
  name: "adddepreciation",
  data() {
    return {
      showReplace:false,
       title:'资产分类',
        wltree:[],
       selectOptionList:[
        {
          title: "全部状态",
          statu: -1,
        },
        {
          title: "启用",
          statu: 2,
        },
        {
          title: "停用",
          statu: 3,
        },
      ],
      newTableData: [],
      formType: "1",
      show: false,
      showMX:false,
      form: {},
      zjdata:{},
      depreciationType: [
        {
          label: "按年折旧",
          value: 2,
        },
        {
          label: "按月折旧",
          value: 1,
        }
      ],
      rules:{
          ratio:[ { required: true, message: '请输入折旧比例', trigger: 'blur' },
                  { type: 'number', message: '折旧比例为数字值'}
          ],
           Dprice:[ { required: true, message: '请输入折旧金额', trigger: 'blur' },
                  { type: 'number', message: '折旧金额为数字值'}
          ],
           Cumulative:[ { required: true, message: '请输入累计折旧', trigger: 'blur' },
                  { type: 'number', message: '累计折旧为数字值'}
          ],
           OutputValue:[ { required: true, message: '请输入累计折旧', trigger: 'blur' },
                  { type: 'number', message: '累计折旧为数字值'}
          ],
           ratio:[ { required: true, message: '请输入折旧比例', trigger: 'blur' },
                  { type: 'number', message: '折旧比例为数字值'}
          ],
          CreatedTime:[  { type: 'date',required: true, message: '请选择创建时间', trigger: 'blur' },],
          CreateUser:[ { required: true, message: '请输入创建人', trigger: 'blur' },],        
    },
      optionProps: {
        value: "Id",
        label: "Name",
        children: "Children",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath:false
      },
    };
  },
  props: {
    addway: {
      type: Array,
      default() {
        return [];
      },
    },
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    showZJ:{
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "1",
    },
    typeList: {
      type: Array,
      default() {
        return [];
      },
    },
    editformData: {
      type: Object,
      default() {
        return {};
      },
    },
    brands: {
      type: Array,
      default() {
        return [];
      },
    },
    manageStyle: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters([
      "GetMaterielCategoryTree"//物料树
    ]),
  },
  watch: {
   //物料树
   GetMaterielCategoryTree(newVal,oldVal){
      this.wltree=newVal.ReturnData

    },
    showZJ(newVal, oldVal) {
      this.show = newVal;
    },
    editformData(newVal, oldVal) {
      this.form = newVal;
      this.form.AssetsType=newVal.AssetsType
      this.form.Addtype=newVal.Addtype+""
      this.newTableData=newVal.AssetDepreciationLogs
      console.log(this.newTableData)
      console.log(this.form)
    }
  },
  methods: {
    //请求物料树
     gettree(){
      let json = {
        SN: "Materiel",
        MN: "GetMaterielCategoryTree",
        DataContent: {
          // "IsAssets": '1'
          SType:'1'
        },
      };
      this.MIX_send(json);
    },
    //物料弹窗
     focusfns(){
    this.showReplace=true
    },
      //替代件
    AddMateriels() {
      this.PopFormInit01();
    },
    PopFormInit01() {
      this.showReplace = false;
    },
    closePropMask(data) {
      this.showReplace = false;
    },
    addTable(row) {
      this.form.MaterielId=row.Id;
    },
    addCheck(val) {
      this.form.ReplaceMaterielDetail = val;
    },
    //
    openMX(){
      this.showMX=true
    },
    indata(){
      this.newTableData.push(this.zjdata)
      this.zjdata={}
      this.showMX=false
    },
    addZJ(){

    },
    RemoveMateriels(val) {
      for (let index = 0; index < this.newTableData.length; index++) {
        const element = this.newTableData[index];
        if (element.Name == val.Name) {
          this.newTableData.splice(index, 1);
        }
      }
    },
  
    selectChange(Id) {
      let Name = "";
      this.supplierList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.DefaultSupplierName = Name;
      this.form.DefaultSupplierId = Id;
    },

    dataSubmit(data) {
      if (this.currentIndex === "") {
        this.form.ReplaceMaterielDetail.push(data);
      } else {
        this.form.ReplaceMaterielDetail[this.currentIndex] = data;
        this.currentIndex = "";
      }
      this.maskData = {};
      this.showReplace = false;
    },

    handleClick(data) {},
    cancelSubmit() {
      this.$emit("closeZJ", false);
       this.$refs.form.clearValidate()
       this.form={}
      // this.form
    },
    submitData(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let addZJdata={...this.form,AssetDepreciationLogs:this.newTableData}
      this.$emit("addZJPush", addZJdata);
       this.$refs.form.resetFields();
      this.form = {}
      this.newTableData=[]
          } else {
           
            return false;
          }
        });
     
    },
  },
  components: {
    replaceTable,
  },
  created() {
    this.gettree()
  },
};
</script>
<style scoped lang="less">
.formContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-row {
  width: 100% !important;
}
.replaceList {
  width: 100%;
  height: 166px;
}
.imgList {
  width: 100%;
  height: 166px;
}
.Unit {
  width: 100px !important;
  margin-left: 10px !important;
}

</style>
<style >

.FormItem .el-form-item__content {
  display: flex !important;
}
.el-input__inner {
  padding-left: 10px;
}
button:hover {
  cursor: pointer;
}

</style>