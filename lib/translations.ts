export type Locale = "en" | "vi";

export const translations = {
  en: {
    nav: {
      products: "Products",
      howItWorks: "How It Works",
      about: "About",
      contact: "Contact",
      getStarted: "Get Started",
      cartLabel: "Shopping cart",
      toggleMenu: "Toggle menu",
      login: "Login",
      cart: "Cart",
    },
    hero: {
      badge: "Premium Printing Services",
      title: "Beautiful prints that make your brand bloom",
      subtitle:
        "From business cards to large-format banners, we bring your vision to life with premium materials and expert craftsmanship. Upload your design or let our designers create something extraordinary.",
      browseProducts: "Browse Products",
      howItWorks: "How It Works",
      stats: {
        customers: "Happy Customers",
        papers: "Paper Types",
        turnaround: "Fast Turnaround",
        satisfaction: "Satisfaction",
      },
    },
    catalog: {
      label: "Our Products",
      title: "Choose your printing product",
      subtitle:
        "Select from our range of premium printing products. Each crafted with the finest materials and attention to detail.",
      popular: "Popular",
      from: "From",
      customize: "Customize",
      products: {
        "business-cards": {
          name: "Business Cards",
          description: "Make a lasting first impression with premium cards",
        },
        flyers: {
          name: "Flyers & Brochures",
          description: "Eye-catching promotional materials for any event",
        },
        banners: {
          name: "Banners & Posters",
          description: "Large format prints that command attention",
        },
        stickers: {
          name: "Stickers & Labels",
          description: "Custom stickers for branding and packaging",
        },
        invitations: {
          name: "Invitations",
          description: "Elegant invitations for weddings and events",
        },
        packaging: {
          name: "Custom Packaging",
          description: "Branded packaging that elevates your product",
        },
      },
    },
    steps: {
      label: "How It Works",
      title: "From idea to print in 4 simple steps",
      items: [
        {
          title: "Choose Your Product",
          description:
            "Browse our catalog and select the printing product that fits your needs.",
        },
        {
          title: "Select Material",
          description:
            "Pick from premium papers, finishes, and special materials for your print.",
        },
        {
          title: "Upload or Design",
          description:
            "Upload your pre-designed artwork or hire one of our professional designers.",
        },
        {
          title: "Fast Delivery",
          description:
            "We print and ship your order with care, right to your doorstep.",
        },
      ],
      stepLabel: "Step",
    },
    customizer: {
      backToProducts: "Back to Products",
      orderSummary: "Order Summary",
      product: "Product",
      material: "Material",
      design: "Design",
      materialStep: "Material",
      designStep: "Design",
      continueToDesign: "Continue to Design",
      backToMaterial: "Back to Material",
      addToCart: "Add to Cart",
      orderSubmitted: "Order Submitted",
      thankYou: "Thank you for your order! We've received your",
      customization: "customization.",
      hireResponse:
        " Our design team will reach out within 24 hours to discuss your project.",
      uploadResponse: " Your design file is being reviewed by our print team.",
      browseMore: "Browse More Products",
      ownDesign: "Own Design",
      hireDesigner: "Hire Designer",
    },
    materials: {
      title: "Select Material",
      subtitle: "Choose the perfect material for your print project.",
    },
    designOptions: {
      title: "Design Your Print",
      subtitle:
        "Upload your own artwork or let our designers craft it for you.",
      uploadTitle: "Upload Your Design",
      uploadSubtitle: "Have a ready-to-print file? Upload it here.",
      hireTitle: "Hire a Designer",
      hireSubtitle: "Let a professional bring your vision to life.",
      dragDrop: "Drag and drop your file here",
      dragDropSub:
        "or click to browse. Supports PDF, PNG, JPG, AI, PSD (max 50MB)",
      removeFile: "Remove uploaded file",
      uploadLabel: "Upload design file",
      designService: "Professional Design Service",
      designPrice: "Starting from $49.99 per design",
      designBrief: "Design Brief",
      designPlaceholder:
        "Describe your vision: colors, style, text, imagery, brand guidelines...",
      designHint:
        "The more detail you provide, the better our designer can match your vision.",
      whatYouGet: "What you get:",
      benefits: [
        "2 initial concept designs to choose from",
        "Up to 3 rounds of revisions",
        "Print-ready files in all formats",
        "Dedicated designer communication",
      ],
    },
    quantitySelector: {
      title: "Select Quantity",
      subtitle: "Choose a quantity package or enter your own.",
      pieces: "pieces",
      customLabel: "Custom Quantity",
      customDescription:
        "Need a different amount? Enter your desired quantity.",
      customPlaceholder: "Enter quantity...",
      customNotice:
        "For custom quantities, our team will review your order and contact you with a personalized quote and estimated delivery time.",
      quantityLabel: "Quantity",
      priceLabel: "Price",
      custom: "custom",
      quotePending: "Quote pending",
      addedCustom: "Added! We'll contact you with a custom quote.",
      customConfirmation:
        " Our team will contact you shortly with a personalized quote for your custom quantity.",
    },
    mockup: {
      title: "3D Product Mockup",
      subtitle:
        "Preview how your design looks on the actual product. Drag to rotate, scroll to zoom.",
      resetView: "Reset View",
      hint: "This is an approximate preview. Final product may vary slightly.",
      close: "Done",
      viewMockup: "View 3D Mockup",
    },
    footer: {
      description:
        "Premium printing services that bring your creative vision to life. Quality materials, expert craftsmanship, delivered to your door.",
      products: "Products",
      company: "Company",
      support: "Support",
      legal: "Legal",
      copyright: "2026 PrintBloom. All rights reserved.",
      productLinks: [
        "Business Cards",
        "Flyers",
        "Banners",
        "Stickers",
        "Invitations",
        "Packaging",
      ],
      companyLinks: ["About Us", "Careers", "Blog", "Press"],
      supportLinks: ["Help Center", "Contact Us", "Shipping Info", "Returns"],
      legalLinks: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
    // Login page
    login: {
      title: "Welcome back",
      subtitle: "Sign in to your PrintBloom account",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      orContinueWith: "Or continue with",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      google: "Google",
      github: "GitHub",
      apple: "Apple",
    },
    // Cart page
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptySubtitle: "Looks like you haven't added any items to your cart yet.",
      continueShopping: "Continue Shopping",
      product: "Product",
      material: "Material",
      design: "Design",
      quantity: "Quantity",
      price: "Price",
      remove: "Remove",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingCalc: "Calculated at checkout",
      tax: "Tax estimate",
      total: "Total",
      proceedToCheckout: "Proceed to Checkout",
      items: "items",
      ownDesign: "Own Design",
      hireDesigner: "Hire Designer",
      customQuantityTag: "Custom qty",
      getQuote: "Get a Quote",
      getQuoteNote:
        "This item has a custom quantity. Click to submit a quote request and our team will contact you directly with pricing.",
      loginRequired: "Login Required",
      loginRequiredNote:
        "You need to be logged in to proceed with payment or request a quote.",
      loginToCheckout: "Login to Checkout",
      loginToQuote: "Login to Request Quote",
      hasCustomItems: "Some items need a quote",
      hasCustomItemsNote:
        "Items with custom quantities cannot be purchased directly. Submit a quote request and we will contact you.",
      quoteItems: "Quote Items",
      buyableItems: "Purchasable Items",
    },
    // Checkout page
    checkout: {
      title: "Checkout",
      contactInfo: "Contact Information",
      email: "Email",
      emailPlaceholder: "you@example.com",
      phone: "Phone",
      phonePlaceholder: "+1 (555) 000-0000",
      shippingAddress: "Shipping Address",
      firstName: "First name",
      lastName: "Last name",
      address: "Address",
      addressPlaceholder: "123 Main St",
      apartment: "Apartment, suite, etc.",
      apartmentPlaceholder: "Apt 4B",
      city: "City",
      cityPlaceholder: "New York",
      state: "State / Province",
      statePlaceholder: "NY",
      zip: "ZIP / Postal code",
      zipPlaceholder: "10001",
      country: "Country",
      shippingMethod: "Shipping Method",
      standard: "Standard Shipping",
      standardTime: "5-7 business days",
      standardPrice: "Free",
      express: "Express Shipping",
      expressTime: "2-3 business days",
      expressPrice: "$12.99",
      overnight: "Overnight Shipping",
      overnightTime: "Next business day",
      overnightPrice: "$24.99",
      payment: "Payment Information",
      cardNumber: "Card number",
      cardPlaceholder: "1234 5678 9012 3456",
      expiry: "Expiry date",
      expiryPlaceholder: "MM/YY",
      cvc: "CVC",
      cvcPlaceholder: "123",
      cardholderName: "Cardholder name",
      cardholderPlaceholder: "John Doe",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      total: "Total",
      placeOrder: "Place Order",
      backToCart: "Back to Cart",
      orderSuccess: "Order Placed Successfully!",
      orderSuccessMessage:
        "Thank you for your order. You will receive a confirmation email shortly.",
      backToHome: "Back to Home",
      items: "items",
    },
  },
  vi: {
    nav: {
      products: "Sản phẩm",
      howItWorks: "Cách hoạt động",
      about: "Về chúng tôi",
      contact: "Liên hệ",
      getStarted: "Bắt đầu",
      cartLabel: "Giỏ hàng",
      toggleMenu: "Mở menu",
      login: "Đăng nhập",
      cart: "Giỏ hàng",
    },
    hero: {
      badge: "Dịch vụ in ấn cao cấp",
      title: "Bản in đẹp giúp thương hiệu của bạn tỏa sáng",
      subtitle:
        "Từ danh thiếp đến băng rôn lớn, chúng tôi biến tầm nhìn của bạn thành hiện thực với chất liệu cao cấp và tay nghề chuyên nghiệp. Tải lên thiết kế hoặc để đội ngũ thiết kế của chúng tôi sáng tạo điều phi thường.",
      browseProducts: "Xem sản phẩm",
      howItWorks: "Cách hoạt động",
      stats: {
        customers: "Khách hàng hài lòng",
        papers: "Loại giấy",
        turnaround: "Giao nhanh",
        satisfaction: "Hài lòng",
      },
    },
    catalog: {
      label: "Sản phẩm của chúng tôi",
      title: "Chọn sản phẩm in ấn của bạn",
      subtitle:
        "Lựa chọn từ các sản phẩm in ấn cao cấp. Mỗi sản phẩm được chế tác từ chất liệu tốt nhất và chú ý đến từng chi tiết.",
      popular: "Phổ biến",
      from: "Từ",
      customize: "Tùy chỉnh",
      products: {
        "business-cards": {
          name: "Danh thiếp",
          description: "Tạo ấn tượng đầu tiên khó quên với danh thiếp cao cấp",
        },
        flyers: {
          name: "Tờ rơi & Brochure",
          description: "Tài liệu quảng cáo bắt mắt cho mọi sự kiện",
        },
        banners: {
          name: "Băng rôn & Poster",
          description: "In khổ lớn thu hút sự chú ý",
        },
        stickers: {
          name: "Nhãn dán & Tem",
          description: "Nhãn dán tùy chỉnh cho thương hiệu và đóng gói",
        },
        invitations: {
          name: "Thiệp mời",
          description: "Thiệp mời sang trọng cho đám cưới và sự kiện",
        },
        packaging: {
          name: "Bao bì tùy chỉnh",
          description: "Bao bì có thương hiệu nâng tầm sản phẩm của bạn",
        },
      },
    },
    steps: {
      label: "Cách hoạt động",
      title: "Từ ý tưởng đến bản in chỉ với 4 bước đơn giản",
      items: [
        {
          title: "Chọn sản phẩm",
          description:
            "Duyệt danh mục và chọn sản phẩm in phù hợp với nhu cầu của bạn.",
        },
        {
          title: "Chọn chất liệu",
          description:
            "Lựa chọn giấy cao cấp, lớp phủ và vật liệu đặc biệt cho bản in.",
        },
        {
          title: "Tải lên hoặc thiết kế",
          description:
            "Tải lên tác phẩm đã thiết kế hoặc thuê nhà thiết kế chuyên nghiệp.",
        },
        {
          title: "Giao hàng nhanh",
          description:
            "Chúng tôi in và giao hàng cẩn thận, ngay đến cửa nhà bạn.",
        },
      ],
      stepLabel: "Bước",
    },
    customizer: {
      backToProducts: "Quay lại sản phẩm",
      orderSummary: "Tóm tắt đơn hàng",
      product: "Sản phẩm",
      material: "Chất liệu",
      design: "Thiết kế",
      materialStep: "Chất liệu",
      designStep: "Thiết kế",
      continueToDesign: "Tiếp tục thiết kế",
      backToMaterial: "Quay lại chất liệu",
      addToCart: "Thêm vào giỏ",
      orderSubmitted: "Đã gửi đơn hàng",
      thankYou: "Cảm ơn bạn đã đặt hàng! Chúng tôi đã nhận yêu cầu tùy chỉnh",
      customization: "của bạn.",
      hireResponse:
        " Đội ngũ thiết kế sẽ liên hệ trong vòng 24 giờ để thảo luận về dự án.",
      uploadResponse: " File thiết kế của bạn đang được đội ngũ in ấn xem xét.",
      browseMore: "Xem thêm sản phẩm",
      ownDesign: "Thiết kế riêng",
      hireDesigner: "Thuê thiết kế",
    },
    materials: {
      title: "Chọn chất liệu",
      subtitle: "Chọn chất liệu hoàn hảo cho dự án in ấn của bạn.",
    },
    designOptions: {
      title: "Thiết kế bản in",
      subtitle: "Tải lên tác phẩm của bạn hoặc để nhà thiết kế thực hiện.",
      uploadTitle: "Tải lên thiết kế",
      uploadSubtitle: "Có file sẵn sàng in? Tải lên tại đây.",
      hireTitle: "Thuê nhà thiết kế",
      hireSubtitle: "Để chuyên gia hiện thực hóa tầm nhìn của bạn.",
      dragDrop: "Kéo và thả file tại đây",
      dragDropSub:
        "hoặc bấm để duyệt. Hỗ trợ PDF, PNG, JPG, AI, PSD (tối đa 50MB)",
      removeFile: "Xóa file đã tải lên",
      uploadLabel: "Tải lên file thiết kế",
      designService: "Dịch vụ thiết kế chuyên nghiệp",
      designPrice: "Giá từ $49.99 mỗi thiết kế",
      designBrief: "Mô tả thiết kế",
      designPlaceholder:
        "Mô tả tầm nhìn của bạn: màu sắc, phong cách, nội dung, hình ảnh, nhận diện thương hiệu...",
      designHint:
        "Bạn cung cấp càng chi tiết, nhà thiết kế càng dễ đáp ứng đúng ý tưởng.",
      whatYouGet: "Bạn nhận được:",
      benefits: [
        "2 bản thiết kế ban đầu để lựa chọn",
        "Tối đa 3 lần chỉnh sửa",
        "File sẵn sàng in ở mọi định dạng",
        "Liên lạc trực tiếp với nhà thiết kế",
      ],
    },
    quantitySelector: {
      title: "Chọn số lượng",
      subtitle: "Chọn gói số lượng hoặc nhập số lượng riêng.",
      pieces: "sản phẩm",
      customLabel: "Số lượng tùy chỉnh",
      customDescription: "Cần số lượng khác? Nhập số lượng bạn muốn.",
      customPlaceholder: "Nhập số lượng...",
      customNotice:
        "Với số lượng tùy chỉnh, đội ngũ của chúng tôi sẽ xem xét đơn hàng và liên hệ với bạn để báo giá cá nhân và thời gian giao hàng dự kiến.",
      quantityLabel: "Số lượng",
      priceLabel: "Giá",
      custom: "tùy chỉnh",
      quotePending: "Đang báo giá",
      addedCustom: "Đã thêm! Chúng tôi sẽ liên hệ báo giá cho bạn.",
      customConfirmation:
        " Đội ngũ của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất với báo giá cá nhân cho số lượng tùy chỉnh.",
    },
    mockup: {
      title: "Mô hình 3D sản phẩm",
      subtitle:
        "Xem trước thiết kế của bạn trên sản phẩm thật. Kéo để xoay, cuộn để phóng to.",
      resetView: "Đặt lại góc nhìn",
      hint: "Đây là bản xem trước gần đúng. Sản phẩm thực tế có thể khác đôi chút.",
      close: "Xong",
      viewMockup: "Xem mô hình 3D",
    },
    footer: {
      description:
        "Dịch vụ in ấn cao cấp biến tầm nhìn sáng tạo của bạn thành hiện thực. Chất liệu chất lượng, tay nghề chuyên nghiệp, giao đến tận cửa.",
      products: "Sản phẩm",
      company: "Công ty",
      support: "Hỗ trợ",
      legal: "Pháp lý",
      copyright: "2026 PrintBloom. Mọi quyền được bảo lưu.",
      productLinks: [
        "Danh thiếp",
        "Tờ rơi",
        "Băng rôn",
        "Nhãn dán",
        "Thiệp mời",
        "Bao bì",
      ],
      companyLinks: ["Về chúng tôi", "Tuyển dụng", "Blog", "Báo chí"],
      supportLinks: [
        "Trung tâm trợ giúp",
        "Liên hệ",
        "Thông tin vận chuyển",
        "Đổi trả",
      ],
      legalLinks: [
        "Chính sách bảo mật",
        "Điều khoản dịch vụ",
        "Chính sách cookie",
      ],
    },
  },
} as const;

export type Translations = (typeof translations)["en"];
