"use client";

import React, { useState } from "react";

// Types for the Interactive Demo
interface RFQ {
  id: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  deliveryLocation: string;
  deliveryDate: string;
  status: "PENDING_QUOTE" | "QUOTED" | "ORDER_CONFIRMED";
  createdAt: string;
}

interface Quote {
  rfqId: string;
  basePrice: number; // per unit
  freightCost: number;
  vatRate: number; // percentage
  deliveryDays: number;
  validUntil: string;
}

interface Order {
  id: string;
  rfqId: string;
  product: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED";
  deliveryDays: number;
  createdAt: string;
}

const CATEGORIES = {
  Steel: {
    products: [
      { name: "BSRM 60G Deformed Bar (10mm)", specs: "High-strength TMT reinforcement bar", price: 94000 },
      { name: "AKS TMT Bar (12mm)", specs: "Thermo-mechanically treated bar", price: 93000 },
      { name: "GPH Quantum Steel (16mm)", specs: "State-of-the-art structure steel", price: 95500 }
    ],
    unit: "Tons",
    minQty: 10,
  },
  Cement: {
    products: [
      { name: "Shah Cement Special (OPC)", specs: "Ordinary Portland Cement for heavy structures", price: 530 },
      { name: "Bashundhara Cement (PCC)", specs: "Portland Composite Cement for general masonry", price: 510 },
      { name: "Seven Rings Gold (OPC)", specs: "Premium grade high early strength cement", price: 545 }
    ],
    unit: "Bags",
    minQty: 500,
  },
  Textile: {
    products: [
      { name: "100% Cotton Yarn (30/1 Carded)", specs: "Ring-spun knitting yarn for RMG", price: 420 },
      { name: "Polyester Single Jersey Fabric", specs: "Dyed knit fabric (160 GSM)", price: 380 },
      { name: "Cotton Canvas Heavy GSM", specs: "Durable woven canvas fabric", price: 650 }
    ],
    unit: "Kgs",
    minQty: 1000,
  },
  Agro: {
    products: [
      { name: "Non-Basmati Rice (Miniket)", specs: "Auto-milled polished parboiled rice", price: 62000 },
      { name: "Yellow Maize/Corn Feed Grade", specs: "High energy animal feed grain", price: 32000 },
      { name: "Premium Quality Soymeal", specs: "High protein solvent-extracted meal", price: 68000 }
    ],
    unit: "Tons",
    minQty: 15,
  }
};

const DISTRICTS = [
  "Dhaka (Tongi/Gazipur)",
  "Chittagong (Halishahar/Patenga)",
  "Narayanganj (Siddhirganj)",
  "Comilla (EPZ)",
  "Sylhet (Mahanagar)",
  "Bogura (Industrial Area)",
  "Jessore (Kotwali)"
];

export default function Home() {
  // Demo State: default is "guest"
  const [currentView, setCurrentView] = useState<"guest" | "client" | "admin">("guest");
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>("Steel");
  
  // Database Mock State
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: "RFQ-7291",
      product: "BSRM 60G Deformed Bar (10mm)",
      category: "Steel",
      quantity: 25,
      unit: "Tons",
      targetPrice: 92000,
      deliveryLocation: "Dhaka (Tongi/Gazipur)",
      deliveryDate: "2026-07-05",
      status: "QUOTED",
      createdAt: "2026-06-22"
    },
    {
      id: "RFQ-5014",
      product: "Bashundhara Cement (PCC)",
      category: "Cement",
      quantity: 1200,
      unit: "Bags",
      targetPrice: 510,
      deliveryLocation: "Chittagong (Halishahar/Patenga)",
      deliveryDate: "2026-07-10",
      status: "PENDING_QUOTE",
      createdAt: "2026-06-22"
    }
  ]);

  const [quotes, setQuotes] = useState<Record<string, Quote>>({
    "RFQ-7291": {
      rfqId: "RFQ-7291",
      basePrice: 93500,
      freightCost: 18000,
      vatRate: 5,
      deliveryDays: 4,
      validUntil: "2026-06-24T18:00:00"
    }
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-9912",
      rfqId: "RFQ-1102",
      product: "Seven Rings Gold (OPC)",
      quantity: 800,
      unit: "Bags",
      totalAmount: 432600,
      status: "SHIPPED",
      deliveryDays: 3,
      createdAt: "2026-06-21"
    }
  ]);

  // Form States (Client Portal)
  const [selectedProduct, setSelectedProduct] = useState<string>(CATEGORIES.Steel.products[0].name);
  const [rfqQty, setRfqQty] = useState<number>(CATEGORIES.Steel.minQty);
  const [targetPrice, setTargetPrice] = useState<number>(CATEGORIES.Steel.products[0].price - 2000);
  const [deliveryLocation, setDeliveryLocation] = useState<string>(DISTRICTS[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-07-01");
  const [notification, setNotification] = useState<string | null>(null);

  // Auth Dialog state for Guest View
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Admin Quotation Form States
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState<RFQ | null>(null);
  const [adminBasePrice, setAdminBasePrice] = useState<number>(0);
  const [adminFreight, setAdminFreight] = useState<number>(12000);
  const [adminDeliveryDays, setAdminDeliveryDays] = useState<number>(3);

  // Helper: Trigger notification banner
  const triggerAlert = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Client Action: Submit RFQ
  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `RFQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: RFQ = {
      id: newId,
      product: selectedProduct,
      category: activeCategory,
      quantity: rfqQty,
      unit: CATEGORIES[activeCategory].unit,
      targetPrice: targetPrice,
      deliveryLocation: deliveryLocation,
      deliveryDate: deliveryDate,
      status: "PENDING_QUOTE",
      createdAt: new Date().toISOString().split("T")[0]
    };
    setRfqs([newRfq, ...rfqs]);
    triggerAlert(`Request for Quote (${newId}) submitted successfully! Switch to "Admin Panel" to set pricing.`);
  };

  // Category switch helper
  const handleCategoryChange = (cat: keyof typeof CATEGORIES) => {
    setActiveCategory(cat);
    setSelectedProduct(CATEGORIES[cat].products[0].name);
    setRfqQty(CATEGORIES[cat].minQty);
    setTargetPrice(CATEGORIES[cat].products[0].price - 2000);
  };

  // Admin Action: Submit Quote
  const handleAdminQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfqForQuote) return;

    const rfqId = selectedRfqForQuote.id;
    const newQuote: Quote = {
      rfqId,
      basePrice: adminBasePrice,
      freightCost: adminFreight,
      vatRate: 5,
      deliveryDays: adminDeliveryDays,
      validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };

    setQuotes({ ...quotes, [rfqId]: newQuote });
    setRfqs(rfqs.map(r => r.id === rfqId ? { ...r, status: "QUOTED" } : r));
    setSelectedRfqForQuote(null);
    triggerAlert(`Quotation sent to client for ${rfqId}! Switch back to "Client Portal" to approve and order.`);
  };

  // Client Action: Accept Quote (Converts to Order)
  const handleAcceptQuote = (rfqId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    const quote = quotes[rfqId];
    if (!rfq || !quote) return;

    const subtotal = rfq.quantity * quote.basePrice;
    const total = (subtotal + quote.freightCost) * (1 + quote.vatRate / 100);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      rfqId: rfqId,
      product: rfq.product,
      quantity: rfq.quantity,
      unit: rfq.unit,
      totalAmount: Math.round(total),
      status: "PROCESSING",
      deliveryDays: quote.deliveryDays,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setOrders([newOrder, ...orders]);
    setRfqs(rfqs.map(r => r.id === rfqId ? { ...r, status: "ORDER_CONFIRMED" } : r));
    triggerAlert(`Order ${newOrder.id} confirmed! Operations team will coordinate delivery.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-655/20 selection:text-indigo-900">
      
      {/* Alert Notification */}
      {notification && (
        <div className="fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-fade-in-down">
          <div className="bg-white border-l-4 border-indigo-600 rounded-xl p-4 shadow-xl flex items-start space-x-3">
            <div className="p-1 bg-indigo-50 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-xs">Platform Message</h3>
              <p className="text-xs text-slate-600 mt-1">{notification}</p>
            </div>
          </div>
        </div>
      )}

      {/* Guest Sign-In Dialog */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-scale-up">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
                J
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sign In to Request Quote</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Access wholesale bulk rates, custom logistics, and digital invoicing. Link your business profile to verify trade documents.
              </p>
              
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setCurrentView("client");
                    setShowAuthModal(false);
                    triggerAlert("Successfully signed in as guest buyer!");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition"
                >
                  Log In / Continue as Demo Client
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
                >
                  Back to Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl tracking-wider shadow-md text-white">
              J
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide uppercase text-slate-900">The J Platform</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">B2B Core</span>
            </div>
          </div>

          {/* 3-Way Toggle Switcher */}
          <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-xl flex space-x-1 shadow-inner">
            <button
              onClick={() => { setCurrentView("guest"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === "guest" 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Guest View
            </button>
            <button
              onClick={() => { setCurrentView("client"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === "client" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Client Dashboard
            </button>
            <button
              onClick={() => { setCurrentView("admin"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentView === "admin" 
                  ? "bg-orange-600 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Admin Panel</span>
              {rfqs.filter(r => r.status === "PENDING_QUOTE").length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === "guest" && (
          // GUEST VIEW (Non-functional e-commerce style catalog)
          <div className="space-y-12">
            
            {/* Guest Hero Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
              
              <div className="max-w-xl space-y-5 relative z-10 text-center md:text-left">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  Industrial B2B Marketplace
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Direct Sourcing for Steel, Cement, Textile & Agro raw materials
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Join hundreds of factories and SMEs saving on raw materials. Submit RFQs online, get immediate freight calculation, and leverage verified logistics.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center md:justify-start">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl text-xs transition shadow-md shadow-indigo-600/10"
                  >
                    Register Business Profile
                  </button>
                  <a
                    href="#catalog"
                    className="w-full sm:w-auto text-center border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl text-xs transition"
                  >
                    Browse Directory
                  </a>
                </div>
              </div>

              {/* Minimalist Graphic Widget */}
              <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-2xl p-6 relative z-10 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-800">Todays Market Index</span>
                  <span className="text-[10px] text-green-600 font-bold flex items-center">
                    <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +1.4%
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Deformed Bar (Steel/Ton)</span>
                    <span className="font-bold text-slate-800">BDT 94,000</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">OPC Cement (Bag)</span>
                    <span className="font-bold text-slate-800">BDT 530</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Cotton Carded Yarn (Kg)</span>
                    <span className="font-bold text-slate-800">BDT 420</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Section */}
            <div id="catalog" className="space-y-6 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Primary Product Directory</h2>
                  <p className="text-xs text-slate-500 mt-1">Select a category to view specifications and minimum order levels.</p>
                </div>
                
                {/* Category selectors */}
                <div className="bg-slate-100 p-1.5 border border-slate-200 rounded-xl flex overflow-x-auto space-x-1">
                  {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                        activeCategory === cat
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CATEGORIES[activeCategory].products.map((prod, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {activeCategory}
                        </span>
                        <span className="text-[10px] text-slate-500 italic">
                          MOQ: {CATEGORIES[activeCategory].minQty} {CATEGORIES[activeCategory].unit}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{prod.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{prod.specs}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Indicative Price</span>
                        <strong className="text-sm font-extrabold text-slate-800">
                          BDT {prod.price.toLocaleString()}
                        </strong>
                        <span className="text-[10px] text-slate-500"> / {CATEGORIES[activeCategory].unit.slice(0, -1)}</span>
                      </div>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 px-4 rounded-xl transition"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Inquiry CTA Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Need a specific commodity outside this list?</h3>
                <p className="text-xs text-slate-400">Our logistics networks cover bulk procurement for construction, chemical processing, and RMG sectors.</p>
              </div>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs transition"
              >
                Inquire Special Order
              </button>
            </div>

          </div>
        )}

        {currentView === "client" && (
          // CLIENT PORTAL VIEW (Interactive RFQ/Order flow)
          <div className="space-y-8 animate-fade-in">
            
            {/* Top overview stats */}
            <div className="py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <span>Client Procurement Dashboard</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">Logged in as: **Demo SME Enterprise** (Trade ID: #TRD-88210)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: RFQ Form */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Submit B2B RFQ</span>
                </h2>

                {/* Category Selection Tabs */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`py-2 px-1 text-center rounded-lg font-semibold text-xs border transition-all ${
                        activeCategory === cat
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRfqSubmit} className="space-y-4">
                  {/* Select Product */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Select Material</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                    >
                      {CATEGORIES[activeCategory].products.map((p) => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Required Quantity</label>
                      <span className="text-[10px] text-slate-450 italic">Min Order: {CATEGORIES[activeCategory].minQty} {CATEGORIES[activeCategory].unit}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min={CATEGORIES[activeCategory].minQty}
                        value={rfqQty}
                        onChange={(e) => setRfqQty(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                      />
                      <span className="absolute right-4 top-3 text-sm font-semibold text-slate-450">{CATEGORIES[activeCategory].unit}</span>
                    </div>
                  </div>

                  {/* Target Price */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Target Price (BDT per {CATEGORIES[activeCategory].unit.slice(0,-1)})</label>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Delivery Yard</label>
                    <select
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                    >
                      {DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  {/* Expected Delivery Date */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition text-xs mt-2"
                  >
                    Submit B2B RFQ
                  </button>
                </form>
              </div>

              {/* Right Column: Quotes & Orders */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Active RFQs list */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Active RFQs</span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-650 rounded-full font-mono">{rfqs.length} Total</span>
                  </h2>

                  <div className="space-y-4">
                    {rfqs.map((rfq) => {
                      const quote = quotes[rfq.id];
                      return (
                        <div 
                          key={rfq.id} 
                          className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-300 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono font-bold text-indigo-600">{rfq.id}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">{rfq.category}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-xs">{rfq.product}</h3>
                            <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-500">
                              <span>Qty: <strong className="text-slate-700">{rfq.quantity} {rfq.unit}</strong></span>
                              <span>Yard: <strong className="text-slate-700">{rfq.deliveryLocation.split(" ")[0]}</strong></span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-start sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                            {rfq.status === "PENDING_QUOTE" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Awaiting Quote
                              </span>
                            )}
                            
                            {rfq.status === "QUOTED" && quote && (
                              <div className="space-y-2 w-full sm:w-auto text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Quote Ready
                                </span>
                                <div className="text-[11px] text-slate-700 font-bold">
                                  BDT {quote.basePrice.toLocaleString()} / {rfq.unit.slice(0,-1)}
                                </div>
                                <button
                                  onClick={() => handleAcceptQuote(rfq.id)}
                                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition"
                                >
                                  Accept & Place Order
                                </button>
                              </div>
                            )}

                            {rfq.status === "ORDER_CONFIRMED" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Ordered
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Confirmed orders */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Confirmed Orders ({orders.length})</span>
                  </h2>

                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-bold text-emerald-700 font-mono">{ord.id}</span>
                            <span className="text-[10px] font-mono text-slate-400">Ref: {ord.rfqId}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-xs">{ord.product}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Qty: <strong className="text-slate-700">{ord.quantity} {ord.unit}</strong> | Value: <strong className="text-indigo-650">BDT {ord.totalAmount.toLocaleString()}</strong>
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                          <div className="text-right text-xs">
                            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Delivery Est</span>
                            <span className="text-slate-700 font-medium">{ord.deliveryDays} Days</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            ord.status === "SHIPPED"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : ord.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {currentView === "admin" && (
          // ADMIN VIEW (Calculations and calculations update)
          <div className="space-y-8 animate-fade-in">
            
            <div className="py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                  <span>Operations Control Center</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">Role: **Platform Administrator** (Ops Hub ID: #OPS-990)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: RFQs to Process */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-655" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>RFQs Awaiting Pricing</span>
                </h3>

                <div className="space-y-4">
                  {rfqs.filter(r => r.status === "PENDING_QUOTE").length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                      All submitted RFQs have been quoted. Ready for new client requests!
                    </div>
                  ) : (
                    rfqs.filter(r => r.status === "PENDING_QUOTE").map((rfq) => (
                      <div 
                        key={rfq.id}
                        className={`border rounded-xl p-4 cursor-pointer transition ${
                          selectedRfqForQuote?.id === rfq.id 
                            ? "bg-slate-55 border-orange-500" 
                            : "bg-slate-50 border-slate-200 hover:border-slate-350"
                        }`}
                        onClick={() => {
                          setSelectedRfqForQuote(rfq);
                          const matchedProduct = Object.values(CATEGORIES)
                            .flatMap(c => c.products)
                            .find(p => p.name === rfq.product);
                          setAdminBasePrice(matchedProduct ? matchedProduct.price + 500 : rfq.targetPrice + 1000);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-orange-600">{rfq.id}</span>
                          <span className="text-[10px] text-slate-400">{rfq.createdAt}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs">{rfq.product}</h4>
                        
                        <div className="grid grid-cols-2 gap-y-1.5 mt-3 text-xs text-slate-500">
                          <div>Quantity: <strong className="text-slate-700">{rfq.quantity} {rfq.unit}</strong></div>
                          <div>Target BDT: <strong className="text-slate-700">{rfq.targetPrice.toLocaleString()}</strong></div>
                          <div>Yard Location: <strong className="text-slate-700">{rfq.deliveryLocation}</strong></div>
                          <div>Date Requested: <strong className="text-slate-700">{rfq.deliveryDate}</strong></div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                          <span className="bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition">
                            Open Quote Configurator
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Quote Calculation Form or Dispatch Control */}
              <div className="lg:col-span-5 space-y-6">
                
                {selectedRfqForQuote ? (
                  <div className="bg-white border-2 border-orange-500 rounded-2xl p-6 shadow-md relative animate-fade-in">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>Quote Form: {selectedRfqForQuote.id}</span>
                    </h3>

                    <form onSubmit={handleAdminQuoteSubmit} className="space-y-4">
                      <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-500 space-y-1">
                        <p>Product: <strong className="text-slate-700">{selectedRfqForQuote.product}</strong></p>
                        <p>Quantity: <strong className="text-slate-700">{selectedRfqForQuote.quantity} {selectedRfqForQuote.unit}</strong></p>
                        <p>Target Price: <strong className="text-slate-700">BDT {selectedRfqForQuote.targetPrice.toLocaleString()}</strong></p>
                      </div>

                      {/* Base Price per Unit */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Base unit price (BDT)</label>
                        <input 
                          type="number"
                          value={adminBasePrice}
                          onChange={(e) => setAdminBasePrice(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>

                      {/* Freight Cost */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Logistics / Freight BDT (Total)</label>
                        <input 
                          type="number"
                          value={adminFreight}
                          onChange={(e) => setAdminFreight(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>

                      {/* Delivery Days */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fulfillment duration (Days)</label>
                        <input 
                          type="number"
                          value={adminDeliveryDays}
                          onChange={(e) => setAdminDeliveryDays(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-450 pt-2">
                        <span>VAT Rate (Govt standard)</span>
                        <span>5%</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRfqForQuote(null)}
                          className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl text-xs transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md shadow-orange-600/10"
                        >
                          Issue Quotation
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center py-12 text-slate-400 text-xs">
                    Select a pending RFQ on the left to activate calculations.
                  </div>
                )}

                {/* Operations logistics coordinator */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Operations Fulfillment</h3>
                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No active shipments in transit.</p>
                    ) : (
                      orders.map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-800">{ord.id}</span>
                            <span className="text-indigo-600 font-semibold uppercase">{ord.status}</span>
                          </div>
                          <p className="text-slate-550">{ord.product} - {ord.quantity} {ord.unit}</p>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                            {ord.status === "PROCESSING" && (
                              <button
                                onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: "SHIPPED" } : o))}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-1 px-2.5 rounded font-semibold text-[10px] transition"
                              >
                                Dispatch Cargo
                              </button>
                            )}
                            {ord.status === "SHIPPED" && (
                              <button
                                onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: "DELIVERED" } : o))}
                                className="bg-indigo-600 hover:bg-indigo-755 text-white py-1 px-2.5 rounded font-semibold text-[10px] transition shadow-sm"
                              >
                                Confirm Delivery
                              </button>
                            )}
                            {ord.status === "DELIVERED" && (
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Delivered & Closed
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p className="max-w-md mx-auto leading-relaxed">
          &copy; 2026 The J Platform. B2B Raw Materials and Commodity Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
