export default async function handler(req, res) {
  try {
    const apiCode = process.env.ZzrRpqSkOhfFY3dVWNhTBwo3KzBMNtUzaWm3tSdpgY

    const response = await fetch(
      "آدرس واقعی API نرخی"
    );

    const json = await response.json();

    return res.status(200).json(json);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}