<template>
  <div v-if="$store.getters.getPrivilege('mail')">
    <ItemTable :isAdmin="isAdmin" @postBan="postBan"/>
    <PostItem :itemInfo="activeItem" ref="postItem"/>
  </div>
</template>

<script>
  import PostItem from "./Table/PostItem";
  import ItemTable from "./Table/ItemTable";
  import {loadDoc} from "../../network/request";

  export default {
    name: "Resource",
    data() {
      return {
        isAdmin: false,
        activeItem: ''
      }
    },
    methods: {
      postBan(itemInfo) {
        this.activeItem = {itemInfo, username: localStorage.getItem('username'), isGm: false}
        this.$refs.postItem.disabled = false
      }
    },
    components: {
      ItemTable,
      PostItem
    }
  }
</script>

<style scoped>

</style>