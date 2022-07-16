# Period management utility working with numbers and dates

```js
import { findFreeRanges, mergeRanges } from 'perod'

const ranges = [
  { start: 1, end: 8 },
  { start: 4, end: 12 },
  { start: 12, end: 19 },
  { start: 21, end: 28 },
]

findFreeRanges(ranges) // [{ start: 19, end: 21 }]
mergeRanges(ranges) // [{ start: 1, end: 19 }, { start: 21, end: 28 }]
```
