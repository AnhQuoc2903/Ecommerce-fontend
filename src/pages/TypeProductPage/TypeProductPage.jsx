import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductServices from "../../services/ProductServices";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 300);
  const [typeProducts, setTypeProducts] = useState([]);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 1,
  });

  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductServices.getProductType(type, page - 1, limit);

    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPagination((prev) => ({
        ...prev,
        total: res?.totalPage * limit,
      }));
    } else {
      setLoading(false);
    }
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
      fetchProductType(state, pagination.page, pagination.limit);
    }
  }, [state, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const onChange = (current, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));

    fetchProductType(state, current, pageSize);
  };

  const handleSelectType = (type) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
    fetchProductType(type, 1, pagination.limit);
  };

  return (
    <Loading isPending={loading}>
      <div style={{ width: "100%", background: "#efefef" }}>
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
                  ? products
                      ?.filter((pro) => {
                        if (searchDebounce === "") {
                          return true;
                        } else if (
                          pro?.name
                            ?.toLowerCase()
                            ?.includes(searchDebounce?.toLowerCase())
                        ) {
                          return true;
                        }
                        return false;
                      })
                      ?.map((product) => (
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
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
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
