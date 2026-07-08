import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingCart, Heart, Star, Truck, RotateCcw, SlidersHorizontal, PawPrint, Menu, X, ChevronLeft, Plus, Minus, Trash2, Mail, Phone, Users } from 'lucide-react';
import './styles.css';

const products = [
  {
    id: 1,
    name: 'Neon Comfort Harness',
    category: 'dog',
    subcategory: 'Walk Essentials',
    price: 28,
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
    badge: 'BEST',
    description: 'A soft mesh-lined dog harness with a secure fit, perfect for everyday walks.',
    options: ['XS', 'S', 'M', 'L']
  },
  {
    id: 2,
    name: 'Wood Cat Scratcher',
    category: 'cat',
    subcategory: 'Toys & Play',
    price: 34,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=900&q=80',
    badge: 'NEW',
    description: 'A wood-frame scratcher that blends beautifully with modern interiors.',
    options: ['Natural', 'Dark Wood']
  },
  {
    id: 3,
    name: 'Premium Duck Jerky',
    category: 'dog',
    subcategory: 'Treats',
    price: 12,
    rating: 4.9,
    reviews: 231,
    image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=900&q=80',
    badge: 'HOT',
    description: 'A tasty duck protein treat that works well as a training reward.',
    options: ['80g', '160g']
  },
  {
    id: 4,
    name: 'Stainless Bowl Set',
    category: 'all',
    subcategory: 'Bowls & Feeders',
    price: 22,
    rating: 4.6,
    reviews: 57,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=900&q=80',
    badge: 'SALE',
    description: 'A non-slip bowl set suitable for both dogs and cats.',
    options: ['Single', 'Double']
  },
  {
    id: 5,
    name: 'Catnip Mouse Toy Set',
    category: 'cat',
    subcategory: 'Toys & Play',
    price: 10,
    rating: 4.5,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80',
    badge: 'PICK',
    description: 'A lightweight catnip toy set designed to spark your cat’s hunting instincts.',
    options: ['3pcs']
  },
  {
    id: 6,
    name: 'Cloud Cushion Bed',
    category: 'all',
    subcategory: 'Beds & Houses',
    price: 46,
    rating: 4.8,
    reviews: 118,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    badge: 'COMFY',
    description: 'A cozy bed with plush filling for comfortable daily rest.',
    options: ['S', 'M', 'L']
  }
];

const categories = [
  { id: 'all', label: 'All', helper: 'For dogs & cats' },
  { id: 'dog', label: 'Dogs', helper: 'Walks, treats, toys' },
  { id: 'cat', label: 'Cats', helper: 'Scratchers, catnip, bowls' }
];

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
  const shippingFee = subtotal === 0 || subtotal >= 50 ? 0 : 5;
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
    showToast(`${product.name} x${selectedQuantity} added to your cart.`);
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
            <h1 id="hero-title">A Neon Green Shop for Cozy Pet Living</h1>
            <p>A frontend MVP where shoppers can browse dog and cat products by category, review product details, choose options, and add items to cart.</p>
            <div className="hero-actions">
              <a className="btn" href="#products" aria-label="Browse products">Browse Products</a>
              <a className="btn ghost" href="#detail" aria-label="View product details">View Product Details</a>
            </div>
          </div>

          <div className="hero-card" aria-label="Featured product preview">
            <img src={selectedProduct.image} alt={`${selectedProduct.name} product photo`} />
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
            <h2 id="category-title">Choose a Category</h2>
          </div>
          <div className="category-grid" role="list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                aria-label={`View ${category.label} category`}
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
              <h2 id="products-title">Product List</h2>
            </div>

            <div className="toolbar" aria-label="Search and sort tools">
              <label className="search-box">
                <Search className="icon" aria-hidden="true" />
                <span className="sr-only">Product search</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search harness, treats, scratcher"
                />
              </label>
              <label className="sort-box">
                <SlidersHorizontal className="icon" aria-hidden="true" />
                <span className="sr-only">Product sorting</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Select product sorting">
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
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
              No results found. Try another keyword or category.
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
      <a href="#top" className="brand" aria-label="COCOPET home" onClick={closeMobileMenu}>
        <PawPrint className="icon" aria-hidden="true" />
        <span>COCOPET</span>
      </a>
      <nav className={mobileOpen ? 'nav open' : 'nav'} aria-label="Main menu">
        <a href="#products" onClick={closeMobileMenu}>Products</a>
        <a href="#detail" onClick={closeMobileMenu}>Detail</a>
        <a href="#about" onClick={closeMobileMenu}>About</a>
        <a href="#contact" onClick={closeMobileMenu}>Contact</a>
        <a href="#shipping" onClick={closeMobileMenu}>Shipping</a>
      </nav>
      <button className="icon-button cart-button" onClick={onCartOpen} aria-label={`Open cart, currently ${cartCount} item(s)`}>
        <ShoppingCart className="icon" aria-hidden="true" />
        {cartCount > 0 && <span className="cart-badge" aria-label={`Cart item count: ${cartCount}`}>{cartCount}</span>}
      </button>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
        {mobileOpen ? <X className="icon" aria-hidden="true" /> : <Menu className="icon" aria-hidden="true" />}
      </button>
    </header>
  );
}

function ProductCard({ product, onOpen, onAddToCart }) {
  return (
    <article className="product-card">
      <button className="wishlist" aria-label={`Add ${product.name} to wishlist`}>
        <Heart className="icon" aria-hidden="true" />
      </button>
      <button className="product-image-button" onClick={() => onOpen(product)} aria-label={`View ${product.name} details`}>
        <img src={product.image} alt={`${product.name} product photo`} />
      </button>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.badge}</span>
          <small>{product.subcategory}</small>
        </div>
        <h3>{product.name}</h3>
        <div className="rating" aria-label={`Rating ${product.rating}, ${product.reviews} reviews`}>
          <Star className="icon" aria-hidden="true" />
          <span>{product.rating}</span>
          <small>({product.reviews})</small>
        </div>
        <div className="product-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <button className="btn small" onClick={() => onAddToCart(product)} aria-label={`Add ${product.name} to cart`}>Add</button>
        </div>
      </div>
    </article>
  );
}

function ProductDetail({ product, option, setOption, quantity, setQuantity, onAddToCart }) {
  return (
    <section className="detail-section" id="detail" aria-labelledby="detail-title">
      <div className="detail-media">
        <button className="back-chip" aria-label="Back to product list" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
          <ChevronLeft className="icon" aria-hidden="true" /> Back to List
        </button>
        <img src={product.image} alt={`${product.name} detailed product photo`} />
      </div>

      <div className="detail-copy">
        <span className="eyebrow">Product detail</span>
        <h2 id="detail-title">{product.name}</h2>
        <p>{product.description}</p>
        <div className="rating large" aria-label={`Rating ${product.rating}, ${product.reviews} reviews`}>
          <Star className="icon" aria-hidden="true" />
          <span>{product.rating}</span>
          <small>{product.reviews} reviews</small>
        </div>
        <strong className="detail-price">{formatPrice(product.price)}</strong>

        <div className="form-row">
          <label htmlFor="option-select">Choose Option</label>
          <select id="option-select" value={option} onChange={(event) => setOption(event.target.value)}>
            {product.options.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="quantity-select">Choose Quantity</label>
          <div className="quantity-control">
            <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <input id="quantity-select" value={quantity} readOnly aria-label="Selected quantity" />
            <button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn" onClick={() => onAddToCart(product, option, quantity)} aria-label={`Buy ${product.name} now`}>Buy Now</button>
          <button className="btn ghost" onClick={() => onAddToCart(product, option, quantity)} aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
        </div>

        <div className="info-list" id="shipping">
          <div>
            <Truck className="icon" aria-hidden="true" />
            <div><strong>Shipping Info</strong><p>Free shipping on orders over $50. Ships in 1–3 business days on average.</p></div>
          </div>
          <div>
            <RotateCcw className="icon" aria-hidden="true" />
            <div><strong>Returns Info</strong><p>Unused items can be exchanged or returned within 7 days of delivery.</p></div>
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
        <h2 id="about-title">A Pet Lifestyle Team with a Warm Eye for Detail</h2>
      </div>
      <div className="content-card about-card">
        <Users className="icon" aria-hidden="true" />
        <div>
          <p>
            COCOPET is a small curated pet brand built to make everyday life with pets more comfortable, stylish, and joyful.
            Lena Team focuses on the balance between usability, design, and price, carefully introducing everyday essentials
            for dogs and cats as well as thoughtful gift-worthy finds.
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
        <h2 id="contact-title">Contact Us</h2>
      </div>
      <div className="contact-grid">
        <a className="contact-card" href="mailto:westshorestay764@gmail.com" aria-label="Contact by email">
          <Mail className="icon" aria-hidden="true" />
          <div>
            <strong>Email</strong>
            <p>westshorestay764@gmail.com</p>
          </div>
        </a>
        <a className="contact-card" href="tel:12138459221" aria-label="Contact by phone">
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
      <aside className={isOpen ? 'cart-drawer open' : 'cart-drawer'} aria-label="Shopping cart" aria-hidden={!isOpen}>
        <div className="drawer-header">
          <div>
            <p>Shopping cart</p>
            <h2>Your Cart</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close cart">
            <X className="icon" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart className="icon" aria-hidden="true" />
            <strong>Your cart is empty.</strong>
            <p>Try adding an item from a product card.</p>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.key}>
                <img src={item.image} alt={`${item.name} cart image`} />
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <p>Option: {item.option}</p>
                  <span>{formatPrice(item.price)}</span>
                  <div className="cart-item-actions">
                    <button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateCartQuantity(item.key, item.quantity - 1)}><Minus className="icon" aria-hidden="true" /></button>
                    <b>{item.quantity}</b>
                    <button aria-label={`Increase ${item.name} quantity`} onClick={() => updateCartQuantity(item.key, item.quantity + 1)}><Plus className="icon" aria-hidden="true" /></button>
                    <button className="remove" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.key)}><Trash2 className="icon" aria-hidden="true" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-summary">
          <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</strong></div>
          <div className="total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <button className="btn checkout-btn" disabled={items.length === 0} aria-label="Go to checkout">Checkout Test</button>
          <p>This is currently a frontend test. Real checkout can be connected later with Stripe or Shopify.</p>
        </div>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 COCOPET. Frontend MVP.</p>
      <p>Search, filtering, sorting, and cart features currently run on client-side demo data.</p>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
