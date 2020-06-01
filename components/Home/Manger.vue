<template>
  <div>
    <Row :gutter="16">
      <Col span="12">
        <Input placeholder="请输入昵称..." type="text" v-model="roleName"></Input>
      </Col>
      <Col span="12">
        <Input readonly type="text" v-model="username"></Input>
      </Col>
    </Row>
    <br>
    <Row :gutter="16">
      <Col span="12">
        <Button long @click="searchUname" type="primary">查询账号</Button>
      </Col>
      <Col v-if="$store.getters.getPrivilege('gmCloseAccount')" span="12">
        <Button long type="primary" :disabled="ban">封禁用户</Button>
      </Col>
    </Row>
    <br>
    <ItemTable v-if="$store.getters.getPrivilege('gmMail')" :isAdmin="isAdmin" @postBan="postBan"/>
    <PostItem v-if="$store.getters.getPrivilege('gmMail')" :itemInfo="activeItem" ref="postItem"/>
    <CodeTable/>
  </div>
</template>

<script>
  import ItemTable from "./Table/ItemTable";
  import CodeTable from "./Table/CodeTable";
  import PostItem from "./Table/PostItem";
  import {loadDoc} from "../../network/request";

  export default {
    name: "Manger",
    data() {
      return {
        ban: true,
        username: '',
        disabled: true,
        isAdmin: false,
        roleName: '',
        activeItem: ''
      }
    },
    methods: {
      postBan(itemInfo) {
        if (this.username != '')
          this.activeItem = {itemInfo, username: this.username, isGm: true}
        else
          this.activeItem = {itemInfo, username: localStorage.getItem('username'), isGm: false}
        this.$refs.postItem.disabled = false
      },
      searchUname() {
        loadDoc({
          url: '/gm/getUname',
          params: {
            roleName: this.roleName
          }
        },this).then(result => {
          const data = result.data
          if (data.resultCode === 0) {
            this.username = data.rtnMessage
            this.ban = false
          } else
            this.$Message.error(data.rtnMessage)
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      }
    },
    components: {
      ItemTable,
      CodeTable,
      PostItem
    }
  }
</script>

<style scoped>

</style>