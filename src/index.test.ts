import type { IRange } from 'types'
import { merge, mergeAll } from '.'

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

test('merge two ranges', () => {
  expect(merge(ranges[0], ranges[1])).toEqual([{ start: 1, end: 12 }])
  expect(merge(ranges[1], ranges[0])).toEqual([{ start: 1, end: 12 }])
  expect(merge(ranges[1], ranges[2])).toEqual([{ start: 4, end: 19 }])
  expect(merge(ranges[0], ranges[2])).toEqual([ranges[0], ranges[2]])
})

test('merge all ranges', () => {
  expect(mergeAll(ranges)).toEqual(allRangesMerged)
})
