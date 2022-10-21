import React, { useState, useEffect } from "react";
import FilterSearch from "../utils/filterSearch";
import { getData } from "../utils/fetchData";
import { useRouter } from "next/router";

function Filter({ state }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const { categories } = state;
  const router = useRouter();

  // useEffect(() => {
  //     setCategory('')
  // }, [category])

  const handleCategory = (e) => {
    setCategory(e.target.value);
    FilterSearch({ router, category: e.target.value });
  };
  const handleSort = (e) => {
    setSort(e.target.value);
    FilterSearch({ router, sort: e.target.value });
  };

  useEffect(() => {
    FilterSearch({
      router,
      search: search ? search.toLocaleLowerCase() : "all",
    });
  }, [search]);
  return (
    <div className="input-group">
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          className="custom-select text-capitalize"
          value={category}
          onChange={handleCategory}
        >
          <option key="all" value="all">
            All Products
          </option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <form autoComplete="off" className="mt-2 col-md-8 px-0">
        <input
          type="text"
          className="form-control"
          list="title_product"
          value={search.toLocaleLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          className="custom-select text-capitalize"
          value={sort}
          onChange={handleSort}
        >
          <option value="-createdAt">Newset</option>
          <option value="oldest">Oldest</option>
          <option value="-sold">Best sales</option>
          <option value="-price"> Price: High-Low</option>
          <option value="price">Price: Low-Hight</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
