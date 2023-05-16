import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      authDialog: false,
      authToken: ''
    }
  },
  actions: {
    updateAuthDialog(bol) {
      this.authDialog = bol
    },
    updateAuthToken(token) {
      this.authToken = token
    }
  }
})
