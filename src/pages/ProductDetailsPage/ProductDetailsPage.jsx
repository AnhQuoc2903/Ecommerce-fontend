import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Flex } from "antd";
import ProductDetailsComponent from "../../components/ProductDetailComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div
      style={{
        width: "100%",
        background: "#efefef",
        height: "100",
      }}
    >
      <Breadcrumb
        style={{ marginBottom: 10 }}
        items={[
          {
            title: (
              <span
                onClick={() => navigate("/")}
                style={{
                  cursor: "pointer",
                  marginLeft: "120px",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                <HomeOutlined /> Trang chủ
              </span>
            ),
          },
          {
            title: "Chi tiết sản phẩm",
          },
        ]}
      />
      <Flex justify="center">
        <Card>
          <ProductDetailsComponent idProduct={id} />
        </Card>
      </Flex>
    </div>
  );
};

export default ProductDetailsPage;
