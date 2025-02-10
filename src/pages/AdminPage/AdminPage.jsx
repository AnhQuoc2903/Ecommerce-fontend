import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const AdminPage = () => {
  const items = [
    getItem("Người dùng", "sub1", <UserOutlined />, [
      getItem("Option 1", "1"),
      getItem("Option 2", "2"),
      getItem("Option 3", "3"),
      getItem("Option 4", "4"),
    ]),
    getItem("Sản phẩm", "sub2", <AppstoreOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),
  ];

  const rootSubmenuKeys = ["user", "product"];
  const [openKeys, setOpenKeys] = useState(["user"]);
  const [keySelected, setKeySelected] = useState();

  const onOpenChange = (keys) => {
    const latesOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latesOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latesOpenKey ? [latesOpenKey] : []);
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
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{
            width: 256,
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: "1" }}>
          {keySelected === "6" && <span>Key la 6</span>}
          <span>test</span>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
