import React from "react";
import { useNavigate } from "react-router-dom";
import { List, Typography, Card } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

const { Title } = Typography;

const NavbarComponent = ({ typeProducts }) => {
  const navigate = useNavigate();

  const handleSelectType = (type) => {
    const formattedType = encodeURIComponent(type.trim().replace(/\s+/g, "_"));
    navigate(`/product/${formattedType}`, { state: type });
  };

  return (
    <Card style={{ width: 250 }}>
      <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
        Danh mục sản phẩm
      </Title>
      <List
        dataSource={typeProducts}
        renderItem={(product) => (
          <List.Item
            onClick={() => handleSelectType(product)}
            style={{ cursor: "pointer" }}
          >
            <AppstoreOutlined style={{ marginRight: 8 }} />
            {product}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default NavbarComponent;
