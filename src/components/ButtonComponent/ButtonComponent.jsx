import { Button } from "antd";
import React from "react";

const ButtonComponent = ({
  size,
  styleButton,
  styleTextButton,
  textButton,
  colorButton,
  ...rests
}) => {
  return (
    <Button
      size={size}
      style={{ styleButton }}
      {...rests}
      // icon={
      //   <SearchOutlined color={colorButton} style={{ color: colorButton }} />
      // }
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;
