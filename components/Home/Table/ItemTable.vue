<template>
  <div>
    <Row :gutter="16">
      <Col span="12">
        <Input placeholder="请输入物品名称..." type="text" v-model="itemSearch"></Input>
      </Col>
      <Col span="12">
        <Button type="primary" long>搜索</Button>
      </Col>
    </Row>
    <br>
    <Table size="small" :loading="tableLoading" @on-current-change="selection" border highlight-row ref="itemTable"
           :columns="item" :data="itemList"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="$store.state.item.total" :current="1" size="small" show-total
              @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>

  import {loadDoc} from "../../../network/request";

  export default {
    name: "ItemTable",
    data() {
      return {
        itemSearch: '',
        tableLoading: false,
        item: this.itemHeader(),
        itemList: this.$store.state.item.itemInfo
      }
    },
    methods: {
      itemHeader() {
        let header = [];
        if (this.isAdmin) {
          header.push(
            {title: '物品ID', key: 'id', align: 'center'},
            {title: '物品名称', key: 'name', align: 'center'},
            {title: '物品类别', key: 'type', align: 'center'},
            {title: '物品权限', key: 'privilege', align: 'center'})
        } else {
          header.push(
            {title: '物品名称', key: 'name', align: 'center'},
            {title: '物品类别', key: 'type', align: 'center'})
        }
        return header;
      },
      changePage(index) {
        loadDoc({
          url: '/user/itemList',
          params: {
            page: index
          }
        },this).then(result => {
          const data = result.data
          if (data.resultCode === 1) {
            this.$store.commit('updateItem', data.table)
          }
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      },
      selection(currentRow, oldCurrentRow) {
        this.$emit("postBan", currentRow)
      }
    },
    props: ['isAdmin'],
  }

</script>

<style scoped>

</style>