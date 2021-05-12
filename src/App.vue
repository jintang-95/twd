<template>
  <div id="app">
	<router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      showmodule: true,
    };
  },
  created() {
    this.ws_init();
  }
};
</script>

<style lang="less">
@import "~@/assets/css/common.less";
* {
  margin: 0;
  padding: 0;
}
html,body{
  height:100%;
}
#app{
  height:100%;
}
.el-tree-node__label {
  font-size: 16px;
}
.el-tree-node__content {
  height: 50px!important;
}
.el-tree-node__content:hover {
    background-color: rgba(0,0,0,0.04);
}
.el-tree-node__expand-icon {
	font-size: 16px;
}
 /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar
  {
    width: 3px;  /*滚动条宽度*/
    height: 3px;  /*滚动条高度*/
    // background-color: #132958;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rgb(0, 96, 160)!important;  /*滚动条的背景颜色*/
  }

// element的input,select样式修改
.formContainerItem .el-input__inner:focus,
.formContainerItem .el-select:focus {
  border-color: none;
  box-shadow: none;
}
.formContainerItem .el-input__inner:hover,
.formContainerItem .el-select:hover,
.formContainerItem .el-select .el-input__inner:focus {
  border-right-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
  border-bottom-color: #57a3f3;
}
.formContainerItem .el-input__inner,
.formContainerItem .el-select {
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-bottom-color: 1px solid #dcdee2;
}
.formContainerItem .is-disabled .el-input__inner:hover,
.formContainerItem .el-select .is-disabled .el-input__inner:hover,
.formContainerItem .is-disabled .el-select .el-input__inner:focus {
  border-right-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
  border-bottom-color: 1px solid #e4e7ed !important;
}
.formContainerItem .is-disabled .el-input__inner,
.formContainerItem .is-disabled .el-select {
  background-color: transparent;
  color: #c0c4cc;
  cursor: not-allowed;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-bottom-color: 1px solid #e4e7ed;
}
.formContainerItem .is-error .el-input__inner,
.formContainerItem .is-error .el-select {
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-bottom-color: 1px solid #f56c6c;
}
.ModalForm .ivu-modal-content .ivu-modal-header {
  text-align: center;
}
.Scheduling .el-table th .cell {
  padding: 0;
}
.Scheduling .el-table .cell {
  padding-left: 0;
  padding-right: 1px;
  padding-bottom: 1px;
}
.left{

  background:#0060A0!important;

}

.el-menu-item.is-active{
    min-width: 250px!important;
    background:rgba(191,222,243,1)!important;
    color:rgba(0,96,160,1);
}
.el-submenu__title:hover{
  background-color: rgba(191,222,243,1) !important;
  color:rgba(0,96,160,1) !important;
}
.el-menu-item:hover{
  background-color: rgba(191,222,243,1) !important;
  color:rgba(0,96,160,1) !important;
}
.el-table th>.cell{
	text-align:center!important;
}

.slide-fade-enter-active {
  transition: all .7s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
 {
  transform: translateX(10px);
  opacity: 0;
}
.el-card__header{
	padding: 15px 5px!important;
}
</style>