import styled from "styled-components";
import background from "../../assets/images/BackGroundSignIn.png";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const Container = styled.div`
  text-align: center;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4f;
  margin-top: 10px;
  font-size: 14px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
  }

  &:hover {
    border-color: #1890ff;
  }
`;

export const StyledButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #40a9ff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

export const Description = styled.p`
  margin-bottom: 30px;
  font-size: 14px;
  color: #666;
`;
