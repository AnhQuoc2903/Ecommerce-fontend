import { Card, Menu, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { getItem } from "../../utils";
import {
  AppstoreOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";

const AdminPage = () => {
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
  ];

  const [keySelected, setKeySelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (keySelected) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  }, [keySelected]);

  const renderPage = (key) => {
    if (loading)
      return (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      );

    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      default:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Card
              style={{
                textAlign: "center",
                padding: "20px",
                maxWidth: "400px",
                background: "#fafafa",
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <InfoCircleOutlined
                style={{
                  fontSize: "32px",
                  color: "#1890ff",
                  marginBottom: "10px",
                }}
              />
              <p style={{ fontSize: "18px", color: "#555", fontWeight: "500" }}>
                Vui lòng chọn một mục để hiển thị nội dung.
              </p>
            </Card>
          </div>
        );
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 260,
            height: "100vh",
            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "10px",
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
