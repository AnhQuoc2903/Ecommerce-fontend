import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import * as UserServices from "../../services/UserServices";
import {
  Wrapper,
  Container,
  ErrorMessage,
  EyeIcon,
  InputWrapper,
  StyledInput,
  StyledButton,
  Title,
  Description,
} from "./style";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (password.trim() === "" || confirmPassword.trim() === "") {
      setMessage("Mật khẩu không được để trống!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await UserServices.resetPassword(token, {
        password,
        confirmPassword,
      });

      if (response.status === "OK") {
        alert("🎉 Đặt lại mật khẩu thành công!");
        navigate("/sign-in");
      } else {
        setMessage(response.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      setMessage("❌ Lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>Đặt Lại Mật Khẩu</Title>
        <Description>Nhập mật khẩu mới của bạn.</Description>

        <InputWrapper>
          <StyledInput
            placeholder="Mật khẩu mới"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <EyeIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </EyeIcon>
        </InputWrapper>

        <InputWrapper>
          <StyledInput
            placeholder="Xác nhận mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </EyeIcon>
        </InputWrapper>

        <StyledButton onClick={handleResetPassword} disabled={loading}>
          {loading ? "⏳ Đang xử lý..." : "Đặt lại mật khẩu"}{" "}
        </StyledButton>

        {message && <ErrorMessage>{message}</ErrorMessage>}
      </Container>
    </Wrapper>
  );
};

export default ResetPasswordPage;
