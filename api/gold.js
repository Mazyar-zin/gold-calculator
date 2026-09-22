export default async function handler(req, res) {
  try {
    const apiKey = process.env.NERKH_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        error: "NERKH_API_KEY تنظیم نشده"
      });
    }

    const response = await fetch(
  "https://nerkh-api.ir/api/ZzrRpqSkOhfFY3dVWNhTBwo3KzBMNtUzaWm3tSdpgY/gold/"
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "خطای سرور",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}