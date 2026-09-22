export default async function handler(req, res) {
  try {
    const apiCode = process.env.NERKH_API_KEY;

    if (!apiCode) {
      return res.status(500).json({
        error: "API key تنظیم نشده"
      });
    }

    const response = await fetch(
      `https://nerkh-api.ir/api/${apiCode}/gold/`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "خطا در دریافت قیمت"
      });
    }

    const json = await response.json();

    const prices = json.data.prices;

    return res.status(200).json({
      price18: Number(prices.gold_geram18.current),
      price24: Number(prices.gold_geram24.current),
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
  return res.status(500).json({
    error: "خطای سرور",
    details: error.message
  });
}
}