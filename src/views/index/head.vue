<template>
<div id="app-head">
       <img src="../../assets/logo.png">
       <img src="../../assets/evun_logo.png"/>
</div>
</template>

<script>
export default {
  data() {
    return {
      titless: ""
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      this.titless = localStorage.getItem("title");
    }
  }
};
</script>
<style lang="less" >
#app-head {
  height: 80px;
  width: 100%;
  background: rgba(3, 53, 77, 0.637);
  box-shadow: 0px 1px 4px #ff5000;
  display: flex;
  align-items: center;
  color: #fff;
  img:nth-child(1){
    padding: 0 20px;
    display: inline-block;
    vertical-align: middle;
  }
  img:nth-child(2){
    padding: 0 700px;
    display: inline-block;
    vertical-align: middle;
  }
 
}

</style>
