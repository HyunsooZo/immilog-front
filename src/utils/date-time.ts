interface TimeCalculationResult {
  time: number | ''
  text: string
}

const timeCalculation = (localTime: string): TimeCalculationResult => {
  const postDate = new Date(localTime)
  const now = new Date()
  const diff = now.getTime() - postDate.getTime()

  const diffMinutes = Math.floor(diff / (1000 * 60))
  if (diffMinutes < 10) {
    return {
      time: '',
      text: 'createdAt.justNow'
    }
  } else if (diffMinutes < 60) {
    return {
      time: diffMinutes,
      text: 'createdAt.minutesAgo'
    }
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return {
      time: diffHours,
      text: 'createdAt.hoursAgo'
    }
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) {
    return {
      time: '',
      text: 'createdAt.aDayAgo'
    }
  } else if (diffDays < 30) {
    return {
      time: diffDays,
      text: 'createdAt.daysAgo'
    }
  }

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) {
    return {
      time: diffMonths,
      text: 'createdAt.monthsAgo'
    }
  }

  const diffYears = Math.floor(diffMonths / 12)
  return {
    time: diffYears,
    text: 'createdAt.yearsAgo'
  }
}

export { timeCalculation }
