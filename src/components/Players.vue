<template>
  <v-navigation-drawer right fixed app>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Players</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list two-line>
          <template v-for="(item, index) in items">
            <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>
            <v-list-tile v-else :key="item.title" avatar @click="changePlayer(item.title)">
              <v-list-tile-avatar v-if="item.avatar">
                <img :src="item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-navigation-drawer>
</template>
<script>
  export default {
    created () {
      window.$events.$on('players:view', this.update)
    },
    methods: {
      update: function (players) {
        this.items = []
        // console.log(players)
        let sortedPlayers = this.getSortedPlayersByScore(players)
        sortedPlayers
          .forEach(element => {
            this.items.push({
              title: element.name,
              subtitle: this.renderSubtitle(element),
              name: element.name,
              score: element.score
            })
          })
      },
      renderSubtitle: function (element) {
        return "<span class='text--primary'>" +
               'Score: <b>' + element.score + '</b> ' +
               'Life: <b>' + element.life + '</b> ' +
               'Ammo: <b>' + element.ammo + '</b>' +
               '</span> '
      },
      changePlayer: function (title) {
        var _item = this.items.find(element => element.title === title)
        window.$events.$emit('players:change', _item.name)
      },
      getSortedPlayersByScore: function (players) {
        return players.sort(function (p1, p2) {
          if (p1.score < p2.score) {
            return -1
          }
          if (p1.score > p2.score) {
            return 1
          }
          return 0
        }).reverse()
      }
    },
    data () {
      return {
        allPlayersScreen: false,
        enablePlayerInfoLevel: true,
        items: []
      }
    }
  }
</script>
