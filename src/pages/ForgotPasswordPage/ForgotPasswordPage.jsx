import React, { useState } from "react";
import * as UserServices from "../../services/UserServices";
import {
  Wrapper,
  Container,
  ErrorMessage,
  InputWrapper,
  StyledInput,
  StyledButton,
  Title,
  Description,
} from "./style";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await UserServices.forgotPassword(email);
      if (response.status === "OK") {
        setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      } else {
        setMessage("Không tìm thấy tài khoản.");
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>Quên Mật Khẩu</Title>
        <Description>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </Description>
        <InputWrapper>
          <StyledInput
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </InputWrapper>
        <StyledButton
          textButton="Gửi yêu cầu"
          onClick={handleForgotPassword}
          styleButton={{ marginTop: "10px" }}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}{" "}
        </StyledButton>
        {message && <ErrorMessage>{message}</ErrorMessage>}
      </Container>
    </Wrapper>
  );
};

export default ForgotPasswordPage;
