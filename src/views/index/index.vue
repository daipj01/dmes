<template>
  <div class="hello-pad" @click="closeMenu">
    <app-head></app-head>
   <app-body class="content">
    </app-body>
   <app-foot @changeNavMenu=""></app-foot>
  </div>
</template>
<script>
import appFoot from "./foot.vue";
import appBody from "./body.vue";
import appHead from "./head.vue";
export default {
  data() {
    return {
      isShowNavMenu: false
    };
  },
  created() {},
  components: {
    appFoot,
    appBody,
    appHead
  },
  methods: {
    closeMenu() {
      this.isShowNavMenu = false;
    },
    NavMenuEmit(data) {
      this.isShowNavMenu = !this.isShowNavMenu;
    },
    changeNavMenu() {
      console.log(q11);
    }
  }
};
</script>

<style lang="less" scoped>
.hello-pad {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #EDEDED;
  overflow: hidden;
  .content {
    height:619px;
    flex: 1;
    display: flex;
  }
}
</style>
