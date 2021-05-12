<template>
  <!-- 审批记录 -->
  <div class="app-container">
    <el-card class="box-card">
      <div class="topTitle">
        <label>审批记录</label>
        <label class="refresh" @click="refresh"></label>
        <div class="serach">
          <el-select
            v-model="ProcessIdValue"
            ref="serach"
            clearable
            @clear="ProcessIdListClear"
            @change="ProcessIdListChange"
            placeholder="请选择事项类型"
          >
            <el-option v-for="item in  ProcessIdList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </div>
      <!-- 选项卡部分 -->
      <div class="tab">
        <el-tabs value="0" @tab-click="handleClick" class="tabCard">
          <el-tab-pane label="待我审批">
            <!-- <Wait ref="Wait"></Wait> -->
            <!--待我审批卡片部分  -->
            <div class="lazyBox" ref="lazyBox1" id="lazyBox">
              <div class="ifNull" v-if="cardList && cardList.lenght<0">还没有数据</div>
              <div class="approCard" v-else>
                <div class="cardItem" v-for="(item,index) in cardList" :key="item.id">
                  <div class="headImg">
                    <img src="../../../assets/images/img_shenpi/head_img.jpg" class="headSrc" />
                  </div>
                  <div class="headContent">
                    <div class="headContentTop">
                      <div class="headContentTopkz">
                        <p class="headContentTopName">
                          申请人:
                          <span>{{item.Name}}</span>
                        </p>
                        <p class="headContentTopTime">
                          申请时间:
                          <span>{{item.Addtime}}</span>
                        </p>
                      </div>
                      <div class="line"></div>
                      <!-- <div class="waitSb">待<span>{{item.waitSb}}</span>审核</div> -->
                    </div>
                    <div class="headContentButtom">
                      <div class="headContentButtomkz">
                        <p>
                          申请事项:
                          <span>{{item.ProcessName}}</span>
                        </p>
                        <!-- <p>审批用时:<span>{{item.timeSpend}}</span></p> -->
                        <p>
                          审批详情:
                          <span>{{item.Abstracts}}</span>
                        </p>
                      </div>
                      <div class="btnGoApproval" @click="goApproval(item)">进入审批</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我审批的">
            <!-- <Already ref="Already"></Already> -->
            <div class="lazyBox" ref="lazyBox2" id="lazyBox">
              <div class="ifNull" v-if="cardList && cardList.lenght<=0">还没有数据</div>
              <div class="approCard" v-else>
                <div
                  class="cardItem"
                  v-for="(item,index) in cardList"
                  :key="item.id"
                  @click="lookInfo(item)"
                >
                  <div class="headImg">
                    <img src="../../../assets/images/img_shenpi/head_img.jpg" class="headSrc" />
                  </div>
                  <div class="headContent">
                    <div class="headContentTop">
                      <div class="headContentTopkz">
                        <p class="headContentTopName">
                          申请人:
                          <span>{{item.Name}}</span>
                        </p>
                        <p class="headContentTopTime">
                          申请时间:
                          <span>{{item.Addtime}}</span>
                        </p>
                      </div>
                      <div class="line"></div>
                      <div class="waitSb" v-if="item.Status==1">待审核</div>
                      <div class="waitSb" v-else-if="item.Status==2">审核通过</div>
                      <div class="waitSb waitSbNo" v-else-if="item.Status==3">拒绝审核</div>
                      <div class="waitSb waitSbNo" v-else-if="item.Status==4">退回</div>
                      <div class="waitSb waitSbNo" v-else-if="item.Status==5">作废</div>
                    </div>
                    <div class="headContentButtom">
                      <div class="headContentButtomkz">
                        <p>
                          申请事项:
                          <span>{{item.ProcessName}}</span>
                        </p>
                        <p>
                          审批详情:
                          <span>{{item.Abstracts}}</span>
                        </p>
                      </div>
                      <div class="stateSealYes" v-if="item.Status==2"></div>
                      <div class="stateSealNo" v-if="item.Status==3 || item.Status==4"></div>
                      <div class="stateSealVoid" v-if="item.Status==5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我发起的">
            <!-- <Launch ref="Launch"></Launch> -->
            <div class="lazyBox" ref="lazyBox3">
              <div class="ifNull" v-if="cardList && cardList.lenght<0">还没有数据</div>
              <div class="approCard" v-else id="approCard">
                <div
                  class="cardItem"
                  v-for="(item,index) in cardList"
                  :key="item.id"
                  @click="lookInfo(item)"
                >
                  <div class="headImg">
                    <img
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      class="headSrc"
                    />
                  </div>
                  <div class="headContent">
                    <div class="headContentTop">
                      <div class="headContentTopkz">
                        <p class="headContentTopName">
                          申请人:
                          <span>{{item.Name}}</span>
                        </p>
                        <p class="headContentTopTime">
                          申请时间:
                          <span>{{item.Addtime}}</span>
                        </p>
                      </div>
                      <div class="line"></div>
                      <div class="waitSb" v-if="item.Status==1">
                        待
                        <span>{{item.waitSb}}</span>审核
                      </div>
                      <div class="waitSb " v-else-if="item.Status==2">审核通过</div>
                      <div class="waitSb waitSbNo" v-else-if="item.Status==3">拒绝审核</div>
                      <div class="waitSb waitSbNo" v-else-if="item.Status==4">退回</div>
                      <div class="waitSb waitSbNo" v-else-if="item.Status==5" >作废</div>
                    </div>
                    <div class="headContentButtom">
                      <div class="headContentButtomkz">
                        <p>
                          申请事项:
                          <span>{{item.ProcessName}}</span>
                        </p>
                        <p>
                          审批详情:
                          <span>{{item.Abstracts}}</span>
                        </p>
                      </div>
                      <div class="stateSealYes" v-if="item.Status==2"></div>
                      <div class="stateSealNo" v-if="item.Status==3 || item.Status==4"></div>
                      <div class="stateSealVoid" v-if="item.Status==5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <goApproval ref="goApproval" v-if="ProcessID == 1"></goApproval>
    <goZCBF ref="goZCBF" v-if="ProcessID == 6"></goZCBF>
    <goKCBF ref="goKCBF" v-if="ProcessID == 5"></goKCBF>
    <goKCSL ref="goKCSL" v-if="ProcessID == 4"></goKCSL>
    <RSDDApproval ref="RSDDApproval" v-if="ProcessID == 3"></RSDDApproval>
  </div>
</template>

<script>
import goApproval from "@/components/QJApproval";
import goZCBF from "@/components/ZCBF";
import goKCBF from "@/components/KCBF";
import goKCSL from "@/components/KCSL";
import RSDDApproval from "@/components/RSDDApproval";
import { mapGetters } from "vuex";
import { Alert } from "element-ui";
export default {
  data () {
    return {
      active: 1, //定义active判断刷新页面
      ProcessIdList: [],
      ProcessIdValue: "",
      ProcessID: 0,
      formData: {
        StaffID: 0,
        ApprovalStaffID: JSON.parse(sessionStorage.getItem("UserDetial")).Id,
        Status: 1,
        ProcessId: "0",
        PageIndex: 1,
        PageSize: 9,
      },
      // 卡片数据
      cardList: [],
    };
  },
  //生命周期 - 创建完成
  async created () {
    this.formData.PageSize = 9;
    await this.getCardData(); //获取wait页面的卡片数据
  },
  components: {
    goApproval,
    goZCBF,
    goKCBF,
    goKCSL,
    RSDDApproval,
  },
  computed: {
    ...mapGetters(["GetCardData"]),
  },
  watch: {
    GetCardData (newValue, oldValue) {
      if (newValue.Code === 0) {
        this.cardList = newValue.ReturnData.Data;
        console.log(newValue);
        console.log(this.cardList);
        // if(this.active==2){
        //   // alert('dd')
        //       this.cardList =newValue.ReturnData.Data.filter(item => item.Status!=1 );
        //       console.log(this.cardList);
        // }
      } else {
        // 失败
        console.log("失败");
      }
    },
    // 流程列表
    "$store.state.ApprovalCenter.ApprovalProcessGetList": function (data) {
      console.log(data.ReturnData.Data);
      data.ReturnData.Data.forEach((item, index, arr) => {
        this.ProcessIdList.push(arr[index].ProcessName);
      });
    },
  },
  async mounted () {
    await this.getCardData(); //获取wait页面的卡片数据
    await this.getList(); //获取下拉筛选的类型名数据
    this.layzLoad(); //触发懒加载
  },
  methods: {
    // 获取列表
    getList () {
      let obj = {
        SN: "ApprovalCenter",
        MN: "ApprovalProcessGetList",
        DataContent: {},
      };
      this.MIX_send(obj);
    },
    //获取待我审批卡片数据
    getCardData () {
      let obj = {
        SN: "ApprovalCenter",
        MN: "ApprovalProcessGetOrderList",
        DataContent: this.formData,
      };
      console.log(JSON.stringify(this.formData));
      this.MIX_send(obj);
    },
    // 卡片懒加载
    layzLoad () {
      let dom = this.$refs["lazyBox1"];
      dom.addEventListener("scroll", async () => {
        const scrollDistance =
          dom.scrollHeight - dom.scrollTop - dom.clientHeight;
        //等于0证明已经到底，可以请求接口
        if (scrollDistance <= 0) {
          // this.loddings()//loadding
          this.formData.PageSize += 9;
          await this.getCardData();
        }
      });
      let dom2 = this.$refs["lazyBox2"];
      dom2.addEventListener("scroll", async () => {
        const scrollDistance =
          dom2.scrollHeight - dom2.scrollTop - dom2.clientHeight;
        //等于0证明已经到底，可以请求接口
        if (scrollDistance <= 0) {
          // this.loddings()//loadding
          this.formData.PageSize += 9;
          await this.getCardData();
        }
      });
      let dom3 = this.$refs["lazyBox3"];
      dom3.addEventListener("scroll", async () => {
        const scrollDistance =
          dom3.scrollHeight - dom3.scrollTop - dom3.clientHeight;
        //等于0证明已经到底，可以请求接口
        if (scrollDistance <= 0) {
          // this.loddings()//loadding
          this.formData.PageSize += 9;
          await this.getCardData();
        }
      });
    },
    // 筛选流程ProcessId
    ProcessIdListChange () {
      // this.ProcessIdValue
      switch (this.ProcessIdValue) {
        case "请假":
          this.formData.ProcessId = 1;
          break;
        case "请购":
          this.formData.ProcessId = 2;
          break;
        case "人事调动":
          this.formData.ProcessId = 3;
          break;
        case "库存申领":
          this.formData.ProcessId = 4;
          break;
        case "库存报废":
          this.formData.ProcessId = 5;
          break;
        case "资产报废":
          this.formData.ProcessId = 6;
          break;
      }
      this.getCardData();
    },
    //筛选流程清空下拉框触发事件
    ProcessIdListClear () {
      this.formData.ProcessId = "";
      this.getCardData();
    },
    //审批查看
    lookInfo (item) {
      console.log(item)
      this.ProcessID = item.ProcessID
      console.log(this.ProcessID)
      this.$nextTick(() => {
        if (item.ProcessID == 1) {
          this.$refs.goApproval.formData = item;
          this.$refs.goApproval.BillNum = item.BillNum;
          this.$refs.goApproval.noSpCenter = false;
          this.$refs.goApproval.dialogFormVisible = true;
        } else if (item.ProcessID == 6) {
          this.$refs.goZCBF.formData = item;
          this.$refs.goZCBF.BillNum = item.BillNum;
          this.$refs.goZCBF.noSpCenter = true;
          this.$refs.goZCBF.dialogZCBF = true;
        } else if (item.ProcessID == 5) {
          this.$refs.goKCBF.formData = item;
          this.$refs.goKCBF.BillNum = item.BillNum;
          this.$refs.goKCBF.noSpCenter = false;
          this.$refs.goKCBF.dialogKCBF = true;
        } else if (item.ProcessID == 4) {
          this.$refs.goKCSL.formData = item;
          this.$refs.goKCSL.BillNum = item.BillNum;
          this.$refs.goKCSL.noSpCenter = false;
          this.$refs.goKCSL.dialogKCSL = true;
        } else if (item.ProcessID == 3) {
          this.$refs.RSDDApproval.formData = item;
          this.$refs.RSDDApproval.BillNum = item.BillNum;
          this.$refs.RSDDApproval.noSpCenter = false;
          this.$refs.RSDDApproval.dialogFormVisible = true;
        }
      })
    },
    async refresh () {
      //刷新数据
      await this.getCardData();
    },
    search () {
      //搜索
      alert("搜索");
    },
    async handleClick (tab, event) {
      //tabs选项卡切换
      if (tab.$options.propsData.label == "待我审批") {
        this.formData.Status = 1;
        this.active = 1;
        this.formData.PageSize = 9;
        this.cardList = [];
        this.formData.ApprovalStaffID = JSON.parse(
          sessionStorage.getItem("UserDetial")
        ).Id;
        this.formData.StaffID = "0";
        await this.getCardData();
      } else if (tab.$options.propsData.label == "我审批的") {
        this.formData.Status = "2,3";
        this.active = 2;
        this.formData.PageSize = 9;
        this.cardList = [];
        this.formData.ApprovalStaffID = JSON.parse(
          sessionStorage.getItem("UserDetial")
        ).Id;
        this.formData.StaffID = "0";
        await this.getCardData();
      } else {
        this.formData.Status = "";
        this.active = 3;
        this.formData.PageSize = 9;
        this.cardList = [];
        this.formData.StaffID = JSON.parse(
          sessionStorage.getItem("UserDetial")
        ).Id;
        this.formData.ApprovalStaffID = "0";
        await this.getCardData();
      }
      console.log(tab, event);
    },
    // 进入审批，调用子组件弹窗
    goApproval (item) {
      this.ProcessID = item.ProcessID
      // this.$refs.goApproval.dialogFormVisible = true;
      console.log(item);
      this.$nextTick(() => {
        if (item.ProcessID == 1) {
          this.$refs.goApproval.formData = item;
          this.$refs.goApproval.BillNum = item.BillNum;
          this.$refs.goApproval.noSpCenter = true;
          this.$refs.goApproval.dialogFormVisible = true;
        } else if (item.ProcessID == 6) {
          this.$refs.goZCBF.formData = item;
          this.$refs.goZCBF.BillNum = item.BillNum;
          this.$refs.goZCBF.noSpCenter = true;
          this.$refs.goZCBF.dialogZCBF = true;
        } else if (item.ProcessID == 5) {
          this.$refs.goKCBF.formData = item;
          this.$refs.goKCBF.BillNum = item.BillNum;
          console.log(item);
          this.$refs.goKCBF.noSpCenter = true;
          this.$refs.goKCBF.dialogKCBF = true;
        } else if (item.ProcessID == 4) {
          this.$refs.goKCSL.formData = item;
          this.$refs.goKCSL.BillNum = item.BillNum;
          this.$refs.goKCSL.noSpCenter = true;
          this.$refs.goKCSL.dialogKCSL = true;
        } else if (item.ProcessID == 3) {
          this.$refs.RSDDApproval.formData = item;
          this.$refs.RSDDApproval.BillNum = item.BillNum;
          this.$refs.RSDDApproval.noSpCenter = true;
          this.$refs.RSDDApproval.dialogFormVisible = true;
        }
      })

      // alert(item.BillNum)
    },
    //调ZCBF子组件弹窗

    goZCBF (item) {
      // this.$refs.goZCBF.formData = item;
      // this.$refs.goZCBF.BillNum = item.BillNum;
      // this.$refs.goZCBF.dialogZCBF = true;
      console.log(item);
      // alert(item.BillNum)
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  height: 95%;
  padding: 20px;
}
.topTitle {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid rgba(135, 145, 154, 0.27);
  margin-bottom: 20px;
  color: rgba(77, 100, 116, 1);
  font-size: 24px;
  .refresh {
    float: right;
    width: 35px;
    height: 35px;
    background: url('../../../assets/images/img_shenpi/refesh.png');
    background-repeat: no-repeat;
    background-size: 18px 18px;
    margin-top: 10px;
    cursor: pointer;
  }
}
// 查询
.serach {
  float: right;
  margin-right: 20px;
}

/deep/.el-tabs__item.is-active {
  background: url('../../../assets/images/img_shenpi/tab-active.png');
  background-repeat: no-repeat;
  background-size: 132px 40px;
  color: #fff;
}
/deep/.el-tabs__item {
  padding: 0;
  line-height: 35px;
  // background: #F0F7FB;
  color: rgba(109, 121, 131, 1);
  width: 132px;
  text-align: center;
  font-size: 16px;
}
/deep/.el-tabs__nav-wrap::after {
  width: 0;
}
/deep/.el-tabs__active-bar {
  background: none;
}
// 组件样式
.lazyBox {
  width: 100%;
  height: 640px;
  overflow: hidden;
  overflow-y: scroll;
}
.approCard {
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  .cardItem {
    min-width: 30%;
    width: 32%;
    height: 270px;
    border-radius: 7px;
    background: #f0f7fb;
    margin: 10px 0;
    overflow: hidden;
    display: flex;
    margin-right: 20px;
    p {
      span {
        padding-left: 5px;
      }
    }
    .headImg {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      .headSrc {
        margin-top: 20px;
        display: block;
        width: 56px;
        height: 56px;
        border-radius: 50%;
      }
    }
    .headContent {
      flex: 5;
      height: 100%;
      display: flex;
      flex-direction: column;
      .headContentTop {
        flex: 4;
        width: 100%;
        position: relative;
        .headContentTopkz {
          position: absolute;
          top: 50%;
          margin-top: -35px;
          height: 70px;
          width: 70%;
          .headContentTopName {
            font-size: 22px;
            font-weight: 500;
            color: rgba(77, 100, 116, 1);
          }
          .headContentTopTime {
            font-size: 1rem;
            color: rgba(109, 121, 131, 1);
            margin-top: 8px;
          }
        }
        .line {
          width: 90%;
          height: 1px;
          background-color: rgba(135, 145, 154, 0.17);
          position: absolute;
          top: 50%;
          margin-top: 40px;
        }
        .waitSb {
          height: 36px;
          background-color: rgba(139, 210, 105, 0.2);
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
          color:red ;
        }
      }
      .headContentButtom {
        position: relative;
        flex: 7.3;
        width: 100%;
        .headContentButtomkz {
          height: 100px;
          width: 60%;
          color: rgba(109, 121, 131, 1);
          font-size: 16px;
          line-height: 32px;
          p:nth-of-type(2) {
            width: 100%;
            height: 60px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .btnGoApproval {
          width: 110px;
          height: 38px;
          background-color: rgba(0, 96, 160, 1);
          text-align: center;
          line-height: 38px;
          color: #fff;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 8px;
          cursor: pointer;
        }
        .stateSealNo {
          width: 76px;
          height: 66px;
          background: url('../../../assets/images/img_shenpi/shenpi-no.png')
            no-repeat;
          background-size: 76px 66px;
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .stateSealYes {
          width: 76px;
          height: 66px;
          background: url('../../../assets/images/img_shenpi/shenpi-yes.png')
            no-repeat;
          background-size: 76px 66px;
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .stateSealVoid {
          width: 76px;
          height: 66px;
          background: url('../../../assets/images/img_shenpi/shenpi-void.png')
            no-repeat;
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