<template>
	<div class="pageTOP">
		<span>{{this.title}}</span>
		<a id="reLode" @click="reLodeData">
		</a>
	</div>
</template>

<script>
	export default {
	  name: 'pageTop',
	  props: {
	    title:""
	  },
	  data() {
	    return {
	      isShow: true
	    }
	  },
	  methods:{
		  reLodeData:function(){
			history.go(0)
		  }
	  },
	  mounted() {
    }
	}
</script>

<style>
	#reLode{
		width: 1.125rem;
		height: 1.125rem;
		background: url(../assets/images/img/shauxin.png) no-repeat center center;
		background-size: 100% 100%;
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -0.5625rem;
		/* margin-right: 20px; */
		cursor: pointer
	}
	
	.pageTOP{
		width: 100%;
		border-bottom: 1px solid rgba(0,0,0,0.06);
		line-height: 3.125rem;
		position: relative;
		font-weight: 600;
	}
	/* 刷新动画 */
	
	  @-webkit-keyframes rotation {
	
	from {
	    -webkit-transform: rotate(0deg);
	}
	
	to {
	    -webkit-transform: rotate(360deg);
	}
	
	  }
	
	@keyframes rotation {
	    from {
	        -webkit-transform: rotate(0deg);
	        transform: rotate(0deg)
	    }
	
	to {
	    -webkit-transform: rotate(360deg);
	    transform: rotate(360deg)
	}
	
	}
</style>
