<template>
  <Form label-position="left" ref="formRevise" :model="formRevise" :rules="ruleRevise" :label-width="80">
    <FormItem label="原密码" prop="oldPwd">
      <Input placeholder="请输入原密码..." type="password" v-model="formRevise.oldPwd"></Input>
    </FormItem>
    <FormItem label="新密码" prop="password">
      <Input placeholder="请输入新密码..." type="password" v-model="formRevise.password"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="passwordCheck">
      <Input placeholder="请再次输入密码..." type="password" v-model="formRevise.passwordCheck"></Input>
    </FormItem>
    <div style="width: 100%;display: inline-block;position: relative">
      <Button style="width: 100%" type="success" long @click="revise('formRevise')">修改密码</Button>
      <Spin fix v-if="$store.state.submit"></Spin>
    </div>
  </Form>
</template>

<script>
  import {request} from "../../network/request";
  import {loginOperate} from "./loginOperate";

  export default {
    name: "Revise",
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formRevise.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        formRevise: {
          username: '',
          oldPwd: '',
          password: '',
          passwordCheck: ''
        },
        ruleRevise: {
          oldPwd: [
            {required: true, message: '原密码不能为空', trigger: 'blur'},
            {min: 6, message: '密码至少6位', trigger: 'blur'}
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
      revise(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            request({
              url: '/user/resetPassword',
              params: {
                password: this.formRevise.oldPwd,
                newPassword: this.formRevise.password
              }
            }).then(result => {
              const userInfo = result.data.data
              if (result.data.resultCode === 0) {
                this.$store.commit('hideLoginBox')
                for (let i in userInfo) {
                  localStorage.setItem(i, userInfo[i])
                }
              } else
                this.$Message.error(result.data.rtnMessage)
              this.$store.commit('hideSubmit')
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