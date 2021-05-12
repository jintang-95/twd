import { encryptDes, decryptDes, sha1_to_base64 } from '@/des.js'
var WS_obj = null;
var MIX_timerintvar = [];
var MIX_Token =null;
var MIX_timer =null;
var MIX_ERROR_timer =null;
var MIXlod =null;
var that = null;
let mixin = {
  data () {
    return {
      WS_obj:null,
      MIX_wsurl:'ws://192.168.1.234:8888/Handler.ashx?ConnectString=',
      MIXlod: null,
      MIX_readyState: null,
      MIX_timerintvar:[],
      fullscreenLoading:false,
      MIX_Token:null, // token
      MIX_MNData: {},
    }
  },
  methods: {
    //返回状态
     Getvalue(v1,v2,v3,v4){
      let checkarr = [];
      let arr = [v1,v2,v3,v4];
      arr.forEach((value,index)=>{
        if(value){
          checkarr.push(index)
        }
      })
      return checkarr.join(",");
    },
    //请求数据
    GetAllValue(data){
      let json = {
		SN:"UserPermission",
        MN: "QueryUser",
        DataContent: {
          KeyWord: "",
          UState: data,
          PageIndex:'1'
        }
      };
      this.MIX_send(json);
    },
    goto(url){
      this.$router.push({path:url});
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate(value, type) {
      // 非空验证
    if (type === 'require') {
      return !!value;
    }
      // 手机号验证
    if (type === 'phone') {
      return /^1\d{10}$/.test(value);
    }
      // 邮箱格式验证
    if (type === 'email') {
      return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
    }
    if (type === 'pwd') {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/.test(value);
    }
  },
    // 连接成功
    MIX_onopen(e){
      console.log("websocket连接成功");
    },
    MIX_Loding(){
      MIXlod = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    // 接收消息
    MIX_onmessage(e){
      MIXlod.close();
      console.log(e,"接收消息");
      let Mnname = e.MN;
      if (Mnname) {
        if(e.Code != "0" && e.Message == "Token超时" || e.Code != "0" && e.Message == "Token验证失败"){
          sessionStorage.removeItem("UserInfor");
          this.$router.push({path:'/'})
        }
        if (e.Code != "0") {
          this.$message.error(e.Message);
          return
        }
         this.$store.commit("Setfunname",e)
      } else {
        MIX_Token = e.ReturnData.Token;
        // 发送离线缓存请求
        if (MIX_timerintvar.length) {
          MIX_timerintvar.forEach((item,index)=>{
            item.Token = e.ReturnData.Token;
            // this.MIX_send(item);
          });
          MIX_timerintvar.forEach((item,index)=>{
            // item.Token = e.ReturnData.Token;
            this.MIX_send(item);
          });
          MIX_timerintvar = [];
        }
        // sessionStorage.setItem("MIX_Token", MIX_Token);
        // 发送心跳
        clearInterval(MIX_timer);
        MIX_timer = setInterval(() => {
          let obj = {"MN":"Heart","Token": MIX_Token};
          WS_obj.send(JSON.stringify(obj));
        }, 20000);
        // console.log(MIX_Token,'4444');
      }
    },
    // 连接报错
    MIX_onerror(e){
      console.log(e,'连接报错');
      clearTimeout(MIX_ERROR_timer);
      MIX_ERROR_timer = setTimeout(() => {
        that.ws_init();
      }, 2000);
      this.$message.error(e);
    },
    MIX_send(data,ulfe){
      if (!ulfe) {
        data.Token = MIX_Token;
        let username = JSON.parse(sessionStorage.getItem('UserInfor'));
		let userDetil = JSON.parse(sessionStorage.getItem('UserDetial'));
        if (username && username.Token) {
          data.DataContent.Token = username.Token;
          data.UserId = username.UId;
        }
		if(userDetil && userDetil.Id){
			data.StaffID = userDetil.Id;
		}
		else{
			data.StaffID = "";
		}
      }
      this.MIX_Loding();
      if (WS_obj.readyState == 1) {
        // 判断是否是上传文件
        if (!ulfe) {
          console.log(JSON.stringify(data),'发送数据');
          WS_obj.send(JSON.stringify(data));
        } else {
          console.log(JSON.stringify(data),'发送数据');
          WS_obj.send(data);
        }
      } else {
        MIX_timerintvar.push(data);
        console.log(MIX_timerintvar,'加入离线队列');
      }
    },
    ws_close(){
      WS_obj.close()
    },
    // 初始化连接
    ws_init(){
      that = this;
      WS_obj = null;
      this.MIX_Loding();
      // DES加密
      var appid = '';
      var UserInfor = JSON.parse(sessionStorage.getItem('UserInfor'));
      // console.log(UserInfor);
      // 登录用默认的AppKey和AppSecret，登陆成功后用登陆的AppKey和AppSecret
      // if (UserInfor && UserInfor.AppKey) {
      //   appid = encryptDes("AppKey="+UserInfor.AppKey+"&AppSecret="+UserInfor.AppSecret,this.$config.config.WS_rule_key,this.$config.config.WS_rule_vi);
      // } else {
        appid = encryptDes("AppKey="+this.$config.config.WS_Login_AppKey+"&AppSecret="+this.$config.config.WS_Login_AppSecret,this.$config.config.WS_rule_key,this.$config.config.WS_rule_vi);
      // }
      
      // console.log(decryptDes(appid,this.$config.config.WS_rule_key,this.$config.config.WS_rule_vi),'发起连接');
      if ("WebSocket" in window) {
        WS_obj = new WebSocket(this.$config.config.WS_URl + sha1_to_base64(appid));
        WS_obj.onopen = (params)=> {
          that.MIX_onopen(params);
        };
        WS_obj.onmessage = (params)=> {
          that.MIX_onmessage(JSON.parse(params.data))
        };
        WS_obj.onerror = (params)=> {
          clearInterval(MIX_timer);
          that.MIX_onerror(JSON.stringify(params));
        }
        WS_obj.onclose = function() {
          // 关闭 websocket
          clearInterval(MIX_timer);
          // this.$message.error('连接已关闭');
          console.log("连接已关闭...");
          clearTimeout(MIX_ERROR_timer);
          MIX_ERROR_timer = setTimeout(() => {
            that.ws_init();
          }, 2000);
        };
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
        }
  }
}
export default mixin
