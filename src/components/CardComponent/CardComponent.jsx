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
    <article
      onClick={() => handleDetailsProduct(id)}
      style={{ cursor: "pointer" }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleDetailsProduct(id)}
      aria-label={`Xem chi tiết sản phẩm ${name}`}
      title={`Xem chi tiết sản phẩm ${name}`}
    >
      <WrapperCardStyle>
        <img
          src={images}
          alt={`Hình ảnh sản phẩm ${name}`}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        {/* Logo overlay */}
        <WrapperImageStyle
          src={logo}
          alt="Logo cửa hàng"
          title="Thương hiệu"
        />

        {/* Tên sản phẩm */}
        <StyledNameProduct as="h2">{name}</StyledNameProduct>

        {/* Đánh giá sao */}
        <WrapperReportText>
          <StarRatings
            rating={rating}
            starRatedColor="#FFD700"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="2px"
            name={`rating-${id}`}
          />
        </WrapperReportText>

        {/* Đã bán */}
        <WrapperStyleTextSell as="p">
          Đã bán {seller || 1000}+
        </WrapperStyleTextSell>

        {/* Giá */}
        <WrapperPriceText as="p">
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginRight: "8px",
              color: "#1a1a1a",
            }}
          >
            {convertPrice(price)}
          </span>
        </WrapperPriceText>
      </WrapperCardStyle>
    </article>
  );
};

export default CardComponent;
