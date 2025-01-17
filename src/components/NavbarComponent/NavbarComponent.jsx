import React from "react";
import { WrapperContent, WrapperLableText, WrapperTextValue, WrapperTextPrice } from "./style";
import { Checkbox, Rate } from "antd";


const NavbarComponent = () => {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <WrapperTextValue>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
            <Checkbox value="B">B</Checkbox>
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          return (
            <>
              <div style={{ display: "flex" }}>
                <Rate
                  style={{ fontSize: "12px" }}
                  disabled
                  defaultValue={option}
                />
                <span>{`tu ${option} sao`}</span>
              </div>
            </>
          );
        });
      case "price":
        return options.map((option) => {
          return (
              <WrapperTextPrice>{option}</WrapperTextPrice>
          );
        });
      default:
        return {};
    }
  };

  return (
    <div>
      <WrapperLableText>Label</WrapperLableText>
      <WrapperContent>
        {renderContent("text", ["Tu lanh", "TV", "MAYGIAT"])}
      </WrapperContent>
      {/* <WrapperContent>
        {renderContent("checkbox", [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ])}
      </WrapperContent>
      <WrapperContent>{renderContent("star", [1, 2, 3, 4, 5])}</WrapperContent>
      <WrapperContent>
        {renderContent("price", ["duoi 40000", "tren 50000"])}
      </WrapperContent> */}
    </div>
  );
};

export default NavbarComponent;
