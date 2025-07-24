import React, { useEffect } from "react";
import {
  WrapperInfo,
  Lable,
  WrapperValue,
  WrapperItemOrder,
  WrapperItemOrderItem,
} from "./style";
import { CheckCircleOutlined, TruckOutlined, CreditCardOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;

  // SEO Meta data
  const orderTotal = state?.orders?.reduce((total, item) => total + (item.price * item.amount), 0) || 0;
  const pageTitle = `Đặt hàng thành công - Đơn hàng ${orderTotal > 0 ? convertPrice(orderTotal) : ''}`;
  const pageDescription = `Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được xác nhận và sẽ được giao trong thời gian sớm nhất.`;

  // Update document title and meta for SEO
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
    metaKeywords.content = 'đặt hàng thành công, xác nhận đơn hàng, e-commerce, mua hàng online, giao hàng';

    return () => {
      document.title = 'E-Commerce Store';
    };
  }, [pageTitle, pageDescription]);

  const containerStyle = {
    background: "linear-gradient(135deg, #e6f4ea 0%, #a3e4c0 100%)",
    minHeight: "100vh",
    padding: "20px 0"
  };

  const mainContainerStyle = {
    maxWidth: "1270px",
    margin: "0 auto",
    padding: "0 15px"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "40px",
    padding: "30px 20px"
  };

  const headerCardStyle = {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px 30px",
    boxShadow: "0 8px 30px rgba(39, 174, 96, 0.15)",
    maxWidth: "600px",
    margin: "0 auto"
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "30px"
  };

  const sectionStyle = {
    flex: "2",
    minWidth: "0"
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
    marginBottom: "20px"
  };

  const headerInfoStyle = {
    background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
    color: "#fff",
    padding: "25px",
    display: "flex",
    flexDirection: "row",
    gap: "30px",
    flexWrap: "wrap"
  };

  const infoCardStyle = {
    flex: "1",
    minWidth: "250px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "20px"
  };

  const asideStyle = {
    flex: "1",
    minWidth: "300px",
    maxWidth: "400px"
  };

  const sidebarStyle = {
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    padding: "25px",
    position: "sticky",
    top: "20px"
  };

  const productItemStyle = {
    padding: "20px",
    border: "1px solid #f0f0f0",
    borderRadius: "12px",
    marginBottom: "15px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    alignItems: "center",
    gap: "15px"
  };

  const productImageStyle = {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px solid #e8f5e8",
    flexShrink: "0"
  };

  return (
    <div style={containerStyle}>
      <div style={mainContainerStyle}>
        {/* Success Header */}
        <div style={headerStyle}>
          <div style={headerCardStyle}>
            <CheckCircleOutlined style={{
              fontSize: "80px",
              color: "#27ae60",
              marginBottom: "20px",
              display: "block"
            }} />
            <h1 style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#27ae60",
              margin: "0 0 10px 0"
            }}>
              🎉 Đặt hàng thành công!
            </h1>
            <p style={{
              fontSize: "16px",
              color: "#7f8c8d",
              margin: "0",
              lineHeight: "1.5"
            }}>
              Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng chúng tôi.<br />
              Đơn hàng của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={contentStyle}>
          {/* Order Details */}
          <div style={sectionStyle}>
            <div style={cardStyle}>
              {/* Delivery & Payment Info */}
              <div style={headerInfoStyle}>
                <WrapperInfo style={infoCardStyle}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px"
                  }}>
                    <TruckOutlined style={{ fontSize: "20px" }} />
                    <Lable style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "16px",
                      margin: "0"
                    }}>
                      Phương thức giao hàng
                    </Lable>
                  </div>
                  <WrapperValue style={{
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}>
                    <div style={{
                      background: "rgba(255,255,255,0.2)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      display: "inline-block",
                      marginBottom: "5px"
                    }}>
                      <span style={{ fontWeight: "bold" }}>
                        {orderContant.delivery[state?.delivery]}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", opacity: "0.9" }}>
                      Giao hàng tiết kiệm
                    </div>
                  </WrapperValue>
                </WrapperInfo>

                <WrapperInfo style={infoCardStyle}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px"
                  }}>
                    <CreditCardOutlined style={{ fontSize: "20px" }} />
                    <Lable style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "16px",
                      margin: "0"
                    }}>
                      Phương thức thanh toán
                    </Lable>
                  </div>
                  <WrapperValue style={{
                    color: "#fff",
                    fontSize: "14px"
                  }}>
                    <div style={{
                      background: "rgba(255,255,255,0.2)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      display: "inline-block"
                    }}>
                      {orderContant.payment[state?.payment]}
                    </div>
                  </WrapperValue>
                </WrapperInfo>
              </div>

              {/* Products List */}
              <div style={{ padding: "25px" }}>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#2c3e50",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <ShoppingOutlined style={{ color: "#27ae60" }} />
                  Danh sách sản phẩm đã đặt
                </h3>

                <WrapperItemOrderItem>
                  {state?.orders?.map((order) => (
                    <WrapperItemOrder key={order.product} style={productItemStyle}>
                      {/* Product Info */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        flex: "1",
                        minWidth: "0"
                      }}>
                        <img
                          alt={order?.name || "Sản phẩm"}
                          src={order?.image}
                          style={productImageStyle}
                        />
                        <div style={{
                          flex: "1",
                          minWidth: "0"
                        }}>
                          <h4 style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#2c3e50",
                            lineHeight: "1.4",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {order?.name}
                          </h4>
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px"
                          }}>
                            <span style={{
                              fontSize: "14px",
                              color: "#27ae60",
                              fontWeight: "600"
                            }}>
                              💰 Giá: {convertPrice(order?.price)}
                            </span>
                            <span style={{
                              fontSize: "14px",
                              color: "#7f8c8d"
                            }}>
                              📦 Số lượng: {order?.amount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div style={{
                        textAlign: "right",
                        marginLeft: "15px"
                      }}>
                        <div style={{
                          fontSize: "12px",
                          color: "#7f8c8d",
                          marginBottom: "5px"
                        }}>
                          Thành tiền
                        </div>
                        <div style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#27ae60",
                          background: "linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)",
                          padding: "8px 12px",
                          borderRadius: "8px"
                        }}>
                          {convertPrice(order?.price * order?.amount)}
                        </div>
                      </div>
                    </WrapperItemOrder>
                  ))}
                </WrapperItemOrderItem>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div style={asideStyle}>
            <div style={sidebarStyle}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "20px",
                textAlign: "center",
                borderBottom: "2px solid #27ae60",
                paddingBottom: "10px"
              }}>
                📋 Tóm tắt đơn hàng
              </h3>

              {/* Order Stats */}
              <div style={{
                background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                color: "#fff",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  opacity: "0.9"
                }}>
                  Tổng số sản phẩm
                </div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "15px"
                }}>
                  {state?.orders?.reduce((total, item) => total + item.amount, 0) || 0} sản phẩm
                </div>
                <div style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  opacity: "0.9"
                }}>
                  Tổng giá trị đơn hàng
                </div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "bold"
                }}>
                  {convertPrice(orderTotal)}
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "15px"
                }}>
                  🚚 Trạng thái đơn hàng
                </h4>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0"
                  }}>
                    <CheckCircleOutlined style={{
                      color: "#27ae60",
                      fontSize: "16px"
                    }} />
                    <span style={{
                      color: "#27ae60",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}>
                      Đơn hàng đã được xác nhận
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0"
                  }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid #bdc3c7",
                      background: "#fff"
                    }} />
                    <span style={{
                      color: "#7f8c8d",
                      fontSize: "14px"
                    }}>
                      Đang chuẩn bị hàng
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0"
                  }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid #bdc3c7",
                      background: "#fff"
                    }} />
                    <span style={{
                      color: "#7f8c8d",
                      fontSize: "14px"
                    }}>
                      Đang giao hàng
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div style={{
                background: "linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "10px"
                }}>
                  🤝 Cần hỗ trợ?
                </h4>
                <p style={{
                  fontSize: "14px",
                  color: "#7f8c8d",
                  margin: "0 0 15px 0",
                  lineHeight: "1.5"
                }}>
                  Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng
                </p>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px"
                }}>
                  <div>📞 Hotline: 1900-1234</div>
                  <div>📧 Email: support@store.com</div>
                  <div>💬 Chat: 8:00 - 22:00 hàng ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            flex-direction: column !important;
            gap: 15px !important;
          }
          
          .header-info {
            flex-direction: column !important;
            gap: 15px !important;
          }
          
          .info-card {
            min-width: auto !important;
            width: 100% !important;
          }
          
          .sidebar {
            max-width: 100% !important;
            position: static !important;
          }
          
          .header-card {
            padding: 20px 15px !important;
          }
          
          .product-item {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          .product-info {
            flex-direction: column !important;
            text-align: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 10px !important;
          }
          
          .header-title {
            font-size: 24px !important;
          }
          
          .product-image {
            width: 60px !important;
            height: 60px !important;
          }
          
          .content-gap {
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;