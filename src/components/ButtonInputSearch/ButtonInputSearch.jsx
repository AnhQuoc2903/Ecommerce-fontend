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
    backgroundColorButton = "#fff", // Nút trắng
    colorButton = "#000",           // Chữ đen
    onSearch,
  } = props;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "32px",
        padding: "6px 10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "600px",
        transition: "all 0.3s ease",
      }}
    >
      <InputComponent
        size={size}
        placeholder={placeholder}
        variant={variant}
        style={{
          backgroundColor: backgroundColorInput,
          border: "none",
          outline: "none",
          flex: 1,
          fontSize: "16px",
          padding: "10px 16px",
          borderRadius: "32px",
        }}
        {...props}
      />
      <ButtonComponent
        size={size}
        style={{
          backgroundColor: backgroundColorButton,
          border: "none",
          padding: "0 16px",
          borderRadius: "24px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        icon={
          <SearchOutlined
            style={{
              fontSize: "20px",
              color: colorButton,
            }}
          />
        }
        textButton={textButton}
        styleTextButton={{
          color: colorButton,
          fontWeight: 600,
        }}
        onSearch={onSearch}
      />
    </div>
  );
};

export default ButtonInputSearch;
