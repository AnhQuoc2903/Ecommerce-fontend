import { useEffect, useRef, useState, useMemo } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import slice1 from "../../assets/images/Slice1.jpg";
import slice5 from "../../assets/images/Slice2.jpg";
import slice4 from "../../assets/images/Slice3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductServices from "../../services/ProductServices";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import Banner from "../../components/Banner/Banner";
import { Empty, Spin } from "antd";
import "./HomePage.css";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500); // Tăng delay để giảm API calls
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sliderImages = [slice1, slice5, slice4];
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll effect với cleanup tốt hơn
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sliderImages.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: nextIndex * scrollRef.current.offsetWidth,
            behavior: "smooth",
          });
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Reset limit khi search thay đổi
  useEffect(() => {
    if (searchDebounce !== searchProduct) {
      setLimit(6); // Reset về limit ban đầu khi search
    }
  }, [searchDebounce]);

  // Fetch products với error handling tốt hơn
  const fetchProductAll = async (context) => {
    try {
      const limit = context?.queryKey && context?.queryKey[1];
      const search = context?.queryKey && context?.queryKey[2];

      console.log('🔍 Searching with params:', { search, limit });

      const res = await ProductServices.getAllProduct(search, limit);

      console.log('📦 Search results:', res);

      if (res?.status === "OK") {
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  };

  // Fetch all product types
  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductServices.getAllTypeProduct();
      if (res?.status === "OK") {
        setTypeProducts(res?.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching product types:', error);
    }
  };

  // Main products query với cải thiện
  const {
    isPending,
    data: products,
    isPreviousData,
    error,
    refetch
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      console.error('🚨 Query error:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Query success:', data);
      setIsLoadingMore(false);
    }
  });

  // Load product types on mount
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  // Handle load more
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    setLimit((prev) => prev + 6);
  };

  // Memoized search status
  const searchStatus = useMemo(() => {
    const hasSearch = searchDebounce && searchDebounce.trim().length > 0;
    const hasResults = products?.data && products.data.length > 0;
    const isEmpty = !isPending && !hasResults;

    return {
      hasSearch,
      hasResults,
      isEmpty,
      isSearching: hasSearch && isPending,
      searchTerm: searchDebounce?.trim()
    };
  }, [searchDebounce, products, isPending]);

  // Check if can load more
  const canLoadMore = useMemo(() => {
    if (!products?.data) return false;
    return products.data.length < products.total && products.totalPage > 1;
  }, [products]);

  return (
    <div className="homepage-wrapper">
      {/* Hero Carousel với overlay */}
      <div className="hero-carousel">
        <div ref={scrollRef} className="carousel-container">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                loading="lazy"
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <div className="hero-content">
                  <h1 className="hero-title">
                    {index === 0 && "Khám Phá Sản Phẩm Mới"}
                    {index === 1 && "Ưu Đãi Đặc Biệt"}
                    {index === 2 && "Chất Lượng Hàng Đầu"}
                  </h1>
                  <p className="hero-subtitle">
                    {index === 0 && "Trải nghiệm mua sắm tuyệt vời với hàng ngàn sản phẩm chất lượng"}
                    {index === 1 && "Giảm giá lên đến 50% cho tất cả sản phẩm"}
                    {index === 2 && "Cam kết chất lượng và dịch vụ tốt nhất"}
                  </p>
                  <button className="hero-cta">Khám Phá Ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: index * scrollRef.current.offsetWidth,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Categories Section - Ẩn khi đang search */}
      {!searchStatus.hasSearch && (
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Danh Mục Sản Phẩm</h2>
              <p className="section-subtitle">Khám phá các danh mục sản phẩm đa dạng của chúng tôi</p>
            </div>

            <div className="categories-grid">
              <WrapperTypeProduct className="type-products-wrapper">
                {typeProducts?.map((item, index) => (
                  <div key={item} className="category-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <TypeProduct name={item} />
                  </div>
                ))}
              </WrapperTypeProduct>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {searchStatus.hasSearch
                ? `Kết quả tìm kiếm: "${searchStatus.searchTerm}"`
                : "Sản Phẩm Nổi Bật"
              }
            </h2>
            <p className="section-subtitle">
              {searchStatus.hasSearch
                ? `Tìm thấy ${products?.total || 0} sản phẩm`
                : "Những sản phẩm được yêu thích nhất"
              }
            </p>
          </div>

          {/* Search Loading */}
          {searchStatus.isSearching && (
            <div className="search-loading">
              <Spin size="large" />
              <p>Đang tìm kiếm sản phẩm...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!</p>
              <button onClick={() => refetch()} className="retry-btn">
                Thử lại
              </button>
            </div>
          )}

          <Loading isPending={isPending && !isPreviousData}>
            <div className="products-container">
              <WrapperProducts className="products-grid">
                {searchStatus.hasResults ? (
                  products.data.map((product, index) => (
                    <div
                      key={product?._id}
                      className="product-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardComponent
                        countInStock={product?.countInStock}
                        description={product?.description}
                        images={product?.images?.[0]}
                        name={product?.name}
                        price={product?.price}
                        rating={product?.rating}
                        type={product?.type}
                        discount={product?.discount}
                        seller={product?.seller}
                        id={product?._id}
                      />
                    </div>
                  ))
                ) : (
                  searchStatus.isEmpty && (
                    <div className="empty-state">
                      <Empty
                        description={
                          <span className="empty-text">
                            {searchStatus.hasSearch
                              ? `Không tìm thấy sản phẩm nào cho "${searchStatus.searchTerm}"`
                              : "Không có sản phẩm nào!"
                            }
                          </span>
                        }
                      />
                      {searchStatus.hasSearch && (
                        <button
                          onClick={() => window.location.reload()}
                          className="reset-search-btn"
                        >
                          Xem tất cả sản phẩm
                        </button>
                      )}
                    </div>
                  )
                )}
              </WrapperProducts>

              {/* Load More Button */}
              {searchStatus.hasResults && canLoadMore && (
                <div className="load-more-container">
                  <WrapperButtonMore
                    textButton={isLoadingMore ? "Đang tải..." : "Xem thêm"}
                    type="outline"
                    className="load-more-btn"
                    disabled={isLoadingMore || isPreviousData}
                    onClick={handleLoadMore}
                  />
                </div>
              )}

              {/* Pagination Info */}
              {searchStatus.hasResults && (
                <div className="pagination-info">
                  <p>
                    Hiển thị {products.data.length} / {products.total} sản phẩm
                    {searchStatus.hasSearch && ` cho "${searchStatus.searchTerm}"`}
                  </p>
                </div>
              )}
            </div>
          </Loading>
        </div>
      </section>

      {/* Banner Section - Ẩn khi đang search */}
      {!searchStatus.hasSearch && (
        <section className="banner-section">
          <Banner />
        </section>
      )}
    </div>
  );
};

export default HomePage;