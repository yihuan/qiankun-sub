const freeze = Object.freeze

// Popover 等 trigger 选项值
export const Trigger = freeze({
  CLICK: 'click',
  FOCUS: 'focus',
  HOVER: 'hover',
  MANUAL: 'manual'
})
export const TRIGGERS = freeze(Object.values(Trigger))

export const Size = freeze({
  MEDIUM: 'medium',
  SMALL: 'small',
  MINI: 'mini'
})
export const SIZES = freeze(Object.values(Size))

export const Placement = freeze({
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT: 'left',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end',
  RIGHT: 'right',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end'
})
export const PLACEMENTS = freeze(Object.values(Placement))

export const Effect = freeze({
  DARK: 'dark',
  LIGHT: 'light'
})
export const EFFECTS = freeze(Object.values(Effect))

export const MessageType = freeze({
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
})
export const MESSAGE_TYPES = freeze(Object.values(MessageType))
