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
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

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
      localStorage.setItem("access_token", data.access_token);
      const decoded = jwtDecode(data.access_token);
      if (decoded?.id) {
        handleGetDetailsUser(decoded.id, data.access_token);
      }
      navigate(location?.state || "/");
    } else if (data?.status === "ERR") {
      alert(data?.message);
    }
  }, [isSuccess, data, navigate, handleGetDetailsUser, location?.state]);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "ERR") {
            alert(data?.message);
          }
        },
      }
    );
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleNavigateForget = () => {
    navigate("/forget-password");
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await UserServices.googleAuth(
        credentialResponse.credential
      );

      if (result?.status === "OK") {
        if (result.user.isBlocked) {
          alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
          return;
        }

        const userData = { ...result.user, access_token: result.accessToken };
        dispatch(updateUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
        alert("Đăng nhập thành công");
      } else {
        alert("Không có quyền truy cập");
      }
    } catch (error) {
      console.error("Google Auth Error:", error?.response?.data || error.message);
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
        background: "linear-gradient(to right, #c2e9fb, #a1c4fd)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "880px",
          height: "480px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          display: "flex",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }}
      >
        {/* LEFT SIDE */}
        <WrapperContainerLeft style={{ flex: 1.2, padding: "40px 30px" }}>
          <h1 style={{ fontWeight: "bold", fontSize: "32px", marginBottom: 8 }}>
            Xin chào!
          </h1>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: 24 }}>
            Đăng nhập hoặc tạo tài khoản để tiếp tục
          </p>

          <InputForm
            style={{ marginBottom: 12, padding: 12 }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />

          <div style={{ position: "relative", marginBottom: 12 }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: 12,
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {isShowPassword ? (
                <EyeFilled style={{ fontSize: 18, color: "blue" }} />
              ) : (
                <EyeInvisibleFilled style={{ fontSize: 18, color: "gray" }} />
              )}
            </span>
            <InputForm
              placeholder="Mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
              style={{ padding: 12 }}
            />
          </div>

          {data?.status === "ERR" && (
            <div
              style={{
                color: "red",
                fontSize: "14px",
                fontStyle: "italic",
                marginBottom: 8,
              }}
            >
              {data?.message || "Đăng nhập thất bại!"}
            </div>
          )}

          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={!email || !password}
              onClick={handleSignIn}
              styleButton={{
                background: "#ff4d4f",
                height: 48,
                width: "100%",
                border: "none",
                borderRadius: "6px",
                marginBottom: 12,
              }}
              textButton="Đăng nhập"
              styleTextButton={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
              }}
            />
          </Loading>

          <div style={{ fontSize: 13 }}>
            <WrapperTextLight
              onClick={handleNavigateForget}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              Quên mật khẩu?
            </WrapperTextLight>
          </div>

          <div style={{ fontSize: 13, marginTop: 12 }}>
            <WrapperText>Bạn chưa có tài khoản?</WrapperText>
            <WrapperTextLight
              onClick={handleNavigateSignUp}
              style={{ marginLeft: 5, color: "#1890ff", cursor: "pointer" }}
            >
              Đăng ký ngay
            </WrapperTextLight>
          </div>

          <div style={{ marginTop: 20 }}>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </div>
        </WrapperContainerLeft>

        {/* RIGHT SIDE */}
        <WrapperContainerRight
          style={{
            flex: 1,
            background: "#f7f7f7",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <Image
            src={login}
            preview={false}
            alt="image-login"
            height="200px"
            width="260px"
            style={{
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <h2
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              color: "#333",
            }}
          >
            Mua sắm tại TKTK
          </h2>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
