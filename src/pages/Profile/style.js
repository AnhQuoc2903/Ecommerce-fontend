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
