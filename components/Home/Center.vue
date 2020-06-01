<template>
  <div style="text-align: center">
    <Icon type="ios-home" size="50" color="rgb(135, 208, 104)"/>
    <h2>昵称：<span>{{$store.getters.getUserInfo.roleName}}</span></h2>
    <h2>等级：<span>{{$store.getters.getUserInfo.privilege}}</span></h2>
    <div v-if="$store.getters.getPrivilege('resetPassword')" style="margin-top: 20px">
      <Button type="primary" @click="resetPwd" long>修改密码</Button>
    </div>
    <div v-if="$store.getters.getPrivilege('addPrivilege')">
      <Form label-position="left" ref="formCode" :model="formCode" :rules="ruleCode">
        <FormItem prop="code">
          <Input style="margin-top: 20px" placeholder="激活码..." type="text" v-model="formCode.code"></Input>
        </FormItem>
      </Form>
      <div style="margin-top: 20px">
        <Button type="primary" @click="level('formCode')" long>提升权限</Button>
      </div>
    </div>
    <div style="margin-top: 20px">
      <Button type="primary" @click="logout" long>退出登录</Button>
    </div>
  </div>
</template>

<script>
  import {loadDoc} from "../../network/request"

  export default {
    name: "Center",
    data() {
      return {
        username: '',
        roleName: '',
        privilege: '',
        formCode: {
          code: ''
        },
        ruleCode: {
          code: [
            {required: true, message: '请输入32位激活码', trigger: 'blur'},
            {min: 32, message: '请输入32位激活码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      level(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            loadDoc({
              url: '/user/addPrivilege',
              params: {
                code: this.formCode.code
              }
            },this).then(result => {
              if (result.data.resultCode === 0) {
                this.$Message.success(result.data.rtnMessage)
                localStorage.setItem('privilege', result.data.data.privilege)
                this.$store.commit('updateInfo', {privilege: localStorage.getItem('privilege')})
              } else {
                this.$Message.error(result.data.rtnMessage)
              }
              this.$Spin.hide()
            }).catch(error => {
              console.log(error);
              this.$Message.error('发生错误，请联系管理员')
            })
          }
        })
      },
      logout() {
        this.$Modal.confirm({
          title: '退出登录',
          content: '<p>确认退出登录吗？</p>',
          onOk: () => {
            loadDoc({
              url: '/user/logout'
            },this).then(result => {
              if (result.data.resultCode === 0) {
                localStorage.clear()
                this.$store.commit('updateInfo', {username: null, roleName: null, privilege: null})
                this.$store.commit('logout')
                this.$store.commit('showLoginBox')
                this.$store.commit('clearItem')
              } else {
                this.$Message.error(result.data.rtnMessage)
              }
              this.$Spin.hide()
            }).catch(error => {
              console.log(error);
              this.$Message.error('发生错误，请联系管理员')
            })
          },
          onCancel: () => {
          }
        })
      },
      resetPwd() {
        this.$store.commit('changeTab', 'reset')
        this.$store.commit('showLoginBox')
      }
    }
  }
</script>

<style type="text/css">
</style>