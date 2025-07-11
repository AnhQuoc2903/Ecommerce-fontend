import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
`;

export const Lable = styled.span`
  font-size: 12px;
  color: #000;
  font-weight: bold;
`;

export const WrapperValue = styled.div`
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 255, 255);
  padding: 10px;
  width: fit-content;
  border-radius: 6px;
  margin-top: 4px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
  border-radius: 4px;
  justify-content: center;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 60px;
    border-top: none;
    border-bottom: none;

    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`;

export const WrapperItemOrderItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
`;
