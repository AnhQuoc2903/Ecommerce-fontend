import React, { useState } from "react";
import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  const [valueInput] = useState("");
  const { placeholder = "Nhận test", ...rests } = props;
  return (
    <>
      <WrapperInputStyle
        placeholder={placeholder}
        valueInput={valueInput}
        {...rests}
      >
       </WrapperInputStyle>
    </>
  );
};

export default InputForm;
