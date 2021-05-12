<template>
  <div id="returngood">
    <div class="top">
      <el-button type="primary" @click="ClickAdd">新增</el-button>
      <div class="Inputs">
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checkone" @click="Clickone" /> 草稿
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checktwo" @click="Clicktwo" /> 启动
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checkthree" @click="Clickthree" /> 已出库
        </div>
        <div style="margin-right:30px;">
          <input type="checkbox" v-model="Checkfour" @click="Clickfour" /> 已完成
        </div>
        <div class="check" style="margin-right:10px;position:relative">
          <el-input placeholder="请输入搜索关键字" maxlength="15" style="width:330px;" v-model="InputValue"></el-input>
          <i class="iconfont icon-sousuo" @click="ToCheck"></i>
        </div>
        <div>
          <i class="iconfont icon-shuaxin" @click="Toreload"></i>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#F5F5F5'}"
      style="padding-left:20px;padding-right:20px;margin-top:20px;"
      show-overflow-tooltip
    >
      <el-table-column
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.tableprop"
        :label="item.name"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.States == '草稿'"
            @click="handleClickone(scope.row)"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            v-if="scope.row.States == '草稿'"
            @click="handleClicktwo(scope.row)"
            type="text"
            size="small"
          >删除</el-button>
          <el-button
            v-if="scope.row.States == '草稿'"
            @click="handleClickthree(scope.row)"
            type="text"
            size="small"
          >提交</el-button>
          <el-button
            v-if="scope.row.States == '启动'"
            @click="handleClickfour(scope.row)"
            type="text"
            size="small"
          >撤销</el-button>
          <el-button
            v-if="scope.row.States != '草稿'"
            @click="handleClickfive(scope.row)"
            type="text"
            size="small"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="Pages">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="pagesize"
        :pager-count="9"
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="采购退货单" center :visible.sync="dialog" width="1200px">
      <el-form label-width="100px" :model="formone">
        <el-row>
          <el-col :span="6">
            <el-form-item label="退货单号:">
              <el-input v-model="formone.ReturnOrder" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退货时间:">
              <el-input v-model="formone.ReturnTime" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="源单类型:">
              <el-select placeholder="请选择类型:" v-model="formone.SourceType" :disabled="LookType">
                <el-option
                  v-for="item in Typedata"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="源单编号:">
              <el-input v-model="formone.SourceOrder" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商:">
              <el-input v-model="formone.Supplier" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人:">
              <el-input v-model="formone.Contact" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购员:">
              <el-input v-model="formone.PurchasePeople" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="应退金额:">
              <el-input v-model="formone.ShouldBack" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="优惠:">
              <el-input v-model="formone.Preferential" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实退金额:">
              <el-input v-model="formone.ActualBack" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货币:">
              <el-input v-model="formone.Currency" :disabled="LookType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注:">
          <el-input v-model="formone.Note" :disabled="LookType"></el-input>
        </el-form-item>
      </el-form>
      <div class="foottable">
        <div style="position:absolute;top:0;right:0;z-index:99">
          <el-button type="primary" @click="AddTable" :disabled="LookType">新增</el-button>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane label="购买明细">
            <div class="tablecontent">
              <el-table
                :data="Formtable"
                :header-cell-style="{background:'#F5F5F5'}"
                show-overflow-tooltip
                style="width:100%"
                max-height="200"
              >
                <el-table-column
                  v-for="(item,index) in Formtabletitle"
                  :key="index"
                  :prop="item.tableprop"
                  :label="item.name"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="scope">
                    <el-button @click="Clickredact(scope.row)" type="text" size="small" :disabled="LookType">编辑</el-button>
                    <el-button @click="Clickdelete(scope.row)" type="text" size="small" :disabled="LookType">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="text-align:right;margin-top:10px;">
        <el-button type="primary" @click="ClickYes">确定</el-button>
        <el-button @click="Canceltwo">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增表单内表格数据 -->
    <el-dialog title="购买明细" center :visible.sync="dialogtwo" width="30%">
      <el-form label-width="100px" :model="formtwo">
        <el-form-item label="物料名称:">
          <el-select
            style="width:100%"
            v-model="formtwo.name"
            remote
            filterable
            reserve-keyword
            placeholder="请输入物料关键词"
            :disabled="AddType"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价:">
          <el-input v-model="formtwo.price" placeholder="请输入单价" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="数量:">
          <el-input v-model="formtwo.number" placeholder="请输入数量" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="单位:">
          <el-input v-model="formtwo.unit" placeholder="请输入单位" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="金额:">
          <el-input v-model="formtwo.money" placeholder="请输入金额" style="width:100%"></el-input>
        </el-form-item>
        <div style="text-align:right;margin-top:10px;">
          <el-button type="primary" @click="ClickYestwo">确定</el-button>
          <el-button @click="Canclematerial">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ReturnGoods",
  data() {
    return {
      AddType: false,
      LookType: false,
      Checkone: true,
      Checktwo: true,
      Checkthree: true,
      Checkfour: true,
      InputValue: "",
      tableData: [
        {
          States: "草稿",
          ReturnOrder: "PAF111111",
          ReturnTime: "2019-01-01",
          PurchasePeople: "张三",
          Supplier: "新时代电器01",
          SourceType: "采购单",
          SourceOrder: "PAF111",
          Note: "质量问题"
        },
        {
          States: "启动",
          ReturnOrder: "PAF222222",
          ReturnTime: "2019-01-02",
          PurchasePeople: "李四",
          Supplier: "新时代电器02",
          SourceType: "采购单",
          SourceOrder: "PAF222",
          Note: "质量问题"
        },
        {
          States: "已出库",
          ReturnOrder: "PAF333333",
          ReturnTime: "2019-01-03",
          PurchasePeople: "王五",
          Supplier: "新时代电器03",
          SourceType: "采购单",
          SourceOrder: "PAF333",
          Note: "质量问题"
        },
        {
          States: "已完成",
          ReturnOrder: "PAF444444",
          ReturnTime: "2019-01-04",
          PurchasePeople: "谢六",
          Supplier: "新时代电器04",
          SourceType: "采购单",
          SourceOrder: "PAF444",
          Note: "质量问题"
        },
        {
          States: "草稿",
          ReturnOrder: "PAF555555",
          ReturnTime: "2019-01-05",
          PurchasePeople: "李七",
          Supplier: "新时代电器05",
          SourceType: "采购单",
          SourceOrder: "PAF555",
          Note: "质量问题"
        }
      ],
      tableTitle: [
        { name: "状态", tableprop: "States" },
        { name: "退货单号", tableprop: "ReturnOrder" },
        { name: "退货时间", tableprop: "ReturnTime" },
        { name: "采购员", tableprop: "PurchasePeople" },
        { name: "供应商", tableprop: "Supplier" },
        { name: "源单类型", tableprop: "SourceType" },
        { name: "源单号", tableprop: "SourceOrder" },
        { name: "备注", tableprop: "Note" }
      ],
      total: 20,
      pagesize: 10,
      dialog: false,
      formone: {
        ReturnOrder: "",
        ReturnTime: "",
        SourceType: "",
        SourceOrder: "",
        Supplier: "",
        Contact: "",
        PurchasePeople: "",
        ShouldBack: "",
        Preferential: "",
        ActualBack: "",
        Currency: "人民币",
        Note: ""
      },
      Typedata: [
        { Id: "1", Name: "备料计划" },
        { Id: "2", Name: "请购单" },
        { Id: "3", Name: "采购单" },
        { Id: "4", Name: "退货单" }
      ],
      Formtable: [
        {
          Materialcode: "201256",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Price: "1170",
          Number: "9",
          Unit: "个",
          Money: "1170"
        },
        {
          Materialcode: "201256",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Price: "1170",
          Number: "9",
          Unit: "个",
          Money: "1170"
        },
        {
          Materialcode: "201256",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Price: "1170",
          Number: "9",
          Unit: "个",
          Money: "1170"
        },
        {
          Materialcode: "201256",
          Materialname: "蛟龙2号",
          Specifications: "蛟龙64",
          Model: "ik 6400",
          Price: "1170",
          Number: "9",
          Unit: "个",
          Money: "1170"
        }
      ],
      Formtabletitle: [
        { name: "物料编码", tableprop: "Materialcode" },
        { name: "物料名称", tableprop: "Materialname" },
        { name: "规格", tableprop: "Specifications" },
        { name: "型号", tableprop: "Model" },
        { name: "单价", tableprop: "Price" },
        { name: "数量", tableprop: "Number" },
        { name: "单位", tableprop: "Unit" },
        { name: "金额", tableprop: "Money" }
      ],
      dialogtwo: false,
      formtwo: {
        name: "",
        price: "",
        number: "",
        unit: "",
        money: ""
      },
      options: [],
      loading: false
    };
  },
  methods: {
    //点击新增
    ClickAdd() {
      this.dialog = true;
      this.LookType = false;
      this.formone = {
        ReturnOrder: "",
        ReturnTime: "",
        SourceType: "",
        SourceOrder: "",
        Supplier: "",
        Contact: "",
        PurchasePeople: "",
        ShouldBack: "",
        Preferential: "",
        ActualBack: "",
        Currency: "人民币",
        Note: ""
      };
      this.Formtable = [];
    },
    //勾选框
    Clickone() {
      if (this.Checkone) {
        this.Checkone = false;
      } else {
        this.Checkone = true;
      }
    },
    Clicktwo() {
      if (this.Checktwo) {
        this.Checktwo = false;
      } else {
        this.Checktwo = true;
      }
    },
    Clickthree() {
      if (this.Checkthree) {
        this.Checkthree = false;
      } else {
        this.Checkthree = true;
      }
    },
    Clickfour() {
      if (this.Checkfour) {
        this.Checkfour = false;
      } else {
        this.Checkfour = true;
      }
    },
    //搜索关键字
    ToCheck() {},
    //刷新
    Toreload() {
      this.$router.go(0);
    },
    //点击编辑
    handleClickone(r) {
      this.dialog = true;
      this.LookType = false;
      //填充数据
    },
    //点击删除
    handleClicktwo(r) {
      this.$confirm("是否删除此条退货单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击提交
    handleClickthree(r) {
      this.$confirm("是否提交此条退货单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击撤销
    handleClickfour(r) {
      this.$confirm("是否撤销此条退货单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击查看
    handleClickfive(r) {
      this.dialog = true;
      this.LookType = true;
      //补充数据
    },
    //分页
    current_change(currentPage) {
      console.log(currentPage);
    },
    //点击表单新增
    AddTable() {
      this.dialogtwo = true;
      this.AddType = false;
      this.formtwo = {
        name: "",
        price: "",
        number: "",
        unit: "",
        money: ""
      };
    },
    //点击表单内表格编辑
    Clickredact(r) {
      this.dialogtwo = true;
      this.AddType = true;
      //数据填充
    },
    //点击表单内表格删除
    Clickdelete(r) {
      this.$confirm("是否删除此条购物明细?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击表单确定
    ClickYes() {
      if (this.LookType) {
      } else {
        //补充提交表单数据
      }
      this.dialog = false;
    },
    //点击表单取消
    Canceltwo() {
      this.dialog = false;
    },
    //新增明细确定
    ClickYestwo() {
      if (this.AddType) {
        //修改表格内容
      } else {
        // 增加数据
      }
      this.dialogtwo = false;
    },
    //新增明细取消
    Canclematerial() {
      this.dialogtwo = false;
    },
    //物料名称远程搜索
    remoteMethod(r) {
      if (r !== "") {
        this.loading = true;
        //添加数据请求
      } else {
        this.options = [];
      }
    }
  },
  mounted() {},
  watch: {}
};
</script>

<style scoped>
#returngood {
  position: relative;
}
.top {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
}
.Inputs {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.Inputs > div {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.check > i {
  position: absolute;
  right: 20px;
}
.Pages {
  position: absolute;
  margin-top: 50px;
  right: 200px;
}
.foottable {
  position: relative;
  width: 100%;
}
.tablecontent {
  width: 100%;
  height: 200px;
}
</style>