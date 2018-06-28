<template>
  <v-app>
    <Menu/>
    <v-content>
      <router-view/>
    </v-content>
    <Players/>
    <v-footer>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import Players from '@/components/Players'
import Menu from '@/components/Menu'

export default {
  name: 'App',
  data () {
    return {
      drawer: false,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'CodeBattle Game Spectrator'
    }
  },
  components: {
    Players, Menu
  }
}
</script>
