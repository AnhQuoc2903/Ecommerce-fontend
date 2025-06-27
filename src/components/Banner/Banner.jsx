import React from "react";
import { Col, Image, Space, Avatar } from "antd";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { FaGift } from "react-icons/fa";
import BannerImg from "../../assets/images/women2.jpg";

const features = [
  {
    icon: <GrSecure size={18} style={{ color: "#000" }} />,
    bgColor: "#e9d5ff",
    label: "Sản phẩm chất lượng",
  },
  {
    icon: <IoFastFood size={18} style={{ color: "#000" }} />,
    bgColor: "#fa8c16",
    label: "Giao hàng nhanh",
  },
  {
    icon: <GiFoodTruck size={18} style={{ color: "#000" }} />,
    bgColor: "#52c41a",
    label: "Phương thức thanh toán dễ dàng",
  },
  {
    icon: <FaGift size={18} style={{ color: "#000" }} />,
    bgColor: "#fadb14",
    label: "Nhận ưu đãi",
  },
];

const Banner = () => {
  return (
    <section
      style={{
        minHeight: 550,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        backgroundColor: "#fff",
      }}
    >
      <article
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          maxWidth: "1200px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col xs={24} sm={12}>
          <Image
            src={BannerImg}
            alt="Người phụ nữ đang cầm sản phẩm thủ công"
            preview={false}
            title="Sản phẩm thủ công tinh xảo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            }}
          />
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="large">
            <h1 style={{ fontWeight: "bold", fontSize: 32 }}>
              Ưu đãi bất ngờ
            </h1>
            <p style={{ color: "gray", fontSize: 16, lineHeight: 1.6 }}>
              Chuyên cung cấp đồ lưu niệm thủ công tinh xảo – mỗi sản phẩm là
              một tác phẩm nghệ thuật mang đậm dấu ấn sáng tạo.
            </p>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {features.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    style={{
                      backgroundColor: item.bgColor,
                      padding: 12,
                      width: 50,
                      height: 50,
                    }}
                    alt={item.label}
                    title={item.label}
                  >
                    {item.icon}
                  </Avatar>
                  <h2 style={{ marginLeft: 12, fontSize: 16 }}>{item.label}</h2>
                </div>
              ))}
            </Space>
          </Space>
        </Col>
      </article>
    </section>
  );
};

export default Banner;
