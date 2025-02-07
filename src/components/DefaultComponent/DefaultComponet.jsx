import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import "./DefaultComponent.css";

const DefaultComponent = ({ children }) => {
  return (
    <div className="default-layout">
      <HeaderComponent />
      <main className="default-main">{children}</main>
      <FooterComponent />
    </div>
  );
};

export default DefaultComponent;
