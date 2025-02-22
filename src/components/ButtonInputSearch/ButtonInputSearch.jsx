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
    onSearch,
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
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
        onSearch={onSearch}
      />
    </div>
  );
};

export default ButtonInputSearch;
