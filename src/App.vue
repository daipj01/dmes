<template>
  <div id="app">
    <transition name="el-fade-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html,body{
  height:100%;
  margin:0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  display:flex;
  flex-direction: column;
  color: #2c3e50;
  min-width: 768px;
}
</style>
