<template>
  <div style="position:relative;margin-left: 10px; margin-right: 10px;">
    <Login/>
    <Tabs v-if="$store.state.login.loginStatus" type="card">
      <TabPane label="首页">
        <Center/>
      </TabPane>
      <TabPane label="后台操作">
        <Resource/>
      </TabPane>
      <TabPane v-if="$store.state.login.isGm" label="管理员">
        <Manger v-if="$store.state.login.isGm"/>
      </TabPane>
      <TabPane v-if="$store.state.login.isAdmin" label="网站管理">
        <Admin v-if="$store.state.login.isAdmin"/>
      </TabPane>
    </Tabs>
    <Spin fix v-if="$store.state.loading"></Spin>
  </div>
</template>

<script>
  import Center from "../components/Home/Center"
  import Resource from "../components/Home/Resource"
  import Manger from "../components/Home/Manger"
  import Admin from "../components/Home/Admin"
  import Login from "./Login"
  import {loadDoc} from "../network/request"

  export default {
    name: "Home",
    components: {
      Center,
      Resource,
      Manger,
      Admin,
      Login
    },
    mounted() {
      if (localStorage.getItem('loginStatus')) {
        this.$store.commit('hideLoginBox')
        this.$store.commit('login')
        this.$store.commit('updateInfo', {
          username: localStorage.getItem('username'),
          roleName: localStorage.getItem('roleName'),
          privilege: localStorage.getItem('privilege')
        })
        this.$store.dispatch('init', this).then(() => {
          this.$store.state.user.privilege >= this.$store.state.login.min ? this.$store.commit('changeGm', true) : this.$store.commit('changeGm', false)
          this.$store.state.user.privilege >= 10 ? this.$store.commit('changeAdmin', true) : this.$store.commit('changeAdmin', false)
        })
      } else {
        this.$store.commit('showLoginBox')
      }
    }
  }
</script>

<style lang="css">
  .ivu-spin-fix .ivu-spin-main {
    top: 50%
  }
</style>