import { computed } from 'vue'

const LOCAL_STORAGE_FIELD_NAME = 'isReferrer'

enum REFERRER_STORAGE_FIELD_NAMES {
  isReferrer = 'true',
}

export const useReferral = () => {
  const isReferrer = computed(
    () =>
      localStorage.getItem(LOCAL_STORAGE_FIELD_NAME) ===
      REFERRER_STORAGE_FIELD_NAMES.isReferrer,
  )

  const becomeReferrer = () => {
    localStorage.setItem(
      LOCAL_STORAGE_FIELD_NAME,
      REFERRER_STORAGE_FIELD_NAMES.isReferrer,
    )
  }

  return {
    isReferrer,
    becomeReferrer,
  }
}
