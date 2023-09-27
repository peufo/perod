import type { IRange, IPeriod } from 'types'
import { rangeIsPeriod, ensureIsRange, rangeToPeriod } from './utils'

/**
 * Merge two ranges like that
 *  [000000]
 *     [1111111]
 * _____________
 *  [0000000000]
 */
export function mergeTwoPeriod(rangeA: IRange, rangeB: IRange): IRange[]
export function mergeTwoPeriod(rangeA: IPeriod, rangeB: IPeriod): IPeriod[]
export function mergeTwoPeriod(
  rangeA: IRange | IPeriod,
  rangeB: IRange | IPeriod
): IRange[] | IPeriod[] {
  // Date conversion
  const isPeriod = rangeIsPeriod(rangeA)
  const [a, b] = ensureIsRange([rangeA, rangeB])

  // Logic
  const [first, second] = a.start < b.start ? [a, b] : [b, a]
  const left = first.start <= second.start && second.start <= first.end
  const right = second.start <= first.end && first.end <= second.end
  if (!left && !right) {
    return isPeriod ? rangeToPeriod([first, second]) : [first, second]
  }

  const newRange = {
    start: first.start,
    end: Math.max(...[a.end, b.end]),
  }

  // Date conversion
  return isPeriod ? rangeToPeriod([newRange]) : [newRange]
}

/**
 * Merge an array of ranges like that
 *  [000000]   [222222]
 *     [1111111]        [333333]
 * _____________________________
 *  [00000000000000000] [111111]
 */
export function mergeRanges(rangesOrPeriods: IRange[]): IRange[]
export function mergeRanges(rangesOrPeriods: IPeriod[]): IPeriod[]
export function mergeRanges(
  rangesOrPeriods: IRange[] | IPeriod[]
): IRange[] | IPeriod[] {
  if (rangesOrPeriods.length === 0) return []

  const isPeriod = rangeIsPeriod(rangesOrPeriods[0])
  const ranges = ensureIsRange(rangesOrPeriods)

  ranges.sort((a, b) => a.start - b.start)
  let result: IRange[] = []

  for (let index = 0; index < ranges.length - 1; index++) {
    result = mergeTwoPeriod(ranges[index], ranges[index + 1])
    if (result.length === 1) {
      ranges.splice(index + 1, 1)
      ranges[index] = result[0]
      index--
    }
  }
  if (isPeriod) return rangeToPeriod(ranges)
  return ranges
}

/**
 * Find all free ranges in a limit search zone
 *  [000000]   [111111] [222222]
 * _____________________________
 *         [000]      [1]
 */
export function findFreeRanges(
  rangesOrPeriods: IRange[],
  limitRange?: IRange
): IRange[]
export function findFreeRanges(
  rangesOrPeriods: IPeriod[],
  limitPeriod?: IPeriod
): IPeriod[]
export function findFreeRanges(
  rangesOrPeriods: IRange[] | IPeriod[],
  limitRangeOrPeriod?: IRange | IPeriod
): IRange[] | IPeriod[] {
  if (rangesOrPeriods.length === 0) {
    if (limitRangeOrPeriod === undefined) return []
    // @ts-ignore
    return [limitRangeOrPeriod]
  }

  const limitRange =
    limitRangeOrPeriod !== undefined && ensureIsRange(limitRangeOrPeriod)

  const isPeriod = rangeIsPeriod(rangesOrPeriods[0])

  const ranges = mergeRanges(ensureIsRange(rangesOrPeriods))
  const freeRanges: IRange[] = []

  for (let index = 0; index < ranges.length - 1; index++) {
    const freeRange = {
      start: ranges[index].end,
      end: ranges[index + 1].start,
    }
    if (limitRange === false) {
      freeRanges.push(freeRange)
    } else if (
      limitRange.start < freeRange.end &&
      freeRange.start < limitRange.end
    ) {
      if (freeRange.start < limitRange.start) freeRange.start = limitRange.start
      if (freeRange.end > limitRange.end) freeRange.end = limitRange.end
      freeRanges.push(freeRange)
    }
  }

  if (limitRange !== false) {
    // Find collapsed free range before
    if (
      limitRange.start < ranges[0].start &&
      ranges[0].start < limitRange.end
    ) {
      freeRanges.unshift({
        start: limitRange.start,
        end: ranges[0].start,
      })
    }

    // Find collapsed free range after
    const lastEnd = Math.max(...ranges.map((r) => r.end))
    if (limitRange.start < lastEnd && lastEnd < limitRange.end) {
      freeRanges.push({
        start: lastEnd,
        end: limitRange.end,
      })
    }

    // Find free range before
    if (limitRange.end < ranges[0].start) {
      freeRanges.unshift(limitRange)
    }

    // Find free range before
    if (limitRange.start > lastEnd) {
      freeRanges.push(limitRange)
    }
  }

  return isPeriod ? rangeToPeriod(freeRanges) : freeRanges
}

export function isFreeRange(range: IRange, ranges: IRange[]): boolean
export function isFreeRange(range: IPeriod, ranges: IPeriod[]): boolean
export function isFreeRange(
  rangeOrPeriod: IRange | IPeriod,
  rangesOrPeriods: IRange[] | IPeriod[]
): boolean {
  const range = ensureIsRange(rangeOrPeriod)
  const ranges = ensureIsRange(rangesOrPeriods)

  const overlay = ranges.filter(
    ({ start, end }) =>
      (start < range.start && range.start < end) ||
      (start < range.end && range.end < end)
  )

  return !overlay.length
}
