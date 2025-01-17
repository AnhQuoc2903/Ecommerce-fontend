import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {
  return (
    <div
      style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
    >
      <h2>Trang chủ</h2>
      <div
        style={{
          display: "flex",
          background: "#fff",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        <ProductDetailsComponent />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
