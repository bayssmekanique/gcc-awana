<template>
  <v-container fluid class="fill-height">
    <v-row v-if="clubbersList.length === 0" align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-card-title>No clubbers</v-card-title>
          <v-card-subtitle>There are no clubbers attached to this user account.</v-card-subtitle>
          <v-card-text>
            <p>If your clubbers have already been registered for more than a day, contact the church office to resolve.</p>
            <v-list-item-title class="text--gray">
              Grace Community Church Visalia
              <br />
              <a href="tel:1-559-733-3966">+1 (559) 733-3966</a>
            </v-list-item-title>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-for="(record, index) in clubbersList" :key="index">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title v-text="getFullname(record.clubber)"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="openClubber(record.cid)">
              <v-icon>$more</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="py-2 px-3">
            <template v-if="record.book.type === 'c'">
              <cubbies-book-progress :record="record"></cubbies-book-progress>
            </template>
            <template v-if="record.book.type === 's'">
              <sparks-book-progress :record="record"></sparks-book-progress>
            </template>
            <template v-if="record.book.type === 't'">
              <t-n-t-book-progress :record="record"></t-n-t-book-progress>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import CubbiesBookProgress from '@/components/partials/cubbiesBookProgress.vue'
import SparksBookProgress from '@/components/partials/sparksBookProgress.vue'
import TNTBookProgress from '@/components/partials/tntBookProgress.vue'
import { fiveMinutes, getFullname } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    CubbiesBookProgress,
    SparksBookProgress,
    TNTBookProgress
  }
})
export default class extends Vue {
  loading = false

  readonly getFullname = getFullname

  get clubbersList () {
    return vxm.clubbers.clubbersList
      .filter(record => record.clubber?.parents?.includes(vxm.user.phoneNumber))
  }

  async mounted () {
    if (vxm.clubbers.sinceUpdate > fiveMinutes) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecords()
    this.loading = false
  }

  openClubber (cid: string) {
    this.$router.push({ name: 'ParentClubberView', params: { cid } })
  }
}
</script>
