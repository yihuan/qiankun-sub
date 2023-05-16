import {
  isBefore,
  isAfter,
  isSame,
  isSameOrAfter,
  isSameOrBefore,
  get
} from '@/utils/date.util'
import { UNIT } from '@/constants/date.const'

describe('Date util', () => {
  const firstDate = new Date('2022-12-23')

  it('is before: true', () => {
    const ret = isBefore(firstDate, new Date('2022-12-24'))
    expect(ret).toBeTruthy()
  })

  it('is before: equal - true', () => {
    const ret = isBefore(firstDate, '2022-12-23 12:00:00')
    expect(ret).toBeTruthy()
  })

  it('is before: equal - false', () => {
    const ret = isBefore(firstDate, '2022-12-23', UNIT.DATE)
    expect(ret).toBeFalsy()
  })

  it('is before: false', () => {
    const ret = isBefore(firstDate, '2022-12-20')
    expect(ret).toBeFalsy()
  })

  it('is after: false', () => {
    const ret = isAfter(firstDate, '2022-12-24')
    expect(ret).toBeFalsy()
  })

  it('is same', () => {
    const ret = isSame(firstDate, '2022-12-23', UNIT.DATE)
    expect(ret).toBeTruthy()
  })

  it('is same or before', () => {
    const ret = isSameOrBefore(firstDate, '2022-12-23', UNIT.DATE)
    expect(ret).toBeTruthy()
  })

  it('is same or after', () => {
    const ret = isSameOrAfter(firstDate, '2022-12-23', UNIT.DATE)
    expect(ret).toBeTruthy()
  })

  it('get day of month without parameter', () => {
    const day = get(UNIT.DATE)
    expect(day).toEqual(new Date().getDate())
  })

  it('get day of month with parameter', () => {
    const day = get(UNIT.DATE, '2022-12-23')
    expect(day).toEqual(23)
  })
})
