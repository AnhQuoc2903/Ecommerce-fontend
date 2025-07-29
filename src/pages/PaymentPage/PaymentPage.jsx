import { useEffect, useMemo, useState } from "react";
import { Col, Form, Input, Radio, Row } from "antd";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import * as message from "../../components/Message/Message";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserServices from "../../services/UserServices";
import * as OrderServices from "../../services/OrderServices";
import { updateUser } from "../../redux/slides/userSlide";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Modern Green Color Palette
const colors = {
  primary: '#2E8B57', // Sea Green
  primaryLight: '#3CB371', // Medium Sea Green
  primaryDark: '#228B22', // Forest Green
  secondary: '#90EE90', // Light Green
  accent: '#32CD32', // Lime Green
  success: '#00C851',
  warning: '#FFB900',
  error: '#FF4444',
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  mediumGray: '#E9ECEF',
  darkGray: '#6C757D',
  black: '#212529'
};

// Styled Components with Modern Design & Responsive
const Container = styled.div`
  background: linear-gradient(135deg, ${colors.lightGray} 0%, ${colors.mediumGray} 100%);
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const MainWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.h1`
  color: ${colors.primary};
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const WrapperLeft = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const WrapperRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 350px;
  
  @media (max-width: 1024px) {
    width: 100%;
    min-width: unset;
  }
`;

const Card = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(46, 139, 87, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(46, 139, 87, 0.1);
  
  &:hover {
    box-shadow: 0 12px 40px rgba(46, 139, 87, 0.15);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%);
  color: ${colors.white};
  padding: 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  border-bottom: 3px solid ${colors.primaryDark};
`;

const CardContent = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;



const WrapperRadio = styled(Radio.Group)`
  margin-top: 1rem;
  background: linear-gradient(135deg, rgba(46, 139, 87, 0.05) 0%, rgba(60, 179, 113, 0.05) 100%);
  border: 2px solid rgba(46, 139, 87, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  
  .ant-radio-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(46, 139, 87, 0.1);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .ant-radio {
    .ant-radio-inner {
      border-color: ${colors.primary};
      
      &::after {
        background-color: ${colors.primary};
      }
    }
    
    &.ant-radio-checked .ant-radio-inner {
      background-color: ${colors.primary};
      border-color: ${colors.primary};
    }
  }
`;

const AddressSection = styled.div`
  background: linear-gradient(135deg, rgba(46, 139, 87, 0.05) 0%, rgba(60, 179, 113, 0.05) 100%);
  border: 2px solid rgba(46, 139, 87, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AddressText = styled.span`
  color: ${colors.darkGray};
  font-size: 0.95rem;
  margin-right: 0.5rem;
`;

const AddressValue = styled.span`
  color: ${colors.black};
  font-weight: 600;
  font-size: 1rem;
`;

const ChangeAddressLink = styled.span`
  color: ${colors.accent};
  cursor: pointer;
  font-weight: 600;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.accent};
    color: ${colors.white};
    transform: translateY(-1px);
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid ${colors.mediumGray};
  
  &:last-child {
    border-bottom: none;
  }
`;

const PriceLabel = styled.span`
  color: ${colors.darkGray};
  font-size: 1rem;
`;

const PriceValue = styled.span`
  color: ${colors.black};
  font-size: 1rem;
  font-weight: 600;
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%);
  color: ${colors.white};
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TotalPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TotalAmount = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.white};
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const TotalNote = styled.span`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.25rem;
`;

const StyledButton = styled.button`
  background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%);
  color: ${colors.white};
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  height: 56px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(50, 205, 50, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(50, 205, 50, 0.4);
    background: linear-gradient(135deg, ${colors.success} 0%, ${colors.accent} 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledModal = styled(ModalComponent)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%);
    border-bottom: none;
    
    .ant-modal-title {
      color: ${colors.white};
      font-weight: 600;
    }
  }
  
  .ant-modal-close {
    color: ${colors.white};
  }
`;

const FormWrapper = styled.div`
  .ant-form-item-label > label {
    color: ${colors.primary};
    font-weight: 600;
  }
  
  .ant-input {
    border-radius: 8px;
    border: 2px solid ${colors.mediumGray};
    padding: 0.75rem;
    transition: all 0.3s ease;
    
    &:focus, &:hover {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px rgba(46, 139, 87, 0.1);
    }
  }
`;

const DeliveryOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeliveryBrand = styled.span`
  color: ${colors.primary};
  font-weight: 700;
  font-size: 1rem;
`;

const DeliveryText = styled.span`
  color: ${colors.darkGray};
  font-size: 0.95rem;
`;

// Main Component
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
  }, [isSuccess, isError, dataAdd, queryClient, navigate, delivery, payment, order?.orderItemsSelected]);

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
    <Container>
      <MainWrapper>
        <PageTitle>🛒 Thanh Toán Đơn Hàng</PageTitle>

        <ContentWrapper>
          <WrapperLeft>
            {/* Delivery Method Section */}
            <Card>
              <CardHeader>
                🚚 Phương Thức Giao Hàng
              </CardHeader>
              <CardContent>
                <WrapperRadio onChange={handleDilivery} value={delivery}>
                  <Radio value="fast">
                    <DeliveryOption>
                      <DeliveryBrand>FAST</DeliveryBrand>
                      <DeliveryText>Giao hàng nhanh trong ngày</DeliveryText>
                    </DeliveryOption>
                  </Radio>
                  <Radio value="gojek">
                    <DeliveryOption>
                      <DeliveryBrand>GO_JEK</DeliveryBrand>
                      <DeliveryText>Giao hàng tiết kiệm</DeliveryText>
                    </DeliveryOption>
                  </Radio>
                </WrapperRadio>
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                💳 Phương Thức Thanh Toán
              </CardHeader>
              <CardContent>
                <WrapperRadio onChange={handlePayment} value={payment}>
                  <Radio value="later_money">
                    <DeliveryOption>
                      <DeliveryBrand>💵</DeliveryBrand>
                      <DeliveryText>Thanh toán tiền mặt khi nhận hàng</DeliveryText>
                    </DeliveryOption>
                  </Radio>
                </WrapperRadio>
              </CardContent>
            </Card>
          </WrapperLeft>

          <WrapperRight>
            {/* Address Section */}
            <Card>
              <CardHeader>
                📍 Địa Chỉ Giao Hàng
              </CardHeader>
              <CardContent>
                <AddressSection>
                  <AddressText>Giao đến:</AddressText>
                  <AddressValue>
                    {`${user?.address || 'Chưa có địa chỉ'} ${user?.city || ''}`}
                  </AddressValue>
                  <ChangeAddressLink onClick={handleChangeAddress}>
                    Thay đổi
                  </ChangeAddressLink>
                </AddressSection>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                📋 Chi Tiết Đơn Hàng
              </CardHeader>
              <CardContent>
                <PriceRow>
                  <PriceLabel>Tạm tính</PriceLabel>
                  <PriceValue>{convertPrice(priceMemo)}</PriceValue>
                </PriceRow>

                <PriceRow>
                  <PriceLabel>Giảm giá</PriceLabel>
                  <PriceValue style={{ color: colors.success }}>
                    -{convertPrice(priceDiscountMemo)}
                  </PriceValue>
                </PriceRow>

                <PriceRow>
                  <PriceLabel>Phí giao hàng</PriceLabel>
                  <PriceValue>{convertPrice(deliveryPriceMemo)}</PriceValue>
                </PriceRow>
              </CardContent>
            </Card>

            {/* Total Section */}
            <TotalSection>
              <TotalLabel>Tổng Tiền</TotalLabel>
              <TotalPrice>
                <TotalAmount>{convertPrice(totalPriceMemo)}</TotalAmount>
                <TotalNote>(Đã bao gồm VAT nếu có)</TotalNote>
              </TotalPrice>
            </TotalSection>

            {/* Order Button */}
            <StyledButton
              onClick={handleAddOrder}
              disabled={isPendingAddOrder}
            >
              {isPendingAddOrder ? '⏳ Đang xử lý...' : '✅ Đặt Hàng Ngay'}
            </StyledButton>
          </WrapperRight>
        </ContentWrapper>
      </MainWrapper>

      {/* Update Info Modal */}
      <StyledModal
        title="📝 Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInforUser}
        width={600}
      >
        <FormWrapper>
          <Form
            name="update-info"
            layout="vertical"
            style={{ padding: "20px 0" }}
            autoComplete="off"
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="👤 Họ và Tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <InputComponent
                    value={stateUserDetails.name}
                    onChange={handleOnchangeDetails}
                    name="name"
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="🏙️ Thành Phố"
                  name="city"
                  rules={[
                    { required: true, message: "Vui lòng nhập thành phố!" },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.city}
                    onChange={handleOnchangeDetails}
                    name="city"
                    placeholder="Nhập tên thành phố"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="📱 Số Điện Thoại"
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
                      borderRadius: '8px',
                      border: `2px solid ${colors.mediumGray}`,
                      padding: '0.75rem'
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="🏠 Địa Chỉ"
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                  <InputComponent
                    value={stateUserDetails.address}
                    onChange={handleOnchangeDetails}
                    name="address"
                    placeholder="Nhập địa chỉ cụ thể"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </FormWrapper>
      </StyledModal>
    </Container>
  );
};

export default PaymentPage;