import React, { useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderCompenent from "../../components/SliderComponent/SliderCompenent";
import slice1 from "../../assets/images/Slice1.jpg";
import slice5 from "../../assets/images/Slice4.jpg";
import slice4 from "../../assets/images/Slice5.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductServices from "../../services/ProductServices";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import Banner from "../../components/Banner/Banner";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 300);
  const [limit, setLimit] = useState(10);
  // const [page, setPage] = useState(10);
  const arr = ["TV", "Tu Lanh", "Lap Top"];

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductServices.getAllProduct(search, limit);
    return res;
  };

  const {
    isPending,
    data: products,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  return (
    <>
      <SliderCompenent arrImages={[slice1, slice5, slice4]} />
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#33CCFF",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <WrapperTypeProduct
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <Loading isPending={isPending}>
        <div
          className="body"
          style={{
            width: "100%",
            borderRadius: "10px",
          }}
        >
          <div
            id="container"
            style={{
              width: "1270px",
              margin: "0 auto",
            }}
          >
            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product?._id}
                    countInStock={product?.countInStock}
                    description={product?.description}
                    images={product?.images[0]}
                    name={product?.name}
                    price={product?.price}
                    rating={product?.rating}
                    type={product?.type}
                    discount={product?.discount}
                    seller={product?.seller}
                  />
                );
              })}
            </WrapperProducts>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <WrapperButtonMore
                textButton={isPreviousData ? "Load more" : "Xem thêm"}
                type="outline"
                style={{
                  border: "1px solid rgb(11,116,229)",
                  color: `${products?.total === products?.data?.length ? "#ccc" : "rgb(11,116,229)"}`,
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                }}
                disabled={
                  products?.total === products?.data?.length ||
                  products?.totalPage === 1
                }
                styleTextButton={{
                  fontWeight: "bold",
                  color:
                    products?.total === products?.data?.length
                      ? "#fff"
                      : "rgb(11,116,229)",
                }}
                onClick={() => setLimit((prev) => prev + 5)}
              />
            </div>
          </div>
        </div>
      </Loading>
      <Banner />
    </>
  );
};

export default HomePage;
