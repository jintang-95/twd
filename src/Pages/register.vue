<template>
  <div id="register">
    <div class="RegisterInput">
        <h2>注册账号</h2>
        <div class="RegisText">账号:
            <input class="Text" type="text" placeholder="输入注册账号" v-model="usertext">
        </div>
        <div class="RegisPass">密码:
            <input class="Password" type="password" placeholder="输入注册密码" v-model="userword">
        </div>
        <div class="AgainPass">确认密码:
            <input class="AgainPassword" type="password" placeholder="再次输入注册密码" v-model="againuser">
        </div>
        <div class="Phone">手机号:
            <input class="PhonePass" type="text" maxlength="11" placeholder="请输入手机号" v-model="pnum">
        </div>
        <div class="ToRegister" @click="ToRegister">注册</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data(){
      return{
          usertext:'',
          userword:'',
          againuser:'',
          pnum:''
      }
  },
  methods:{
      ToRegister(){
          let Getuser = this.usertext;
          let Getword = this.userword;
          let Getagain = this.againuser;
          let Getnum = this.pnum;
          if(!Getuser){
              this.$message({
                showClose: true,
                message: "请输入账号"
                    });
              return;
          }
          if(!Getword){
              this.$message({
                showClose: true,
                message: "请输入密码"
                    });
              return;
          }
          if(!Getagain){
              this.$message({
                showClose: true,
                message: "请输入确认密码"
                    });
              return;
          }
          if(!Getnum){
              this.$message({
                showClose: true,
                message: "请输入手机号"
                    });
              return;
          }
          if(!this.validate(Getnum,'phone')){
              this.$message({
                showClose: true,
                message: "请输入正确的手机号"
                    });
              return;
          }
          if(Getword != Getagain){
              this.$message({
                showClose: true,
                message: "两次密码不同"
                    });
              return;
          }
          if(Getuser=="admin" && Getword=="123456"){
              alert("注册成功");
              this.$router.push({name:'login'})
          }
      }
  }
}
</script>

<style scoped>
#register{
    width: 100vw;
    height: 100vh;
    background: black;
}
.RegisterInput{
    width: 356px;
    height: 412px;
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    text-align: center;
}
.RegisterInput > h2{
    margin: 10px 0;
}
.RegisText{
    width: 300px;
    height: 50px;
    margin-top: 20px;
    font-size: 18px;
    line-height: 50px;
    padding-left: 20px;
}
.Text{
    width: 200px;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    margin-left: 10px;
}
.RegisPass{
    width: 300px;
    height: 50px;
    margin-top: 20px;
    font-size: 18px;
    line-height: 50px;
    padding-left: 20px;
}
.Password{
    width: 200px;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    margin-left: 10px;
}
.AgainPass{
    width: 300px;
    height: 50px;
    margin-top: 20px;
    font-size: 18px;
    line-height: 50px;
    padding-left: 4px;
}
.AgainPassword{
    width: 200px;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    margin-left: 6px;
}
.Phone{
    width: 300px;
    height: 50px;
    margin-top: 20px;
    font-size: 18px;
    line-height: 50px;
    padding-left: 14px;
}
.PhonePass{
    width: 200px;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    margin-left: 5px;
}
.ToRegister{
    height: 50px;
    width: 250px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    margin-left: 58px;
    margin-top: 30px;
    color: white;
    background: #2468F2;
    border-radius: 10px;
}
</style>
