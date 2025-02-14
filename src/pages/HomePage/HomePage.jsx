import React from "react";
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

const HomePage = () => {
  const arr = ["TV", "Tu Lanh", "Lap Top"];

  const fetchProductAll = async () => {
    const res = await ProductServices.getAllProduct();
    return res;
  };

  const { isPending, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
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
            backgroundColor: "#efefef",
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
                textButton="Xem thêm"
                type="outline"
                style={{
                  border: "1px solid rgb(11,116,229)",
                  color: "rgb(11,116,229)",
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                }}
                styleTextButton={{ fontWeight: "bold" }}
              />
            </div>
          </div>
        </div>
      </Loading>
    </>
  );
};

export default HomePage;
