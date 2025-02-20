import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperInputAvatar } from "./style";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  message,
  Rate,
  Row,
  Space,
  Upload,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
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
    discount: "",
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    description: "",
    rating: "",
    images: [],
    discount: "",
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
      discount: "",
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
    const {
      name,
      type,
      countInStock,
      price,
      description,
      rating,
      images,
      discount,
    } = data;
    return ProductServices.createProduct({
      name,
      type,
      countInStock,
      price,
      description,
      rating,
      images,
      discount,
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
        discount: res?.data?.discount,
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
      title: "Discount",
      dataIndex: "discount",
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
      discount: "",
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

    setStateProduct((prevState) => {
      const updatedImages = [...new Set([...prevState.images, ...newImages])];

      form.setFieldsValue({ images: updatedImages });

      return {
        ...prevState,
        images: updatedImages,
      };
    });

    setFileList(newFileList);
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

    setStateProductDetails((prevState) => {
      const updatedImages = [...new Set([...prevState.images, ...newImages])];

      form.setFieldsValue({ images: updatedImages });

      return {
        ...prevState,
        images: updatedImages,
      };
    });

    setFileList(newFileList);
  };

  const handleRemoveImage = (index) => {
    setStateProduct((prevState) => {
      const newImages = prevState.images.filter((_, i) => i !== index);

      form.setFieldsValue({ images: newImages });

      return {
        ...prevState,
        images: newImages,
      };
    });

    setFileList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleRemoveImageDetails = (index) => {
    setStateProductDetails((prevState) => {
      const newImages = prevState.images.filter((_, i) => i !== index);

      form.setFieldsValue({ images: newImages });

      return {
        ...prevState,
        images: newImages,
      };
    });
    setFileList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <div>
      <WrapperHeader>Quản lý Sản Phẩm</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <Button
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "12px",
            borderStyle: "dashed",
            borderColor: "#1890ff",
            backgroundColor: "#f0f7ff",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e6f7ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f7ff")
          }
        >
          <PlusOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
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
        centered
        width={600}
      >
        <Loading isPending={isPending}>
          <Form
            form={form}
            name="productFormCreate"
            layout="vertical"
            style={{ maxWidth: 600, margin: "0 auto" }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {data?.status === "ERR" && (
              <Alert
                message={data?.message}
                type="error"
                showIcon
                style={{ marginBottom: "15px" }}
              />
            )}

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.name}
                    onChange={handleOnChange}
                    name="name"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Loại sản phẩm"
                  name="type"
                  rules={[
                    { required: true, message: "Vui lòng nhập loại sản phẩm!" },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.type}
                    onChange={handleOnChange}
                    name="type"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số lượng tồn kho"
                  name="countInStock"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng tồn kho!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.countInStock}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (/^\d*$/.test(value)) {
                        setStateProduct({
                          ...stateProduct,
                          countInStock: value,
                        });
                        form.setFieldsValue({ countInStock: value });
                      }
                    }}
                    name="countInStock"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Giá sản phẩm"
                  name="price"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.price}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (/^\d*$/.test(value)) {
                        setStateProduct({ ...stateProduct, price: value });
                        form.setFieldsValue({ price: value });
                      }
                    }}
                    name="price"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Giảm giá" name="Discount">
                  <InputComponent
                    value={stateProduct.discount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (/^\d*$/.test(value)) {
                        setStateProduct({
                          ...stateProduct,
                          discount: value,
                        });
                        form.setFieldsValue({ discount: value });
                      }
                    }}
                    name="discount"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Đánh giá"
                  name="rating"
                  rules={[
                    { required: true, message: "Vui lòng nhập đánh giá!" },
                  ]}
                >
                  <Rate
                    allowHalf
                    value={stateProduct.rating}
                    onChange={(value) => {
                      setStateProduct({ ...stateProduct, rating: value });
                      form.setFieldsValue({ rating: value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Hình ảnh"
              name="images"
              rules={[{ required: true, message: "Vui lòng thêm hình ảnh!" }]}
            >
              <WrapperInputAvatar
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  padding: "10px",
                  border: "1px dashed #1890ff",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
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
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img}
                        alt="product"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          transition: "transform 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.1)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined style={{ color: "red" }} />}
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
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
                    <Button
                      style={{
                        height: "80px",
                        width: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #1890ff",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <PlusOutlined
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      />
                    </Button>
                  </Upload>
                )}
              </WrapperInputAvatar>
            </Form.Item>

            <Form.Item
              label="Mô tả sản phẩm"
              name="description"
              labelCol={{ span: 6 }}
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <Input.TextArea
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
                rows={4}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "160px", height: "45px", fontSize: "16px" }}
              >
                Tạo sản phẩm
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
        width={600}
        style={{ marginTop: "-90px" }}
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <Form
            form={form}
            name="productFormEdit"
            layout="vertical"
            style={{ maxWidth: 600, margin: "0 auto" }}
            onFinish={onUpdateProduct}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <InputComponent
                    value={stateProductDetails.name}
                    onChange={handleOnChangeDetails}
                    name="name"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[
                    { required: true, message: "Please input your type!" },
                  ]}
                >
                  <InputComponent
                    value={stateProductDetails.type}
                    onChange={handleOnChangeDetails}
                    name="type"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Count inStock"
                  name="countInStock"
                  rules={[
                    {
                      required: true,
                      message: "Please input your count inStock!",
                    },
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
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    { required: true, message: "Please input your price!" },
                  ]}
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
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Giảm giá" name="discount">
                  <InputComponent
                    value={stateProductDetails.discount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (/^\d*\.?\d*$/.test(value)) {
                        setStateProductDetails({
                          ...stateProductDetails,
                          discount: value,
                        });
                        form.setFieldsValue({ discount: value });
                      }
                    }}
                    name="discount"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Đánh giá"
                  name="rating"
                  rules={[
                    { required: true, message: "Vui lòng nhập đánh giá!" },
                  ]}
                >
                  <Rate
                    allowHalf
                    value={stateProductDetails.rating}
                    onChange={(value) => {
                      setStateProductDetails({
                        ...stateProductDetails,
                        rating: value,
                      });
                      form.setFieldsValue({ rating: value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

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
                  maxHeight: "220px",
                  overflowY: "auto",
                  padding: "10px",
                  border: "1px dashed #1890ff",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
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
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img}
                        alt="product"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          transition: "transform 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.1)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      />

                      <Button
                        type="text"
                        icon={<CloseOutlined style={{ color: "red" }} />}
                        onClick={() => handleRemoveImageDetails(index)}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
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
                    <Button
                      style={{
                        height: "80px",
                        width: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #1890ff",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <PlusOutlined
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      />
                    </Button>
                  </Upload>
                )}
              </WrapperInputAvatar>
            </Form.Item>

            <Form.Item
              label="Mô tả sản phẩm"
              name="description"
              labelCol={{ span: 6 }}
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <Input.TextArea
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
                rows={4}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "160px", height: "45px", fontSize: "16px" }}
              >
                Áp dụng
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <ModalComponent
        style={{ marginTop: "140px" }}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ExclamationCircleOutlined
              style={{ color: "#ff4d4f", fontSize: "18px" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Xóa sản phẩm
            </span>
          </div>
        }
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <button
              onClick={handleCancelDelete}
              style={{
                border: "1px solid #d9d9d9",
                backgroundColor: "white",
                color: "#595959",
                padding: "6px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteProduct}
              style={{
                backgroundColor: "#ff4d4f",
                border: "none",
                color: "white",
                padding: "6px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Xóa
            </button>
          </div>
        }
      >
        <Loading isPending={isPendingDeleted}>
          <div style={{ textAlign: "center", color: "#595959" }}>
            <p style={{ fontSize: "16px", fontWeight: "500" }}>
              Bạn có chắc chắn muốn xóa sản phẩm này không?
            </p>
          </div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
