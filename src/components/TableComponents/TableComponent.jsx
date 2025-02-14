import React, { useState } from "react";
import { Button, Table } from "antd";
import Loading from "../LoadingComponent/Loading";
import { DeleteOutlined } from "@ant-design/icons";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isPending = false,
    columns = [],
    handleDeleteManyProducts,
    handleDeleteManyUsers,
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === "Disabled User",
    //   name: record.name,
    // }),
  };

  const handleDeleteAll = () => {
    if (handleDeleteManyProducts) {
      handleDeleteManyProducts(rowSelectedKeys);
    }
    if (handleDeleteManyUsers) {
      handleDeleteManyUsers(rowSelectedKeys);
    }
  };

  return (
    <Loading isPending={isPending}>
      {rowSelectedKeys.length > 0 && (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          style={{
            marginBottom: 10,
            fontWeight: "bold",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </Button>
      )}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
