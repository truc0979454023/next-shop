import { deleteData, getData } from "../utils/fetchData";
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import ProductItem from "../components/product/ProductItem";
import { DataContext } from "../store/GlobalState";
import FilterSearch from "../utils/filterSearch";
import { useRouter } from "next/router";
import Filter from "../components/Filter";

const Home = (props) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAll = ({ props }) => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          title: "Delete all selected product?",
          type: "DELETE_PRODUCT",
        });
      }
    });
    dispatch({
      type: "ADD_MODAL",
      payload: deleteArr,
    });
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    FilterSearch({ router, page: page + 1 });
  };

  return (
    <div className="home_page">
      <Head>
        <title>Home Page</title>
      </Head>
      <Filter state={state} />
      {auth.user && auth.user.role === "1" && (
        <div
          className="delete_all btn btn-danger mt-3"
          style={{ marginBottom: "-10px" }}
        >
          <input
            type="checkbox"
            checked={isCheck}
            onChange={handleCheckAll}
            style={{
              width: "25px",
              height: "25px",
              transform: "translateY(8px)",
            }}
          />

          <button
            className="btn btn-danger ml-2"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={handleDeleteAll}
          >
            DELETE ALL
          </button>
        </div>
      )}
      <div className="products">
        {products.length === 0 ? (
          <h2>No Product =((</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleCheck={handleCheck}
            />
          ))
        )}
      </div>
      {props.result < page * 4 ? (
        ""
      ) : (
        <button
          className="btn btn-outline-info d-block mx-auto mb-4"
          onClick={handleLoadMore}
        >
          Load more
        </button>
      )}
    </div>
  );
};

//nextjs support getServerSideProps
export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  // Lấy dữ liệu từ api/product/index
  const res = await getData(
    `product?limit=${
      page * 4
    }&category=${category}&sort=${sort}&title=${search}`
  );
  //server side rendering

  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

export default Home;
