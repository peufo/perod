
export interface IRange {
  start: number
  end: number
}

/**
 * Merge two ranges like that
 *  [000000]
 *     [1111111]
 * _____________
 *  [0000000000]
 */
export function merge (a: IRange, b: IRange): IRange[] {
  const [first, second] = a.start < b.start ? [a, b] : [b, a]
  const left = first.start <= second.start && second.start <= first.end
  const right = second.start <= first.end && first.end <= second.end
  if (!left && !right) return [first, second]
  return [
    {
      start: first.start,
      end: Math.max(...[a.end, b.end])
    }
  ]
}

/**
 * Merge an array of ranges like that
 *  [000000]   [222222]
 *     [1111111]        [333333]
 * ____________________________
 *  [00000000000000000] [111111]
 */
export function mergeAll (ranges: IRange[]): IRange[] {
  ranges.sort((a, b) => a.start - b.start)
  let result: IRange[] = []

  for (let index = 0; index < ranges.length - 1; index++) {
    result = merge(ranges[index], ranges[index + 1])
    if (result.length === 1) {
      ranges = [...ranges.slice(0, index), ...ranges.slice(index + 1)]
      ranges[index] = result[0]
      index--
    }
  }
  return ranges
}
