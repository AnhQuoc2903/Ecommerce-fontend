import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    variant,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13, 92, 182)",
    colorButton = "#fff",
  } = props;
  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        variant={variant}
        style={{
          backgroundColor: backgroundColorInput,
          border: variant === "outlined" ? undefined : "none",
        }}
        {...props}
      />
      <ButtonComponent
        size={size}
        style={{
          backgroundColor: backgroundColorButton,
          border: variant === "outlined" ? undefined : "none",
        }}
        icon={
          <SearchOutlined color={colorButton} style={{ color: colorButton }} />
        }
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
      />
    </div>
  );
};

export default ButtonInputSearch;
