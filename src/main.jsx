import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingCart, Heart, Star, Truck, RotateCcw, SlidersHorizontal, PawPrint, Menu, X, ChevronLeft, Plus, Minus, Trash2, Mail, Phone, Users } from 'lucide-react';
import './styles.css';

const products = [
  {
    id: 1,
    name: '네온 컴포트 하네스',
    category: 'dog',
    subcategory: '산책용품',
    price: 28900,
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
    badge: 'BEST',
    description: '부드러운 메쉬 안감과 안정적인 핏으로 매일 산책에 좋은 강아지 하네스입니다.',
    options: ['XS', 'S', 'M', 'L']
  },
  {
    id: 2,
    name: '고양이 우드 스크래처',
    category: 'cat',
    subcategory: '놀이용품',
    price: 34900,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=900&q=80',
    badge: 'NEW',
    description: '인테리어와 잘 어울리는 우드 프레임 스크래처입니다.',
    options: ['Natural', 'Dark Wood']
  },
  {
    id: 3,
    name: '프리미엄 오리 져키',
    category: 'dog',
    subcategory: '간식',
    price: 12900,
    rating: 4.9,
    reviews: 231,
    image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=900&q=80',
    badge: 'HOT',
    description: '기호성이 좋은 오리 단백질 간식입니다. 훈련 보상용으로 좋아요.',
    options: ['80g', '160g']
  },
  {
    id: 4,
    name: '스테인리스 물그릇 세트',
    category: 'all',
    subcategory: '식기',
    price: 21900,
    rating: 4.6,
    reviews: 57,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=900&q=80',
    badge: 'SALE',
    description: '강아지와 고양이 모두 사용할 수 있는 미끄럼 방지 식기 세트입니다.',
    options: ['Single', 'Double']
  },
  {
    id: 5,
    name: '캣닢 마우스 토이 3종',
    category: 'cat',
    subcategory: '놀이용품',
    price: 9900,
    rating: 4.5,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80',
    badge: 'PICK',
    description: '사냥 본능을 자극하는 가벼운 캣닢 장난감 세트입니다.',
    options: ['3pcs']
  },
  {
    id: 6,
    name: '구름 쿠션 베드',
    category: 'all',
    subcategory: '하우스/침대',
    price: 45900,
    rating: 4.8,
    reviews: 118,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    badge: 'COMFY',
    description: '폭신한 충전재로 편안한 휴식을 돕는 포근한 베드입니다.',
    options: ['S', 'M', 'L']
  }
];

const categories = [
  { id: 'all', label: '전체', helper: '강아지·고양이 공용' },
  { id: 'dog', label: '강아지', helper: '산책, 간식, 장난감' },
  { id: 'cat', label: '고양이', helper: '스크래처, 캣닢, 식기' }
];

function formatPrice(value) {
  return new Intl.NumberFormat('ko-KR').format(value) + '원';
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState(products[0].options[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState('');

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const next = products.filter((product) => {
      const categoryMatch = activeCategory === 'all' || product.category === activeCategory || product.category === 'all';
      const keywordMatch = !keyword || `${product.name} ${product.subcategory} ${product.description}`.toLowerCase().includes(keyword);
      return categoryMatch && keywordMatch;
    });

    if (sort === 'low') return [...next].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...next].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...next].sort((a, b) => b.rating - a.rating);
    return [...next].sort((a, b) => b.reviews - a.reviews);
  }, [activeCategory, query, sort]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= 30000 ? 0 : 3500;
  const total = subtotal + shippingFee;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const addToCart = (product, selectedOption = product.options[0], selectedQuantity = 1) => {
    const key = `${product.id}-${selectedOption}`;
    setCartItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + selectedQuantity } : item);
      }
      return [...current, { ...product, key, option: selectedOption, quantity: selectedQuantity }];
    });
    setCartOpen(true);
    showToast(`${product.name} ${selectedQuantity}개가 장바구니에 담겼어요.`);
  };

  const updateCartQuantity = (key, nextQuantity) => {
    if (nextQuantity < 1) {
      setCartItems((current) => current.filter((item) => item.key !== key));
      return;
    }
    setCartItems((current) => current.map((item) => item.key === key ? { ...item, quantity: nextQuantity } : item));
  };

  const removeFromCart = (key) => {
    setCartItems((current) => current.filter((item) => item.key !== key));
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setOption(product.options[0]);
    setQuantity(1);
    document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="app-shell" id="top">
      <Header
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        closeMobileMenu={closeMobileMenu}
      />

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><PawPrint className="icon" aria-hidden="true" /> COCOPET</span>
            <h1 id="hero-title">따뜻한 펫 라이프를 위한 네온 그린 쇼핑몰</h1>
            <p>강아지와 고양이 용품을 카테고리별로 찾고, 상세 옵션과 리뷰까지 한 화면에서 확인할 수 있는 프론트엔드 MVP입니다.</p>
            <div className="hero-actions">
              <a className="btn" href="#products" aria-label="상품 둘러보기">상품 둘러보기</a>
              <a className="btn ghost" href="#detail" aria-label="상품 상세 보기">상세 페이지 보기</a>
            </div>
          </div>

          <div className="hero-card" aria-label="추천 상품 미리보기">
            <img src={selectedProduct.image} alt={`${selectedProduct.name} 상품 사진`} />
            <div className="hero-card-content">
              <span>{selectedProduct.badge}</span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
            </div>
          </div>
        </section>

        <section className="category-section" aria-labelledby="category-title">
          <div className="section-heading">
            <p>Shop by pet</p>
            <h2 id="category-title">카테고리 선택</h2>
          </div>
          <div className="category-grid" role="list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                aria-label={`${category.label} 카테고리 보기`}
                aria-pressed={activeCategory === category.id}
              >
                <span>{category.label}</span>
                <small>{category.helper}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="products-layout" id="products" aria-labelledby="products-title">
          <div className="products-header">
            <div className="section-heading">
              <p>Find your item</p>
              <h2 id="products-title">상품 리스트</h2>
            </div>

            <div className="toolbar" aria-label="검색 및 정렬 도구">
              <label className="search-box">
                <Search className="icon" aria-hidden="true" />
                <span className="sr-only">상품 검색</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="하네스, 간식, 스크래처 검색"
                />
              </label>
              <label className="sort-box">
                <SlidersHorizontal className="icon" aria-hidden="true" />
                <span className="sr-only">상품 정렬</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="상품 정렬 선택">
                  <option value="popular">인기순</option>
                  <option value="rating">리뷰 높은순</option>
                  <option value="low">낮은 가격순</option>
                  <option value="high">높은 가격순</option>
                </select>
              </label>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={openProduct} onAddToCart={addToCart} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state" role="status">
              검색 결과가 없습니다. 다른 키워드나 카테고리를 선택해주세요.
            </div>
          )}
        </section>

        <ProductDetail
          product={selectedProduct}
          option={option}
          setOption={setOption}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={addToCart}
        />

        <AboutSection />
        <ContactSection />
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={total}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
      />

      {toast && <div className="toast" role="status">{toast}</div>}

      <Footer />
    </div>
  );
}

function Header({ mobileOpen, setMobileOpen, cartCount, onCartOpen, closeMobileMenu }) {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="COCOPET 홈" onClick={closeMobileMenu}>
        <PawPrint className="icon" aria-hidden="true" />
        <span>COCOPET</span>
      </a>
      <nav className={mobileOpen ? 'nav open' : 'nav'} aria-label="주요 메뉴">
        <a href="#products" onClick={closeMobileMenu}>Products</a>
        <a href="#detail" onClick={closeMobileMenu}>Detail</a>
        <a href="#about" onClick={closeMobileMenu}>회사 소개</a>
        <a href="#contact" onClick={closeMobileMenu}>Contact</a>
        <a href="#shipping" onClick={closeMobileMenu}>Shipping</a>
      </nav>
      <button className="icon-button cart-button" onClick={onCartOpen} aria-label={`장바구니 열기, 현재 ${cartCount}개 상품`}>
        <ShoppingCart className="icon" aria-hidden="true" />
        {cartCount > 0 && <span className="cart-badge" aria-label={`장바구니 상품 ${cartCount}개`}>{cartCount}</span>}
      </button>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={mobileOpen}>
        {mobileOpen ? <X className="icon" aria-hidden="true" /> : <Menu className="icon" aria-hidden="true" />}
      </button>
    </header>
  );
}

function ProductCard({ product, onOpen, onAddToCart }) {
  return (
    <article className="product-card">
      <button className="wishlist" aria-label={`${product.name} 찜하기`}>
        <Heart className="icon" aria-hidden="true" />
      </button>
      <button className="product-image-button" onClick={() => onOpen(product)} aria-label={`${product.name} 상세 보기`}>
        <img src={product.image} alt={`${product.name} 상품 사진`} />
      </button>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.badge}</span>
          <small>{product.subcategory}</small>
        </div>
        <h3>{product.name}</h3>
        <div className="rating" aria-label={`평점 ${product.rating}, 리뷰 ${product.reviews}개`}>
          <Star className="icon" aria-hidden="true" />
          <span>{product.rating}</span>
          <small>({product.reviews})</small>
        </div>
        <div className="product-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <button className="btn small" onClick={() => onAddToCart(product)} aria-label={`${product.name} 장바구니에 담기`}>담기</button>
        </div>
      </div>
    </article>
  );
}

function ProductDetail({ product, option, setOption, quantity, setQuantity, onAddToCart }) {
  return (
    <section className="detail-section" id="detail" aria-labelledby="detail-title">
      <div className="detail-media">
        <button className="back-chip" aria-label="상품 리스트로 돌아가기" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
          <ChevronLeft className="icon" aria-hidden="true" /> 리스트로
        </button>
        <img src={product.image} alt={`${product.name} 상세 상품 사진`} />
      </div>

      <div className="detail-copy">
        <span className="eyebrow">Product detail</span>
        <h2 id="detail-title">{product.name}</h2>
        <p>{product.description}</p>
        <div className="rating large" aria-label={`평점 ${product.rating}, 리뷰 ${product.reviews}개`}>
          <Star className="icon" aria-hidden="true" />
          <span>{product.rating}</span>
          <small>리뷰 {product.reviews}개</small>
        </div>
        <strong className="detail-price">{formatPrice(product.price)}</strong>

        <div className="form-row">
          <label htmlFor="option-select">옵션 선택</label>
          <select id="option-select" value={option} onChange={(event) => setOption(event.target.value)}>
            {product.options.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="quantity-select">수량 선택</label>
          <div className="quantity-control">
            <button aria-label="수량 줄이기" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <input id="quantity-select" value={quantity} readOnly aria-label="선택된 수량" />
            <button aria-label="수량 늘리기" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn" onClick={() => onAddToCart(product, option, quantity)} aria-label={`${product.name} 바로 구매하기`}>바로 구매</button>
          <button className="btn ghost" onClick={() => onAddToCart(product, option, quantity)} aria-label={`${product.name} 장바구니에 담기`}>장바구니</button>
        </div>

        <div className="info-list" id="shipping">
          <div>
            <Truck className="icon" aria-hidden="true" />
            <div><strong>배송 안내</strong><p>3만원 이상 무료배송, 평균 1–3영업일 내 출고</p></div>
          </div>
          <div>
            <RotateCcw className="icon" aria-hidden="true" />
            <div><strong>반품 안내</strong><p>수령 후 7일 이내 미사용 상품 교환/반품 가능</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-heading">
        <p>About Cocopet</p>
        <h2 id="about-title">따뜻한 취향을 고르는 펫 라이프 팀</h2>
      </div>
      <div className="content-card about-card">
        <Users className="icon" aria-hidden="true" />
        <div>
          <p>
            COCOPET은 반려동물과 보호자의 일상을 더 편하고 예쁘게 만드는 제품을 큐레이션하는 작은 브랜드입니다.
            Lena Team은 사용감, 디자인, 가격의 균형을 중요하게 보고 강아지와 고양이에게 필요한 기본 아이템부터
            선물하기 좋은 제품까지 정성스럽게 소개합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-heading">
        <p>Contact</p>
        <h2 id="contact-title">문의하기</h2>
      </div>
      <div className="contact-grid">
        <a className="contact-card" href="mailto:westshorestay764@gmail.com" aria-label="이메일로 문의하기">
          <Mail className="icon" aria-hidden="true" />
          <div>
            <strong>Email</strong>
            <p>westshorestay764@gmail.com</p>
          </div>
        </a>
        <a className="contact-card" href="tel:12138459221" aria-label="전화로 문의하기">
          <Phone className="icon" aria-hidden="true" />
          <div>
            <strong>Phone</strong>
            <p>213-845-9221</p>
          </div>
        </a>
      </div>
    </section>
  );
}

function CartDrawer({ isOpen, onClose, items, subtotal, shippingFee, total, updateCartQuantity, removeFromCart }) {
  return (
    <>
      <div className={isOpen ? 'drawer-backdrop open' : 'drawer-backdrop'} onClick={onClose} aria-hidden="true" />
      <aside className={isOpen ? 'cart-drawer open' : 'cart-drawer'} aria-label="장바구니" aria-hidden={!isOpen}>
        <div className="drawer-header">
          <div>
            <p>Shopping cart</p>
            <h2>장바구니</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="장바구니 닫기">
            <X className="icon" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart className="icon" aria-hidden="true" />
            <strong>장바구니가 비어 있어요.</strong>
            <p>상품 카드의 담기 버튼을 눌러 테스트해보세요.</p>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.key}>
                <img src={item.image} alt={`${item.name} 장바구니 이미지`} />
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <p>옵션: {item.option}</p>
                  <span>{formatPrice(item.price)}</span>
                  <div className="cart-item-actions">
                    <button aria-label={`${item.name} 수량 줄이기`} onClick={() => updateCartQuantity(item.key, item.quantity - 1)}><Minus className="icon" aria-hidden="true" /></button>
                    <b>{item.quantity}</b>
                    <button aria-label={`${item.name} 수량 늘리기`} onClick={() => updateCartQuantity(item.key, item.quantity + 1)}><Plus className="icon" aria-hidden="true" /></button>
                    <button className="remove" aria-label={`${item.name} 삭제하기`} onClick={() => removeFromCart(item.key)}><Trash2 className="icon" aria-hidden="true" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-summary">
          <div><span>상품 금액</span><strong>{formatPrice(subtotal)}</strong></div>
          <div><span>배송비</span><strong>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</strong></div>
          <div className="total-row"><span>총 금액</span><strong>{formatPrice(total)}</strong></div>
          <button className="btn checkout-btn" disabled={items.length === 0} aria-label="체크아웃으로 이동하기">체크아웃 테스트</button>
          <p>현재는 프론트엔드 테스트용입니다. 실제 결제는 다음 단계에서 Stripe 또는 Shopify로 연결할 수 있어요.</p>
        </div>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 COCOPET. Frontend MVP.</p>
      <p>검색, 필터, 정렬, 장바구니는 현재 클라이언트 더미 데이터로 동작합니다.</p>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
