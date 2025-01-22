import React from "react";
import { WrapperInputStyle } from "./style";

const InputForm = ({ onChange, value, placeholder = "Nhận test", ...rests }) => {
  const handleOnchangeInput = (e) => {
    onChange(e.target.value);
  };

  return (
    <WrapperInputStyle
      placeholder={placeholder}
      value={value}
      {...rests}
      onChange={handleOnchangeInput}
    />
  );
};

export default InputForm;
