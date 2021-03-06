import { debounce } from 'ts-debounce'
import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

import { debounceSaveTimeout, firestoreCollections, oneMonth } from '@/const'
import firebaseProject, { CollectionFilter } from '@/plugins/firebase'
import { vxm } from '@/store'

const debounceInstances: {[index: string]: ({ uid, update }: {uid: string, update: any}) => void } = {}
const debouncedUpdateUpdate = ({ uid, update }: {uid: string, update: any}) => {
  if (typeof debounceInstances[uid] === 'undefined') {
    debounceInstances[uid] = debounce(({ uid, update }: {uid: string, update: any}) => {
      void firebaseProject.updateDocument(uid, firestoreCollections.updates, update)
    }, debounceSaveTimeout)
  }
  debounceInstances[uid]({ uid, update })
}

export default class extends createModule({ namespaced: 'updates', strict: false }) {
  updatedAt: number = 0
  updates: {[index: string]: ClubUpdate} = {}

  get updatesList (): ClubUpdateRecord[] {
    return Object.keys(this.updates).map(uid => ({
      uid,
      update: this.updates[uid]
    }))
  }

  get sinceUpdate () {
    return Date.now() - this.updatedAt
  }

  get isEmpty () {
    return Object.keys(this.updates).length === 0
  }

  @action
  async getUpdates () {
    const filter: CollectionFilter = {
      orderBy: [{ fieldPath: 'postAt', directionStr: 'desc' }]
    }
    if (!vxm.user.director && !vxm.user.super) {
      filter.where = [
        { fieldPath: 'postAt', opStr: '<=', value: Date.now().toString() },
        { fieldPath: 'postAt', opStr: '>', value: (Date.now() - (oneMonth * 3)).toString() }
      ]
    }
    const updates = await firebaseProject.getCollection(firestoreCollections.updates, filter) as {[index: string]: RawClubUpdate}
    const parsedUpdates: {[index: string]: ClubUpdate} = {}
    Object.keys(updates).forEach(key => { parsedUpdates[key] = { ...updates[key], postAt: parseInt(updates[key].postAt, 10) } })
    this._replaceData({ updates: parsedUpdates })
  }

  @action
  async getUpdate ({ uid }: {uid: string}) {
    const update = await firebaseProject.getDocument(uid, firestoreCollections.updates) as RawClubUpdate
    this._upsertUpdate({ uid, update: { ...update, postAt: parseInt(update.postAt, 10) } })
  }

  @action
  async createUpdate (update: ClubUpdate) {
    const uid = await firebaseProject.addDocument(firestoreCollections.updates, { ...update, postAt: update.postAt.toString() }) as string
    this._upsertUpdate({ uid, update })
    return uid
  }

  @action
  async updateUpdateContent ({ uid, update }: {uid: string, update: { title?: string, general?: ClubSpecificUpdate, cubbies?: ClubSpecificUpdate, sparks?: ClubSpecificUpdate, tnt?: ClubSpecificUpdate }}) {
    const updateDelta = { ...this.updates[uid], ...update }
    await debouncedUpdateUpdate({ uid, update })
    this._upsertUpdate({ uid, update: updateDelta })
  }

  @action
  async updateUpdateMeta ({ uid, update }: {uid: string, update: { postAt: number }}) {
    const updateDelta = { ...this.updates[uid], ...update }
    await debouncedUpdateUpdate({ uid, update: { ...update, postAt: update.postAt.toString() } })
    this._upsertUpdate({ uid, update: updateDelta })
  }

  @action
  async deleteUpdate ({ uid }: {uid: string}) {
    await firebaseProject.deleteDocument(uid, firestoreCollections.updates)
    this._deleteUpdate({ uid })
  }

  @action
  async dispose () {
    this._clear()
  }

  @mutation
  private _replaceData ({ updates }: {updates: {[index: string]: ClubUpdate} }) {
    this.updates = updates
    this.updatedAt = Date.now()
  }

  @mutation
  private _upsertUpdate ({ uid, update }: ClubUpdateRecord) {
    Vue.set(this.updates, uid, update)
  }

  @mutation
  private _deleteUpdate ({ uid }: {uid: string}) {
    Vue.delete(this.updates, uid)
  }

  @mutation
  private _clear () {
    this.updatedAt = 0
    this.updates = {}
  }
}
