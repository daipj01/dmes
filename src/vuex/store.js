import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)
//声明一个状态state
const state = {
    station: '',
    title:''
}

//然后给 actions 注册事件处理函数,当这个函数被触发时,将状态提交到mutaions中处理
const  actions = {
    increment:({commit})=>commit('increment'),
}

//更新状态
const mutations={
    increment (state){
        state.station="aaaa"
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions
})
