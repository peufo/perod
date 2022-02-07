export interface IPeriod {
  start: Date
  end: Date
}

export interface IRange {
  start: number
  end: number
}

export type IRangeOrPeriod = IRange | IPeriod
