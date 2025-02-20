import React, { useState } from "react";
import { Checkbox } from "antd";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperStyleHeader,
  WrapperListOrder,
  WrapperPriceDiscount,
  WrapperRight,
  WrapperTotal,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

import imag from "../../assets/images/details1.jpg";
import {
  WrapperInputNumber,
  WrapperQualityProduct,
} from "../../components/ProductDetailComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const OrderPage = ({ count = 1 }) => {
  const onChange = (e) => {
    console.log(`checked = ${e.target.value}`);
  };
  const handleChangeCount = () => {};

  const handleOnchangeCheckAll = (e) => {};

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox onChange={handleOnchangeCheckAll}></Checkbox>
                <span>Tất cả ({count} sản phẩm)</span>
              </span>
              <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
                <span>Đơn Gía</span>
                <span>Số lượng</span>
                <span>Thành Tiền</span>
                <DeleteOutlined style={{ cursor: "pointer" }} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              <WrapperItemOrder>
                <div
                  style={{
                    width: "390px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox onChange={onChange}></Checkbox>
                  <img
                    alt=""
                    src={imag}
                    style={{ width: "77px", height: "79" }}
                  />
                  <div>nam sản pahamr</div>
                </div>

                <div
                  style={{ flex: "1", display: "flex", alignItems: "center" }}
                >
                  <span>
                    <span style={{ fontSize: "13px", color: "#242424" }}>
                      211
                    </span>
                    <WrapperPriceDiscount>230</WrapperPriceDiscount>
                  </span>
                  <WrapperCountOrder>
                    <button style={{ border: "none" }}>
                      <MinusOutlined
                        style={{ color: "#000", fontSize: "10px" }}
                      />
                    </button>
                    <WrapperInputNumber
                      onChange={onChange}
                      defaultValue={1}
                    ></WrapperInputNumber>
                    <button style={{ border: "none" }}>
                      <PlusOutlined
                        style={{ color: "#000", fontSize: "10px" }}
                      />
                    </button>
                  </WrapperCountOrder>
                  <span
                    style={{ color: "rgb(255,66,78)", fontSize: "13px" }}
                  ></span>
                  <DeleteOutlined style={{ cursor: "pointer" }} />
                </div>
              </WrapperItemOrder>
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>Thuế</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng Tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{ color: "rgb(254,56,52)", fontSize: "24px" }}
                  ></span>
                  <span style={{ color: "#000", fontSize: "14px" }}></span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "220px",
                border: "none",
                borderRadius: "4px",
              }}
              textButton={"Mua hàng"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
