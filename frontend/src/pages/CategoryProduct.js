import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoriesToFetch =
        filterCategoryList.length > 0 && !filterCategoryList.includes("ALL")
          ? filterCategoryList
          : ["ALL"];

      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category: categoriesToFetch,
        }),
      });

      const dataResponse = await response.json();
      setData(dataResponse?.data || []);
    } catch (error) {
      console.error("Lỗi khi fetch:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;

    // Lấy toàn bộ category (bao gồm cả LAPTOP)
    const allCategories = productCategory.map((cat) => cat.value);

    let updatedSelect = { ...selectCategory };
    let arrayOfCategory = [];

    if (value === "LAPTOP" && checked) {
      // Tick tất cả
      updatedSelect = {};
      allCategories.forEach((cat) => {
        updatedSelect[cat] = true;
      });
      arrayOfCategory = [...allCategories];
    } else if (value === "LAPTOP" && !checked) {
      // Bỏ tick tất cả
      updatedSelect = {};
      allCategories.forEach((cat) => {
        updatedSelect[cat] = false;
      });
      arrayOfCategory = [];
    } else {
      // Tick hoặc bỏ tick 1 category con
      updatedSelect[value] = checked;

      // Nếu tất cả category con đều được tick thì tick luôn LAPTOP
      const allSubCats = productCategory
        .filter((cat) => cat.value !== "LAPTOP")
        .map((cat) => cat.value);

      const allSubCatsTicked = allSubCats.every((cat) => updatedSelect[cat]);
      updatedSelect["LAPTOP"] = allSubCatsTicked;

      // Danh sách category được tick
      arrayOfCategory = Object.keys(updatedSelect).filter(
        (key) => updatedSelect[key]
      );
    }

    // Nếu không có category nào thì default là ALL
    if (arrayOfCategory.length === 0) {
      arrayOfCategory = ["ALL"];
    }

    setSelectCategory(updatedSelect);
    setFilterCategoryList(arrayOfCategory);
  };

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  useEffect(() => {
    const initialCategory = urlSearch.get("category");
    if (
      initialCategory &&
      productCategory.some((cat) => cat.value === initialCategory)
    ) {
      const newSelect = {
        ...selectCategory,
        [initialCategory]: true,
      };
      setSelectCategory(newSelect);

      if (initialCategory === "LAPTOP") {
        const allCategories = productCategory.map((cat) => cat.value);
        setFilterCategoryList(allCategories);
      } else {
        setFilterCategoryList([initialCategory]);
      }
    }
  }, [location.search]);

  useEffect(() => {
    let finalCategoryList = Object.keys(selectCategory).filter(
      (key) => selectCategory[key]
    );

    if (finalCategoryList.length === 0) {
      finalCategoryList = ["ALL"];
    }

    setFilterCategoryList(finalCategoryList);

    const urlFormat = finalCategoryList
      .map((el) => `category=${el}`)
      .join("&&");
    navigate("/product-category?" + urlFormat);
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    if (value === "asc") {
      setData((prev) =>
        [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice)
      );
    }
    if (value === "dsc") {
      setData((prev) =>
        [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-4">
        {/* Sidebar Filter */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="font-semibold text-lg mb-4">Bộ lọc</h2>

          {/* Danh mục */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Danh mục</label>
            <form className="flex flex-col gap-2 text-sm">
              {productCategory.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="category"
                    value={cat.value}
                    checked={selectCategory[cat.value] || false}
                    onChange={handleSelectCategory}
                    className="h-4 w-4 text-red-600"
                  />
                  {cat.label}
                </label>
              ))}
            </form>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sắp xếp theo
            </label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              value={sortBy}
              onChange={handleOnChangeSortBy}
            >
              <option value="">Liên quan nhất</option>
              <option value="asc">Giá: Thấp đến cao</option>
              <option value="dsc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div>
          <p className="text-gray-800 font-semibold mb-4">
            Tìm thấy {data.length} sản phẩm
          </p>
          {loading ? (
            <p>Đang tải...</p>
          ) : data.length === 0 ? (
            <div className="text-center text-gray-500">Không có sản phẩm.</div>
          ) : (
            <VerticalCard data={data} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
