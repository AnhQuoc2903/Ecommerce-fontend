import React, { useState } from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import SignUp from "../../assets/images/sign-up.jpg";
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

const SignUpPage = () => {
  const [isShowPassword] = useState(false)
  const [isShowConfirmPassword] = useState(false)
  return (
    <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.53)",
      height: "100vh",
    }}
  >
    <div
      style={{
        width: "800px",
        height: "445px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        display: "flex",
      }}
    >
      <WrapperContainerLeft>
        <h1>Xin chào</h1>
        <p style={{fontSize: "10px"}}>Đăng nhập hoặc Tạo tài khoản</p>
        <InputForm style={{ marginBottom: "10px" }} placeholder="adc@gmail.com"/>
        <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "10px",
                right: "8px",
              }}
            >
              {isShowPassword ? (
                <EyeFilled />
              ) : (
                <EyeInvisibleFilled />
              )
              }
            </span>
            <InputForm style={{ marginBottom: "10px" }} placeholder="password" type={isShowPassword ? "text" : "password"} />
          </div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "10px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? (
                <EyeFilled />
              ) : (
                <EyeInvisibleFilled />
              )
              }
            </span>
            <InputForm placeholder="confirmPassword" type={isShowConfirmPassword ? "text" : "confirmPassword"} />
          </div>
        <ButtonComponent
          border={false}
          size={40}
          style={{
            background: "rgb(255, 57, 69)",
            height: "48px",
            width: "100%",
            border: "none",
            borderRadius: "4px",
            margin: "20px 0 10px 0",
          }}
          textButton={"Đăng nhập"}
          styleTextButton={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700",
          }}
        ></ButtonComponent>
        <p>
          Bạn đã có tài khoản? <WrapperTextLight>Đăng nhập</WrapperTextLight>
        </p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image
          src={SignUp}
          preview={false}
          alt="image-login"
          height="203px"
          width="250px"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <h2 style={{ fontWeight: "bold", marginTop: "10px"}}>
          Mua sắm tại TKTK
        </h2>
      </WrapperContainerRight>
    </div>
  </div>
  )
}

export default SignUpPage