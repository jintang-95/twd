    <template>
  <el-dialog
    @close="cancelSubmit"
    :title="type == 1 ? '新增盘点调整单' : type == '2' ? '编辑盘点调整单' : '查看盘点调整单'"
    :visible.sync="show"
    width="897px"
  >
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
        class="formContainer"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据编号" prop="No" v-if='showNo' label-position="left">
              <el-input v-model="form.No" :disabled="true" placeholder="请输入单据编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属计划" prop="InventoryPlanId" label-width="100px" label-position="left">
              <el-select
                v-model="form.InventoryPlanId"
                @change="selectChange"
                :disabled="type == 3"
                filterable
                placeholder="请选择所属计划"
              >
                <el-option
                  v-for="(item, index) in planList"
                  :label="item.Name"
                  :key="index"
                  :value="item.Id"
                >{{item.Name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="AdjustmentTotal" label="盘盈总数量" label-position="left">
              <el-input
                v-model="form.AdjustmentInfo.AdjustmentTotal"
                readonly
                :disabled="type != 1"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘盈总价值" prop="AdjustmentAmount" label-width="100px" label-position="left">
              <el-input
                v-model="form.AdjustmentInfo.AdjustmentAmount"
                readonly
                :disabled="type != 1"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="盘亏总数量" prop="LossTotal" label-position="left">
              <el-input
                v-model="form.AdjustmentInfo.LossTotal"
                readonly
                :disabled="type != 1"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘亏总价值" prop="LossAmount" label-width="100px" label-position="left">
              <el-input
                v-model="form.AdjustmentInfo.LossAmount"
                readonly
                :disabled="type != 1"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="盈亏总数量" prop="SurplusTotal" label-position="left">
              <el-input
                v-model="form.AdjustmentInfo.SurplusTotal"
                readonly
                :disabled="type != 1"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盈亏总价值" prop="SurplusAmount" label-width="100px" label-position="left">
              <el-input
                v-model="form.AdjustmentInfo.SurplusAmount"
                readonly
                :disabled="type != 1"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                type="textarea"
                :disabled="type == 3"
                v-model="form.Remark"
                placeholder="请输入分类描述"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tabs">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="| 调整明细" name="inventory">
            <div class="replaceList">
              <table-cmp
                style="width:100%"
                class="table_cmp"
                :loading="false"
                :table-data="form.AdjustmentDetail"
                height="266"
                :table-label="inventoryLabel"
              ></table-cmp>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        align="right"
        class="pagination"
      ></el-pagination>
    </div>
    <span slot="footer" class="dialog-footer" style="  margin-left: 25.6rem;">
      <button
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:#fff;line-height: 16px; color:#5C87A4;"
        @click="cancelSubmit"
        v-if="type != 3"
      >取 消</button>
      <button
        style="outline: none;width:86px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
        plain
        @click="saveAsDraft"
        v-if="type != 3"
      >保存为草稿</button>
      <button
        style="outline: none;width:64px;text-align: center; border: 1px solid #D1DDF5;
height:32px;font-size:14px;background:rgba(0,96,160,1);line-height: 16px; color:#fff;"
        @click="submitData"
      >确 定</button>
    </span>
  </el-dialog>
</template>
    <script>
import Detail from "./detail.vue";
import { mapGetters } from "vuex";
export default {
  name: "addAdapter",
  data() {
    return {
      rules: {
          No: [
            { required: true, message: '请输入单据编号', trigger: 'blur' },
          ],
          InventoryPlanId: [
            { required: true, message: '请选择所属计划', trigger: 'blur' },
          ],
          AdjustmentTotal: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          AdjustmentAmount: [
            { required: true, message: '请输入数量', trigger: 'blur' },
          ],
          LossTotal: [
            { required: true, message: '请输入数量', trigger: 'blur' },
          ]
          ,
          LossAmount: [
            { required: true, message: '请输入', trigger: 'blur' },
          ]
          ,
          SurplusTotal: [
            { required: true, message: '请输入', trigger: 'blur' },
          ]
          ,
          SurplusAmount: [
            { required: true, message: '请输入', trigger: 'blur' },
          ]
          },
      activeName: "inventory",
      show: false,
      showMask: false,
      maskData: {},
      formType: "1",
      currentIndex: "",
      currentPage: 1,
      currentId: "",
      total: 0,
      page: 1,
      pageSize: 5,
      form: {
        // No: '',
        // Name: '',
        // StartMode: '',
        // ResponsibleDept: '',
        // Responsibler: '',
        // WarehouseId: '',
        // StartDate: '',
        // EndDate: '',
        // Remark: '',
        // JobsId: '',
        // InventoryPlanDetail: []
      },
      inventoryLabel: [
        {
          label: "物料编码",
          param: "MaterielNo",
          align: "center",
          sortable: false,
        },
        {
          label: "物料名称",
          param: "MaterielName",
          align: "center",
          sortable: false,
        },
        { label: "生产批次", param: "Batch", align: "center", sortable: false },
        {
          label: "所属仓库",
          param: "WareHouseName",
          align: "center",
          sortable: false,
        },
        { label: "单价", param: "Price", align: "center", sortable: false },
        {
          label: "盈亏数量",
          param: "Number",
          align: "center",
          sortable: false,
        },
        { label: "调整数量", param: "Diff", align: "center", sortable: false },
        { label: "单位", param: "UnitName", align: "center", sortable: false },
      ],
      jobList: [],
      organList: [],
      staffList: [],
      planList: [],
      shelevsList: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    showNo:{
      type:Boolean,
      default:false
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
    ...mapGetters(["GetInventoryPlans", "GetInventoryInfoById"]),
  },
  watch: {
    GetInventoryPlans(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.planList = newVal.ReturnData.Data;
        console.log(this.form);
      }
    },
    GetInventoryInfoById(newVal, oldVal) {
      if (newVal.Code == 0) {
        this.form.AdjustmentDetail = newVal.ReturnData.Data;
        this.total = newVal.ReturnData.DataCount;
        this.form.AdjustmentInfo = newVal.ReturnData.AdjustmentInfo;
        console.log(this.form);
      }
    },
    visible(newVal, oldVal) {
      this.show = newVal;
      if (this.show) {
        this.getPlanList();
      }
    },
    formData(newVal, oldVal) {
      this.form = newVal;
    },
  },
  created() {
    this.form = this.formData;
  },
  methods: {
    handleCurrentChange(page) {
      this.CurrentPage = page;
      this.getDetailById(this.currentId);
    },
    handlePrevClick(page) {
      this.CurrentPage = page;
      this.getDetailById(this.currentId);
    },
    handleNextClick(page) {
      this.CurrentPage = page;
      this.getDetailById(this.currentId);
    },
    getPlanList() {
      let json = {
        MN: "GetInventoryPlans",
        SN: "Inventory",
        DataContent: {
          Id: "",
          Status: "",
          KeyWord: "",
          PageSize: this.pageSize,
          PageIndex: this.page,
          TableType: "0",
        },
      };
      this.MIX_send(json);
    },
    getDetailById(Id) {
      this.currentId = Id;
      let json = {
        MN: "GetInventoryInfoById",
        SN: "Inventory",
        DataContent: {
          Id: Id,
          PageSize: 999,
          PageIndex: 1,
        },
      };
      this.MIX_send(json);
    },
    selectChange(Id) {
      this.getDetailById(Id);
    },
    submitData() {
      if (this.type == 3) {
        this.cancelSubmit();
        return;
      }
      let form = {
        No: this.form.No,
        InventoryPlanId: this.form.InventoryPlanId,
        Remark: this.form.Remark,
        TableType: "0",
        //    "AdjustmentDetail": this.form.AdjustmentDetail
      };
      if (this.form.Id !== "") {
        form.Id = this.form.Id;
      }
      this.$emit("addMateria", form);
    },
    saveAsDraft() {
      let form = {
        Status: 0,
        No: this.form.No,
        InventoryPlanId: this.form.InventoryPlanId,
        Remark: this.form.Remark,
        TableType: "0",
        //    "AdjustmentDetail": this.form.AdjustmentDetail
      };
      if (this.form.Id !== "") {
        form.Id = this.form.Id;
      }
      console.log(form);
      this.$emit("addMateria", form);
    },
    cancelSubmit() {
      this.$emit("closeMask", false);
    },
  },
  components: {},
};
</script>
    <style scoped lang="less">
.el-row {
  width: 100% !important;
}
.el-input {
  width: 100% !important;
}
.el-select {
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
    <style lang="">
.table_cmp .el-table__body-wrapper {
  overflow-y: scroll !important;
}
</style>