<template>
  <div>
    <el-dialog
      :title="formtype == 1? '新增班次' : '编辑班次'"
      class="el_dialog_pro"
      width="790px"
      @close='cancel'
      :visible.sync="dialogFormVisible"
    >
      <!-- <div class="dialog_body"> -->
      <el-form :model="listfrom" :rules="rules" ref="ruleForm" label-position="left" style="padding: 20ox;line-height: 50px;">
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="班次名称:" prop="Name" :label-width="formLabelWidth">
              <el-input
                v-model="listfrom.Name"
                size="medium"
                placeholder="请输入班次名称"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12" class="el_col pad_left">
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="24" class="el_col pad_left">
              <span style="font-weight: bold;line-height: 50px;">打卡时段：</span>
          </el-col>
          <el-col :span="24" class="el_col pad_left">
              <span style="line-height: 50px;">该班次一天内上下班的次数</span>
          </el-col>
          <el-col :span="24" class="el_col pad_left">
            <el-form-item>
              <el-radio-group v-model="listfrom.Num" prop="Num">
                <el-radio label="1" size="medium" border>1天1次上下班</el-radio>
                <el-radio label="2" size="medium" border>1天2次上下班</el-radio>
                <el-radio label="3" size="medium" border>1天3次上下班</el-radio>
              </el-radio-group>  
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el_col pad_left">
              <el-col :span="2" class="el_col pad_left">
                  <span>第一次</span>
              </el-col>
              <el-col :span="18" class="el_col pad_left">
                  <span>上班：</span>
                  <el-time-select
                    placeholder="起始时间"
                    class="timeBox"
                    v-model="listfrom.FirstStime"
                    size="medium"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                    }">
                  </el-time-select>
                  <span>下班：</span>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="listfrom.FirstEtime"
                    class="timeBox"
                    size="medium"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                      minTime: startTime
                    }">
                  </el-time-select>
              </el-col>
          </el-col>
          <el-col :span="24" class="el_col pad_left" v-if="listfrom.Num==2||listfrom.Num==3">
              <el-col :span="2" class="el_col pad_left">
                  <span>第二次</span>
              </el-col>
              <el-col :span="18" class="el_col pad_left">
                  <span>上班：</span>
                  <el-time-select
                    placeholder="起始时间"
                    class="timeBox"
                    v-model="listfrom.SencordStIme"
                    size="medium"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                    }">
                  </el-time-select>
                  <span>下班：</span>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="listfrom.SencordEtIme"
                    class="timeBox"
                    size="medium"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                      minTime: startTime
                    }">
                  </el-time-select>
              </el-col>
          </el-col>
          <el-col :span="24" class="el_col pad_left" v-if="listfrom.Num==3">
              <el-col :span="2" class="el_col pad_left">
                  <span>第三次</span>
              </el-col>
              <el-col :span="18" class="el_col pad_left">
                  <span>上班：</span>
                  <el-time-select
                    placeholder="起始时间"
                    class="timeBox"
                    v-model="listfrom.ThirdStime"
                    size="medium"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                    }">
                  </el-time-select>
                  <span>下班：</span>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="listfrom.ThirdEtime"
                    class="timeBox"
                    size="medium"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                      minTime: startTime
                    }">
                  </el-time-select>
              </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="el_col">
            <span style="font-weight: bold;">容错时间</span>
          </el-col>
          <el-col :span="10" class="el_col">
            <el-form-item label="早退时间:" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="12" class="el_col">
                  <el-input
                    v-model="listfrom.Sfault"
                    placeholder="早退时间"
                    size="medium"
                    auto-complete="off"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el_col">
                  <span>&nbsp;&nbsp;分钟</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="10" class="el_col">
            <el-form-item label="迟到时间:" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="12" class="el_col">
                  <el-input
                    v-model="listfrom.Efault"
                    placeholder="迟到时间"
                    size="medium"
                    auto-complete="off"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el_col">
                   <span>&nbsp;&nbsp;分钟</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" class="el_col">
            <span style="font-weight: bold;">更多设置</span>
          </el-col>
          <el-col :span="24" class="el_col">
            <el-form-item>
              <el-row>
                <el-col :span="4" class="el_col">
                  <el-checkbox v-model="checked">严重迟到分钟数：</el-checkbox>
                </el-col>
                <el-col :span="3" class="el_col">
                  <el-input
                    v-model="listfrom.SeriousTime"
                    size="medium"
                    placeholder="严重迟到"
                    auto-complete="off"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el_col">
                  <span>&nbsp;&nbsp;分钟</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el_col">
            <el-form-item>
              <el-row>
                <el-col :span="4" class="el_col">
                  <el-checkbox v-model="checked">旷工迟到分钟数：</el-checkbox>
                </el-col>
                <el-col :span="3" class="el_col">
                  <el-input
                    v-model="listfrom.Absenteeism"
                    placeholder="旷工迟到"
                    size="medium"
                    auto-complete="off"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el_col">
                  <span>&nbsp;&nbsp;分钟</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="el_col1 ">
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input
                style="width:300px"
                placeholder="请输入描述"
                v-model="listfrom.Desc"
                type="textarea"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <div class="week_body EditCMBox">
        </div> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button 
        style="background:rgba(0,96,160,1)"
        type="primary" @click="commit">确 定</el-button>
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
      //新增改动了的
      startTime:'',
      endTime:'',
      checked:'',
      datamode: {
        "WorkOrRest": '1',
        "DayNo": '',
        "ClosingTime": '18:00',
        "WorkTime": '09:00',
      },
      listfrom: {
        "ShiftInfo": [],
        "Name": '',  // 班次名称
        "Num":'',
        "FirstStime":'',
        "FirstEtime":'',
        "SencordStIme":'',
        "SencordEtIme":'',
        "ThirdStime":'',
        "ThirdEtime":'',
        "Sfault": '', // 上班容错时间
        // "LegalHoliday": '1', //法定节假日
        "Efault": '',      // 下班容错时间
        // "CycleCount": '',    // 周期
        "SeriousTime":'',   // 严重迟到早退
        "Absenteeism":'',    // 矿工迟到
        "Desc": '',           // 描述
        // "CycleType": '1',     // 单位 
        // "PageSize": 10,
        // "PageIndex": 1,
      },
      editListfrom: {},
      rules: {
          Name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          CycleCount: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
        },
      activeName2: 'first',
      formLabelWidth: '90px',
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
    // this.editListfrom = JSON.parse(JSON.stringify(this.listfrom))
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
    },
    // "radio": function(data){
      
    //   this.listfrom.Num = this.radio;
    //   alert(this.listfrom.Num)
    // }
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
    //新增的确定按钮
    commit() {
      if(this.formtype == 1){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let ShiftInfo = [].concat.apply([],JSON.parse(JSON.stringify(this.listfrom.ShiftInfo)));
            let listfrom = JSON.parse(JSON.stringify(this.listfrom))
            listfrom.ShiftInfo = ShiftInfo;
            let obj = {
              "MN": "AddFrequency",
              "SN":"Attendance",
              "UserId": 1,
              "DataContent": listfrom
            }
            this.MIX_send(obj);
            this.$emit('getlistdata')
           this.dialogFormVisible = false; 
            // console.log(listfrom);
          } else {
            return false;
          }
        });
      }else{
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // let ShiftInfo = [].concat.apply([],JSON.parse(JSON.stringify(this.listfrom.ShiftInfo)));
            let listfrom = JSON.parse(JSON.stringify(this.listfrom))
            // listfrom.ShiftInfo = ShiftInfo;
            // let listfrom = this.editListfrom;
            let obj = {
              "MN": "UpdateFrequency",
              "SN":"Attendance",
              "UserId": 1,
              "DataContent": listfrom
            }
            this.MIX_send(obj);
             this.$emit('getlistdata')
           this.dialogFormVisible = false; 
            // console.log(listfrom);
          } else {
            return false;
          }
        });
 }
    },
    // 取消按钮
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
.timeBox{
  max-width: 135px;
  margin-right: 20px;
}
/deep/ .el-dialog__header{
  margin: 0 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span {
    color:#4D6474;
    font-size: 18px;
    font-weight: 400;
  }
}
/deep/ .el-dialog__body {
   margin-top: 20px;
}
</style>
