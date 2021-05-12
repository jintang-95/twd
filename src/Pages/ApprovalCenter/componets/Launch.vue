<!-- 我发起的 -->
<template>
<div class="lazyBox"   ref="lazyBox">
  <div   v-if="cardList && cardList.lenght<0" class="nullArray">我还没有发起过</div>
  <div class="approCard" v-else  id="approCard">
      <div class="cardItem"
      v-for="(item,index) in cardList" :key="item.id">
        <div class="headImg">
          <img src="../../../assets/images/img_shenpi/head_img.jpg" class="headSrc">
        </div>
        <div class="headContent">
          <div class="headContentTop">
            <div class="headContentTopkz">
              <p class="headContentTopName">申请人:<span>{{item.Name}}</span></p>
              <p class="headContentTopTime">申请时间:<span>{{item.Addtime}}</span></p>
            </div>
            <div class="line"></div>
            <div class="waitSb" v-if="item.Status==1">待<span>{{item.waitSb}}</span>审核</div>
            <div class="waitSb waitSbNo" v-else-if="item.Status==2">审核通过</div>
            <div class="waitSb waitSbNo" v-else-if="item.Status==3">拒绝审核</div>
            <div class="waitSb waitSbNo" v-else-if="item.Status==4">退回</div>
            <div class="waitSb" v-else>作废</div>

          </div>
          <div class="headContentButtom">
            <div class="headContentButtomkz">
              <p>申请事项:<span>{{item.ProcessName}}</span></p>
              <p>审批详情:<span>{{item.Abstracts}}</span></p>
            </div>
            <div class="stateSealYes" v-if="item.Status==2"></div>
            <div :class="item.Status==2?'stateSealYes':'stateSealNo'" v-else></div>
          </div>
        </div>
      </div>
      <!-- loading加载图标 -->
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      formData: {
          StaffID:0,
          ApprovalStaffID:'19',
          Status:0,
          ProcessId:'',
          PageIndex:1,
          PageSize:6
        },
      // 卡片数据
      // status:1-待审核，2-已拒绝，3-已通过
      cardList:[]
    };
  },
  computed:{
  ...mapGetters([
        "GetCardData"
      ])
  },
  watch:{
    GetCardData(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.cardList = newValue.ReturnData.Data;
        console.log(newValue);
      } else {
        // 失败
        console.log('失败');
      }
    }
  },
  created() {

  },
  mounted() {
    this.getStorage()//获取本地用户session数据
    this.getCardData()//获取wait页面的卡片数据
    console.log(JSON.stringify(this.formData));
    this.layzLoad();//触发懒加载
  },
  methods: {
    //获取本地用户session数据
    getStorage(){
      let data=sessionStorage.getItem('UserDetial');
      console.log(data);
      // this.formData.ApprovalStaffID=JSON.parse(data).Id;
    },
    //获取卡片数据
     getCardData() {
      let obj = {
        SN: "ApprovalCenter",
        MN: "ApprovalProcessGetOrderList",
        DataContent:this.formData
      }
      this.MIX_send(obj);
    },
    // 卡片懒加载
    layzLoad(){
      let dom = this.$refs['lazyBox']
      dom.addEventListener("scroll", function() {
        const scrollDistance =dom.scrollHeight - dom.scrollTop - dom.clientHeight;
        if(scrollDistance <=0){//等于0证明已经到底，可以请求接口
            
          alert('请求接口')
        }
      })
    }
  }
};
</script>
<style scoped lang="less">
.lazyBox{
  width: 100%;
  height: 640px;
  overflow: hidden;
  overflow-y: scroll;
}
.approCard{
  width: 100%;
  overflow-y: auto;
  // border: solid 1px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  .cardItem{
    min-width: 30%;
    width: 32.4%;
    height: 270px;
    border-radius: 7px;
    background: #F0F7FB;
    margin: 10px 0;
    overflow: hidden;
    display: flex;
    p{
      span{
        padding-left: 5px;
      }
    }
    .headImg{
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      .headSrc{
        margin-top: 20px;
        display: block;
        width: 56px;
        height: 56px;
        border-radius: 50%;
      }
    }
    .headContent{
      flex: 5;
      height: 100%;
      display: flex;
      flex-direction: column;
      .headContentTop{
        flex: 4;
        width: 100%;
        position: relative;
        .headContentTopkz{
          position: absolute;
          top: 50%;
          margin-top: -35px;
          height: 70px;
          width: 70%;
          .headContentTopName{
            font-size: 22px;
            font-weight: 500;
            color: rgba(77, 100, 116, 1);
          }
          .headContentTopTime{
            font-size: 1rem;
            color: rgba(109, 121, 131, 1);
            margin-top: 8px;
          }
        }
        .line{
          width: 90%;
          height: 1px;
          background-color: rgba(135, 145, 154, 0.17);
          position: absolute;
          top: 50%;
          margin-top: 40px;
        }
        .waitSb{
          height: 36px;
          background-color: rgba(139, 210, 105, .2);
          text-align: center;
          line-height: 36px;
          color: rgba(139, 210, 105, 1);
          float: right;
          font-size: 16px;
          padding: 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .waitSbNo{
          background-color: rgba(245, 98, 98, .2);
          color: rgba(245, 98, 98, 1);
        }
      }
      .headContentButtom{
        flex: 7.3;
        width: 100%;
        position: relative;
        .headContentButtomkz{
          height: 130px;
          width: 60%;
          color: rgba(109, 121, 131, 1);
          font-size: 16px;
          line-height: 32px;
          p:nth-of-type(3){
            width: 100%;
            height: 60px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .stateSealNo{
          width: 76px;
          height: 66px;
          background: url("../../../assets/images/img_shenpi/shenpi-no.png") no-repeat;
          background-size: 76px 66px;
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .stateSealYes{
          width: 76px;
          height: 66px;
          background: url("../../../assets/images/img_shenpi/shenpi-yes.png") no-repeat;
          background-size: 76px 66px;
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }
    
  }
  
}
</style>