import React, { useEffect, useState, useCallback } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SignUp from "../../assets/images/sign-up.jpg";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserServices from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components//Message/Message";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHooks((data) => UserServices.signupUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  const handleNavigateSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  useEffect(() => {
    if (isSuccess && data?.status !== "ERR") {
      message.success();
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError, data, handleNavigateSignIn]);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(151, 226, 236, 0.53)",
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
          <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>Xin chào</h1>
          <p style={{ fontWeight: "bold", fontSize: "12px" }}>
            Đăng nhập hoặc Tạo tài khoản
          </p>
          <InputForm
            style={{ marginBottom: "10px", padding: "10px" }}
            placeholder="adc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "12px",
                right: "8px",
              }}
            >
              {isShowPassword ? (
                <EyeFilled style={{ fontSize: "20px", color: "blue" }} />
              ) : (
                <EyeInvisibleFilled
                  style={{ fontSize: "20px", color: "gray" }}
                />
              )}
            </span>
            <InputForm
              style={{
                marginBottom: "10px",
                padding: "10px",
              }}
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "12px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? (
                <EyeFilled style={{ fontSize: "20px", color: "blue" }} />
              ) : (
                <EyeInvisibleFilled
                  style={{ fontSize: "20px", color: "gray" }}
                />
              )}
            </span>
            <InputForm
              placeholder="confirmPassword"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
              style={{
                padding: "10px",
              }}
            />
          </div>
          {data?.status === "ERR" && (
            <span
              style={{
                color: "red",
                marginTop: "10px",
                fontSize: "15px",
                fontStyle: "italic",
              }}
            >
              {data?.message}
            </span>
          )}
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                padding: "20px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "20px 0 10px 0",
              }}
              textButton={"Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p>
            <WrapperText>Bạn đã có tài khoản?</WrapperText>
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng nhập
            </WrapperTextLight>
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
          <h2 style={{ fontWeight: "bold", marginTop: "10px" }}>
            Mua sắm tại TKTK
          </h2>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
