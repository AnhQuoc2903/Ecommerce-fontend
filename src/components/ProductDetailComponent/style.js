import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleNameProduct = styled.h1`
  color: rgb(36, 36, 36);
  font-size: 24px;
  line-height: 32px;
  font-weight: 300px;
  word-break: break-word;
  margin-top: -15px;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: #666;
`;

export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  font-weight: 500px;
  margin-top: 10px;
`;

export const WrapperAddressProduct = styled.h1`
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  while-space: nowrap;
`;

export const WrapperQualityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
