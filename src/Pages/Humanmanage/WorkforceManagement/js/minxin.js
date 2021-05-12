let Mymixin = {
    data() {
        return {
            monthNum: '',
            month: '',
            year: '',
            dataarray: [],
            labelarrdemo: [
                { label: '职员', param: 'StaffName', align: 'center', width: '150', },
            ],
        }
    },
    methods: {
        getmonth(parms) {
            this.year = parms.split('-')[0]
            this.month = parms.split('-')[1]
            this.monthNum = this.getDaysOfMonth(Number(this.year), Number(this.month));
            // console.log(this.tableLabel,'number');
            this.getlabelmode(parms, this.monthNum);
        },
        getlabelmode(parms, num) {
            let arr = [];
            console.log(this.month);
            for (let index = 1; index <= num; index++) {
                let obj = {}
                let weekstring = parms + '-' + index
                let week = this.getweekday(weekstring)
                obj.day = this.year + '-' + this.month + '-' + index;
                obj.week = week;
                obj.dayweek = weekstring + week;
                arr.push(obj)
            }
            this.dataarray = arr;
            // console.log(this.dataarray);
            this.getlabel();
        },
        getlabel() {
            this.tableLabel = [];
            let arrlabel = JSON.parse(JSON.stringify(this.labelarrdemo));
            this.dataarray.forEach((item, index) => {
                let obj = { day: '1', week: '1', key: '', width: '105', };
                obj.day = item.day;
                obj.week = item.week;
                obj.key = 'days' + (index + 1);
                // console.log(obj.key);
                arrlabel.push(obj);
            });
            setTimeout(() => {
                this.tableLabel = arrlabel;
            }, 1)
            console.log(arrlabel);
            this.$forceUpdate();
        },
        getdata(data,data2) {
			//alert(JSON.stringify(data))
            let datacopy = JSON.parse(JSON.stringify(data));
            var datatitme = '';
			console.log(data);
            data.forEach((item, index1) => {
                // let item = datacopy[index1];
                for (let index = 1; index <= this.monthNum; index++) {
					if(index<10){
						datatitme = this.year + '-' + this.month + '-0' + index;
					}
					else{
						datatitme = this.year + '-' + this.month + '-' + index;
					}
                    let keys = index;
                    let obj = {
                        "status": 1,
                        "weeks": '休',
                        "StaffId": '',
                        "StaffName": '',
                        "Sdate": "",
                        "Edate": "",
                        "NewData": datatitme,
                        "FrequencyId": "0",
                    }
					
                    item[keys] = obj;
					for (var arr in item.AttendanceScheduleItem){
						if(item.AttendanceScheduleItem[arr].Sdate == obj.NewData){
							 for(var index2 in data2){
							 	if(data2[index2].Id == item.AttendanceScheduleItem[arr].FrequencyId){
							 		obj.weeks = data2[index2].Name
							 		obj.FrequencyId = data2[index2].Id
							 		obj.status = 2;
							 		obj.Sdate = item.AttendanceScheduleItem[arr].Sdate;
							 		obj.Edate = item.AttendanceScheduleItem[arr].Edate;
							 	}
							 }
						}
					}
					
                    obj.StaffId = item.StaffId;
                    obj.StaffName = item.StaffName;
					if (!this.CompareDate(datatitme)) {
					         obj.status = 3;
					     }
					
                    //obj.OrganizationName = item.OrganizationName;
                    // let rulers = this.getsection('1', index, JSON.parse(JSON.stringify(item.ShiftRecord)));
                    // if (rulers.StartDate) {
                    //     obj.weekType = '1';
                    //     obj.weeks = '';
                    //     // 计算当前时间距离开始时间多少天
                    //     let datanumber = this.DateDifference(rulers.StartDate, datatitme);
                    //     let startweek = this.getweekday(rulers.StartDate);
                    //     let arr = rulers.ShiftInfo;
                    //     let datanum = arr.length;
                    //     let arrindex = ((datanumber + (rulers.CycleType=='1'?this.getweeknum(startweek):0)) % datanum);
                    //     let arrdata = arr[arrindex];
                    //     if (arrdata&&arrdata.WorkTime) {
                    //         obj.WorkTime = arrdata.WorkTime;
                    //     }
                    //     if (arrdata&&arrdata.WorkOrRest) {
                    //         obj.WorkOrRest = arrdata.WorkOrRest;
                    //     }
                    //     if (arrdata&&arrdata.ClosingTime) {
                    //         obj.ClosingTime = arrdata.ClosingTime;
                    //     }
                    //     // obj.ClosingTime = arrdata.ClosingTime;
                    //     // obj.WorkOrRest = arrdata.WorkOrRest;
                    //     if (arrdata&&arrdata.WorkOrRest&&arrdata.WorkOrRest == '1') {
                    //         obj.status = 1;
                    //         obj.weeks = rulers.ShiftName.substring(0, 1)
                    //     }
                    //     if (!this.CompareDate(datatitme)) {
                    //         obj.status = 2;
                    //     }
                    //     // 节假日
                    //     if (rulers.Holiday&&rulers.Holiday.length) {
                    //         let holidatarulers = rulers.Holiday
                    //         holidatarulers.forEach((item,index)=>{
                    //             if (this.isDateBetween(datatitme, item.StartDate, item.EndDate)) {
                    //                 obj.weeks = '休';
                    //                 obj.status = 4;
                    //             }
                    //         })
                    //         // console.log(rulers.Holiday,'111222211');
                    //     }
                    //     // 手动排班
                    //     if (rulers.ShiftMakeUp&&rulers.ShiftMakeUp.length) {
                    //         let ShiftMakeUprulers = rulers.ShiftMakeUp
                    //         ShiftMakeUprulers.forEach((item,index)=>{
                    //             if (this.isDateBetween(datatitme, item.StartDate, item.EndDate)) {
                    //                 obj.weeks = '例';
                    //                 obj.status = 3;
                    //             }
                    //         })
                    //         // console.log(rulers.Holiday,'111222211');
                    //     }
                    // }
                    // let rulerspb = this.getsection('2', index, JSON.parse(JSON.stringify(item.ShiftRecord)));
                    // if (rulerspb.Id) {
                    //     // console.log(item.StaffName,rulerspb,'rulerspbrulerspbrulerspbrulerspb');
                    //     if (rulerspb.ShiftInfo.length&&rulerspb.ShiftInfo[0]) {
                    //         obj.HandId = rulerspb.ShiftInfo[0].Id;
                    //         obj.HandshiftId = rulerspb.Id;
                    //         // if (rulerspb.ShiftInfo[0].WorkTime) {
                                
                    //         // }
                    //         obj.WorkTime = rulerspb.ShiftInfo[0].WorkTime;
                    //         obj.ClosingTime = rulerspb.ShiftInfo[0].ClosingTime;
                    //     }
                    //     obj.weeks = '例';
                    //     obj.Desc = rulerspb.Desc;
                    //     obj.status = 3;
                    // }
                    
                }
				delete data[index1].StaffId;
				delete data[index1].StaffName;
				delete data[index1].AttendanceScheduleItem;
                // console.log(data,'1111111111111111222');
            });
            this.tableData = data;
            console.log(data);
        },
        getweeknum(month){
            switch (month) {
                case '星期一':
                    return 0;
                case '星期二':
                    return 1;
                case '星期三':
                    return 2;
                case '星期四':
                    return 3;
                case '星期五':
                    return 4;
                case '星期六':
                    return 5;
                case '星期日':
                    return 6;
            }
        },
        CompareDate(d1) {
            return ((new Date(d1.replace(/-/g, "\/"))) > (new Date()));
        },
        //  获取区间
        getsection(str, index, arr) {
            let data = this.year + '-' + this.month + '-' + index;
            let rulers = [];
            arr.forEach((item, index) => {
                if (item.ShiftType == str) {
                    rulers.push(item);
                }
            })
            for (let q = 0; q < rulers.length; q++) {
                const item = rulers[q];
                // 判断时间
                if (this.isDateBetween(data, item.StartDate, item.EndDate)) {
                    return item
                }
                // console.log(this.isDateBetween('2020-06-3',item.StartDate,item.EndDate));
            }
            return {};
            // console.log(data);
        },
        DateDifference(Date1, Date2) { //Date1和Date2是2017-07-10格式  
            var aDate, newDate1, newDate2, Days
            aDate = Date1.split("-");
            newDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为07-10-2017格式  
            aDate = Date2.split("-");
            newDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
            Days = parseInt(Math.abs(newDate1 - newDate2) / 1000 / 60 / 60 / 24); //把差的毫秒数转换为天数  
            return Days;
        },
        //  判断时间是否在某个区间内
        isDateBetween(dateString, startDateString, endDateString) {
            var flag = false;
            var startFlag = (this.dateCompare(dateString, startDateString) < 1);
            var endFlag = (this.dateCompare(dateString, endDateString) > -1);
            if (startFlag && endFlag) {
                flag = true;
            }
            return flag;
        },
        dateCompare(dateString, compareDateString) {
            var dateTime = this.dateParse(dateString).getTime();
            var compareDateTime = this.dateParse(compareDateString).getTime();
            if (compareDateTime > dateTime) {
                return 1;
            } else if (compareDateTime == dateTime) {
                return 0;
            } else {
                return -1;
            }
        },
        dateParse(dateString) {
            var SEPARATOR_BAR = "-";
            var SEPARATOR_SLASH = "/";
            var SEPARATOR_DOT = ".";
            var dateArray;
            if (dateString.indexOf(SEPARATOR_BAR) > -1) {
                dateArray = dateString.split(SEPARATOR_BAR);
            } else if (dateString.indexOf(SEPARATOR_SLASH) > -1) {
                dateArray = dateString.split(SEPARATOR_SLASH);
            } else {
                dateArray = dateString.split(SEPARATOR_DOT);
            }
            return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        },
        getweekday(date) {
            var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var week = weekArray[new Date(date).getDay()];//注意此处必须是先new一个Date
            return week;
        },
        getDaysOfMonth(year, month) {
            // month = month + 1;
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    return 31;
                case 4:
                case 6:
                case 9:
                case 11:
                    return 30;
                case 2:
                    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 29 : 28;
                default:
                    return 0;
            }
        }
    }
}
export default Mymixin
