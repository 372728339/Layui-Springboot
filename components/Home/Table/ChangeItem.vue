<template>
  <Modal v-model="model">
    <p style="font-weight: 800" slot="header">
      <span>新增物品</span>
    </p>
    <Form label-position="left" ref="item" :model="item" :rules="ruleItem" :label-width="80">
      <FormItem style="font-size: 12px" label="物品ID" prop="id">
        <Input placeholder="请输入物品ID..." type="text" v-model="item.id"></Input>
      </FormItem>
      <FormItem label="物品名称" prop="name">
        <Input @on-change="enterName" placeholder="请输入物品名称..." type="text" v-model="item.name"></Input>
      </FormItem>
      <FormItem label="物品类别" prop="type">
        <Select v-model="itemType" :label-in-value="true" @on-change="changeType" style="display: inline-block">
          <Option v-for="item in $store.state.item.type" :value="$store.state.item.type.indexOf(item)+1" :key="item">{{
            item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="设置权限" prop="privilege">
        <Slider :disabled="itemSlider" style="margin-left: 10px" :max="10" :min="1" :step="1" v-model="setPrivilege"
                show-input></Slider>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="()=>model=false">取消</Button>
      <Button type="primary" @click="changeItem('item')">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import {loadDoc} from "../../../network/request";

  export default {
    name: "changeItem",
    data() {
      const typeCheck = (rule, value, callback) => {
        if (this.itemType === '') {
          callback(new Error('请选择物品类别'));
        } else {
          callback();
        }
      }
      return {
        model: false,
        itemSlider: true,
        setPrivilege: 1,
        itemType: '',
        item: {
          id: '',
          name: '',
          type: ''
        },
        ruleItem: {
          id: [
            {required: true, message: '请输入物品ID', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入物品名称', trigger: 'blur'},
          ],
          type: [
            {required: true, validator: typeCheck, trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      changeType(value) {
        this.itemType = value.value
      },
      enterName() {
        this.itemSlider = false
      },
      changeItem(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            loadDoc({
              url: '/gm/insertItem',
              params: {
                id: this.item.id,
                name: this.item.name,
                type: this.item.type,
                privilege: this.setPrivilege
              }
            },this).then(result => {
              if (result.data.resultCode === 0) {
                this.$Message.success(result.data.rtnMessage)
                this.model = false
                this.$store.dispatch('getItem',this)
              } else
                this.$Message.error(result.data.rtnMessage)
              this.$Spin.hide()
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