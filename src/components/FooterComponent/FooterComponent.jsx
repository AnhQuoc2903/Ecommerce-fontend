import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./FooterComponent.css";
import logo from "../../assets/images/logoBalabin.png"; // sửa đường dẫn đúng với project của bạn

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer" role="contentinfo" aria-label="Thông tin liên hệ và giới thiệu về Balabin">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section about-section">
          <h2>Về Balabin</h2>
          <p>
            Tiền thân là Eco Bắp, chúng tôi cung cấp sản phẩm thân thiện với môi trường từ bắp tự nhiên, chất lượng cao với giá hợp lý. Cam kết mang đến giải pháp bền vững cho cuộc sống hàng ngày.
          </p>
          <div className="footer-logo">
            <img src={logo} alt="logo Balabin" width="120" height="60" />
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact-section">
          <h2>Liên Hệ</h2>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <address>Đại học FPT, P. An Bình, Q. Ninh Kiều, TP. Cần Thơ</address>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <a href="tel:+84964179329">(84+) 964.179.329</a>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <a href="mailto:balabin0905@gmail.com">balabin0905@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Operation Hours */}
        <div className="footer-section hours-section">
          <h2>Thời Gian Hoạt Động</h2>
          <ul className="operation-hours">
            <li><FaClock className="hours-icon" /> <span>8:00 - 21:00</span></li>
            <li><span className="day-span">Thứ 2 - Chủ nhật</span></li>
            <li><span className="support-span">Hỗ trợ khách hàng 24/7</span></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section links-section">
          <h2>Liên Kết</h2>
          <nav aria-label="Footer Navigation">
            <ul className="quick-links">
              <li><Link to="/" onClick={scrollToTop}>Trang chủ</Link></li>
              {/* <li><Link to="/shop" onClick={scrollToTop}>Sản phẩm</Link></li>
              <li><Link to="/news" onClick={scrollToTop}>Tin tức</Link></li> */}
            </ul>
          </nav>
        </div>

        {/* Social Links */}
        <div className="footer-section social-section">
          <h2>Theo Dõi Chúng Tôi</h2>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61568821003334" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="social-icon" />
              <span className="social-name">Facebook</span>
            </a>
            <a href="https://www.instagram.com/ecobap" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" />
              <span className="social-name">Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@eco4.bap" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok className="social-icon" />
              <span className="social-name">TikTok</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} Balabin - Khơi Nguồn Sáng Tạo
        </div>
        <div className="legal-links">
          <Link to="/privacy-policy" onClick={scrollToTop}>Chính sách bảo mật</Link>
          <Link to="/terms-of-service" onClick={scrollToTop}>Điều khoản dịch vụ</Link>
          <Link to="/shipping-policy" onClick={scrollToTop}>Chính sách vận chuyển</Link>
        </div>
      </div>

      {/* Payment & Certifications */}
      <div className="footer-badges">
        <div className="payment-methods">
          <span>Phương thức thanh toán:</span>
          <div className="payment-logos">
            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png" alt="Vietcombank" />
            <img src="https://static.wixstatic.com/media/9d8ed5_0581c29a11f546b98a50fac0b6e24a7f~mv2.jpg" alt="BIDV" />
            <img src="https://ruybangphuonghoang.com/wp-content/uploads/2024/10/logo-agribank-scaled.jpg" alt="Agribank" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Techcombank_logo.png" alt="Techcombank" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_MB_new.png/1200px-Logo_MB_new.png" alt="MB Bank" />
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Former_Visa_%28company%29_logo.svg" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
          </div>
        </div>
        <div className="certifications">
          <span>Chứng nhận:</span>
          <img src="https://file.hstatic.net/200000423303/article/nn_huuco_8ad18ec91a174544837c5d06217ee34a_grande.jpg" alt="Chứng nhận chất lượng" width="100" height="30" />
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
