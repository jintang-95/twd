<template>
    <div class="rightHead">
        <div class="rhleft"> 左</div>
        <div class="rhright"> 
            <img src="@/assets/images/img/shauxin.png" >
        </div>
    </div>
</template>
<script>
export default {
  name: "RightHead", //模板名称
  data() {
    return {};
  },
  methods: {
    // aaa(val) {
    //   console.log(val);
    // },
    // bbb(val) {
    //   console.log(val);
    // }
  },
  created() {},
  beforeMount() {},
};
</script>
<style scoped lang='less'>
.rightHead{
    width:100% ;
    height: 55px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
}
.rhleft{
    height: 16px;
    width:100px;
    float: left;
}
.rhright{
    height: 18px;
    width: 18px;
    float: right;
}
</style>