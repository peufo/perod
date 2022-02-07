import type { IRange, IPeriod } from 'types'
import { rangeIsPeriod, ensureIsRange, ensureIsPeriod } from './utils'

/**
 * Merge two ranges like that
 *  [000000]
 *     [1111111]
 * _____________
 *  [0000000000]
 */
export function merge (rangeA: IPeriod, rangeB: IPeriod): IPeriod[]
export function merge (rangeA: IRange, rangeB: IRange): IRange[]
export function merge (rangeA: IRange | IPeriod, rangeB: IRange | IPeriod): IRange[] | IPeriod[] {
  // Date conversion
  const isPeriod = rangeIsPeriod(rangeA)
  const [a, b] = ensureIsRange([rangeA, rangeB])

  // Logic
  const [first, second] = a.start < b.start ? [a, b] : [b, a]
  const left = first.start <= second.start && second.start <= first.end
  const right = second.start <= first.end && first.end <= second.end
  if (!left && !right) return [first, second]

  const newRange = {
    start: first.start,
    end: Math.max(...[a.end, b.end])
  }

  // Date conversion
  if (isPeriod) return ensureIsPeriod([newRange])
  return [newRange]
}

/**
 * Merge an array of ranges like that
 *  [000000]   [222222]
 *     [1111111]        [333333]
 * ____________________________
 *  [00000000000000000] [111111]
 */
export function mergeAll (ranges: IPeriod[]): IPeriod[]
export function mergeAll (ranges: IRange[]): IRange[]
export function mergeAll (ranges: IRange[] | IPeriod[]): IRange[] | IPeriod[] {
  // Date conversion
  const isPeriod = rangeIsPeriod(ranges[0])
  const _ranges = ensureIsRange(ranges)

  _ranges.sort((a, b) => a.start - b.start)
  let result: IRange[] = []

  for (let index = 0; index < _ranges.length - 1; index++) {
    result = merge(_ranges[index], _ranges[index + 1])
    if (result.length === 1) {
      _ranges.splice(index + 1, 1)
      _ranges[index] = result[0]
      index--
    }
  }
  if (isPeriod) return ensureIsPeriod(_ranges)
  return _ranges
}
