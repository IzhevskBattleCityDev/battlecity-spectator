<template>
<v-layout>
  <v-card v-for="board in boards" :key="board.id">
    <board :id="board.id"/>
  </v-card>
</v-layout>
</template>

<script>
  import board from '@/components/Board'
  export default {
    data: function () {
      return {
        boards: []
      }
    },
    mounted: function () {
      this.$events.$on('boards:update', (params) => {
        console.log(params)
        console.log(this)
      })
    },
    created: function () {

    },
    components: {
      board
    },
    name: 'Boards'
  }
</script>
