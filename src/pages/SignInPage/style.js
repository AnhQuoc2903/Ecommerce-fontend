import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 80px 40px 80px 40px;
  display: flex;
  flex-direction: column;
`;

export const WrapperContainerRight = styled.div`
  width: 300px;
  background: rgb(206, 221, 247);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const WrapperText = styled.span`
  font-size: 13px;
  cursor: pointer;
  font-weight: bold;
`;

export const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  cursor: pointer;
  font-weight: bold;
`;
