<template>
<v-layout fluent>
  <v-card v-for="board in boards" :key="board.id">
    <board :id="board.id" :data="board"/>
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
      this.$events.$on('boards-view:update', (boardsList) => {
        this.boards = []
        console.log(boardsList)
        console.log(this)
        this.boards = boardsList
        this.$events.$emit('board:update')
      })
    },
    components: {
      board
    },
    name: 'Boards'
  }
</script>
