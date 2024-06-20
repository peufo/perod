import type { IPeriod, IRange } from 'types'
import {
  findFreeRanges,
  mergeTwoPeriod,
  mergeRanges,
  isFreeRange,
  isRangesOverlapOrStick,
  isRangesOverlap,
} from './index'
import { compareAll } from './utils'

const ranges: IRange[] = [
  { start: 1, end: 8 },
  { start: 4, end: 12 },
  { start: 12, end: 19 },
  { start: 21, end: 28 },
]

const allRangesMerged: IRange[] = [
  { start: 1, end: 19 },
  { start: 21, end: 28 },
]

const periods: IPeriod[] = [
  { start: new Date('2000-01-01'), end: new Date('2000-01-08') },
  { start: new Date('2000-01-04'), end: new Date('2000-01-12') },
  { start: new Date('2000-01-12'), end: new Date('2000-01-19') },
  { start: new Date('2000-01-21'), end: new Date('2000-01-28') },
]

test('compare all items', () => {
  expect(compareAll([0, 1, 2, 3], (a, b) => a === b)).toEqual(false)
  expect(compareAll([0, 1, 2, 1], (a, b) => a === b)).toEqual(true)
})

describe('Ranges overlap logique', () => {
  test('Overlap', () => {
    expect(isRangesOverlap(ranges)).toEqual(true)
    expect(isRangesOverlap([ranges[1], ranges[2]])).toEqual(false)
    expect(isRangesOverlap([ranges[2], ranges[1]])).toEqual(false)
    expect(isRangesOverlap([ranges[1], ranges[3]])).toEqual(false)
    expect(isRangesOverlap([ranges[3], ranges[1]])).toEqual(false)
  })

  test('Overlap with tolerance', () => {
    expect(isRangesOverlap(ranges, 3)).toEqual(true)
    expect(isRangesOverlap(ranges, 4)).toEqual(false)
    expect(isRangesOverlap([ranges[0], ranges[1]], 0)).toEqual(true)
    expect(isRangesOverlap([ranges[1], ranges[0]], 0)).toEqual(true)
    expect(isRangesOverlap([ranges[0], ranges[1]], 3)).toEqual(true)
    expect(isRangesOverlap([ranges[1], ranges[0]], 3)).toEqual(true)
    expect(isRangesOverlap([ranges[0], ranges[1]], 4)).toEqual(false)
    expect(isRangesOverlap([ranges[1], ranges[0]], 4)).toEqual(false)
    expect(isRangesOverlap([ranges[2], ranges[3]], -2)).toEqual(false)
    expect(isRangesOverlap([ranges[3], ranges[2]], -2)).toEqual(false)
    expect(isRangesOverlap([ranges[2], ranges[3]], -3)).toEqual(true)
    expect(isRangesOverlap([ranges[3], ranges[2]], -3)).toEqual(true)
  })

  test('Overlap or sticks', () => {
    expect(isRangesOverlapOrStick(ranges)).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[1], ranges[2]])).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[2], ranges[1]])).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[1], ranges[3]])).toEqual(false)
    expect(isRangesOverlapOrStick([ranges[3], ranges[1]])).toEqual(false)
  })

  test('Overlap or sticks with tolerance', () => {
    expect(isRangesOverlapOrStick(ranges, 4)).toEqual(true)
    expect(isRangesOverlapOrStick(ranges, 5)).toEqual(false)
    expect(isRangesOverlapOrStick([ranges[0], ranges[1]], 0)).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[1], ranges[0]], 0)).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[0], ranges[1]], 4)).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[1], ranges[0]], 4)).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[0], ranges[1]], 5)).toEqual(false)
    expect(isRangesOverlapOrStick([ranges[1], ranges[0]], 5)).toEqual(false)
    expect(isRangesOverlapOrStick([ranges[2], ranges[3]], -1)).toEqual(false)
    expect(isRangesOverlapOrStick([ranges[3], ranges[2]], -1)).toEqual(false)
    expect(isRangesOverlapOrStick([ranges[2], ranges[3]], -2)).toEqual(true)
    expect(isRangesOverlapOrStick([ranges[3], ranges[2]], -2)).toEqual(true)
  })
})

test('merge two ranges', () => {
  expect(mergeTwoPeriod(ranges[0], ranges[1])).toEqual([{ start: 1, end: 12 }])
  expect(mergeTwoPeriod(periods[0], periods[1])).toEqual([
    { start: new Date('2000-01-01'), end: new Date('2000-01-12') },
  ])
  expect(mergeTwoPeriod(ranges[1], ranges[0])).toEqual([{ start: 1, end: 12 }])
  expect(mergeTwoPeriod(periods[1], periods[0])).toEqual([
    { start: new Date('2000-01-01'), end: new Date('2000-01-12') },
  ])
  expect(mergeTwoPeriod(ranges[1], ranges[2])).toEqual([{ start: 4, end: 19 }])
  expect(mergeTwoPeriod(periods[1], periods[2])).toEqual([
    { start: new Date('2000-01-04'), end: new Date('2000-01-19') },
  ])
  expect(mergeTwoPeriod(ranges[0], ranges[2])).toEqual([ranges[0], ranges[2]])
  expect(mergeTwoPeriod(periods[0], periods[2])).toEqual([
    periods[0],
    periods[2],
  ])
})

test('merge all ranges', () => {
  expect(mergeRanges(ranges)).toEqual(allRangesMerged)
  expect(mergeRanges([])).toEqual([])
})

test('find free ranges', () => {
  expect(findFreeRanges(ranges)).toEqual([{ start: 19, end: 21 }])
  expect(findFreeRanges(ranges, { start: 0, end: 30 })).toEqual([
    { start: 0, end: 1 },
    { start: 19, end: 21 },
    { start: 28, end: 30 },
  ])
  expect(findFreeRanges(ranges, { start: 5, end: 29 })).toEqual([
    { start: 19, end: 21 },
    { start: 28, end: 29 },
  ])
  expect(findFreeRanges([ranges[0], ranges[2]])).toEqual([
    { start: 8, end: 12 },
  ])
  expect(findFreeRanges([], ranges[2])).toEqual([ranges[2]])
  expect(findFreeRanges([ranges[0]], ranges[2])).toEqual([ranges[2]])
  expect(findFreeRanges([ranges[2]], ranges[0])).toEqual([ranges[0]])
})

test('is free range', () => {
  expect(isFreeRange({ start: 19, end: 21 }, ranges)).toEqual(true)
  expect(isFreeRange({ start: 18, end: 21 }, ranges)).toEqual(false)
  expect(isFreeRange({ start: 19, end: 22 }, ranges)).toEqual(false)
  expect(isFreeRange({ start: 0, end: 1 }, ranges)).toEqual(true)
  expect(isFreeRange({ start: 0, end: 0 }, ranges)).toEqual(true)
  expect(isFreeRange({ start: 28, end: 40 }, ranges)).toEqual(true)
  expect(isFreeRange({ start: 30, end: 40 }, ranges)).toEqual(true)
  expect(isFreeRange({ start: 2, end: 3 }, ranges)).toEqual(false)
  expect(isFreeRange({ start: 20, end: 30 }, ranges)).toEqual(false)
})
