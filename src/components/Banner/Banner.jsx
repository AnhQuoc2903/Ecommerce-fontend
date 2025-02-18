import React from "react";
import { Col, Image, Space, Avatar } from "antd";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { FaGift } from "react-icons/fa";
import BannerImg from "../../assets/images/women2.jpg";

const Banner = () => {
  return (
    <div
      style={{
        minHeight: 550,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <Col xs={24} sm={12} style={{ height: "100%" }}>
          <Image
            src={BannerImg}
            alt="Banner"
            preview={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              boxShadow: "-10px 10px 12px rgba(0,0,0,1)",
            }}
          />
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="large">
            <h1 style={{ fontWeight: "bold" }}>Giảm giá lên tới 50%</h1>
            <div style={{ color: "gray" }}>
              Chuyên cung cấp đồ lưu niệm thủ công tinh xảo – mỗi sản phẩm là
              một tác phẩm nghệ thuật mang đậm dấu ấn sáng tạo.
            </div>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div
                bordered={false}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Avatar
                  style={{
                    backgroundColor: "#e9d5ff",
                    padding: 12,
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <GrSecure size={18} style={{ color: "#000" }} />
                </Avatar>
                <span style={{ marginLeft: 12 }}>Sản phẩm chất lượng</span>
              </div>
              <div
                bordered={false}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Avatar
                  style={{
                    backgroundColor: "#fa8c16",
                    padding: 12,
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <IoFastFood size={18} style={{ color: "#000" }} />
                </Avatar>
                <span style={{ marginLeft: 12 }}>Giao hàng nhanh</span>
              </div>
              <div
                bordered={false}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: "#52c41a",
                    padding: 12,
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <GiFoodTruck size={18} style={{ color: "#000" }} />
                </Avatar>
                <span style={{ marginLeft: 12 }}>
                  Phương thức thanh toán dễ dàng
                </span>
              </div>
              <div
                bordered={false}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Avatar
                  style={{
                    backgroundColor: "#fadb14",
                    padding: 12,
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <FaGift size={18} style={{ color: "#000" }} />
                </Avatar>
                <span style={{ marginLeft: 12 }}>Nhận ưu đãi</span>
              </div>
            </Space>
          </Space>
        </Col>
      </div>
    </div>
  );
};

export default Banner;
