<template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增盘点计划' : type == '2' ? '编辑盘点计划' : '查看盘点计划'"
    :visible.sync="show"
    width="897px"
  >
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left" class="formContainer">
        <el-row :gutter="20">
          <el-col :span="8">
            <!-- <el-form-item label="计划编号"  prop="No" label-position="left">
              <el-input v-model="form.No" :disabled="type == 3" placeholder="请输入计划编号"></el-input>
            </el-form-item> -->
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划名称" prop="Name" label-width="100px" label-position="left">
              <el-input v-model="form.Name" :disabled="type == 3" placeholder="请输入计划名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启动方式" prop="StartMode" label-width="100px">
              <el-select v-model="form.StartMode" placeholder="请选择启动方式" :disabled="type == 3">
                <el-option
                  v-for="(item, index) in list"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="负责部门" prop="ResponsibleDeptName" label-width="100px" label-position="left">
              <el-select
                v-model="form.ResponsibleDeptName"
                @change="deptChange"
                :disabled="type == 3"
                filterable
                remote
                :remote-method="getOrganList"
                placeholder="请输入负责部门搜索"
              >
                <el-option
                  v-for="(item, index) in organList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责岗位" prop="JobsName" label-width="100px">
              <el-select
                v-model="form.JobsName"
                @change="jobChange"
                :disabled="type == 3"
                filterable
                remote
                :remote-method="getJobList"
                placeholder="请输入负责岗位搜索"
              >
                <el-option
                  v-for="(item, index) in jobList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人"  label-width="100px">
              <chooseStaff class="chooseStaff" :isCustomer="true" :isMultipleChoice="false" @getToFather="getToId"></chooseStaff>
              <!-- <el-select
                v-model="form.ResponsiblerName"
                @change="selectChange"
                :disabled="type == 3"
                filterable
                remote
                :remote-method="getResponsiblerList"
                placeholder="请输入负责人姓名搜索"
              >
                <el-option
                  v-for="(item, index) in staffList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="盘点仓库" prop="WarehouseId" label-width="100px">
              <!-- <el-select v-model="form.WarehouseId" :disabled="type == 3" placeholder="请选择盘点仓库">
                <el-option
                  v-for="(item, index) in list"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select> -->
              <el-cascader
                placeholder="请选择盘点仓库"
                v-model="form.WarehouseId"
                :options="list"
                :props=" {
        value: 'Id',
        label: 'Name',
        children: 'ChildNodes',
        checkStrictly: true,
        expandTrigger: 'hover',
        emitPath:false,
      }"
                filterable
                clearable
                style="width:100%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间" prop="StartDate" label-width="100px">
              <el-date-picker
                :disabled="type == 3"
                v-model="form.StartDate"
                value-format="yyyy/MM/dd hh:mm:ss"
                type="datetime"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="EndDate" label-width="100px">
              <el-date-picker
                :disabled="type == 3"
                v-model="form.EndDate"
                value-format="yyyy/MM/dd hh:mm:ss"
                type="datetime"
                placeholder="选择结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                type="textarea"
                :disabled="type == 3"
                v-model="form.Desc"
                placeholder="请输入分类描述"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tabs">
        <button
          style="float: right;z-index: 100;position: absolute;right: 20px;width:24px;
height:24px; color:#fff;border:none;font-size:13px; outline: none;
background:rgba(0,96,160,1);
border-radius:2px;"
          @click="addNew"
          v-if="type != 3"
        >+</button>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="| 盘点安排" name="inventory">
            <div class="replaceList">
              <table-cmp
                style="width:100%"
                class="table_cmp"
                :loading="false"
                :table-data="form.InventoryPlanDetail"
                height="166"
                :table-label="inventoryLabel"
              ></table-cmp>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" style="  margin-left: 25.6rem;">
      <button style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;" @click="cancelSubmit" v-if="type != 3">取 消</button>
      <button  style="outline: none;width:86px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;" plain @click="saveAsDraft" v-if="type != 3">保存为草稿</button>
      <button  style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;" @click="submitData">确 定</button>
    </span>
    <Arrange
      :visible="showMask"
      :type="formType"
      :allData="form.InventoryPlanDetail"
      :addData="maskData"
      @closePropMask="closePropMask"
      @dataSubmit="dataSubmit"
    ></Arrange>
  </el-dialog>
</template>

<script>
import Arrange from "./arrange.vue";
import chooseStaff from '@/components/myStaff'
var that;
var process = {
  template: `<div>
            <el-button type="text" size="small" @click="edit()">编辑</el-button>
            <el-button type="text" size="small" @click="del()">删除</el-button>
  
  </div>`,
  props: ["row", "keyindex"],
  methods: {
    edit() {
      that.clickEdit(this.row, this.keyindex);
    },
    del() {
      that.clickDel(this.row, this.keyindex);
    },
  },
};
import { mapGetters } from "vuex";
export default {
  name: "plan",
  data() {
    return {
      rules: {
          No: [
            { required: true, message: '请输入计划编号', trigger: 'blur' },
          ],
          Name: [
            { required: true, message: '请输入计划名称', trigger: 'blur' },
          ],
          StartMode: [
            { required: true, message: '请选择启动方式', trigger: 'blur' },
          ],
          ResponsibleDeptName: [
            { required: true, message: '请选择负责部门', trigger: 'blur' },
          ],
          JobsName: [
            { required: true, message: '请选择岗位', trigger: 'blur' },
          ],
          WarehouseId: [
            { required: true, message: '请选择盘点仓库', trigger: 'blur' },
          ],
          StartDate: [
            { required: true, message: '选择开始时间', trigger: 'blur' },
          ],
          EndDate: [
            { required: true, message: '选择结束时间', trigger: 'blur' },
          ],
          },
      activeName: "inventory",
      show: false,
      showMask: false,
      maskData: {},
      formType: "1",
      currentIndex: "",
      form: {
        // No: '',
        // Name: '',
        // StartMode: '',
        // ResponsibleDept: '',
        // Responsibler: '',
        // WarehouseId: '',
        // StartDate: '',
        // EndDate: '',
        // Desc: '',
        // JobsId: '',
        // InventoryPlanDetail: []
      },
      inventoryLabel: [
        { label: "编号", param: "No", align: "center", sortable: false },
        { label: "任务", param: "Name", align: "center", sortable: false },
        {
          label: "负责人",
          param: "ResponsiblerName",
          align: "center",
          sortable: false,
        },
        {
          label: "开始时间",
          param: "StartDate",
          align: "center",
          sortable: false,
        },
        {
          label: "结束时间",
          param: "EndDate",
          align: "center",
          sortable: false,
        },
        { label: "操作", align: "center", width: "200", component: process },
      ],
      jobList: [],
      organList: [],
      staffList: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "1",
    },
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters(["QueryOrganization", "QueryJobs", "QueryStaff"]),
  },
  watch: {
    visible(newVal, oldVal) {
      this.show = newVal;
    },
    formData(newVal, oldVal) {
      this.form = newVal;
    },
    QueryOrganization(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.organList = newVal.ReturnData.Data;
      }
    },
    QueryJobs(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.jobList = newVal.ReturnData.Data;
      }
    },
    QueryStaff(newVal, oldVal) {
      if (newVal.Code === 0) {
        this.staffList = newVal.ReturnData.Data;
      }
    },
    type(newVal, oldVal) {
      let arr = this.inventoryLabel.filter((item) => item.label == "操作");
      if (newVal != "3") {
        if (arr.length == 0) {
          this.inventoryLabel.push({
            label: "操作",
            align: "center",
            width: "200",
            component: process,
          });
        }
      } else {
        if (arr.length != 0) {
          this.inventoryLabel.splice(this.inventoryLabel.length - 1, 1);
        }
      }
    },
  },
  created() {
    that = this;
    this.form = this.formData;
  },
  methods: {
    //获取员工
    getToId(val){
      console.log(val)
      this.form.Responsibler=val.keyId
    },
    deptChange(Id) {
      let Name = "";
      this.organList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.ResponsibleDept = Id;
      this.form.ResponsibleDeptName = Name;
    },
    jobChange(Id) {
      let Name = "";
      this.jobList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      this.form.JobsId = Id;
      this.form.JobsName = Id;
    },
    selectChange(Id) {
      let Name = "";
      this.staffList.map((item) => {
        if (item.Id == Id) {
          Name = item.Name;
        }
      });
      // this.form.Responsibler = Id;
      // console.log(this.form.Id)
      // console.log(this.form.Responsibler)
      this.form.ResponsiblerName = Name;
    },
    submitData() {
      if (this.type == 3) {
        this.cancelSubmit();
        return;
      }
      let form = {
        // No: this.form.No,
        No:"",
        Name: this.form.Name,
        StartMode: 0,
        ResponsibleDept: this.form.ResponsibleDept,
        Responsibler: this.form.Responsibler,
        WarehouseId: this.form.WarehouseId,
        StartDate: this.form.StartDate,
        EndDate: this.form.EndDate,
        Desc: this.form.Desc,
        TableType: "0",
        InventoryPlanDetail: this.form.InventoryPlanDetail,
      };
      if (this.form.Id != "") {
        form.Id = this.form.Id;
      }
      this.$emit("addMateria", form);
    },
    saveAsDraft() {
      let form = {
        Status: 0,
        No: this.form.No,
        Name: this.form.Name,
        StartMode: 0,
        ResponsibleDept: this.form.ResponsibleDept,
        Responsibler: this.form.Responsibler,
        WarehouseId: this.form.WarehouseId,
        StartDate: this.form.StartDate,
        EndDate: this.form.EndDate,
        Desc: this.form.Desc,
        TableType: "0",
        InventoryPlanDetail: this.form.InventoryPlanDetail,
      };
      if (this.form.Id != "") {
        form.Id = this.form.Id;
      }
      this.$emit("addMateria", form);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
    },
    addNew() {
      this.formType = "1";
      this.maskData = {};
      this.showMask = true;
    },
    getResponsiblerList(keyword) {
      let json = {
        MN: "QueryStaff",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "100",
        },
      };
      this.MIX_send(json);
    },
    getOrganList(keyword) {
      let json = {
        MN: "QueryOrganization",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    getJobList(keyword) {
      let json = {
        MN: "QueryJobs",
        SN: "Organization",
        DataContent: {
          KeyWord: keyword,
          PageIndex: "1",
          PageSize: "10",
        },
      };
      this.MIX_send(json);
    },
    closePropMask() {
      this.showMask = false;
    },
    dataSubmit(data) {
      console.log(this.form);
      if (this.formType == "1") {
        this.form.InventoryPlanDetail.push(data);
      } else {
        this.form.InventoryPlanDetail[this.currentIndex] = data;
      }

      this.showMask = false;
    },
    // 表格编辑和假删除
    clickEdit(row, index) {
      this.currentIndex = index;
      this.formType = "2";
      this.maskData = this.form.InventoryPlanDetail[index];
      this.showMask = true;
    },
    clickDel(row, index) {
      this.form.InventoryPlanDetail.splice(index, 1);
    },
  },
  components: {
    Arrange,
    chooseStaff
  },
};
</script>
<style scoped>
.chooseStaff{
 margin-top: -.5rem;
}
/deep/ .selectL .selectL_radious .el-input__inner{
  width: 170px;
}
.el-row {
  width: 100% !important;
}
.el-input {
  width: 100% !important;
}
/deep/ .el-dialog {
  border-radius: 4px;
}
button:hover {
  cursor: pointer;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #4d6474 !important;
}
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border: none;
    color: #4D6474 !important;
}
/deep/ .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:last-child{
    color: #4D6474 !important;
    font-size: 16px;
}
</style>