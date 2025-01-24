import { Badge, Col, Popover } from "antd";
import React, { useState } from "react";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccunt,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserServices from "../../services/UserServices";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    await UserServices.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}>
        Đăng xuất
      </WrapperContentPopup>
      <WrapperContentPopup>Thông tin người dùng</WrapperContentPopup>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        background: "rgb(26,148,255)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader>ECO WARRIORS</WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSearch
            size="large"
            bordered={false}
            textButton="Tim Kiem"
            placeholder="Input search text"
          />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "30px", alignItems: "center" }}
        >
          <Loading isPending={loading}>
            <WrapperHeaderAccunt>
              <UserOutlined style={{ fontSize: "30px", marginLeft: "10px" }} />
              {user?.name ? (
                <>
                  <Popover content={content} trigger="click">
                    <div
                      style={{
                        cursor: "pointer",
                        marginTop: "5px",
                        maxWidth: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user?.name}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập/Đăng Ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài Khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccunt>
          </Loading>
          <div>
            <Badge count={4} size="small">
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "#fff" }}
              />
            </Badge>
            <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
