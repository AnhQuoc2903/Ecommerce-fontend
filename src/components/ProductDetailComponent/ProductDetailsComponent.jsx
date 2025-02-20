import { Col, Image, Row, Typography, Button } from "antd";
import React, { useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as ProductServices from "../../services/ProductServices";
import Loading from "../LoadingComponent/Loading";
import StarRatings from "react-star-ratings";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";

const { Text } = Typography;

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state?.user);

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async ({ queryKey }) => {
    const id = queryKey[1];
    if (id) {
      const res = await ProductServices.getDetailsProduct(id);
      return res.data;
    }
  };

  const handleChangeCount = (type) => {
    setNumProduct((prev) =>
      type === "increase" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  return (
    <Loading isPending={isPending}>
      <Row style={{ padding: "10px", background: "#fff", borderRadius: "8px" }}>
        <Col
          span={12}
          style={{
            borderRight: "1px solid #e5e5e5",
            paddingLeft: "10px",
            paddingRight: "10px",
            textAlign: "center",
          }}
        >
          <Image
            src={productDetails?.images?.[0]}
            alt="product"
            preview={false}
            style={{ borderRadius: "8px", maxWidth: "100%", height: "auto" }}
          />
          <Row
            justify="space-between"
            gutter={[8, 8]}
            style={{ paddingTop: "12px" }}
          >
            {productDetails?.images?.slice(1, 5).map((img, index) => (
              <Col key={index} span={5}>
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "10px",
                  }}
                >
                  <Image src={img} alt={`small-${index}`} preview={false} />
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={12} style={{ paddingLeft: "16px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <StarRatings
              rating={productDetails?.rating}
              starRatedColor="#FFD700"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="4px"
            />
            <WrapperStyleTextSell>
              | Đã bán {productDetails?.seller || 1000}+
            </WrapperStyleTextSell>
          </div>

          <WrapperPriceTextProduct>
            {productDetails?.price?.toLocaleString() || 1000} đ
          </WrapperPriceTextProduct>

          <WrapperAddressProduct>
            <Text type="secondary">Giao đến:</Text>
            <Text underline>{user?.address}</Text>
            <Text
              type="primary"
              style={{ cursor: "pointer", marginLeft: "8px" }}
            >
              - Đổi địa chỉ
            </Text>
          </WrapperAddressProduct>

          <div
            style={{
              margin: "20px 0",
              padding: "12px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <Text strong>Số lượng</Text>
            <WrapperQualityProduct>
              <Button
                type="text"
                icon={<MinusOutlined />}
                onClick={() => handleChangeCount("decrease")}
              />
              <WrapperInputNumber
                onChange={onChange}
                value={numProduct}
                defaultValue={1}
                size="small"
              />
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => handleChangeCount("increase")}
              />
            </WrapperQualityProduct>
          </div>

          <Row gutter={16}>
            <Col>
              <Button type="primary" size="large" style={{ width: "220px" }}>
                Chọn mua
              </Button>
            </Col>
            <Col>
              <Button
                size="large"
                style={{
                  width: "220px",
                  borderColor: "rgb(13,92,182)",
                  color: "rgb(13,92,182)",
                }}
              >
                Mua trả sau
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
