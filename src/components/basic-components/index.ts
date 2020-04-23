import Vue from 'vue'
import div, { schema as divSchema } from './div'
import img, { schema as imgSchema } from './img'
import list, { schema as listSchema } from './list'
import richTex, { schema as richTextSchema } from './rich-text'
import divComponent from './div/index.vue'
import imgComponent from './img/index.vue'
import listComponent from './list/index.vue'
import richComponent from './rich-text/index.vue'

export const basic = [ div, img, list, richTex ]
export const basicSchemaMap = {
  div: divSchema,
  img: imgSchema,
  list: listSchema,
  'rich-text': richTextSchema
}

const components = [ divComponent, imgComponent, listComponent, richComponent ]
export const useBasicComponents = () => {
  components.forEach(it => {
    Vue.component(it.name, it)
  })
}