import styled from "styled-components";
import { Card } from "antd";

export const WrapperCardStyle = styled(Card)`
  width: 100%;
  max-width: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  & img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

export const WrapperImageStyle = styled.img`
  top: -1px;
  left: -1px;
  border-top-left-radius: 3px;
  position: absolute;
  height: 14px !important;
  width: 68px !important;
`;

export const StyledNameProduct = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WrapperReportText = styled.div`
  font-size: 12px;
  color: rgb(128, 128, 137);
  margin: 6px 0;
`;

export const WrapperPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const WrapperDiscountText = styled.span`
  color: #ff4d4f;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  padding: 2px 6px;
  background-color: #fff0f0;
  border-radius: 4px;
`;
