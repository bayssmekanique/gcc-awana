<template>
  <ValidationProvider mode="lazy" :name="$attrs.label" :rules="rules" v-slot="{ errors }">
    <v-select
      v-model.trim="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
      ref="stateSelect"
      @hook:mounted="onSelectMounted"
    ></v-select>
  </ValidationProvider>
</template>

<script lang="ts">
import { ValidationProvider } from 'vee-validate'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    ValidationProvider
  }
})
export default class extends Vue {
  innerValue = ''

  @Ref('stateSelect') readonly stateSelectComponent !: Vue
  @Prop([String, Object]) readonly rules!: string | {required?: boolean, regex?: string | RegExp, oneOf?: string[]}
  @Prop([String]) readonly value!: string

  @Watch('innerValue')
  onInnerValueChanged (val: string) {
    this.$emit('input', val)
  }

  @Watch('value')
  onValueChanged (value: string) {
    this.innerValue = value
  }

  created () {
    this.innerValue = this.value
  }

  onSelectMounted () {
    const input = this.stateSelectComponent.$el.querySelector('.v-select__selections input')
    if (input) {
      (
        input.removeAttribute('readonly')
      )
    }
  }
}
</script>

<style lang='scss'>
// .v-select__selections input {
//   position: absolute !important;
//   left: -999999px !important;
// }
</style>
