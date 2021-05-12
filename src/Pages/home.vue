<template>
  <div id="home">
    <div class="left EditCMBox">
      <logo :collapse="isCollapse" />
      <el-menu
        router
        :default-active="active"
        text-color="#bfcbd9"
        background-color="#0060A0"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        style="border:none;margin-bottom:40px;color:;background-color: rgb(0, 95, 158);"
      >
      <Menu :menuList="this.routes"></Menu>
      </el-menu>
      <div class="open" @click="OpenNavi">
			<i class="iconfont icon-zhankai" style="color: #aaa;font-size: 14px;"></i>
      </div>
    </div>
    <div class="right">
      <div class="RightBody">
		  
        <div class="Timer" style="display:flex">
          <div class="hint_one">
            <el-breadcrumb separator-class="iconfont icon-iconyuandian" style="line-height: 75px;">
              <el-breadcrumb-item
                v-for="(item,index) in crumbs"
                :key="index"
                :to="{ path: item.path }"
              >{{item.meta.title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div
            class="hint_two"
          >{{year}}-{{mouth}}-{{day}}&nbsp;&nbsp;{{hours}}:{{minutes}}:{{seconds}}</div>
          <div class="hint_three">
            <div style="margin:0 15px;display: inline-block;" @click="showInfo">
				<el-badge :value="DataFormSon.workOrderNum" class="item">
					<el-button size="medium"><i class="iconfont icon-icongongdan" style="color: #5C87A4;margin-right: 5px;"></i>工单</el-button>
				</el-badge>
            </div>
            
            <!-- <div style="margin:0 15px;display: inline-block;" >
			  <el-badge :value="DataFormSon.MsgdataCOunt" class="item">
			  	<el-button size="medium"><i class="iconfont icon-iconxiaoxi" style="color: #5C87A4;margin-right: 5px;"></i>消息</el-button>
			  </el-badge>
            </div> -->
            <!-- <div style="margin:0 15px;display: inline-block;">帮助</div> -->
            <el-dropdown>
              <div style="margin-left:25px; color:#5C87A4; position: relative;padding-left: 25px;">
				<!-- <i class="iconfont icon-icon-user"></i> -->
				<el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span class="el-dropdown-link">{{loginname}}</span>
                <el-dropdown-menu>
                  <el-dropdown-item @click.native="changepass">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="BackLogin">退出账号</el-dropdown-item>
                </el-dropdown-menu>
              </div>
            </el-dropdown>
          </div>
        </div>
        <!-- 修改密码弹出框 -->
        <el-dialog title="修改密码" center :visible.sync="dialogPass" width="30%">
          <el-form label-width="80px">
            <el-form-item label="当前密码:">
              <el-input v-model="nowpass" placeholder="输入当前密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码:">
              <el-input v-model="newpass" placeholder="输入新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:">
              <el-input v-model="contentpass" placeholder="确认新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item style="text-align:right">
              <el-button type="primary" @click="clickcontent">确定</el-button>
              <el-button @click="clickcancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <transition name="slide-fade">
          <router-view @func="getDataFormSon"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu";
import Logo from "../components/Logo";
function addNum (timer) {
  return timer >= 10 ? timer : "0" + timer;
}
import { mapGetters } from "vuex";
export default {
  name: "home",
  data () {
    return {
      year: "",
      mouth: "",
      day: "",
      hours: "",
      minutes: "",
      seconds: "",
      loginname: "",
      isCollapse: false,
      routes: [],
      active: this.$route.meta.title,
      dialogPass: false,
      nowpass: "",
      newpass: "",
      contentpass: "",
	  MsgdataCOunt:"0",
	  workOrderNum:"0",
	  TaskCount:"0",
	  DataFormSon:{}
    };
  },
  components: {
    Menu,
    Logo
  },
  watch: {
    $route: {
      handler: function (val, params) {
        this.active = val.meta.title;
        console.log(val);
        let pageArr = val.matched.filter(item =>
          item.meta.hasOwnProperty("title")
        );
        this.$store.dispatch("setCrums", pageArr);
        this.crumbs = this.crums;
      }
    }
  },
  computed: {
    ...mapGetters(["crums"])
  },
  async created () {
    this.routes = this.$router.options.routes[2].children;
    // 初始化面包屑
    console.log(this.crums);
    this.crumbs = this.crums;
  },
  mounted () {
    this.loginname = JSON.parse(sessionStorage.getItem("UserDetial")).Name;
    this.gettime();
    setInterval(() => {
      this.gettime();
    }, 1000);
  },
  methods: {
    gettime () {
      let date = new Date();
      let Gyears = date.getFullYear();
      let Gmouths = date.getMonth() + 1;
      let Gday = date.getDate();
      let Ghours = date.getHours();
      let Gminutes = date.getMinutes();
      let Gseconds = date.getSeconds();
      this.year = addNum(Gyears);
      this.mouth = addNum(Gmouths);
      this.day = addNum(Gday);
      this.hours = addNum(Ghours);
      this.minutes = addNum(Gminutes);
      this.seconds = addNum(Gseconds);
    },
    OpenNavi () {
      if (!this.isCollapse) {
        this.isCollapse = true;
      } else {
        this.isCollapse = false;
      }
    },
    BackLogin () {
      this.$confirm("是否退出当前账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("UserInfor");
          this.$router.push({ path: "/" });
        })
        .catch(() => { });
    },
    changepass () {
      this.dialogPass = true;
    },
    clickcancel () {
      this.dialogPass = false;
      this.nowpass = "";
      this.newpass = "";
      this.contentpass = "";
    },
    clickcontent () {
      if (!this.nowpass) {
        this.$message({
          showClose: true,
          message: "请输入当前密码"
        });
      } else if (!this.newpass) {
        this.$message({
          showClose: true,
          message: "请输入新密码"
        });
      } else if (!this.contentpass) {
        this.$message({
          showClose: true,
          message: "请输入确认密码"
        });
      } else if (this.newpass != this.contentpass) {
        this.$message({
          showClose: true,
          message: "两次密码不一致"
        });
      } else {
        //补充接口
        this.dialogPass = false;
      }
    },
	getDataFormSon(data){
		this.DataFormSon = JSON.parse(data);
	},
	showInfo(){
		this.$router.push({
				path: '/WorkManage/index'
			});
	}
  }
};
</script>

<style scoped>

.is-active{
    min-width: 220px!important;
    background-color: #1f2d3d!important;
    color: #000000;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  height: calc(100% - 12rem);
  overflow-y: scroll;
  overflow-x: hidden;
  margin-right: -17px;
  margin-bottom: -17px;
}
.el-menu--collapse{
	width: 81px!important;
	height: calc(100% - 12rem);
	overflow-y: scroll;
	overflow-x: hidden;
	margin-right: -17px;
	margin-bottom: -17px;
}
#home {
  display: flex;
  width: 100%;
  min-width: 1400px;
  overflow: hidden;
  position: relative;
  height: 100%;
}
.left {
  max-width: 220px;
  height: 100%;
  min-height: 500px;
  background: #304156;
  overflow: hidden;
  overflow-y: hidden;
  position: relative;
}
.open {
  position: absolute;
  bottom: 0;
  left: 0; 
  line-height: 3rem;
  cursor: pointer;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
    width: 100%;
    height: 3rem;
    background: #065081;
	padding-left: 20px;
	color: #fff;
}
.right {
  flex: 1;
  height: 100vh;
  min-width: 1250px;
  /* overflow-y: auto; */
}
.Timer {
  display: flex;
  padding-left: 20px;
  /* padding-right: 20px; */
  text-align: center;
  height: 75px;
  /* overflow: hidden; */
  position: relative;
  background: #fff;
  -webkit-box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.hint_one {
 float: left;
 display: inline-block;
 font-size: 16px;
 line-height: 75px;
 /* margin-left: 20px; */
}
.hint_two {
	font-size: 18px;
  line-height: 75px;
  position: absolute;
  left: 50%;
  margin-left: -80px;
  color:#5C87A4;
  display: none;
}
.hint_three {
  height: 100%;
  line-height: 75px;
  position: absolute;
  right: 50px;
  color: #5C87A4;
}
.RightBody {
  background:#F5F8FF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.EditCMBox::-webkit-scrollbar {
  width: 4px;
}
.EditCMBox::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.EditCMBox::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.el_form_item .el-form-item__content {
  margin-left: 0px !important;
}

.el-breadcrumb{
  font-size: 15px;
  color:#5C87A4;
}
.tby{
  vertical-align:middle;
}
.gongdanxiaoxi{
  vertical-align:middle;
  color:#5C87A4;
  display: inline-block;
  position: relative;
}
.redPoint{
	width: 7px;
	height: 7px;
	background: #FF2D2D;
	position: absolute;
	top: 26px;
	border-radius: 50%;
}
</style>
<style >
.el-menu-vertical-demo{
  background:#0060A0;
}
.el-submenu__icon-arrow{
	right: 40px;
}
.el-menu-item, .el-submenu__title{
	height: 45px!important;
	line-height: 45px!important;
}
.el-submenu .el-menu-item{
	height: 40px!important;
	line-height: 40px!important;
}
.el-breadcrumb__separator{
	font-size: 8px!important;
	margin: 0 10px!important;
}
.el-avatar--circle{
	position: absolute;
	left: -15px;
	top:50%;
	margin-top: -15px;
}
.menusBox .el-submenu__title i{
	color: #BCCAE6;
	font-size: 18px;
}
.el-badge__content.is-fixed{
	position: absolute!important;
	top: 25px!important;
	right: 18px!important;
}
.el-badge .el-button{
	border: none;
}
</style>