import React from "react";
import {
  StyledNameProduct,
  WrapperPriceText,
  WrapperReportText,
  WrapperCardStyle,
  WrapperImageStyle,
} from "./style";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { WrapperStyleTextSell } from "../ProductDetailComponent/style";
import StarRatings from "react-star-ratings";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const { images, name, price, rating, seller, id } = props;
  const navigate = useNavigate();
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <WrapperCardStyle
      onClick={() => handleDetailsProduct(id)}
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
        <StarRatings
          rating={rating}
          starRatedColor="#FFD700"
          numberOfStars={5}
          starDimension="20px"
          starSpacing="2px"
        />
      </WrapperReportText>
      <WrapperStyleTextSell> Đã bán {seller || 1000}+</WrapperStyleTextSell>
      <WrapperPriceText>
        <span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginRight: "8px",
          }}
        >
          {convertPrice(price)}
        </span>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
