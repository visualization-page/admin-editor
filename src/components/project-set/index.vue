<template>
  <div class="page-set">
    <schema-form
      :schema="local"
      :schema-data="detail"
    />
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import { local } from './config'

export default createComponent({
  components: {
    SchemaForm
  },

  setup () {
    return {
      // validate: null,
      local,
      detail: {
        desc: '',
        dir: '',
        thumbCover: '',
        interactiveType: 'long-page',
        httpOptions: {
          baseUrl: '',
          contentType: 'application/json',
          urlMap: {
            test: '/path/to/get'
          }
        },
        url: '',
        pages: [
          {
            title: '',
            url: '',
            id: '',
            nodes: [
            ]
          }
        ]
      }
    }
  }
})
</script>
