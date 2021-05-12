<template>
  <div>
    <el-dialog
      :title="formtype == 1 ? '新增班次' : '编辑班次'"
      class="el_dialog_pro"
      width="897px"
      @close='cancel'
      :visible.sync="dialogFormVisible"
    >
      <!-- <div class="dialog_body"> -->
      <el-form :model="listfrom" :rules="rules" ref="ruleForm" label-position="left">
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="班次名称" prop="Name" :label-width="formLabelWidth">
              <el-input
                class="input_border_bottom"
                v-model="listfrom.Name"
                placeholder="请输入班次名称"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="el_col pad_left">
            <el-row>
              <el-col :span="16" class="el_col">
                <el-form-item label="周期设置" prop="CycleCount" :label-width="formLabelWidth">
                  <el-input
                    class="input_border_bottom"
                    v-model="listfrom.CycleCount"
                    placeholder="请输入周期"
                    auto-complete="off"
                    @input.native="cycchang"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="el_col">
                <el-form-item>
                  <el-select
                    class="select_border_bottom"
                    v-model="listfrom.CycleType"
                    @change="cyctypechange"
                  >
                    <el-option label="周" value="1"></el-option>
                    <el-option label="天" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="el_col ">
            <el-form-item label="法定节假" prop="LegalHoliday" :label-width="formLabelWidth">
              <el-select
                class="select_border_bottom"
                v-model="listfrom.LegalHoliday"
                placeholder="请选择法定节假"
              >
                <el-option label="智能跳过" value="1"></el-option>
                <el-option label="不跳过" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="el_col pad_left">
            <el-form-item label="容错时间" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="8" class="el_col">
                  <el-input
                    class="input_border_bottom"
                    v-model="listfrom.LateTime"
                    placeholder="迟到时间"
                    auto-complete="off"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el_col">
                  分钟
                </el-col>
                <el-col :span="8" class="el_col">
                  <el-input
                    class="input_border_bottom"
                    v-model="listfrom.EarlyLeaveTime"
                    placeholder="早退时间"
                    auto-complete="off"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el_col">
                  分钟
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="el_col1 ">
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input
                class="textarea_border_bottom"
                placeholder="请输入描述"
                v-model="listfrom.Desc"
                type="textarea"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="week_body EditCMBox">
          <div v-if="listfrom.CycleType == '1'">
            <div
              class="week_item"
              v-for="(item, index) in listfrom.ShiftInfo"
              :key="index"
            >
              <div class="week_title">第{{ index + 1 }}周</div>
              <el-row>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周一" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[0].WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[0].WorkTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item[0].ClosingTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[0].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周二" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[1].WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[1].WorkTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item[1].ClosingTime"
                          :clearable="false"
                          class="time_select_defin"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[1].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周三" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[2].WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[2].WorkTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item[2].ClosingTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[2].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周四" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[3].WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[3].WorkTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item[3].ClosingTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[3].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周五" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[4].WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[4].WorkTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item[4].ClosingTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[4].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周六" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[5].WorkOrRest"
                          :clearable="false"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[5].WorkTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item[5].ClosingTime"
                          class="time_select_defin"
                          :clearable="false"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[5].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item label="周日" :label-width="weekLabelWidth">
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item[6].WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item[6].WorkTime"
                          :clearable="false"
                          class="time_select_defin"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          :clearable="false"
                          v-model="item[6].ClosingTime"
                          class="time_select_defin"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item[6].WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- ------------------天------------------------ -->
          <div v-else>
            <div
              class="week_item"
              v-for="(item, index) in listfrom.ShiftInfo"
              :key="index"
            >
              <el-row>
                <el-col :span="12" class="el_col1 ">
                  <el-form-item
                    :label="getlabel(index)"
                    :label-width="formLabelWidth"
                  >
                    <el-row>
                      <el-col :span="8" class="el_col1 ">
                        <el-select
                          class="select_border_bottom"
                          v-model="item.WorkOrRest"
                          placeholder="请选择"
                        >
                          <el-option label="工作日" value="1"></el-option>
                          <el-option label="休息日" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item.WorkTime"
                          :clearable="false"
                          class="time_select_defin"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00'
                          }"
                        >
                        </el-time-select>
                      </el-col>
                      <el-col :span="8" class="el_col1 ">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.ClosingTime"
                          :clearable="false"
                          class="time_select_defin"
                          :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '24:00',
                            minTime: item.WorkTime
                          }"
                        >
                        </el-time-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
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
      ClosingTime: '',
      WorkTime: '',
      tbasindex: 0,
      ShiftInfo:[],
      datamode: {
        "WorkOrRest": '1',
        "DayNo": '',
        "ClosingTime": '18:00',
        "WorkTime": '09:00',
      },
      listfrom: {
        "ShiftInfo": [],
        "Name": '',
        "LegalHoliday": '1',
        "LateTime": '',
        "CycleCount": '',
        "EarlyLeaveTime": '',
        "Desc": '',
        "CycleType": '1',
        "PageSize": 10,
        "PageIndex": 1
      },
      rules: {
          Name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          CycleCount: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      activeName2: 'first',
      formLabelWidth: '80px',
      weekLabelWidth: '50px',
      form: {
        name: '',
        region: '',
        select: [],
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
  watch: {
    // 'listfrom.CycleType': () => {
    //   that.createdata();
    // },
    // 'listfrom.CycleCount': (e) => {
    //   that.createdata();
    // },
    "$store.state.Humanmanage.SaveShift": function (data) {
      this.$message({
            type: 'success',
            message: '操作成功!'
          });
    this.cancel();
    this.$parent.getlistdata();
    }
  },
  methods: {
    cycchang(){
      console.log('objectcycchang');
      that.createdata();
    },
    cyctypechange(){
      console.log('objectcycchangcyctypechange');
      that.createdata();
    },
    createdata() {
      that.listfrom.ShiftInfo = [];
      let e = this.listfrom.CycleCount;
      let arr = []
      if (that.listfrom.CycleType == '1') {
        for (let index = 0; index < Number(e); index++) {
          let arr1 = [];
          for (let index1 = 0; index1 < 7; index1++) {
            let obj = JSON.parse(JSON.stringify(that.datamode));
            obj.DayNo = ((index * 7)+index1)+1;
            if ((obj.DayNo%7) ==6||(obj.DayNo%7) ==0) {
              obj.WorkOrRest = '0'
            }
            // console.log(obj);
            arr1.push(obj)
          }
          arr.push(arr1);
        }
          that.listfrom.ShiftInfo = JSON.parse(JSON.stringify(arr));
          console.log(that.listfrom.ShiftInfo);
      } else {
        for (let index = 0; index < Number(e); index++) {
          let obj1 = JSON.parse(JSON.stringify(that.datamode));
          obj1.DayNo = index+1;
          that.listfrom.ShiftInfo.push(obj1);
        }
      }
    },
    getlabel(index) {
      return '第' + (index + 1) + '天'
    },
    commit() {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // alert('submit!');
            let ShiftInfo = [].concat.apply([],JSON.parse(JSON.stringify(this.listfrom.ShiftInfo)));
            let listfrom = JSON.parse(JSON.stringify(this.listfrom))
            listfrom.ShiftInfo = ShiftInfo;
            let obj = {
              "MN": "SaveShift",
              "RequestId": 1,
              "UserId": 1,
              "DataContent": listfrom
            }
            this.MIX_send(obj);
            console.log(listfrom);
          } else {
            return false;
          }
        });
    },
    cancel(){
      this.listfrom= {
        "ShiftInfo": [],
        "Name": '',
        "LegalHoliday": '1',
        "LateTime": '',
        "CycleCount": '',
        "EarlyLeaveTime": '',
        "Desc": '',
        "CycleType": '1',
      },
      this.dialogFormVisible = false;
    },
    getShiftInfo(arr){
      const iconsArr = []; // 声明数组
      arr.forEach((item, index) => {
      const page = Math.floor(index / 7);
      if (!iconsArr[page]) { 
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
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
.week_body {
  width: 100%;
  height: 350px;
  overflow-y: scroll;
}
</style>