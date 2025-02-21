import React from "react";
import { useNavigate } from "react-router-dom";
import { WrapperContent, WrapperLableText, WrapperTextValue } from "./style";

const NavbarComponent = ({ typeProducts }) => {
  const navigate = useNavigate();

  const handleSelectType = (type) => {
    const formattedType = encodeURIComponent(type.trim().replace(/\s+/g, "_"));
    navigate(`/product/${formattedType}`, { state: type });
  };

  return (
    <div>
      <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
      <WrapperContent>
        {typeProducts?.map((product, index) => (
          <WrapperTextValue
            key={index}
            onClick={() => handleSelectType(product)}
            style={{ cursor: "pointer" }}
          >
            {product}
          </WrapperTextValue>
        ))}
      </WrapperContent>
    </div>
  );
};

export default NavbarComponent;
