import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Input, Radio, Row } from "antd";
import {
  WrapperInfo,
  WrapperLeft,
  WrapperRight,
  WrapperTotal,
  WrapperRadio,
  Lable,
} from "./style";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector, useDispatch } from "react-redux";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import * as message from "../../components/Message/Message";

import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserServices from "../../services/UserServices";
import * as OrderServices from "../../services/OrderServices";
import { updateUser } from "../../redux/slides/userSlide";
import Loading from "../../components/LoadingComponent/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const queryClient = useQueryClient();

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserServices.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks(async (data) => {
    const { token, ...rests } = data;
    const res = OrderServices.createOrder(token, { ...rests });
    return res;
  });

  const {
    data: dataAdd,
    isLoading: isPendingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      message.success(dataAdd?.message || "Đặt hàng thành công");
      queryClient.invalidateQueries(["users"]);
      navigate("/order-success", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
        },
      });
    } else if (isError) {
      message.error(dataAdd?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  }, [isSuccess, isError, dataAdd, queryClient]);

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

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
      });
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

  const handleDilivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Thanh toán</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperInfo>
              <div>
                <Lable>Chọn phương thức giao hàng</Lable>
                <WrapperRadio onChange={handleDilivery} value={delivery}>
                  <Radio value="fast">
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      FAST
                    </span>
                    Giao hàng tiết kiệm
                  </Radio>
                  <Radio value="gojek">
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      GO_JEK
                    </span>
                    Giao hàng tiết kiệm
                  </Radio>
                </WrapperRadio>
              </div>
            </WrapperInfo>
            <WrapperInfo>
              <div>
                <Lable>Chọn phương thức giao hàng</Lable>
                <WrapperRadio onChange={handlePayment} value={payment}>
                  <Radio value="later_money">
                    Thanh toán tiền mặt khi nhận hàng
                  </Radio>
                </WrapperRadio>
              </div>
            </WrapperInfo>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <span>Địa chỉ: </span>
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                  {`${user?.address} ${user?.city}`}{" "}
                </span>
                <span
                  onClick={handleChangeAddress}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Thay đổi
                </span>
              </WrapperInfo>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {`${priceDiscountMemo * 100} %`}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(deliveryPriceMemo)}
                  </span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng Tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254,56,52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddOrder()}
              size={40}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
              textButton={"Đặt hàng"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInforUser}
      >
        <Form
          name="update-info"
          layout="vertical"
          style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}
          autoComplete="off"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={<strong>Tên</strong>}
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <InputComponent
                  value={stateUserDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                  placeholder="Nhập tên của bạn"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<strong>Thành phố</strong>}
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
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={<strong>Số điện thoại</strong>}
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
                  maxLength={10}
                  placeholder="Nhập số điện thoại"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<strong>Địa chỉ</strong>}
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                  placeholder="Nhập địa chỉ của bạn"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default PaymentPage;
