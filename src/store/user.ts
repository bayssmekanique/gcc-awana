import { createModule, mutation } from 'vuex-class-component'

export default class extends createModule({ namespaced: 'user', strict: false }) {
  firstName = ''
  lastName = ''
  email = ''

  get fullName () {
    return this.firstName + ' ' + this.lastName
  }

  get isEmpty () {
    return this.firstName === '' && this.lastName === ''
  }

  get isValid () {
    return this.firstName.length > 0 &&
     this.lastName.length > 0
    //  this.email.length > 0
  }

  @mutation
  clear () {
    this.firstName = ''
    this.lastName = ''
    this.email = ''
  }
}
