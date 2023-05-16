function emptyAction() {
  // 设置一个actions实例
  // 提示当前使用的是空 Action
  console.warn('Current execute action is empty!') // eslint-disable-line
}

class Actions {
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  }

  setActions(actions) {
    this.actions = actions
  }

  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args)
  }

  setGlobalState(...args) {
    return this.actions.setGlobalState(...args)
  }
}

const actions = new Actions()
export default actions
