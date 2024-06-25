import { IRangeOrPeriod, IRange, IPeriod } from 'types'

export function rangeIsPeriod(
  rangeOrPeriod: IRangeOrPeriod
): rangeOrPeriod is IPeriod {
  return rangeOrPeriod.start instanceof Date
}

export function ensureIsRange(rangeOrPeriod: IRangeOrPeriod): IRange
export function ensureIsRange(rangeOrPeriod: IRangeOrPeriod[]): IRange[]
export function ensureIsRange(
  rangeOrPeriod: IRangeOrPeriod | IRangeOrPeriod[]
): IRange | IRange[] {
  const isArray = Array.isArray(rangeOrPeriod)
  const rangesOrPeriods = isArray ? rangeOrPeriod : [rangeOrPeriod]
  const ranges = rangesOrPeriods.map((r) => {
    const isPeriod = rangeIsPeriod(r)
    if (!isPeriod) return r
    return {
      start: new Date(r.start).getTime(),
      end: new Date(r.end).getTime(),
    }
  })
  return isArray ? ranges : ranges[0]
}

export function rangeToPeriod(rangeOrPeriod: IRangeOrPeriod): IPeriod
export function rangeToPeriod(rangeOrPeriod: IRangeOrPeriod[]): IPeriod[]
export function rangeToPeriod(
  rangeOrPeriod: IRangeOrPeriod | IRangeOrPeriod[]
): IPeriod | IPeriod[] {
  const isArray = Array.isArray(rangeOrPeriod)
  const rangesOrPeriods = isArray ? rangeOrPeriod : [rangeOrPeriod]
  const ranges = rangesOrPeriods.map((r) => ({
    start: new Date(r.start),
    end: new Date(r.end),
  }))

  return isArray ? ranges : ranges[0]
}

/**
 * Compare all items until the result is true
 */
export function compareAll<T>(
  items: T[],
  compare: (a: T, b: T) => boolean
): boolean {
  const len = items.length
  for (let indexA = 0; indexA < len; indexA++) {
    const a = items[indexA]
    for (let indexB = indexA + 1; indexB < len; indexB++) {
      const b = items[indexB]
      if (compare(a, b)) return true
    }
  }
  return false
}
