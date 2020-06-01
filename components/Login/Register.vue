<template>
  <Form label-position="left" ref="formRegister" :model="formRegister" :rules="ruleRegister" :label-width="80">
    <FormItem label="账号" prop="username">
      <Input type="text" placeholder="请输入账号..." v-model="formRegister.username"></Input>
    </FormItem>
    <FormItem label="昵称" prop="roleName">
      <Input type="text" placeholder="请输入昵称..." v-model="formRegister.roleName"></Input>
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input type="password" placeholder="请输入密码..." v-model="formRegister.password"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="passwordCheck">
      <Input type="password" placeholder="请再次输入密码..." v-model="formRegister.passwordCheck"></Input>
    </FormItem>
    <div style="width: 100%;display: inline-block; position: relative;">
      <Button style="width: 100%" type="success" long @click="register('formRegister')">注册</Button>
      <Spin fix v-if="$store.state.submit"></Spin>
    </div>
  </Form>
</template>

<script>
  import {request} from "../../network/request";
  import {loginOperate} from "./loginOperate";

  export default {
    name: "Register",
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formRegister.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      }
      return {
        formRegister: {
          username: '',
          roleName: '',
          password: '',
          passwordCheck: ''
        },
        ruleRegister: {
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
            {min: 6, message: '账号至少6位', trigger: 'blur'}
          ],
          roleName: [
            {required: true, message: '昵称不能为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, message: '密码至少6位', trigger: 'blur'}
          ],
          passwordCheck: [
            {required: true, validator: validatePassCheck, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      register(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            request({
              url: '/user/register',
              params: {
                username: this.formRegister.username,
                roleName: this.formRegister.roleName,
                password: this.formRegister.password
              }
            }).then(result => {
              const data = result.data
              const userInfo = data.data
              if (data.resultCode === 0) {
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
              } else {
                this.$store.commit('hideSubmit')
                this.$Message.error(data.rtnMessage)
              }
            }).catch(error => {
              console.log(error);
              this.$Message.error('发生错误，请联系管理员')
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>