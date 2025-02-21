import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import login from "../../assets/images/login.jpg";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserServices from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";
import { GoogleLogin } from "@react-oauth/google";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch("");

  const mutation = useMutationHooks((data) => UserServices.loginUser(data));

  const { data, isPending, isSuccess } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserServices.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );
  useEffect(() => {
    if (isSuccess && data?.access_token) {
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));

      const decoded = jwtDecode(data?.access_token);

      if (decoded?.id) {
        handleGetDetailsUser(decoded?.id, data?.access_token);
      }
      navigate("/");
    }
  }, [isSuccess, data, navigate, handleGetDetailsUser]);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google Credential Response:", credentialResponse);

      const result = await UserServices.googleAuth(
        credentialResponse.credential
      );
      console.log("Server Response:", result);

      if (result?.status === "OK") {
        dispatch(
          updateUser({ ...result.user, access_token: result.accessToken })
        );
        localStorage.setItem(
          "access_token",
          JSON.stringify(result.accessToken)
        );

        navigate("/");
        alert("Đăng nhập thành công");
      } else {
        alert("Không có quyền truy cập");
      }
    } catch (error) {
      console.error(
        "Google Auth Error:",
        error?.response?.data || error.message
      );
      alert(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleError = () => {
    alert("Đăng nhập thất bại");
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
            style={{
              marginBottom: "10px",
              padding: "10px",
            }}
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
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
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
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "10px 0 10px 0",
              }}
              textButton={"Đăng nhập"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <p>
            <WrapperText> Chưa có tài khoản?</WrapperText>
            <WrapperTextLight
              onClick={handleNavigateSignUp}
              style={{ marginLeft: "5px" }}
            >
              Tạo tài khoản
            </WrapperTextLight>
          </p>
          <div>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </div>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={login}
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

export default SignInPage;
