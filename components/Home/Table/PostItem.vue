<template>
  <Form ref="formPost" :rules="rulePost" :model="formPost">
    <FormItem prop="num">
      <Row :gutter="16">
        <Col span="12">
          <Input placeholder="请输入物品数量..." type="number" v-model="formPost.num"></Input>
        </Col>
        <Col span="12">
          <Button long type="primary" @click="post('formPost')" :disabled="disabled">发送物品</Button>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
  import {loadDoc} from "../../../network/request";

  export default {
    name: "PostItem",
    data() {
      const NumCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('数量不能为空'));
        } else if (value > 999) {
          callback(new Error('数量不能大于999'))
        } else if (value <= 0)
          callback(new Error('请输入正确的数量'))
        else
          callback()
      }
      return {
        formPost: {
          num: '',
        },
        disabled: true,
        rulePost: {
          num: [
            {validator: NumCheck, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      post(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.itemInfo.isGm) {
              loadDoc({
                url: '/gm/mail',
                params: {
                  uname: this.itemInfo.username,
                  itemId: this.itemInfo.itemInfo.id,
                  num: this.formPost.num
                }
              }, this).then(result => {
                const data = result.data
                if (data.resultCode === 0) {
                  this.$Message.success(data.rtnMessage)
                } else {
                  this.$Message.error(data.rtnMessage)
                }
                this.$Spin.hide()
              }).catch(error => {
                console.log(error)
                this.$Message.error('发生错误，请联系管理员')
              })
            } else {
              console.log(1)
              loadDoc({
                url: '/gm/mail',
                params: {
                  uname: this.$store.state.user.username,
                  itemId: this.itemInfo.itemInfo.id,
                  num: this.formPost.num
                }
              }, this).then(result => {
                const data = result.data
                if (data.resultCode === 0) {
                  this.$Message.success(data.rtnMessage)
                } else {
                  this.$Message.error(data.rtnMessage)
                }
                this.$Spin.hide()
              }).catch(error => {
                console.log(error)
                this.$Message.error('发生错误，请联系管理员')
              })
            }
          }
        })
      }
    },
    props: ['itemInfo']
  }
</script>

<style scoped>

</style>