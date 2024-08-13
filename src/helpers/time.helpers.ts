import { TIME_IN_SEC } from '@/enums'
import { i18n } from '@/localization'
import { duration } from '@distributedlab/tools'

export const humanizeTime = (seconds: number): string => {
  const { t } = i18n.global
  const durationInSeconds = duration(seconds, 'seconds')

  if (seconds >= TIME_IN_SEC.year) {
    const timeAsYears = durationInSeconds.asYears
    return timeAsYears > 1
      ? t('time.years', { duration: timeAsYears })
      : t('time.year', { duration: timeAsYears })
  }
  if (seconds >= TIME_IN_SEC.month) {
    const timeAsMonths = durationInSeconds.asMonths
    return timeAsMonths > 1
      ? t('time.months', { duration: timeAsMonths })
      : t('time.month', { duration: timeAsMonths })
  }
  if (seconds >= TIME_IN_SEC.day) {
    const timeAsDays = durationInSeconds.asDays
    return timeAsDays > 1
      ? t('time.days', { duration: timeAsDays })
      : t('time.day', { duration: timeAsDays })
  }
  if (seconds >= TIME_IN_SEC.hour) {
    const timeAsHours = durationInSeconds.asHours
    return timeAsHours > 1
      ? t('time.hours', { duration: timeAsHours })
      : t('time.hour', { duration: timeAsHours })
  }
  if (seconds >= TIME_IN_SEC.minute) {
    const timeAsMinutes = durationInSeconds.asMinutes
    return timeAsMinutes > 1
      ? t('time.minutes', { duration: timeAsMinutes })
      : t('time.minute', { duration: timeAsMinutes })
  }
  return seconds > 1
    ? t('time.seconds', { duration: seconds })
    : t('time.second', { duration: seconds })
}
