import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";

const SliderCompenent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <WrapperSliderStyle {...settings}>
      {arrImages.map((image) => (
        <Image
          src={image}
          alt="slider"
          preview={false}
          width="100%"
          height="400px"
          style={{ objectFit: "fill" }}
        />
      ))}
    </WrapperSliderStyle>
  );
};

export default SliderCompenent;
