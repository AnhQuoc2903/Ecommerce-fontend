import React, { useMemo, useState } from "react";
import { Button, Table } from "antd";
import Loading from "../LoadingComponent/Loading";
import { DeleteOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import { DownloadOutlined } from "@ant-design/icons";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isPending = false,
    columns = [],
    handleDeleteManyProducts,
    handleDeleteManyUsers,
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const newColumnExport = useMemo(() => {
    return columns
      ?.filter(
        (col) =>
          col.dataIndex !== "action" &&
          col.dataIndex !== "avatar" &&
          col.dataIndex !== "images"
      )
      .map(({ render, ...col }) => col);
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    if (handleDeleteManyProducts) {
      handleDeleteManyProducts(rowSelectedKeys);
    }
    if (handleDeleteManyUsers) {
      handleDeleteManyUsers(rowSelectedKeys);
    }
  };

  const exportExcel = () => {
    const sanitizedDataSource = Array.isArray(dataSource)
      ? dataSource.map((row) => {
          let newRow = { ...row };
          newColumnExport.forEach((col) => {
            if (typeof newRow[col.dataIndex] === "function") {
              newRow[col.dataIndex] = "";
            }
          });
          return newRow;
        })
      : [];

    const excel = new Excel();
    excel
      .addSheet("Data Export")
      .addColumns(newColumnExport)
      .addDataSource(sanitizedDataSource, {
        str2Percent: true,
      })
      .saveAs("Exported_Data.xlsx");
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

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={exportExcel}
        style={{ marginBottom: 10, marginLeft: 10 }}
      >
        Export Excel
      </Button>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
