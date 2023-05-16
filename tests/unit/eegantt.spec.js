import { isSame } from '@/utils/date.util'

describe('EeGantt.vue', () => {
  it('Add date by week', () => {
    const endOfWeek = new Date('2022-12-26')
    expect(isSame(endOfWeek, new Date('2023-01-02'))).toBeTruthy()
  })
})
