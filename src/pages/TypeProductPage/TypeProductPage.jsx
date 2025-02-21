import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductServices from "../../services/ProductServices";
import Loading from "../../components/LoadingComponent/Loading";

const TypeProductPage = () => {
  const [typeProducts, setTypeProducts] = useState([]);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductType = async (type) => {
    setLoading(true);
    try {
      const res = await ProductServices.getProductType(type);
      if (res?.status === "OK") {
        setProducts(res?.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductServices.getAllTypeProduct();
      if (res?.status === "OK") {
        setTypeProducts(res?.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state);
    }
  }, [state]);

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const onChange = (page) => {
    console.log("Chuyển trang:", page);
  };

  const handleSelectType = (type) => {
    fetchProductType(type);
  };

  return (
    <Loading isPending={loading}>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "1370px", margin: "0 auto" }}>
          <Row style={{ paddingTop: "10px", flexWrap: "nowrap" }}>
            <WrapperNavbar span={4}>
              <NavbarComponent
                typeProducts={typeProducts}
                onSelectType={handleSelectType}
              />
            </WrapperNavbar>

            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WrapperProducts>
                {products.length > 0
                  ? products.map((product) => (
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
                        id={product?._id}
                      />
                    ))
                  : !loading && (
                      <p style={{ textAlign: "center" }}>
                        Không có sản phẩm nào.
                      </p>
                    )}
              </WrapperProducts>
              <Pagination
                defaultCurrent={1}
                total={100}
                onChange={onChange}
                style={{ justifyContent: "center", marginTop: "10px" }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
