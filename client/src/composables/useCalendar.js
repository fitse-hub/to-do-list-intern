import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCalendar() {
  const { locale } = useI18n()
  
  const currentLocale = computed(() => locale.value === 'am' ? 'am-ET' : 'en-US')

  // Generate localized arrays dynamically so templates can still do `MONTHS[i]`
  const DAYS_OF_WEEK = computed(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2023, 0, i + 1) // Jan 1, 2023 was Sunday
      return new Intl.DateTimeFormat(currentLocale.value, { weekday: 'short' }).format(d)
    })
  })

  const MONTHS = computed(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2023, i, 1)
      return new Intl.DateTimeFormat(currentLocale.value, { month: 'long' }).format(d)
    })
  })

  const MONTHS_SHORT = computed(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2023, i, 1)
      return new Intl.DateTimeFormat(currentLocale.value, { month: 'short' }).format(d)
    })
  })

  /** Format a Date as YYYY-MM-DD */
  function toDateKey(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  /** Parse YYYY-MM-DD to a Date at midnight local */
  function fromDateKey(key) {
    const [y, m, d] = key.split('-').map(Number)
    return new Date(y, m - 1, d)
  }

  /** Is the given Date "today"? */
  function isToday(date) {
    const t = new Date()
    return date.getFullYear() === t.getFullYear() &&
           date.getMonth() === t.getMonth() &&
           date.getDate() === t.getDate()
  }

  /** Is two Date objects on the same calendar day? */
  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate()
  }

  /** Is the given Date in the same month as a reference Date? */
  function isSameMonth(date, ref) {
    return date.getFullYear() === ref.getFullYear() &&
           date.getMonth() === ref.getMonth()
  }

  /**
   * Build the 6-row × 7-column grid for a month view.
   * Each cell is a Date object.
   * Cells outside the current month are included (greyed out).
   */
  function buildMonthGrid(anchorDate) {
    const year = anchorDate.getFullYear()
    const month = anchorDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const grid = []
    // Fill leading days from previous month
    const startDow = firstDay.getDay() // 0 = Sunday
    for (let i = startDow - 1; i >= 0; i--) {
      grid.push(new Date(year, month, -i))
    }
    // Fill current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      grid.push(new Date(year, month, d))
    }
    // Fill trailing days so total = 42 (6 weeks)
    while (grid.length < 42) {
      grid.push(new Date(year, month + 1, grid.length - lastDay.getDate() - startDow + 1))
    }
    return grid
  }

  /**
   * Returns an array of 7 Date objects for the week containing anchorDate.
   * Week starts on Sunday.
   */
  function buildWeekDays(anchorDate) {
    const d = new Date(anchorDate)
    d.setDate(d.getDate() - d.getDay()) // go to Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(d)
      day.setDate(d.getDate() + i)
      return day
    })
  }

  /**
   * Build 24-hour time slots for the Day view.
   */
  function buildDayHours() {
    return Array.from({ length: 24 }, (_, i) => {
      const h = String(i).padStart(2, '0')
      return { label: `${h}:00`, hour: i }
    })
  }

  /**
   * Returns an array of 12 objects, one per month of the year.
   * Each has: { month (0-based), name, shortName, firstDay, lastDay }
   */
  function buildYearMonths(year) {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i,
      name: MONTHS.value[i],
      shortName: MONTHS_SHORT.value[i],
      firstDay: new Date(year, i, 1),
      lastDay: new Date(year, i + 1, 0),
      grid: buildMonthGrid(new Date(year, i, 1)),
    }))
  }

  /** Human-readable header title for the current view */
  function getHeaderTitle(anchorDate, view) {
    const y = anchorDate.getFullYear()
    const m = MONTHS.value[anchorDate.getMonth()]
    if (view === 'month') return `${m} ${y}`
    if (view === 'year') return `${y}`
    if (view === 'week') {
      const days = buildWeekDays(anchorDate)
      const first = days[0]
      const last = days[6]
      if (first.getMonth() === last.getMonth()) {
        return `${MONTHS.value[first.getMonth()]} ${first.getDate()}–${last.getDate()}, ${y}`
      }
      return `${MONTHS_SHORT.value[first.getMonth()]} ${first.getDate()} – ${MONTHS_SHORT.value[last.getMonth()]} ${last.getDate()}, ${y}`
    }
    if (view === 'day') {
      const dow = new Intl.DateTimeFormat(currentLocale.value, { weekday: 'short' }).format(anchorDate)
      return `${dow}, ${m} ${anchorDate.getDate()}, ${y}`
    }
    return `${m} ${y}`
  }

  return {
    DAYS_OF_WEEK,
    MONTHS,
    MONTHS_SHORT,
    toDateKey,
    fromDateKey,
    isToday,
    isSameDay,
    isSameMonth,
    buildMonthGrid,
    buildWeekDays,
    buildDayHours,
    buildYearMonths,
    getHeaderTitle,
  }
}
