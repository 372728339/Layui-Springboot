<template>
  <div>
    <Form>
      <Table size="small" :loading="tableLoading" @on-current-change="selection" border highlight-row ref="itemTable"
             :columns="code" :data="codeList"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="$store.state.total" :current="1" size="small" show-total @on-change="changePage"></Page>
        </div>
      </div>
      <FormItem>
        <Button v-if="$store.getters.getPrivilege('gmDeleteRegCode')" style="width: 100%" type="primary"
                @click="deleteCode" :disabled="disabled">删除激活码
        </Button>
      </FormItem>
      <Slider v-if="$store.getters.getPrivilege('gmInsertRegCode')" style="margin-left: 10px" :min="1" :max="$store.state.user.privilege-1"
              :step="1" v-model="privilege" show-input></Slider>
      <Button v-if="$store.getters.getPrivilege('gmInsertRegCode')" style="width: 100%" type="primary"
              @click="productCode">生成激活码
      </Button>
    </Form>
  </div>
</template>

<script>
  import {loadDoc} from "../../../network/request";

  export default {
    name: "CodeTable",
    data() {
      return {
        privilege: 1,
        tableLoading: false,
        disabled: true,
        code: [
          {title: '激活码', key: 'code', align: 'center'},
          {title: '权限', key: 'privilege', align: 'center', width: '80', sortable: true}],
        codeList: this.$store.state.codeInfo,
        selectCode: {}
      }
    },
    methods: {
      changePage(index) {
        loadDoc({
          url: '/gm/findRegCodeList',
          params: {
            page: index
          }
        },this).then(result => {
          const data = result.data
          if (data.resultCode === 1) {
            this.$store.commit('updateCode', data.table)
            this.$store.commit('codeTotal', data.total)
          } else
            this.$Message.error(data.rtnMessage)
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      },
      selection(currentRow, oldCurrentRow) {
        this.disabled = false
        this.selectCode = currentRow
      },
      productCode() {
        loadDoc({
          url: '/gm/insertRegCode',
          params: {
            privilege: this.privilege
          }
        },this).then(result => {
          const data = result.data
          if (data.resultCode === 0) {
            this.$Message.success(data.rtnMessage)
            this.$store.dispatch('getCode',this)
          }else
            this.$Message.error(data.rtnMessage)
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      },
      deleteCode() {
        loadDoc({
          url: '/gm/deleteRegCode',
          params: {
            code: this.selectCode.code
          }
        },this).then(result => {
          const data = result.data
          if (data.resultCode === 0) {
            this.$Message.success(data.rtnMessage)
            this.$store.dispatch('getCode',this)
          }else
            this.$Message.error(data.rtnMessage)
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      }
    }
  }
</script>

<style scoped>

</style>