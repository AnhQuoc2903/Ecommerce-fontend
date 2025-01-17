import React from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderCompenent from "../../components/SliderComponent/SliderCompenent";
import slice1 from "../../assets/images/h1.jpg";
import slice5 from "../../assets/images/h2.jpg";
import slice4 from "../../assets/images//h3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import CardComponent1 from "../../components/CardComponent/CardComponent1";
import CardComponent2 from "../../components/CardComponent/CardComponent2";
import CardComponent3 from "../../components/CardComponent/CardComponent3";
import CardComponent4 from "../../components/CardComponent/CardComponent4";
import CardComponent5 from "../../components/CardComponent/CardComponent5";
import CardComponent6 from "../../components/CardComponent/CardComponent6";
import CardComponent7 from "../../components/CardComponent/CardComponent7";
import CardComponent8 from "../../components/CardComponent/CardComponent8";
import CardComponent9 from "../../components/CardComponent/CardComponent9";


const HomePage = () => {
  const arr = ["TV", "Tu Lanh", "Lap Top"];
  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto"}}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div className="body" style={{width: "100%", backgroundColor: '#efefef'}}>
        <div
          id="container"
          style={{
            height: "1000px",
            width: "1270px",
            margin: "0 auto"
          }}
        >
          <SliderCompenent arrImages={[slice1, slice5, slice4]} />
          <WrapperProducts>
            <CardComponent />
            <CardComponent1 />
            <CardComponent2 />
            <CardComponent3 />
            <CardComponent4 />
            <CardComponent5 />
            <CardComponent6 />
            <CardComponent7 />
            <CardComponent8 />
            <CardComponent9 />
          </WrapperProducts>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              textButton="Xem thêm"
              type="outline"
              style={{
                border: "1px solid rgb(11,116,229)",
                color: "rgb(11,116,229)",
                width: "240px",
                height: "38px",
                borderRadius: "4px"
              }}
              styleTextButton={{ fontWeight: "bold" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
