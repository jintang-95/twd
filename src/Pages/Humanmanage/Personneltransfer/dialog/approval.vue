<template>
  <div>
    <el-dialog :title="formtype==1?'审批调动申请单':'审批调动申请单'" center class="el_dialog_pro1" width='897px' :visible.sync="dialogFormVisible">
      <!-- <div class="dialog_body"> -->
        <el-form :model="form" label-position='left'>
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="单据编号" :label-width="formLabelWidth">
              <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入单据编号" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col pad_left">
            <el-form-item label="申请时间" :label-width="formLabelWidth">
                <el-date-picker
                  class="date_pickert_border_bottom"
                  v-model="form.name"
                  type="date"
                  format='yyyy-MM-dd'
                  placeholder="选择日期">
                </el-date-picker>
              <!-- <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入姓名" auto-complete="off"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="申请人" :label-width="formLabelWidth">
              <!-- <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入身份证号" auto-complete="off"></el-input> -->
              <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择申请人">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col pad_left">
            <el-form-item label="调动类型" :label-width="formLabelWidth">
              <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择调动类型">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="当前部门" :label-width="formLabelWidth">
              <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入当前部门" auto-complete="off"></el-input>
              <!-- <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择隶属部门">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col pad_left">
           <el-form-item label="当前岗位" :label-width="formLabelWidth">
              <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择当前岗位">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="目标部门" :label-width="formLabelWidth">
              <!-- <el-input class="input_border_bottom" v-model="form.name" placeholder="请输入当前部门" auto-complete="off"></el-input> -->
              <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择目标部门">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col pad_left">
           <el-form-item label="目标岗位" :label-width="formLabelWidth">
              <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择目标岗位">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="el_col1 ">
            <el-form-item label="申请原因" :label-width="formLabelWidth">
              <el-input class="textarea_border_bottom" placeholder="请输入申请原因" v-model="form.name" type="textarea" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="审批结论" :label-width="formLabelWidth">
              <el-select class="select_border_bottom" v-model="form.region" placeholder="请选择审批结论">
                <el-option label="通过" value="shanghai"></el-option>
                <el-option label="不通过" value="beijing"></el-option>
                <el-option label="打回修改" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col pad_left">
           <el-form-item label="审批时间" :label-width="formLabelWidth">
             <el-date-picker
                  class="date_pickert_border_bottom"
                  v-model="form.name"
                  type="date"
                  format='yyyy-MM-dd'
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="el_col ">
            <el-form-item label="审批意见" :label-width="formLabelWidth">
              <el-input class="textarea_border_bottom" placeholder="请输入审批意见" v-model="form.name" type="textarea" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </div>
      <!-- </div> -->
</el-dialog>
  </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      formtype: 1,
      tbasindex: 0,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      listfrom: {
        "Status": '',
        "KeyWord": '',
        "Status": '',
        "PageSize": 10,
        "PageIndex": 1
      },
      activeName2: 'first',
      formLabelWidth: '80px',
      form: {
        name: '',
        region: '',
        select: [],
        province: {
          code: "460000",
          value: "海南省"
        },
        city: {
          code: "460000",
          value: "海南省"
        },
        area: {
          code: "460000",
          value: "海南省"
        },
      }
    }
  },
  components: {
    // inforpop,
  },
  created() {
    that = this;
    // console.log(citys);
  },
  methods: {
    commit() {
      this.dialogFormVisible = false
    },
    onSelected(data) {
      // this.dialogFormVisible=false
      console.log(data);
    },
    handleClick(data) {
      // this.dialogFormVisible=false
      // console.log(data.index);
      this.tbasindex = data.index;
    },
    add() {
      if (this.tbasindex == 0) {
      } else if (this.tbasindex == 1) {
        this.$refs.inforpop.dialogFormVisible = true;
      } else {

      }
    },
    handleButton() { },
    rowClick() { },
    cellClick() { },
    handleSortChange() { },
    handleSelectionChange() { },
  },
}
</script>

<style lang="less" scoped>
.dialog_body {
  width: 100%;
}
.pad_left {
  padding-left: 15px;
}
.el_tabs_pro {
  margin-top: 10px;
  width: 100%;
  position: relative;
}
.add_btn {
  position: absolute;
  top: 5px;
  right: 0px;
  z-index: 12;
}
.contact_list {
  width: 100%;
  height: 165px;
}
</style>