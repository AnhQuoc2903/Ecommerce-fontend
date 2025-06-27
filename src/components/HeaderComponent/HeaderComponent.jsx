import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Col, Image, Popover, Tooltip } from "antd";
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import Loading from "../LoadingComponent/Loading";

import * as UserServices from "../../services/UserServices";
import { resetUser } from "../../redux/slides/userSlide";
import { searchProduct } from "../../redux/slides/productSlide";

import logoBalabin from "../../assets/images/logoBalabin.png";
import "./HeaderComponent.css";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const handleNavigateLogin = () => navigate("/sign-in");

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    await UserServices.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  useEffect(() => {
    if (search) dispatch(searchProduct(search));
  }, [search, dispatch]);

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name || "");
    setUserAvatar(user?.avatar || "");
    setLoading(false);
  }, [user]);

  const content = (
    <div role="menu">
      <div
        className="popover-item"
        onClick={() => navigate("/profile-user")}
        role="menuitem"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate("/profile-user")}
      >
        Hồ sơ của tôi
      </div>
      {user?.isAdmin && (
        <div
          className="popover-item"
          onClick={() => navigate("/system/admin")}
          role="menuitem"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate("/system/admin")}
        >
          Quản lý hệ thống
        </div>
      )}
      <div
        className="popover-item"
        onClick={handleLogout}
        role="menuitem"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
      >
        Đăng xuất
      </div>
    </div>
  );

  const onSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(searchProduct(value));
  };

  return (
    <header className="header-container" role="banner">
      <div
        className="header-wrapper"
        style={{
          justifyContent: isHiddenSearch && isHiddenCart ? "space-between" : "unset",
        }}
      >
        {/* Logo Section */}
        <Col span={5} className="logo">
          <Tooltip title="Về trang chủ">
            <div
              onClick={() => navigate("/")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/")}
              aria-label="Logo Balabin - Về trang chủ"
            >
              <Image
                preview={false}
                alt="Logo Balabin - Trang chủ mua sắm trực tuyến"
                src={logoBalabin}
                width={70}
                height={70}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
          </Tooltip>
        </Col>

        {/* Search Section */}
        {!isHiddenSearch && (
          <Col span={13} className="search-container">
            <div className="search-wrapper">
              <ButtonInputSearch
                size="large"
                bordered={false}
                textButton="Tìm Kiếm"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={onSearch}
                onSearch={() => dispatch(searchProduct(search))}
                aria-label="Tìm kiếm sản phẩm"
                role="searchbox"
              />
            </div>
          </Col>
        )}

        {/* User & Cart Section */}
        <Col span={6} className="user-actions">
          <Loading isPending={loading}>
            <nav className="account-wrapper" role="navigation" aria-label="Tài khoản người dùng">
              {userAvatar ? (
                <Image
                  preview={false}
                  src={userAvatar}
                  alt={`Avatar của ${userName || user?.email || 'người dùng'}`}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <UserOutlined
                  style={{ fontSize: "30px", marginLeft: "10px", color: "#fff" }}
                  aria-label="Icon người dùng"
                />
              )}

              {user?.access_token ? (
                <Popover
                  content={content}
                  trigger="click"
                  placement="bottomRight"
                  overlayClassName="user-menu-popover"
                >
                  <div
                    style={{
                      cursor: "pointer",
                      marginTop: "5px",
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#fff",
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Tài khoản: ${userName || user?.email}`}
                    onKeyDown={(e) => e.key === 'Enter' && e.target.click()}
                  >
                    {userName || user?.email}
                  </div>
                </Popover>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer", color: "#fff" }}
                  role="button"
                  tabIndex={0}
                  aria-label="Đăng nhập hoặc đăng ký tài khoản"
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigateLogin()}
                >
                  <div className="text-small">Đăng nhập/Đăng ký</div>
                  <div className="text-small">
                    Tài khoản <CaretDownOutlined aria-hidden="true" />
                  </div>
                </div>
              )}
            </nav>
          </Loading>

          {!isHiddenCart && (
            <div
              className="cart-wrapper"
              onClick={() => navigate("/order")}
              role="button"
              tabIndex={0}
              aria-label={`Giỏ hàng có ${order?.orderItems?.length || 0} sản phẩm`}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/order")}
            >
              <Badge
                count={order?.orderItems?.length}
                size="small"
                aria-label={`${order?.orderItems?.length || 0} sản phẩm trong giỏ hàng`}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                  aria-hidden="true"
                />
              </Badge>
              <div className="text-small">Giỏ Hàng</div>
            </div>
          )}
        </Col>
      </div>
    </header>
  );
};

export default HeaderComponent;