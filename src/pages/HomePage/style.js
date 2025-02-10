import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-item: center;
  gap: 24px;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-left: 125px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: rgb(13, 92, 182);
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
`;

export const WrapperProducts = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
`;
