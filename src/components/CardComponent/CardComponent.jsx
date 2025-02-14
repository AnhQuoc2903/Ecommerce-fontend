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
      style={{
        width: 200,
        styles: {
          header: { width: "200px", height: "200px" },
          body: { padding: "10px" },
        },
      }}
      cover={<img alt="" src={images} />}
    >
      <WrapperImageStyle src={logo} />
      <StyledNameProduct>{name}</StyledNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <span>{rating} </span>
          <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
        </span>
        <WrapperStyleTextSell>| Da Ban {seller || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{price} đ</span>
        <WrapperDiscountText>{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
