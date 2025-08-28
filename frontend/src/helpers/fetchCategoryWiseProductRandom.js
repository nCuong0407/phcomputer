import SummaryApi from "../common";

// Hàm dùng để xáo trộn mảng
const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const fetchRandomProducts = async () => {
  try {
    const response = await fetch(SummaryApi.allProduct.url, {
      method: SummaryApi.allProduct.method,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();

    // Shuffle và lấy 10 sản phẩm
    const randomProducts = shuffleArray(result?.data || []).slice(0, 20);
    return randomProducts;
  } catch (error) {
    console.error("Fetch Random Products Error:", error);
    return [];
  }
};

export default fetchRandomProducts;
