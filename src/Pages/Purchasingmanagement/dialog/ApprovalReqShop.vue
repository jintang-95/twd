<!-- 审批请购单弹窗 -->
<template>
    <el-dialog  :visible.sync="dialogFormVisible" center width="900px" @close = 'cancel'>
      <div class="titleName">请购单审批</div>
      <div class="line"></div>
      <el-form label-width="auto" label-position="left" v-model="formone">
          <el-row>
          <el-col :span="8">
            <el-form-item label="申请部门:">
                <el-input placeholder="请输入内容" v-model="formone.Department" :disabled="InputDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前岗位:">
              <el-input placeholder="请输入内容" v-model="formone.Jobs" :disabled="InputDisabled"></el-input>
              <!-- <span style="color:rgba(121, 139, 151, .8);font-size:15px;">{{formone.Jobs}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人:">
              <el-input placeholder="请输入内容" v-model="formone.ApplyPeople" :disabled="InputDisabled"></el-input>
              <!-- <span style="color:rgba(121, 139, 151, .8);font-size:15px;">{{formone.ApplyPeople}}</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请部门:">
                <el-input placeholder="请输入内容" v-model="formone.Department" :disabled="InputDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前岗位:">
              <el-input placeholder="请输入内容" v-model="formone.Jobs" :disabled="InputDisabled"></el-input>
              <!-- <span style="color:rgba(121, 139, 151, .8);font-size:15px;">{{formone.Jobs}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人:">
              <el-input placeholder="请输入内容" v-model="formone.ApplyPeople" :disabled="InputDisabled"></el-input>
              <!-- <span style="color:rgba(121, 139, 151, .8);font-size:15px;">{{formone.ApplyPeople}}</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="申请原因:">
               <el-input v-model="formone.Why" type="textarea" disabled="false"  placeholder="请输入申请调动的原因"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请时间:">
              <el-date-picker
              v-model="date1"
              type="datetime"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请购类型:">
              <el-select placeholder="请选择类型:" v-model="selectValue"  style="width:100%;">
                <el-option
                  v-for="item in Typedata"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="申请原因:">
          <el-input v-model="formone.Why" type="textarea"  placeholder="请输入申请调动的原因"></el-input>
        </el-form-item>
      </el-form>
      <div class="addIcon">
          <label>购买明细</label>
        </div>
      <div class="foottable">
        
            <div class="tablecontent">
              <el-table
                :data="Formtable"
                :header-cell-style="{background:'rgba(240, 247, 251, 1)'}"
                show-overflow-tooltip
                style="width:100%"
                max-height="200px"
              >
                <el-table-column
                  v-for="(item,index) in Formtabletitle"
                  :key="index"
                  :prop="item.tableprop"
                  :label="item.name"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </div>
      </div>





      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="commit">
          提交
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
  return {
        contentData:{
          contentDataTop:[
            {lable:'计划编号',content:'00165'},
            {lable:'计划名称',content:'MBI'},
            {lable:'启动方式',content:'对对对'},
            {lable:'负责部门',content:'人事部'},
            {lable:'负责岗位',content:'前端开发'},
            {lable:'负责人',content:'张三'},
            {lable:'盘点部门',content:'开发部'},
            {lable:'开始时间',content:'2020/06/05 08:54:26'},
            {lable:'结束时间',content:'2020/06/05 08:54:26'}
          ],
          cotentDataDescribe:{lable:'盘点部门',content:'本周需要完成的计划任务，请大家准时按照要求严格执行，本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行，本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行，本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行，本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行，本周需要完成的计划任务，请大家准时按照要求严格执行本周需要完成的计划任务，请大家准时按照要求严格执行'}
        },
        date1:'',
        dialogFormVisible: true,
        formone:{},
        InputDisabled:true,
        selectValue:'',
        Formtable:[],
        Formtabletitle: [//新增请购单弹出框表格表头死数据
            { name: "物料编码", tableprop: "Materialcode" },
            { name: "物料名称", tableprop: "Materialname" },
            { name: "规格", tableprop: "Specifications" },
            { name: "型号", tableprop: "Model" },
            { name: "数量", tableprop: "Number" },
            { name: "单位", tableprop: "Unit" }
        ],
        Typedata: [//新增请购单下拉请购类型死数据
            { Id: "1", Name: "项目需求" },
            { Id: "2", Name: "工作需要" },
            { Id: "3", Name: "材料损坏" }
        ],
        dialogStatus: '待我审批',
        center:true,
        textMap: {
          update: '请购单审批',
          create: '我审批的'
        }
      }
  },
  created() {
    },
  watch: {
   
  },
  methods: {
    cancel() {
      this.dialogFormVisible = false
    },
    commit() {
      this.dialogFormVisible = false
    //   this.$refs.ruleForm.validate((valid) => {
    //       if (valid) {
    //         let obj = {
    //               "MN":"SaveOrganization",
    //               "RequestId":1,
    //               "UserId":1,
    //               "DataContent":this.form
    //              }
    //         this.MIX_send(obj);
    //       } else {
    //         return false;
    //       }
    //     });
    }
  }
}
</script>

<style lang="less" scoped>
.titleName{
  font-size: 20px;
  color: rgba(77, 100, 116, 1);
  font-weight: 600;
  display: block;
  margin-bottom: 20px;
  margin-top: -35px;
}
.line{
  width: 100%;
  height: 1px;
  background-color: #e9e9e9;
  margin-bottom: 20px;
}
.addIcon{
  width: 100%;
  height: 74px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span{
    display:inline-block;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 96, 160, 1);
    border-radius: 5px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
  label{
    font-size: 20px;
    color: rgba(77, 100, 116, 1);
    font-weight: 600;
  }
  label::before{
    content: "";
    height: 20px;
    display: inline-block;
    background-color: rgba(0, 96, 160, 1);
    width: 4px;
    margin-right: 5px;
    position: relative;
    top: 3px;

  }
}
</style>