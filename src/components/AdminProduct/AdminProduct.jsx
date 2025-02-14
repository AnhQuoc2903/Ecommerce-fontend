import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperInputAvatar } from "./style";
import { Button, Form, message, Rate, Space, Upload } from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64 } from "../../utils";
import * as ProductServices from "../../services/ProductServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import TableComponents from "../TableComponents/TableComponent";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [fileList, setFileList] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const queryClient = useQueryClient();
  const [expandedRows, setExpandedRows] = useState({});
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  const [stateProduct, setStateProduct] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    description: "",
    rating: "",
    images: [],
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    description: "",
    rating: "",
    images: [],
  });

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      type: "",
      countInStock: "",
      price: "",
      description: "",
      rating: "",
      images: [],
    });
    form.resetFields();
  }, [form]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const mutation = useMutationHooks((data) => {
    const { name, type, countInStock, price, description, rating, images } =
      data;
    return ProductServices.createProduct({
      name,
      type,
      countInStock,
      price,
      description,
      rating,
      images,
    });
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductServices.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductServices.deleteProduct(id, token);
    return res;
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductServices.deleteManyProduct(ids, token);
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductServices.getAllProduct();
    return res;
  };

  const { data, isPending, isSuccess, isError } = mutation;

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { data: products, isPending: isPendingProducts } = queryProduct;

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductServices.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        images: res?.data?.images || [],
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateProductDetails);
  }, [form, stateProductDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
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
      title: "Name",
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => (a.name?.length || 0) - (b.name?.length || 0),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      align: "center",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        { text: "1★", value: 1 },
        { text: "2★", value: 2 },
        { text: "3★", value: 3 },
        { text: "4★", value: 4 },
        { text: "5★", value: 5 },
      ],
      onFilter: (value, record) => Math.floor(record.rating) === value,
      render: (rating) => <Rate value={rating} allowHalf disabled />,
    },

    {
      title: "CountInStock",
      dataIndex: "countInStock",
      align: "center",
    },

    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Image",
      dataIndex: "images",
      align: "center",
      render: (images, record) => {
        const isExpanded = expandedRows[record._id] || false;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(isExpanded ? images : images.slice(0, 1)).map(
                (image, index) => (
                  <div
                    key={index}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <img
                      src={image}
                      alt={`product-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                )
              )}
            </div>
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRows((prev) => ({
                    ...prev,
                    [record._id]: !isExpanded,
                  }));
                }}
                style={{
                  marginTop: "5px",
                  background: "#007bff",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  transition: "background 0.2s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#0056b3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#007bff")
                }
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        );
      },
    },

    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product?._id };
    });

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      type: "",
      countInStock: "",
      price: "",
      description: "",
      rating: "",
      images: [],
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success(data?.message);
      handleCancel();
      queryClient.invalidateQueries(["products"]);
    } else if (isError) {
      message.error(data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  }, [isSuccess, isError, data, handleCancel, queryClient]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success(dataUpdated?.message);
      handleCloseDrawer();
      queryClient.invalidateQueries(["products"]);
    } else if (isErrorUpdated) {
      message.error(dataUpdated?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  }, [
    isSuccessUpdated,
    isErrorUpdated,
    dataUpdated,
    queryClient,
    handleCloseDrawer,
  ]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success(dataDeleted?.message);
      handleCancelDelete();
      queryClient.invalidateQueries(["products"]);
    } else if (isErrorDeleted) {
      message.error(dataDeleted?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted, queryClient]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success(dataDeletedMany?.message);
      queryClient.invalidateQueries(["products"]);
    } else if (isErrorDeletedMany) {
      message.error(
        dataDeletedMany?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany, queryClient]);

  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate(
      {
        ids: ids,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
    form.setFieldsValue({ [e.target.name]: e.target.value });
  };

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
    form.setFieldsValue({ [e.target.name]: e.target.value });
  };

  const handleOnchangeAvatar = async ({ fileList: newFileList }) => {
    let newImages = [];

    for (let file of newFileList) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
        continue;
      }

      let preview = file.url || file.preview;
      if (!preview && file.originFileObj) {
        try {
          preview = await getBase64(file.originFileObj);
        } catch (error) {
          console.error("Lỗi khi chuyển file sang Base64:", error);
          alert("Không thể hiển thị ảnh, vui lòng thử lại!");
          continue;
        }
      }

      if (preview) {
        newImages.push(preview);
      }
    }

    setStateProduct((prevState) => ({
      ...prevState,
      images: [...newImages],
    }));

    form.setFieldsValue({ images: newImages });

    setFileList([...newFileList]);
  };

  const handleOnchangeAvatarDetail = async ({ fileList: newFileList }) => {
    let newImages = [];

    for (let file of newFileList) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
        continue;
      }

      let preview = file.url || file.preview;
      if (!preview && file.originFileObj) {
        try {
          preview = await getBase64(file.originFileObj);
        } catch (error) {
          console.error("Lỗi khi chuyển file sang Base64:", error);
          alert("Không thể hiển thị ảnh, vui lòng thử lại!");
          continue;
        }
      }

      if (preview) {
        newImages.push(preview);
      }
    }

    setStateProductDetails((prevState) => ({
      ...prevState,
      images: [...newImages],
    }));

    form.setFieldsValue({ images: newImages });

    setFileList([...newFileList]);
  };

  const handleRemoveImage = (index) => {
    const newImages = stateProduct.images.filter((_, i) => i !== index);

    setStateProduct((prevState) => ({
      ...prevState,
      images: newImages,
    }));
    form.setFieldsValue({ images: newImages });
    setFileList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleRemoveImageDetails = (index) => {
    const newImages = stateProductDetails.images.filter((_, i) => i !== index);

    setStateProductDetails((prevState) => ({
      ...prevState,
      images: newImages,
    }));
    form.setFieldsValue({ images: newImages });
    setFileList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <div>
      <WrapperHeader>Quản lý Sản Phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "100px",
            width: "100px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponents
          handleDeleteManyProducts={handleDeleteManyProducts}
          columns={columns}
          isPending={isPendingProducts || isPendingDeletedMany}
          data={dataTable}
          onRow={(record) => {
            return {
              onClick: () => {
                setRowSelected(record?._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        title="Tạo mới sản phẩm"
        open={isModalOpen}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isPending={isPending}>
          <Form
            form={form}
            name="productFormCreate"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProduct.type}
                onChange={handleOnChange}
                name="type"
              />
            </Form.Item>

            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (/^\d*\.?\d*$/.test(value)) {
                    setStateProduct({ ...stateProduct, countInStock: value });
                    form.setFieldsValue({ countInStock: value });
                  }
                }}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (/^\d*\.?\d*$/.test(value)) {
                    setStateProduct({ ...stateProduct, price: value });
                    form.setFieldsValue({ price: value });
                  }
                }}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your rating!" },
                {
                  pattern: /^(?:[1-4](?:\.\d{1,2})?|5(?:\.0{1,2})?)$/,
                  message: "Rating phải từ 1 tới 5 !",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (/^\d*\.?\d*$/.test(value)) {
                    setStateProduct({ ...stateProduct, rating: value });
                    form.setFieldsValue({ rating: value });
                  }
                }}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Images"
              name="images"
              rules={[{ required: true, message: "Please input your images!" }]}
            >
              <WrapperInputAvatar
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {Array.isArray(stateProduct?.images) &&
                  stateProduct.images.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        height: "80px",
                        width: "80px",
                      }}
                    >
                      <img
                        src={img}
                        alt="product"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          border: "2px solid #1A94FF",
                          borderRadius: "5px",
                        }}
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined style={{ color: "red" }} />}
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ))}
                {stateProduct.images.length < 5 && (
                  <Upload
                    onChange={handleOnchangeAvatar}
                    showUploadList={false}
                    multiple
                    fileList={fileList}
                  >
                    <Button style={{ height: "80px", width: "80px" }}>
                      <PlusOutlined />
                    </Button>
                  </Upload>
                )}
              </WrapperInputAvatar>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <ModalComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        footer={null}
        onClose={() => setIsOpenDrawer(false)}
        onCancel={handleCloseDrawer}
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <Form
            form={form}
            name="productFormEdit"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProductDetails.type}
                onChange={handleOnChangeDetails}
                name="type"
              />
            </Form.Item>

            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (/^\d*\.?\d*$/.test(value)) {
                    setStateProductDetails({
                      ...stateProductDetails,
                      countInStock: value,
                    });
                    form.setFieldsValue({ countInStock: value });
                  }
                }}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (/^\d*\.?\d*$/.test(value)) {
                    setStateProductDetails({
                      ...stateProductDetails,
                      price: value,
                    });
                    form.setFieldsValue({ price: value });
                  }
                }}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your rating!" },
                {
                  pattern: /^(?:[1-4](?:\.\d{1,2})?|5(?:\.0{1,2})?)$/,
                  message: "Rating phải từ 1 tới 5 !",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (/^\d*\.?\d*$/.test(value)) {
                    setStateProductDetails({
                      ...stateProductDetails,
                      rating: value,
                    });
                    form.setFieldsValue({ rating: value });
                  }
                }}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Images"
              name="images"
              rules={[{ required: true, message: "Please input your images!" }]}
            >
              <WrapperInputAvatar
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {Array.isArray(stateProductDetails?.images) &&
                  stateProductDetails?.images.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        height: "80px",
                        width: "80px",
                      }}
                    >
                      <img
                        src={img}
                        alt="product"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          border: "2px solid #1A94FF",
                          borderRadius: "5px",
                        }}
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined style={{ color: "red" }} />}
                        onClick={() => handleRemoveImageDetails(index)}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ))}
                {stateProductDetails?.images.length < 5 && (
                  <Upload
                    onChange={handleOnchangeAvatarDetail}
                    showUploadList={false}
                    multiple
                    fileList={fileList}
                  >
                    <Button style={{ height: "80px", width: "80px" }}>
                      <PlusOutlined />
                    </Button>
                  </Upload>
                )}
              </WrapperInputAvatar>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
        okText="Delete"
        cancelText="Cancel"
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc muốn xóa sản phẩm này không!</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
