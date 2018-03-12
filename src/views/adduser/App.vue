<template>
<div>
  <mu-raised-button label="取消选择" @click="unselect"/>
  <mu-raised-button label="添加商户" />
  <mu-table multiSelectable enableSelectAll ref="table" class="listTable">
    <mu-thead>
      <mu-tr>
        <mu-th>ID</mu-th>
        <mu-th>商户名</mu-th>
        <mu-th>商家状态</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr>
        <mu-td>1</mu-td>
        <mu-td>商户A</mu-td>
        <mu-td>正常</mu-td>
      </mu-tr>
      <mu-tr>
        <mu-td>2</mu-td>
        <mu-td>商户B</mu-td>
        <mu-td>正常</mu-td>
      </mu-tr>
      <mu-tr>
        <mu-td>3</mu-td>
        <mu-td>商户C</mu-td>
        <mu-td>待审核</mu-td>
      </mu-tr>
      <mu-tr>
        <mu-td>4</mu-td>
        <mu-td>商户D</mu-td>
        <mu-td>未通过</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  <div class="deleteShopBtn">
    <mu-raised-button label="删除商户" class="demo-raised-button" secondary/>
  </div>
  

   <mu-pagination :total="total" :current="current" @pageChange="handleClick" class="ManagePagination">
     </mu-pagination>
</div>
</template>

<script>
  export default {
    data(){
      return {
        total: 500,
        current: 1
      }
    },
    components: {

    },
    methods: {
      unselect () {
        this.$refs.table.unSelectAll()
      },
      handleClick (newIndex) {
      }
    }
  }
</script>

<style scoped>
  .listTable{
    margin-top: 30px;
  }
  .mu-table tbody{
    line-height: 48px;
  }
  .deleteShopBtn{ 
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .ManagePagination{
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

</style>