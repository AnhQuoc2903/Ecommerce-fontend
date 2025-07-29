import { useEffect, useMemo, useState } from "react";
import { Checkbox, Col, Form, Input, Row } from "antd";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperStyleHeader,
  WrapperListOrder,
  WrapperTotal,
  WrapperInputNumber,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import * as message from "../../components/Message/Message";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserServices from "../../services/UserServices";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [form] = Form.useForm();

  // SEO Meta data
  const totalItems = order?.orderItems?.length || 0;
  const pageTitle = `Giỏ hàng (${totalItems} sản phẩm) - Thanh toán`;
  const pageDescription = `Xem lại và thanh toán đơn hàng của bạn với ${totalItems} sản phẩm. Giao hàng toàn quốc, thanh toán an toàn.`;

  // Update document title for SEO
  useEffect(() => {
    document.title = pageTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = pageDescription;

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = 'giỏ hàng, thanh toán, mua hàng online, e-commerce, đặt hàng';

    return () => {
      document.title = 'E-Commerce Store';
    };
  }, [pageTitle, pageDescription, totalItems]);

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, currentAmount) => {
    if (type === "increase") {
      dispatch(increaseAmount({ idProduct }));
    } else {
      if (currentAmount > 1) {
        dispatch(decreaseAmount({ idProduct }));
      } else {
        handleDeleteOrder(idProduct);
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserServices.updateUser(id, { ...rests }, token);
    return res;
  });

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + (cur.price * cur.amount || 0);
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + (cur.price * cur.discount * cur.amount || 0);
    }, 0);
    return result;
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo > 100000) {
      return 10000;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPrice = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleUpdateInforUser = () => {
    const { name, city, address, phone } = stateUserDetails;
    if (name && city && address && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: (data) => {
            if (data?.status === "OK") {
              dispatch(
                updateUser({
                  ...user,
                  ...stateUserDetails,
                  access_token: data?.data?.access_token || user.access_token,
                })
              );
              message.success("Cập nhật thành công!");
              setIsOpenModalUpdateInfo(false);
            } else {
              message.error("Cập nhật thất bại, vui lòng thử lại!");
            }
          },
          onError: (error) => {
            console.error("Mutation Error:", error);
            message.error("Cập nhật thất bại, vui lòng thử lại! ❌");
          },
        }
      );
    } else {
      message.warning("Vui lòng điền đầy đủ thông tin! ⚠️");
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      const updatedDetails = {
        city: user?.city || "",
        address: user?.address || "",
        name: user?.name || "",
        phone: user?.phone || "",
      };
      setStateUserDetails(updatedDetails);
      form.setFieldsValue(updatedDetails);
    }
  }, [isOpenModalUpdateInfo, user, form]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  return (
    <>
      <main
        style={{
          background: "linear-gradient(135deg, #e6f4ea 0%, #a3e4c0 100%)",
          minHeight: "100vh",
          padding: "20px 0"
        }}
        role="main"
        aria-label="Trang giỏ hàng"
      >
        <div style={{
          maxWidth: "1270px",
          margin: "0 auto",
          padding: "0 15px"
        }}>
          {/* Header */}
          <header style={{
            marginBottom: "30px",
            textAlign: "center"
          }}>
            <h1 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: "700",
              color: "#2c3e50",
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              <ShoppingCartOutlined style={{ color: "#27ae60" }} />
              Giỏ hàng của bạn
            </h1>
            {totalItems > 0 && (
              <p style={{
                fontSize: "16px",
                color: "#7f8c8d",
                marginTop: "5px"
              }}>
                Bạn có {totalItems} sản phẩm trong giỏ hàng
              </p>
            )}
          </header>

          {/* Main Content */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            "@media (max-width: 768px)": {
              flexDirection: "column"
            }
          }}>
            {/* Left Section - Cart Items */}
            <section
              style={{
                flex: "2",
                minWidth: "0"
              }}
              aria-label="Danh sách sản phẩm"
            >
              <div style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden"
              }}>
                {/* Cart Header */}
                <WrapperStyleHeader style={{
                  background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                  color: "#fff",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minWidth: "250px",
                    flex: "1"
                  }}>
                    <Checkbox
                      onChange={handleOnchangeCheckAll}
                      checked={
                        listChecked?.length === order?.orderItems?.length &&
                        order?.orderItems?.length > 0
                      }
                      disabled={order?.orderItems?.length === 0}
                      style={{ color: "#fff" }}
                    />
                    <span style={{ fontWeight: "600" }}>
                      Tất cả ({order?.orderItems?.length} sản phẩm)
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: "2",
                    minWidth: "300px",
                    gap: "20px"
                  }}>
                    <span>Đơn Giá</span>
                    <span>Số lượng</span>
                    <span>Thành Tiền</span>
                    <DeleteOutlined
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "5px",
                        borderRadius: "4px",
                        transition: "background-color 0.3s"
                      }}
                      onClick={handleRemoveAllOrder}
                      title="Xóa tất cả sản phẩm đã chọn"
                    />
                  </div>
                </WrapperStyleHeader>

                {/* Cart Items List */}
                <WrapperListOrder style={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  padding: "0"
                }}>
                  {order?.orderItems?.length === 0 ? (
                    <div style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#7f8c8d"
                    }}>
                      <ShoppingCartOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                      <h3>Giỏ hàng trống</h3>
                      <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                    </div>
                  ) : (
                    order?.orderItems?.map((orderItem, index) => (
                      <WrapperItemOrder
                        key={orderItem.product}
                        style={{
                          padding: "20px",
                          borderBottom: index !== order.orderItems.length - 1 ? "1px solid #f0f0f0" : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          flexWrap: "wrap",
                          transition: "background-color 0.3s",
                          "&:hover": {
                            backgroundColor: "#f8f9fa"
                          }
                        }}
                      >
                        {/* Product Info */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flex: "1",
                          minWidth: "250px"
                        }}>
                          <Checkbox
                            onChange={onChange}
                            value={orderItem?.product}
                            checked={listChecked.includes(orderItem?.product)}
                          />
                          <img
                            alt={orderItem?.name || "Sản phẩm"}
                            src={orderItem?.image}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e0e0e0"
                            }}
                            loading="lazy"
                          />
                          <div style={{
                            flex: "1",
                            minWidth: "160px"
                          }}>
                            <h4 style={{
                              margin: "0",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#2c3e50",
                              lineHeight: "1.4",
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}>
                              {orderItem?.name}
                            </h4>
                          </div>
                        </div>

                        {/* Price and Controls */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flex: "2",
                          minWidth: "300px",
                          gap: "20px",
                          flexWrap: "wrap"
                        }}>
                          <span style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#27ae60"
                          }}>
                            {convertPrice(orderItem?.price)}
                          </span>

                          <WrapperCountOrder style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #d0d0d0",
                            borderRadius: "6px",
                            overflow: "hidden"
                          }}>
                            <button
                              style={{
                                border: "none",
                                background: "#f8f9fa",
                                cursor: "pointer",
                                padding: "8px 12px",
                                transition: "background-color 0.3s"
                              }}
                              onClick={() =>
                                handleChangeCount(
                                  "decrease",
                                  orderItem?.product,
                                  orderItem?.amount
                                )
                              }
                              aria-label="Giảm số lượng"
                            >
                              <MinusOutlined style={{ fontSize: "12px" }} />
                            </button>
                            <WrapperInputNumber
                              value={orderItem?.amount}
                              size="small"
                              style={{
                                border: "none",
                                textAlign: "center",
                                width: "50px"
                              }}
                              readOnly
                            />
                            <button
                              style={{
                                border: "none",
                                background: "#f8f9fa",
                                cursor: "pointer",
                                padding: "8px 12px",
                                transition: "background-color 0.3s"
                              }}
                              onClick={() =>
                                handleChangeCount("increase", orderItem?.product)
                              }
                              aria-label="Tăng số lượng"
                            >
                              <PlusOutlined style={{ fontSize: "12px" }} />
                            </button>
                          </WrapperCountOrder>

                          <span style={{
                            color: "#27ae60",
                            fontSize: "16px",
                            fontWeight: "bold",
                            minWidth: "80px",
                            textAlign: "right"
                          }}>
                            {convertPrice(orderItem?.price * orderItem?.amount)}
                          </span>

                          <DeleteOutlined
                            style={{
                              cursor: "pointer",
                              fontSize: "16px",
                              color: "#dc3545",
                              padding: "5px",
                              borderRadius: "4px",
                              transition: "background-color 0.3s"
                            }}
                            onClick={() => handleDeleteOrder(orderItem?.product)}
                            title="Xóa sản phẩm"
                            aria-label="Xóa sản phẩm khỏi giỏ hàng"
                          />
                        </div>
                      </WrapperItemOrder>
                    ))
                  )}
                </WrapperListOrder>
              </div>
            </section>

            {/* Right Section - Order Summary */}
            <aside
              style={{
                flex: "1",
                minWidth: "300px",
                maxWidth: "400px"
              }}
              aria-label="Tóm tắt đơn hàng"
            >
              <div style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                padding: "25px",
                position: "sticky",
                top: "20px"
              }}>
                {/* Delivery Address */}
                <WrapperInfo style={{
                  background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                  color: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px"
                }}>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>📍 Địa chỉ giao hàng:</strong>
                  </div>
                  <div style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "10px"
                  }}>
                    {user?.address && user?.city ?
                      `${user.address}, ${user.city}` :
                      "Chưa có địa chỉ giao hàng"
                    }
                  </div>
                  <button
                    onClick={handleChangeAddress}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "all 0.3s"
                    }}
                  >
                    Thay đổi
                  </button>
                </WrapperInfo>

                {/* Order Summary */}
                <div style={{ marginBottom: "25px" }}>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#2c3e50",
                    marginBottom: "15px",
                    borderBottom: "2px solid #27ae60",
                    paddingBottom: "8px"
                  }}>
                    Chi tiết thanh toán
                  </h3>

                  <WrapperInfo style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0"
                    }}>
                      <span style={{ color: "#7f8c8d" }}>Tạm tính:</span>
                      <span style={{
                        fontWeight: "600",
                        color: "#2c3e50"
                      }}>
                        {convertPrice(priceMemo)}
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0"
                    }}>
                      <span style={{ color: "#7f8c8d" }}>Giảm giá:</span>
                      <span style={{
                        fontWeight: "600",
                        color: "#27ae60"
                      }}>
                        -{convertPrice(priceDiscountMemo)}
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px dashed #e0e0e0"
                    }}>
                      <span style={{ color: "#7f8c8d" }}>Phí giao hàng:</span>
                      <span style={{
                        fontWeight: "600",
                        color: "#2c3e50"
                      }}>
                        {deliveryPriceMemo === 0 ? "Miễn phí" : convertPrice(deliveryPriceMemo)}
                      </span>
                    </div>
                  </WrapperInfo>
                </div>

                {/* Total */}
                <WrapperTotal style={{
                  background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                  color: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  <div style={{ marginBottom: "8px", fontSize: "16px" }}>
                    Tổng thanh toán
                  </div>
                  <div style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    marginBottom: "5px"
                  }}>
                    {convertPrice(totalPrice)}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    opacity: "0.9"
                  }}>
                    (Đã bao gồm VAT nếu có)
                  </div>
                </WrapperTotal>

                {/* Checkout Button */}
                <ButtonComponent
                  onClick={handleAddCard}
                  size={40}
                  styleButton={{
                    background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                    height: "50px",
                    width: "100%",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.4)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(39, 174, 96, 0.6)"
                    }
                  }}
                  textButton="🛒 Tiến hành thanh toán"
                  styleTextButton={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                  disabled={!order?.orderItemsSelected?.length}
                />

                {/* Trust Badges */}
                <div style={{
                  marginTop: "20px",
                  textAlign: "center",
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "8px"
                }}>
                  <div style={{
                    fontSize: "12px",
                    color: "#7f8c8d",
                    marginBottom: "8px"
                  }}>
                    🔒 Thanh toán an toàn & bảo mật
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "#95a5a6"
                  }}>
                    Miễn phí giao hàng cho đơn hàng trên 100.000đ
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Update Info Modal */}
      <ModalComponent
        title="🚚 Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInforUser}
        style={{
          top: "20px"
        }}
      >
        <Form
          name="update-info"
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "20px 0"
          }}
          autoComplete="off"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<strong>👤 Họ và tên</strong>}
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <InputComponent
                  value={stateUserDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                  placeholder="Nhập họ và tên của bạn"
                  style={{
                    borderRadius: "6px",
                    padding: "8px 12px"
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<strong>🏙️ Thành phố</strong>}
                name="city"
                rules={[
                  { required: true, message: "Vui lòng nhập thành phố!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.city}
                  onChange={handleOnchangeDetails}
                  name="city"
                  placeholder="Nhập thành phố của bạn"
                  style={{
                    borderRadius: "6px",
                    padding: "8px 12px"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<strong>📱 Số điện thoại</strong>}
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  value={stateUserDetails.phone}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "");
                    setStateUserDetails({
                      ...stateUserDetails,
                      phone: value,
                    });
                    form.setFieldsValue({ phone: value });
                  }}
                  maxLength={11}
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                    padding: "8px 12px"
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<strong>🏠 Địa chỉ</strong>}
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                  placeholder="Nhập địa chỉ chi tiết"
                  style={{
                    borderRadius: "6px",
                    padding: "8px 12px"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          main > div {
            padding: 0 10px !important;
          }
          
          main > div > div {
            flex-direction: column !important;
          }
          
          .ant-modal {
            margin: 0 !important;
            max-width: 100vw !important;
            width: 100vw !important;
            height: 100vh !important;
            padding: 0 !important;
          }
          
          .ant-modal-content {
            height: 100vh !important;
            border-radius: 0 !important;
          }
          
          aside {
            max-width: 100% !important;
            position: static !important;
          }
        }
        
        @media (max-width: 480px) {
          [style*="display: flex"][style*="flexWrap: wrap"] {
            flex-direction: column !important;
          }
          
          [style*="minWidth: 300px"] {
            min-width: auto !important;
            width: 100% !important;
          }
          
          [style*="minWidth: 250px"] {
            min-width: auto !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default PaymentPage;