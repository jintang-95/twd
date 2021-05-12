<template>
  <div id="login">
    <!-- <div class="header">
     <div class="hint"><span>MMIS</span> &nbsp;&nbsp;设备运维管理信息系统</div>
    </div>
	<div id="backPic"></div>
    <div class="nav">
      <div class="inputs">
        <span>Hi，欢迎登录</span>
        <div class="zhanghao inputDiv">
          <div class="iconfont username" style="font-size:20px;margin:auto 10px;"></div>
          <div>
            <input class="text" type="text" placeholder="请输入账号" v-model="username" />
          </div>
        </div>
        <div class="password inputDiv">
          <div class="iconfont  password" style="font-size:20px;margin:auto 10px;"></div>
          <div>
            <input class="pass" type="password" placeholder="请输入密码" v-model="password" />
          </div>
        </div>
        <div class="vcode inputDiv">
          <div class="iconfont  verification" style="font-size:20px;margin:auto 10px;"></div>
            <input class="inputcode" type="text" placeholder="请输入验证码" v-model="getcode" />
            <div class="createcode" ref="vvcode">{{code}}</div>
        </div>
        <div class="tologin" @click="UpLogin">登&nbsp;&nbsp;&nbsp;&nbsp;录</div>
      </div>
    </div> -->
    <div>
      122
    </div>
<!--    <div class="footer">
      <div>Cppy Right 民航物流技术</div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
	  UId:"",
      username: "",
      password: "",
      getcode: "",
      code: "",
      list:[{
        id:1,
        name:"小米"
      },
      {
        id:2,
        name:"小红"
      }
      ,
      {
        id:3,
        name:"小绿"
      }
      ]
    };
  },
  methods: {
    CreateCode() {
      this.code = "";
      var codeLength = 4; //验证码的长度
      var random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ); //随机数
      for (var i = 0; i < codeLength; i++) {
        //循环操作
        var charIndex = Math.floor(Math.random() * 36); //取得随机数的索引
        this.code += random[charIndex]; //根据索引取得随机数加到code上
      }
    },
    UpLogin() {
      var CodeValue = this.code;
      var GetText = this.username;
      var GetPassword = this.password;
      var GetCode = this.getcode.toUpperCase();
      if (!GetText) {
        this.$message({
          showClose: true,
          message: "请输入账号"
        });
        return;
      }
      if (!GetPassword) {
        this.$message({
          showClose: true,
          message: "请输入密码"
        });
        return;
      }
      if (!GetCode) {
        this.$message({
          showClose: true,
          message: "请输入验证码"
        });
        return;
      }
      if (GetCode != CodeValue) {
        this.$message({
          showClose: true,
          message: "验证码错误"
        });
        this.CreateCode();
        this.password = "";
        this.getcode = "";
        return;
      }

      let json = {
		SN:"UserPermission",
        MN: "Login",
        DataContent: {
          UName: this.username,
          PassWord: this.password
        }
      };
      this.MIX_send(json);
    },
    ToLogin() {
      this.$router.push({ name: "register" });
    },
	QueryStaffByUIds(UIds){
		let obj = {
			SN:"Organization",
			MN: "QueryStaffByUId",
			DataContent: {
			  UId: UIds
			}
		};
		this.MIX_send(obj);
  },
  list(){
    console.log(this.list)
    for(var i=0 ; i<this.list.length;i++){
      if(this.list[i].id){
        this.list[i].id=i
        console.log(this.list)
      }
    }
  }
  },
  mounted() {
    this.CreateCode();
    console.log(this.list)
    this.list()
    
  },
  computed: {
    ...mapGetters(["Login","QueryStaffByUId"]),
  },
  watch: {
    //监听数据变化
    Login: function(data) {
      if (data.Code == 0) {
        sessionStorage.setItem("UserInfor", JSON.stringify(data.ReturnData));
		this.UId = data.ReturnData.UId;
		this.QueryStaffByUIds(this.UId);
        console.log(JSON.parse(sessionStorage.getItem("UserInfor")).Power);
      } else {
        this.$message({
          showClose: true,
          message: data.Message
        });
      }
    },
	QueryStaffByUId:function(data){
		
		
		
		
		if (data.Code == 0) {
			//员工详细信息存入sessionStorage
		  sessionStorage.setItem("UserDetial", JSON.stringify(data.ReturnData));
		  console.log(JSON.parse(sessionStorage.getItem("UserDetial")).Power);
		  this.$router.replace({ path: "/homePage" });
		} else {
		  this.$message({
		    showClose: true,
		    message: data.Message
		  });
		}
	}
  },
  created() {}
};
</script>

<style scoped>
#login {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  /* display: flex;
  flex-direction: column; */
  /* position: relative; */
}
.header {
  width: 100%;
  height: 4.25rem;
  position: absolute;
  left: 0;
  top: 0;
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 6px 0px rgba(206,208,212,0.47);
}
.nav {
  width: 100%;
  height: 100%;
  display: flex;
  background: url("../assets/images/bg-01.png") no-repeat center;
  background-size: 90%;
  background-position-y: -50%;
  flex: 1;
}

.hint {
  position: absolute;
  /* height: 22px; */
  /* top: 5vh; */
  left: 2.21%;
  line-height: 4.25rem;
  font-size: 1.125rem;
  font-weight:500;
  color:rgba(161,169,186,1);
}
.hint > span {
  font-size:1.125rem;
  font-weight:500;
  color:rgba(70,78,86,1);
  line-height:25px;
}
.hint > span::after{
	content: "";
	width: 0.0625rem;
	height: 4.25rem;
	border-left: 1px solid #000000;
	margin-left: 10px;
}

.inputs {
  position: absolute;
  width: 30rem;
  height: 34.125rem;
  background: rgb(255, 255, 255, 1);
  right: 15.4375rem;
  top: 12.375rem;
  text-align: center;
  box-shadow:0px 10px 20px 0px rgba(47,111,243,0.23);
  padding: 4.5625rem 3.75rem;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
.inputs > span {
  font-size:2.25rem;
  font-weight:500;
  color:rgba(0,0,0,1);
  line-height:3.125rem;
}

.footer {
  width: 100%;
  height: 40px;
  /* position: absolute;
  bottom: 0; */
  background: #000033;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
}
.footer > div {
  color: white;
  line-height: 40px;
  font-size: 16px;
}

.inputDiv {
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  height: 4.25rem;
  width: 100%;
  /* border-radius: 5px; */
  position: relative;
  border-bottom: solid 1px #f1f1f1;
}

.inputDiv input {
  outline: none;
  color: #606266;
  background: none;
  border: none;
  caret-color: #606266;
  font-size: 16px;
}
.inputDiv .username {
  width: 30px;
  background: url("../assets/images/icon-user.png") no-repeat;
}
.inputDiv .password {
  width: 30px;
  background: url("../assets/images/icon-password.png") no-repeat;
}
.inputDiv .verification {
  width: 30px;
  background: url("../assets/images/icon-yanzhengma.png") no-repeat;
}
.text {
  height: 4.25rem;
  width: 100%;
  border: none;
  line-height: 4.25rem;
  border-left: solid 1px gray;
  font-size:14px;
  font-weight:500;
}

.iconfont:after {
  content: "";
  width: 1px;
  height: 30px;
  color: #888;
  /* border-left: 1px solid #808080; */
  font-size: 12px;
  margin-left: 10px;
}

.pass {
  height: 4.25rem;
  width: 100%;
  border: none;
  line-height: 4.25rem;
  border-left: solid 1px gray;
  font-size:14px;
  font-weight:500;
}

.inputcode {
  height: 4.25rem;
  width: 55%;
  border: none;
  line-height: 4.25rem;
  font-size:14px;
  font-weight:500;
}
.createcode {
  height: 30px;
  width: 100px;
  background: #f8f7f8;
  line-height: 30px;
  color: #2d5d87;
  font-size: 20px;
  margin: auto;
  /* letter-spacing: 15px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px; */
}
.tologin {
  width: 100%;
  text-align: center;
  line-height: 3.25rem;
  height: 3.25rem;
  margin-top: 3rem;
  color: white;
  background: #2468f2;
  /* border-radius: 5px; */
  cursor: pointer;
}
.register {
  width: 70px;
  line-height: 25px;
  border-radius: 5px;
  background: #2468f2;
  color: #fff;
  position: absolute;
  bottom: 10px;
  right: 50px;
  font-weight: 100;
}
</style>
