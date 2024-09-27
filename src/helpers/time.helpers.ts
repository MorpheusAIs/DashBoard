import { i18n } from '@/localization'
import { duration } from '@distributedlab/tools'

export const humanizeAsYears = (time: number) => {
  const { t } = i18n.global
  const seconds = duration(time, 'seconds')
  const timeAsYears = seconds.asYears
  return timeAsYears > 1
    ? t('time.years', { duration: timeAsYears.toFixed() })
    : t('time.year', { duration: timeAsYears.toFixed() })
}

export const humanizeAsMonths = (time: number) => {
  const { t } = i18n.global
  const seconds = duration(time, 'seconds')
  const timeAsMonths = seconds.asMonths
  return timeAsMonths > 1
    ? t('time.months', { duration: timeAsMonths.toFixed() })
    : t('time.month', { duration: timeAsMonths.toFixed() })
}

export const humanizeAsDays = (time: number) => {
  const { t } = i18n.global
  const seconds = duration(time, 'seconds')
  const timeAsDays = seconds.asDays
  return timeAsDays > 1
    ? t('time.days', { duration: timeAsDays.toFixed() })
    : t('time.day', { duration: timeAsDays.toFixed() })
}

export const humanizeAsHours = (time: number) => {
  const { t } = i18n.global
  const seconds = duration(time, 'seconds')
  const timeAsHours = seconds.asHours
  return timeAsHours > 1
    ? t('time.hours', { duration: timeAsHours.toFixed() })
    : t('time.hour', { duration: timeAsHours.toFixed() })
}

export const humanizeAsMinutes = (time: number) => {
  const { t } = i18n.global
  const seconds = duration(time, 'seconds')
  const timeAsMinutes = seconds.asMinutes
  return timeAsMinutes > 1
    ? t('time.minutes', { duration: timeAsMinutes.toFixed() })
    : t('time.minute', { duration: timeAsMinutes.toFixed() })
}

export const humanizeAsSeconds = (time: number) => {
  const { t } = i18n.global
  const seconds = duration(time, 'seconds')
  const timeAsSeconds = seconds.asSeconds
  return timeAsSeconds > 1
    ? t('time.seconds', { duration: timeAsSeconds.toFixed() })
    : t('time.second', { duration: timeAsSeconds.toFixed() })
}

export const humanizeTime = (time: number) => {
  const durationInSeconds = duration(time, 'seconds')

  if (durationInSeconds.asYears >= 1) {
    return humanizeAsYears(durationInSeconds.asSeconds)
  }
  if (durationInSeconds.asMonths >= 1) {
    return humanizeAsMonths(durationInSeconds.asSeconds)
  }
  if (durationInSeconds.asDays >= 1) {
    return humanizeAsDays(durationInSeconds.asSeconds)
  }
  if (durationInSeconds.asHours >= 1) {
    return humanizeAsHours(durationInSeconds.asSeconds)
  }
  if (durationInSeconds.asMinutes >= 1) {
    return humanizeAsMinutes(durationInSeconds.asSeconds)
  }
  return humanizeAsSeconds(durationInSeconds.asSeconds)
}
