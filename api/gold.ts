export default async function handler() {
  try {
    const apiCode = process.env.NERKH_API_KEY

    if (!apiCode) {
      return Response.json(
        { error: "API key تنظیم نشده" },
        { status: 500 }
      )
    }


    const response = await fetch(
      `https://nerkh-api.ir/api/${apiCode}/gold/`
    )


    if (!response.ok) {
      return Response.json(
        {
          error: "خطا در دریافت قیمت"
        },
        {
          status: response.status
        }
      )
    }


    const json = await response.json()


    const prices = json.data.prices


    return Response.json({
      price18: Number(prices.gold_geram18.current),
      price24: Number(prices.gold_geram24.current),
      updatedAt: new Date().toISOString()
    })


  } catch (error) {

    return Response.json(
      {
        error: "خطای سرور"
      },
      {
        status: 500
      }
    )
  }
}