import React from "react";
import { Carousel, Col, Image, Space, Avatar } from "antd";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { FaGift } from "react-icons/fa";

import slice1 from "../../assets/images/Slice1.jpg";
import slice5 from "../../assets/images/Slice2.jpg";

const carouselData = [
    {
        img: slice1,
        title: "Ưu đãi bất ngờ",
        description:
            "Chuyên cung cấp đồ lưu niệm thủ công tinh xảo – mỗi sản phẩm là một tác phẩm nghệ thuật.",
    },
    {
        img: slice5,
        title: "Độc đáo & Sáng tạo",
        description:
            "Mỗi sản phẩm đều mang câu chuyện riêng biệt, được chế tác bởi bàn tay nghệ nhân lành nghề.",
    },
];

const features = [
    {
        icon: <GrSecure size={18} />,
        bgColor: "#e9d5ff",
        label: "Sản phẩm chất lượng",
    },
    {
        icon: <IoFastFood size={18} />,
        bgColor: "#fa8c16",
        label: "Giao hàng nhanh",
    },
    {
        icon: <GiFoodTruck size={18} />,
        bgColor: "#52c41a",
        label: "Thanh toán dễ dàng",
    },
    {
        icon: <FaGift size={18} />,
        bgColor: "#fadb14",
        label: "Ưu đãi hấp dẫn",
    },
];

const BannerCarousel = () => {
    return (
        <Carousel autoplay dots>
            {carouselData.map((item, index) => (
                <section
                    key={index}
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
                                src={item.img}
                                alt={item.title}
                                preview={false}
                                title={item.title}
                                style={{
                                    width: "100%",
                                    maxHeight: 400,
                                    objectFit: "cover",
                                    borderRadius: 12,
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                                }}
                            />
                        </Col>

                        <Col xs={24} sm={12}>
                            <Space direction="vertical" size="large">
                                <h1 style={{ fontWeight: "bold", fontSize: 32 }}>{item.title}</h1>
                                <p style={{ color: "gray", fontSize: 16, lineHeight: 1.6 }}>{item.description}</p>

                                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                    {features.map((f, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Avatar
                                                style={{
                                                    backgroundColor: f.bgColor,
                                                    padding: 12,
                                                    width: 50,
                                                    height: 50,
                                                }}
                                                alt={f.label}
                                                title={f.label}
                                            >
                                                {f.icon}
                                            </Avatar>
                                            <h2 style={{ marginLeft: 12, fontSize: 16 }}>{f.label}</h2>
                                        </div>
                                    ))}
                                </Space>
                            </Space>
                        </Col>
                    </article>
                </section>
            ))}
        </Carousel>
    );
};

export default BannerCarousel;
