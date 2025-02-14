import { Button, Space, message } from "antd";
import { WrapperHeader } from "../AdminUser/style";
import TableComponents from "../TableComponents/TableComponent";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import InputComponent from "../InputComponent/InputComponent";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import * as UserServices from "../../services/UserServices";
import dayjs from "dayjs";

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState();

  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const queryClient = useQueryClient();
  const searchInput = useRef(null);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserServices.deleteUser(id, token);
    return res;
  });

  const getAllUsers = async (token) => {
    if (!token) return { data: [] };
    const res = await UserServices.getAllUser(token);
    return res;
  };

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserServices.deleteManyUser(ids, token);
    return res;
  });

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success(dataDeletedMany?.message);
      queryClient.invalidateQueries(["users"]);
    } else if (isErrorDeletedMany) {
      message.error(
        dataDeletedMany?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany, queryClient]);

  const handleDeleteManyUsers = (ids) => {
    mutationDeleteMany.mutate(
      {
        ids: ids,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const queryUser = useQuery({
    queryKey: ["users", user?.access_token],
    queryFn: () => getAllUsers(user?.access_token),
    enabled: !!user?.access_token,
  });

  const { data: users, isPending: isPendingUsers } = queryUser;

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ""}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false,
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (image) => (
        <img
          src={image}
          alt=""
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "50px",
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => (a.name?.length || 0) - (b.name?.length || 0),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        { text: "Nam", value: "Nam" },
        { text: "Nữ", value: "Nữ" },
      ],
      onFilter: (value, record) => record.gender === value,
    },

    {
      title: "Date of Birth",
      dataIndex: "dob",
      render: (dob) => (dob ? dayjs(dob).format("DD-MM-YYYY") : ""),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data
      ?.filter((user) => !user.isAdmin)
      .map((user) => {
        return { ...user, key: user?._id };
      });

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success(dataDeleted?.message);
      handleCancelDelete();
      queryClient.invalidateQueries(["users"]);
    } else if (isErrorDeleted) {
      message.error(dataDeleted?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted, queryClient]);

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: "20px" }}>
        {isPendingUsers ? (
          <Loading isPending={isPendingUsers}>
            <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
              Đang tải dữ liệu người dùng...
            </p>
          </Loading>
        ) : dataTable?.length > 0 ? (
          <TableComponents
            handleDeleteManyUsers={handleDeleteManyUsers}
            columns={columns}
            isPending={isPendingUsers || isPendingDeletedMany}
            data={dataTable}
            onRow={(record) => ({
              onClick: () => setRowSelected(record?._id),
            })}
          />
        ) : (
          <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
            Không có người dùng nào để hiển thị.
          </p>
        )}
      </div>

      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
        okText="Delete"
        cancelText="Cancel"
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc muốn xóa người dùng này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
