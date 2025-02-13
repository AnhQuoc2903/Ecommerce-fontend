import { Button } from "antd";
import { WrapperHeader } from "../AdminProduct/style";
import TableComponents from "../TableComponents/TableComponent";
import { PlusOutlined } from "@ant-design/icons";

const AdminProduct = () => {
  const handleAddUser = () => {};
  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "100px",
            width: "100px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={handleAddUser}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponents />
      </div>
    </div>
  );
};

export default AdminProduct;
