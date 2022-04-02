import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {/// //在项目中使用到JSX做的话，需要做此适配。
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
