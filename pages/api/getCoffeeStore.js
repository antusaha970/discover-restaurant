import { fetchCoffeeStores } from "../../lib/coffee-store";

export default async function coffeeStore(req, res) {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log({ error });
  }
}
