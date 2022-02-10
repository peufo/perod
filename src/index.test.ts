import type { IPeriod, IRange } from 'types'
import { findFreeRanges, mergeTwoPeriod, mergeRanges } from './index'

const ranges: IRange[] = [
  { start: 1, end: 8 },
  { start: 4, end: 12 },
  { start: 12, end: 19 },
  { start: 21, end: 28 }
]

const allRangesMerged: IRange[] = [
  { start: 1, end: 19 },
  { start: 21, end: 28 }
]

const periods: IPeriod[] = [
  { start: new Date('2000-01-01'), end: new Date('2000-01-08') },
  { start: new Date('2000-01-04'), end: new Date('2000-01-12') },
  { start: new Date('2000-01-12'), end: new Date('2000-01-19') },
  { start: new Date('2000-01-21'), end: new Date('2000-01-28') }
]

test('merge two ranges', () => {
  expect(mergeTwoPeriod(ranges[0], ranges[1])).toEqual([{ start: 1, end: 12 }])
  expect(mergeTwoPeriod(periods[0], periods[1])).toEqual([{ start: new Date('2000-01-01'), end: new Date('2000-01-12') }])
  expect(mergeTwoPeriod(ranges[1], ranges[0])).toEqual([{ start: 1, end: 12 }])
  expect(mergeTwoPeriod(periods[1], periods[0])).toEqual([{ start: new Date('2000-01-01'), end: new Date('2000-01-12') }])
  expect(mergeTwoPeriod(ranges[1], ranges[2])).toEqual([{ start: 4, end: 19 }])
  expect(mergeTwoPeriod(periods[1], periods[2])).toEqual([{ start: new Date('2000-01-04'), end: new Date('2000-01-19') }])
  expect(mergeTwoPeriod(ranges[0], ranges[2])).toEqual([ranges[0], ranges[2]])
  expect(mergeTwoPeriod(periods[0], periods[2])).toEqual([periods[0], periods[2]])
})

test('merge all ranges', () => {
  expect(mergeRanges(ranges)).toEqual(allRangesMerged)
  expect(mergeRanges([])).toEqual([])
})

test('find free ranges', () => {
  expect(findFreeRanges(ranges)).toEqual([{ start: 19, end: 21 }])
  expect(findFreeRanges(ranges, { start: 0, end: 30 })).toEqual([{ start: 0, end: 1 }, { start: 19, end: 21 }, { start: 28, end: 30 }])
  expect(findFreeRanges(ranges, { start: 5, end: 29 })).toEqual([{ start: 19, end: 21 }, { start: 28, end: 29 }])
  expect(findFreeRanges([ranges[0], ranges[2]])).toEqual([{ start: 8, end: 12 }])
  expect(findFreeRanges([], ranges[2])).toEqual([ranges[2]])
  expect(findFreeRanges([ranges[0]], ranges[2])).toEqual([ranges[2]])
  expect(findFreeRanges([ranges[2]], ranges[0])).toEqual([ranges[0]])
})
