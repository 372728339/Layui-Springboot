<template>
  <Form>
    <h5 style="text-align: center">用户权限管理</h5>
    <FormItem label="选择功能：" :label-width="80">
      <Select v-model="userFn" :label-in-value="true" @on-change="changeUserPrivilege" style="display: inline-block">
        <Option v-for="item in userFnList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="设置权限：" :label-width="80">
      <Slider :disabled="userSlider" style="margin-left: 10px" :max="10" :min="1" :step="1" v-model="setUserPrivilege"
              show-input></Slider>
      <Button type="primary" long @click="setUser">修改用户权限</Button>
    </FormItem>
    <hr>
    <h5 style="text-align: center">管理员权限管理</h5>
    <FormItem label="选择功能：" :label-width="80">
      <Select v-model="gmFn" :label-in-value="true" @on-change="changeGmPrivilege" style="display: inline-block">
        <Option v-for="item in gmFnList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="设置权限：" :label-width="80">
      <Slider :disabled="gmSlider" style="margin-left: 10px" :max="10" :min="1" :step="1" v-model="setGmPrivilege"
              show-input></Slider>
      <Button type="primary" long @click="setGm">修改管理员权限</Button>
    </FormItem>
    <hr>
    <h5 style="text-align: center">物品管理</h5>
    <ItemTable :isAdmin="isAdmin" @postBan="postBan"/>
    <Row :gutter="16">
      <Col span="6">
        <Button type="primary" @click="addItem" long>新增物品</Button>
      </Col>
      <Col span="6">
        <Button type="primary" :disabled="disabled" long>修改物品</Button>
      </Col>
      <Col span="6">
        <Button type="primary" @click="deleteItem" :disabled="disabled" long>删除物品</Button>
      </Col>
      <Col span="6">
        <Button type="primary" @click="exportItem" long>excel导出</Button>
      </Col>
    </Row>
    <Row style="margin-left: -5px; margin-right: -5px; margin-top: 10px;">
      <Col>
        <Upload :format="['xls']" :on-format-error="()=>this.$Message.error('传入文件类型不是xls')"
                :show-upload-list=false multiple type="drag"
                :on-success="uploadItem"
                action="http://127.0.0.1/gm/import">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>excel导入</p>
          </div>
        </Upload>
      </Col>
    </Row>
    <hr>
    <h5 style="text-align: center">激活码管理</h5>
    <CodeTable/>
    <ChangeItem ref="itemBox"></ChangeItem>
  </Form>
</template>

<script>
  import ItemTable from "./Table/ItemTable";
  import CodeTable from "./Table/CodeTable";
  import {exportItem, loadDoc} from "../../network/request";
  import ChangeItem from "./Table/ChangeItem";

  export default {
    name: "Admin",
    data() {
      return {
        disabled: true,
        userSlider: true,
        gmSlider: true,
        setUserPrivilege: 1,
        setGmPrivilege: 1,
        itemInfo: '',
        userFn: '',
        gmFn: '',
        userFnList: [
          {value: -1, label: "请选择"},
          {value: "addPrivilege", label: "提升权限"},
          {value: "mail", label: "发送物品"},
          {value: "resetPassword", label: "修改密码"}
        ],
        gmFnList: [
          {value: -1, label: "请选择"},
          {value: "gmMail", label: "发送物品"},
          {value: "gmInsertRegCode", label: "生成激活码"},
          {value: "gmDeleteRegCode", label: "删除激活码"},
          {value: "gmCloseAccount", label: "封禁用户"}
        ],
        isAdmin: true,
      }
    },
    methods: {
      setUser() {
        loadDoc({
          url: '/gm/updateFunction',
          params: {
            name: this.userFn,
            privilege: this.setUserPrivilege
          }
        }, this).then(result => {
          if (result.data.resultCode === 0) {
            this.$Message.success(result.data.rtnMessage)
            this.$store.commit('updateFunction', {fun: this.userFn, privilege: this.setUserPrivilege})
          } else
            this.$Message.error(result.data.rtnMessage)
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      },
      setGm() {
        loadDoc({
          url: '/gm/updateFunction',
          params: {
            name: this.gmFn,
            privilege: this.setGmPrivilege
          }
        }, this).then(result => {
          if (result.data.resultCode === 0) {
            this.$Message.success(result.data.rtnMessage)
            this.$store.commit('updateFunction', {fun: this.gmFn, privilege: this.setGmPrivilege})
          } else
            this.$Message.error(result.data.rtnMessage)
          this.$Spin.hide()
        }).catch(error => {
          console.log(error)
          this.$Message.error('发生错误，请联系管理员')
        })
      },
      changeUserPrivilege(value) {
        value.value === -1 ? this.userSlider = true : this.userSlider = false
        this.setUserPrivilege = this.$store.state.functions[value.value]
      },
      changeGmPrivilege(value) {
        value.value === -1 ? this.gmSlider = true : this.gmSlider = false
        this.setGmPrivilege = this.$store.state.functions[value.value]
      },
      postBan(itemInfo) {
        this.disabled = false
        this.itemInfo = itemInfo
      },
      deleteItem() {
        this.$Modal.confirm({
          title: '删除物品',
          content: '<p>确认删除物品' + this.itemInfo.name + '吗？</p>',
          onOk: () => {
            loadDoc({
              url: '/gm/deleteItem',
              params: {
                itemId: this.itemInfo.id
              }
            }, this).then(result => {
              if (result.data.resultCode === 0) {
                this.$store.dispatch('getItem', this)
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
      addItem() {
        this.$refs.itemBox.model = true
      },
      uploadItem(response) {
        if (response.resultCode === 0) {
          this.$Message.success(response.rtnMessage)
          this.$store.dispatch('getItem', this)
        } else
          this.$Message.error(response.rtnMessage)
        this.$Spin.hide()
      },
      exportItem() {
        let url = 'http://hello.blsy.top:8000/gm/export'
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true);
        xhr.responseType = "blob"
        xhr.onload = function () {
          if (this.status == 200) {
            let blob = this.response
            let reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = function (e) {
              // 转换完成，创建一个a标签用于下载
              let a = document.createElement('a')
              a.download = 'item.xls'
              a.href = e.target.result
              document.body.append(a)   // 修复firefox中无法触发click
              a.click()
              document.body.removeChild(a)
            }
          }
        }
        xhr.send()
      }
    },
    components: {
      ItemTable,
      CodeTable,
      ChangeItem
    },

  }
</script>

<style type="text/css">
  .ivu-form .ivu-form-item-label {
    font-size: 12px;
  }

  .ivu-form .ivu-modal-wrap {
    height: 100%;
  }
</style>