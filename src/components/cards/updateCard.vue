<template>
  <v-card class="elevation-12 pb-2">
    <v-toolbar color="primary" flat dark>
      <v-toolbar-title v-text="update.title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <template v-for="(club, index) in clubs">
      <v-divider
        :key="'divider-' + index"
        class="mx-2 my-2"
        v-if="index > 0"
      ></v-divider>
      <v-list-item :key="'list-' + index">
        <v-list-item-avatar :color="club.color">
          <v-img :src="club.img"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{
            club.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-text
        v-text="club.update.text"
        style="white-space: pre-line"
        :key="index"
        class="pt-0 py-0"
      ></v-card-text>
      <v-card-actions
        v-if="club.update.video"
        :key="'action-' + index"
        class="py-2"
      >
        <v-spacer></v-spacer>
        <v-btn color="primary" :href="club.update.video" target="_blank">
          <v-icon class="mr-2">$video</v-icon>Watch Video
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { getClubColor, getClubImg } from '@/const'

@Component
export default class extends Vue {
  @Prop([Object]) readonly update!: ClubUpdate

  get clubs () {
    const clubs = []
    if (this.update.general && this.update.general.text !== '') {
      clubs.push({
        name: 'All Clubs',
        color: getClubColor('' as Club),
        img: getClubImg('' as Club),
        update: this.update.general
      })
    }

    if (this.update.cubbies && this.update.cubbies.text !== '') {
      clubs.push({
        name: 'Cubbies',
        color: getClubColor('c' as Club),
        img: getClubImg('c' as Club),
        update: this.update.cubbies
      })
    }

    if (this.update.sparks && this.update.sparks.text !== '') {
      clubs.push({
        name: 'Sparks',
        color: getClubColor('s' as Club),
        img: getClubImg('s' as Club),
        update: this.update.sparks
      })
    }

    if (this.update.tnt && this.update.tnt.text !== '') {
      clubs.push({
        name: 'T&T',
        color: getClubColor('b' as Club),
        img: getClubImg('b' as Club),
        update: this.update.tnt
      })
    }

    return clubs
  }
}
</script>
