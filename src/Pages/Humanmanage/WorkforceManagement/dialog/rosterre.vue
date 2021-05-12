<template>
  <div>
    <el-dialog :title="formtype==1?'新增考勤组':'编辑考勤组'" @close='cancel' class="el_dialog_pro1" width='897px' :visible.sync="dialogFormVisible">
      <div class="dialog_body EditCMBox">
        <el-form :model="listfrom" :rules="rules" ref="ruleForm" label-position='left'>
        <el-row>
          <el-col :span="12" class="el_col ">
            <el-form-item label="考勤组名称" prop="" label-width="120px">
				<el-input :disabled="formtype == 3" class="input_textarea_disabled" v-model="listfrom.ScheduleName" type="text" auto-complete="off" placeholder="请输入考勤组名称"></el-input>
            </el-form-item>
          </el-col>
		</el-row>
		<el-row>
          <el-col :span="24" class="el_col ">
            <el-form-item label="参与考情人员数:" prop="" label-width="120px">
				<chooseStaff :checkedList="checkedStaffList" :isCustomer = "true" :isMultipleChoice="true" @getToFather = "getToFather"></chooseStaff>
			</el-form-item>
          </el-col>
        </el-row>
		<el-row>
		  <el-col :span="24" class="el_col ">
		    <el-form-item label="考勤类型:" prop="" label-width="120px">
		        <el-radio-group v-model="checkType">
				  <el-radio :label="1">固定班制 (每天考勤时间一样)</el-radio>
				  <el-radio :label="2">排班制 (自定义设置考勤时间)</el-radio>
				</el-radio-group>
			</el-form-item>
		  </el-col>
		</el-row>
        <el-row>
            <el-form-item label="工作日设置:" prop="" label-width="120px" v-if="checkType==1">
				<el-form-item label="班次选择:" prop="">
					<chooseFrequency :checkedList="checkedByFreList" :isMultipleChoice="false" @getToFather = "getToFatherByFre"></chooseFrequency>
				</el-form-item>
				<el-form-item label="" prop="">
					<el-checkbox v-model="checked">法定节假日自动调休</el-checkbox>
				</el-form-item>
                <el-table
                    ref="multipleTable"
                    :data="tableData2"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="">
<!--                    <el-table-column
                      type="selection"
                      width="55"
					  align="center">
                    </el-table-column> -->
                    <el-table-column
                      label="工作日"
                      width="120"
					  align="center">
                      <template slot-scope="scope">{{ scope.row.date }}</template>
                    </el-table-column>
                    <el-table-column
					prop="workTime"
					align="center"
                      label="班次时间段"
					 >
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="修改班次"
                      show-overflow-tooltip
					  align="center">
					  <template slot-scope="scope">
						  <el-select v-model="scope.row.BCID" @change="upDataTime(scope.row)" clearable placeholder="选择班次">
							<el-option
							v-for="item in allData"
							:key="item.ID"
							:label="item.Name"
							:value="item.ID">
							</el-option>
						  </el-select>
						</template>
                    </el-table-column>
                  </el-table>
            </el-form-item>
			<el-form-item label="考勤班次:" prop="" label-width="120px" v-else>
					<el-select v-model="AttShiftList" multiple placeholder="请选择" width="310px">
					    <el-option
					      v-for="item in allData"
					      :key="item.ID"
					      :label="item.Name"
					      :value="item.ID">
					    </el-option>
					  </el-select>
			</el-form-item>
        </el-row>
        </el-form>
      </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" v-if="formtype != 3" @click="commit">确 定</el-button>
        </div>
</el-dialog>
<rosterpop ref="rosterpop"></rosterpop>
  </div>
</template>

<script>
import chooseStaff from "@/components/chooseStaff.vue"
import chooseFrequency from "@/components/chooseFrequency.vue"
var that;
import rosterpop from './rosterpop'
  export default {
    data() {
      return {
        dialogFormVisible:false,
        loading:false,
        disable:false,
        formtype:1,
        rules: {

          },
       listfrom:{
        Id:"0",
		ScheduleName:"",
      },
        formLabelWidth:'100px',
		checkType:1,
		tableData2: [{
		          date: '星期一',
		          name: '休息',
				  BCID:"0",
				  workTime:""
		        }, {
		          date: '星期二',
		          name: '休息',
				  BCID:"0",
				  workTime:""
		        }, {
		          date: '星期三',
		          name: '休息',
				  BCID:"0",
				  workTime:""
		        }, {
		          date: '星期四',
		          name: '休息',
				  BCID:"0",
				  workTime:""
		        }, {
		          date: '星期五',
		          name: '休息',
				  BCID:"0",
				  workTime:""
		        }, {
		          date: '星期六',
		          name: '休息',
				  BCID:"0",
				  workTime:""
		        }, {
		          date: '星期天',
		          name: '休息',
				  BCID	:"0",
				  workTime:""
		        }],
				checked:true,
				checkedStaffList:[],
				checkedStaffData:[],
				checkedByFreList:[],
				checkedByFreData:[],
				QueryFrequencyFrom: {
					"KeyWord": '',
					"PageSize": 9000,
					"PageIndex": 1,
					"IsDel": "0",
				},
				allData:[],
				AttShiftList:[],
				formData:[],
      }
    },
    components:{
      rosterpop,
	  chooseStaff,
	  chooseFrequency
    },
    created() {
      that = this;
    },
    watch: {
		"$store.state.Humanmanage.GetFrequencyPages": function(data) {
			this.allData = JSON.parse(JSON.stringify(data.Data));
			let rest = {
				FirstEtime: "",
				FirstStime: "",
				ID: "0",
				Name: "休息",
				SencordEtIme: "",
				SencordStIme: "",
				SeriousTime: "",
				ThirdEtime: "",
				ThirdStime: ""
			}
			this.allData.unshift(rest);
		},
		"$store.state.Humanmanage.AddAttendanceSchedule": function (data) {
		  this.$message({
		     message: '操作成功',
		     type: 'success'
		   });
		   this.cancel();
		   this.$parent.getlistdata();
		},
		"$store.state.Humanmanage.UpdateAttendanceSchedule": function (data) {
		  this.$message({
		     message: '修改成功',
		     type: 'success'
		   });
		   this.cancel();
		   this.$parent.getlistdata();
		},
		formData:function(data){
			let obj = JSON.parse(JSON.stringify(data))
			this.checkType = obj.AttType;
			if(obj.FixedAttendanceTime.length>0){
				this.checked = true;
			}
			else{
				this.checked = false;
			}
			this.listfrom.Id = obj.Id;
			this.listfrom.ScheduleName = obj.ScheduleName;
			if(obj.FixedAttendanceTime.length>0){
				for(var index in obj.FixedAttendanceTime){
					this.tableData2[index].name = obj.FixedAttendanceTime[index].Frequency.Name;
					this.tableData2[index].BCID = obj.FixedAttendanceTime[index].Frequency.Id+"";
					this.tableData2[index].workTime = obj.FixedAttendanceTime[index].Frequency.FirstStime 
														+"-"
														+obj.FixedAttendanceTime[index].Frequency.FirstEtime;
					if(obj.FixedAttendanceTime[index].Frequency.SencordStIme&&obj.FixedAttendanceTime[index].Frequency.SencordStIme!=""){
						this.tableData2[index].workTime += obj.FixedAttendanceTime[index].Frequency.SencordStIme
															+"-"
															+obj.FixedAttendanceTime[index].Frequency.SencordEtIme;
					}
					if(obj.FixedAttendanceTime[index].Frequency.ThirdStime&&obj.FixedAttendanceTime[index].Frequency.ThirdStime!=""){
						this.tableData2[index].workTime += obj.FixedAttendanceTime[index].Frequency.ThirdStime
															+"-"
															+obj.FixedAttendanceTime[index].Frequency.ThirdEtime;
					}
				}
			}
			if(obj.SchedulAttendanceTime.length>0){
				for(var index in obj.SchedulAttendanceTime){
					this.AttShiftList.push(obj.SchedulAttendanceTime[index].Id+"");
				}
			}
			for(var index in obj.WorkerIds){
				this.checkedStaffList.push(obj.WorkerIds[index]+"");
			}
		}
    },
    methods: {
      cancel(){
		  this.listfrom={
		    Id:"0",
		  		ScheduleName:"",
		  		AttType:"1",
		  		Skip:"1",
		  		WorkerIds:"",
		  };
		  this.checkType = 1;
		this.checkedStaffList=[],
        this.dialogFormVisible = false;
      },
      commit(){
		let WorkerIds = "";
		for(var index in this.checkedStaffData){
			if (index==this.checkedStaffData.length-1) {
				WorkerIds += this.checkedStaffData[index].Id;
			}
			else{
				WorkerIds += this.checkedStaffData[index].Id+",";
			}
		}
		let Arrange = "";
		let AttShift = "";
		if(this.checkType == 1){
			for(var index in this.tableData2){
				let index2 = index*1 + 1;
				if (index==this.tableData2.length-1) {
					Arrange += index2 +","+this.tableData2[index].BCID;
				}
				else{
					Arrange += index2 +","+this.tableData2[index].BCID+"|";
				}
			}
			this.listfrom.Arrange = Arrange;
		}
		else{
			for(var index in this.AttShiftList){
				if (index==this.AttShiftList.length-1) {
					AttShift += this.AttShiftList[index];
				}
				else{
					AttShift += this.AttShiftList[index]+",";
				}
			}
			this.listfrom.AttShift = AttShift;
		}
		let Skip;
		if(this.checked){
			Skip = 1;
		}
		else{
			Skip = 0;
		}
		this.listfrom.AttType = this.checkType;//排班制
		this.listfrom.Skip = Skip;
		this.listfrom.WorkerIds = WorkerIds;
		this.listfrom.Status = 1;
		if(this.formtype == 1){
			var obj = {
			  "SN":"Attendance",
			  "MN": "AddAttendanceSchedule",
			  "RequestId": 1,
			  "UserId": 1,
			  "DataContent": this.listfrom
			}
		}
		else{
			var obj = {
			  "SN":"Attendance",
			  "MN": "UpdateAttendanceSchedule",
			  "RequestId": 1,
			  "UserId": 1,
			  "DataContent": this.listfrom
			}
		}
		
		this.MIX_send(obj);
      },
	  // list 获取列表
	  getFrequencyList() {
	  	let obj = {
	  		"SN": "Attendance",
	  		"MN": "GetFrequencyPages",
	  		"RequestId": 1,
	  		"UserId": 1,
	  		"DataContent": this.QueryFrequencyFrom
	  	}
	  	this.MIX_send(obj);
	  },
	  getToFather(data){
		  this.checkedStaffList = [];
		  this.checkedStaffData = JSON.parse(JSON.stringify(data));
		  for(var index in this.checkedStaffData){
			  this.checkedStaffList.push(this.checkedStaffData[index].Id)
		  }
	  },
	  getToFatherByFre(data){
		  this.checkedByFreList = [];
		  this.checkedByFreData = JSON.parse(JSON.stringify(data));
		  for(var index in this.tableData2){
			  this.tableData2[index].name = this.checkedByFreData.Name;
			  this.tableData2[index].BCID = this.checkedByFreData.ID;
			  this.tableData2[index].workTime = this.checkedByFreData.FirstStime + "-" +this.checkedByFreData.FirstEtime;
			  if(this.checkedByFreData.SencordStIme!=""){
				  this.tableData2[index].workTime +="\n\n"+this.checkedByFreData.SencordStIme + "-" +this.checkedByFreData.SencordEtIme;
			  }
			  if(this.checkedByFreData.ThirdStime!=""){
				  this.tableData2[index].workTime +="\n\n"+this.checkedByFreData.ThirdStime + "-" +this.checkedByFreData.ThirdEtime;
			  }
		  }
	  },
	  upDataTime(row){
		for(var index in this.allData){
			if(this.allData[index].ID==row.BCID){
				row.name = this.allData[index].Name;
				row.workTime = this.allData[index].FirstStime+ "-" +this.allData[index].FirstEtime;
				if(this.allData[index].SencordStIme!=""){
								  row.workTime +="\n\n"+this.allData[index].SencordStIme + "-" +this.allData[index].SencordEtIme;
				}
				if(this.allData[index].ThirdStime!=""){
								  row.workTime +="\n\n"+this.allData[index].ThirdStime + "-" +this.allData[index].ThirdEtime;
				}
			}
		}
	  }
    },
	created() {
		this.getFrequencyList();
	}
  }
</script>

<style lang="less" scoped>
.dialog_body{
  width: 100%;
  max-height:60vh;
  overflow-y: scroll;

}
.pad_left{
  padding-left: 15px;
}
.el_tabs_pro{
  margin-top: 10px;
  width: 100%;
  position: relative;
}
.add_btn{
  position: absolute;
  top: 5px;
  right: 0px;
  z-index: 12;
}
.contact_list{
  width: 100%;
  // height: 200px;
  // overflow-y: scroll;
}
.member-operation-departments-display {
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    padding: 2px 8px;
    height: 30px;
    overflow: hidden;
    max-height: 100px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
	max-width: 100px;
}
.member-operation-departments-display-text {
    min-width: 80px;
}
.anticon {
    display: inline-block;
    font-style: normal;
    vertical-align: baseline;
    text-align: center;
    text-transform: none;
    line-height: 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
	font-size: 18px;
}

#AttShiftSelect{
	width: 310px!important;
}
</style>