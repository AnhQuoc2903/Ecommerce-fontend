import React from "react";
import {
  StyledNameProduct,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperCardStyle,
  WrapperImageStyle,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { WrapperStyleTextSell } from "../ProductDetailComponent/style";

const CardComponent = (props) => {
  const { images, name, price, rating, discount, seller } = props;

  return (
    <WrapperCardStyle
      cover={
        <img
          alt=""
          src={images}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      }
    >
      <WrapperImageStyle src={logo} />
      <StyledNameProduct>{name}</StyledNameProduct>
      <WrapperReportText>
        <span
          style={{
            marginRight: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {Array.from({ length: rating }, (_, index) => (
            <StarFilled
              key={index}
              style={{ fontSize: "14px", color: "#FFD700", marginRight: "2px" }}
            />
          ))}
        </span>
        <WrapperStyleTextSell>| Đã bán {seller || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginRight: "8px",
          }}
        >
          {price.toLocaleString()}đ
        </span>
        <WrapperDiscountText>-{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
