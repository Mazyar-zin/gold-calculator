interface ServixAsset {
  code?: string
  value?: number | string
  businessTime?: string
}

export interface GoldApiResult {
  price18Toman: number
  price24Toman: number
  businessTime: string | null
}

function asToman(value: unknown): number {
  const rial = Number(value)
  if (!Number.isFinite(rial) || rial <= 0) return 0
  return Math.round(rial / 10)
}

function latestTime(items: ServixAsset[]): string | null {
  const valid = items
    .map((item) => item.businessTime)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .sort((a, b) => Date.parse(b) - Date.parse(a))

  return valid[0] ?? null
}

export async function fetchGoldPrices(apiKey: string): Promise<GoldApiResult> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('اینترنت در دسترس نیست. آخرین قیمت ذخیره‌شده همچنان قابل استفاده است.')
  }

  const key = apiKey.trim()

  if (!key) {
    throw new Error('ابتدا کلید API را وارد کن.')
  }

  const response = await fetch(
    'https://servix.cc/api/v1/assets?codes=GOLD_18_RLS,GOLD_24_RLS',
    {
      method: 'GET',
      headers: {
        'X-API-Key': key,
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('کلید API معتبر نیست.')
    }
    if (response.status === 403) {
      throw new Error('دسترسی API برای این حساب فعال نیست.')
    }
    if (response.status === 429) {
      throw new Error('سهمیه روزانه API تمام شده است.')
    }
    throw new Error(`دریافت قیمت ناموفق بود. کد خطا: ${response.status}`)
  }

  const data = await response.json()
  const items: ServixAsset[] = Array.isArray(data) ? data : [data]

  const gold18 = items.find((item) => item.code === 'GOLD_18_RLS')
  const gold24 = items.find((item) => item.code === 'GOLD_24_RLS')

  const price18Toman = asToman(gold18?.value)
  const price24Toman = asToman(gold24?.value)

  if (price18Toman <= 0 || price24Toman <= 0) {
    throw new Error('قیمت معتبر ۱۸ و ۲۴ عیار از API دریافت نشد.')
  }

  return {
    price18Toman,
    price24Toman,
    businessTime: latestTime([gold18 ?? {}, gold24 ?? {}]),
  }
}
