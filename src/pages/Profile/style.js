import { Input } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  font-size: 18px;
  margin: 4px 0;
  font-weight: bold;
  text-align: center;
  color: #1a94ff;
`;

export const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
  }
`;

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  gap: 20px;
`;

export const WrapperLable = styled.label`
  color: #000;
  font-size: 12px;
  line-height: 30px;
  font-weight: 600;
  width: 100px;
  text-align: left;
`;

export const WrapperInputAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

export const ModalInput = styled(Input.Password)`
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  &:focus {
    border-color: #1a94ff;
    box-shadow: 0 0 0 2px rgba(26, 148, 255, 0.2);
  }
`;

export const ModalLabel = styled.label`
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;
