import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      ibaseDomain: '',
      appName: '',
      // Flag to indicate if the app is selected manually
      appSwitched: false,
      currentUser: {
        id: '', // OA 名称
        name: '', // 中文名
        img: '' // 头像
      }
    }
  }
})
