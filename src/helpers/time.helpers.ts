import { TIME_IN_SEC } from '@/enums'
import { i18n } from '@/localization'
import { duration } from '@distributedlab/tools'

export const humanizeTime = (seconds: number): string => {
  const { t } = i18n.global
  const durationInSeconds = duration(seconds, 'seconds')

  if (seconds >= TIME_IN_SEC.year) {
    const timeAsYears = durationInSeconds.asYears
    return timeAsYears > 1
      ? t('time.years', { duration: timeAsYears.toFixed() })
      : t('time.year', { duration: timeAsYears.toFixed() })
  }
  if (seconds >= TIME_IN_SEC.month) {
    const timeAsMonths = durationInSeconds.asMonths
    return timeAsMonths > 1
      ? t('time.months', { duration: timeAsMonths.toFixed() })
      : t('time.month', { duration: timeAsMonths.toFixed() })
  }
  if (seconds >= TIME_IN_SEC.day) {
    const timeAsDays = durationInSeconds.asDays
    return timeAsDays > 1
      ? t('time.days', { duration: timeAsDays.toFixed() })
      : t('time.day', { duration: timeAsDays.toFixed() })
  }
  if (seconds >= TIME_IN_SEC.hour) {
    const timeAsHours = durationInSeconds.asHours
    return timeAsHours > 1
      ? t('time.hours', { duration: timeAsHours.toFixed() })
      : t('time.hour', { duration: timeAsHours.toFixed() })
  }
  if (seconds >= TIME_IN_SEC.minute) {
    const timeAsMinutes = durationInSeconds.asMinutes
    return timeAsMinutes > 1
      ? t('time.minutes', { duration: timeAsMinutes.toFixed() })
      : t('time.minute', { duration: timeAsMinutes.toFixed() })
  }
  return seconds > 1
    ? t('time.seconds', { duration: seconds.toFixed() })
    : t('time.second', { duration: seconds.toFixed() })
}
