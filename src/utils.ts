import { IRangeOrPeriod, IRange, IPeriod } from 'types'

export function rangeIsPeriod (rangeOrPeriod: IRangeOrPeriod): rangeOrPeriod is IPeriod {
  return Number.isNaN(rangeOrPeriod.start)
}

export function ensureIsRange (rangeOrPeriod: IRangeOrPeriod): IRange
export function ensureIsRange (rangeOrPeriod: IRangeOrPeriod[]): IRange[]
export function ensureIsRange (rangeOrPeriod: IRangeOrPeriod | IRangeOrPeriod[]): IRange | IRange[] {
  const isArray = Array.isArray(rangeOrPeriod)
  const rangesOrPeriods = isArray ? rangeOrPeriod : [rangeOrPeriod]
  const ranges = rangesOrPeriods.map(r => {
    const isPeriod = rangeIsPeriod(r)
    if (!isPeriod) return r
    return {
      start: new Date(r.start).getTime(),
      end: new Date(r.end).getTime()
    }
  })
  return isArray ? ranges : ranges[0]
}

export function ensureIsPeriod (rangeOrPeriod: IRangeOrPeriod): IPeriod
export function ensureIsPeriod (rangeOrPeriod: IRangeOrPeriod[]): IPeriod[]
export function ensureIsPeriod (rangeOrPeriod: IRangeOrPeriod | IRangeOrPeriod[]): IPeriod | IPeriod[] {
  const isArray = Array.isArray(rangeOrPeriod)
  const rangesOrPeriods = isArray ? rangeOrPeriod : [rangeOrPeriod]
  const ranges = rangesOrPeriods.map(r => {
    const isPeriod = rangeIsPeriod(r)
    if (isPeriod) return r
    return {
      start: new Date(r.start),
      end: new Date(r.end)
    }
  })
  return isArray ? ranges : ranges[0]
}
