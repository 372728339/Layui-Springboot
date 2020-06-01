<template>
  <Form label-position="left" ref="formSign" :model="formSign" :rules="ruleSign" :label-width="80">
    <FormItem style="font-size: 12px" label="用户名" prop="username">
      <Input placeholder="请输入用户名..." type="text" v-model="formSign.username"></Input>
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input placeholder="请输入密码..." type="password" v-model="formSign.password"></Input>
    </FormItem>
    <Button style="width: 100%" type="success" long @click="login('formSign').then(init)">登录</Button>
    <Spin fix v-if="$store.state.login.submit"></Spin>
  </Form>
</template>

<script>
  import {request} from "../../network/request";
  import {loginOperate} from "./loginOperate";

  export default {
    name: "Sign",
    data() {
      return {
        formSign: {
          username: '',
          password: ''
        },
        ruleSign: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {min: 6, message: '用户名至少6位', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, message: '密码至少6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login(name) {
        return new Promise((resolve, reject) => {
          this.$refs[name].validate((valid) => {
            if (valid) {
              request({
                url: '/user/login',
                params: {
                  username: this.formSign.username,
                  password: this.formSign.password
                }
              }, this).then(result => {
                const data = result.data
                const userInfo = data.data
                if (data.resultCode === 0) {
                  localStorage.setItem('loginStatus', 'true')
                  this.$store.commit('login')
                  this.$store.commit('hideLoginBox')
                  for (let i in userInfo) {
                    localStorage.setItem(i, userInfo[i])
                  }
                  this.$store.commit('updateInfo', {
                    username: localStorage.getItem('username'),
                    roleName: localStorage.getItem('roleName'),
                    privilege: localStorage.getItem('privilege')
                  })
                  this.$store.commit('hideSubmit')
                  this.$Message.success(result.data.rtnMessage + '欢迎来到魔仙堡')
                  this.$store.dispatch('getItem', this)
                  this.$store.dispatch('getCode', this)
                } else {
                  this.$store.commit('hideSubmit')
                  this.$Message.error(data.rtnMessage)
                }
                resolve()
              }).catch(error => {
                console.log(error);
                this.$Message.error('发生错误，请联系管理员')
                reject()
              })
            }
          })
        })
      },
      init() {
        this.$store.dispatch('init', this).then(()=>{
          this.$store.state.user.privilege >= this.$store.state.login.min ? this.$store.commit('changeGm', true) : this.$store.commit('changeGm', false)
          this.$store.state.user.privilege >= 10 ? this.$store.commit('changeAdmin', true) : this.$store.commit('changeAdmin', false)
        })
      }
    }
  }
</script>

<style type="text/css">
  .ivu-input {
    font-size: 12px;
  }
</style>