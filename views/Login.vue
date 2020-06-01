<template>
  <Modal class-name="login-modal" :title="title" v-model="$store.state.login.loginBox" :closable="false"
         :mask-closable="false" :footer-hide="true" width="800">
    <Tabs :value="$store.state.login.tabValue" type="card">
      <TabPane name="login" label="登录">
        <Sign/>
      </TabPane>
      <TabPane name="register" label="注册">
        <Register/>
      </TabPane>
      <TabPane name="reset" label="修改密码">
        <Revise/>
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script>
  import Sign from "../components/Login/Sign"
  import Register from "../components/Login/Register"
  import Revise from "../components/Login/Revise";
  import {request} from "../network/request";

  export default {
    name: "Login",
    data() {
      return {
        title: "欢迎使用本系统，请先登录或注册",
      }
    },
    mounted() {
    },
    components: {
      Revise,
      Sign,
      Register
    }
  }
</script>

<style lang="less">
  .login-modal {
    .ivu-modal-header-inner {
      font-size: 12px;
    }

    .ivu-form-item-label {
      font-size: 12px;
    }
  }
</style>