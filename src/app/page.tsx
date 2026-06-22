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
    products: ["BSRM 60G Deformed Bar (10mm)", "AKS TMT Bar (12mm)", "GPH Quantum Steel (16mm)"],
    unit: "Tons",
    minQty: 10,
    avgPrice: 94000 // BDT per Ton
  },
  Cement: {
    products: ["Shah Cement Special (OPC)", "Bashundhara Cement (PCC)", "Seven Rings Gold (OPC)"],
    unit: "Bags",
    minQty: 500,
    avgPrice: 530 // BDT per Bag
  },
  Textile: {
    products: ["100% Cotton Yarn (30/1 Carded)", "Polyester Single Jersey Fabric", "Cotton Canvas Heavy GSM"],
    unit: "Kgs",
    minQty: 1000,
    avgPrice: 420 // BDT per Kg
  },
  Agro: {
    products: ["Non-Basmati Rice (Miniket)", "Yellow Maize/Corn Feed Grade", "Premium Quality Soymeal"],
    unit: "Tons",
    minQty: 15,
    avgPrice: 62000 // BDT per Ton
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
  // Demo State
  const [currentView, setCurrentView] = useState<"client" | "admin">("client");
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

  // Form States
  const [selectedProduct, setSelectedProduct] = useState<string>(CATEGORIES.Steel.products[0]);
  const [rfqQty, setRfqQty] = useState<number>(CATEGORIES.Steel.minQty);
  const [targetPrice, setTargetPrice] = useState<number>(CATEGORIES.Steel.avgPrice - 2000);
  const [deliveryLocation, setDeliveryLocation] = useState<string>(DISTRICTS[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-07-01");
  const [notification, setNotification] = useState<string | null>(null);

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
    triggerAlert(`Request for Quote (${newId}) submitted successfully! Click "Admin Panel" toggle in the top-right to process it.`);
  };

  // Category switch helper
  const handleCategoryChange = (cat: keyof typeof CATEGORIES) => {
    setActiveCategory(cat);
    setSelectedProduct(CATEGORIES[cat].products[0]);
    setRfqQty(CATEGORIES[cat].minQty);
    setTargetPrice(CATEGORIES[cat].avgPrice - 2000);
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
    triggerAlert(`Quotation successfully sent to client for ${rfqId}! Switch back to "Client Portal" to view and accept it.`);
  };

  // Client Action: Accept Quote (Converts to Order)
  const handleAcceptQuote = (rfqId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    const quote = quotes[rfqId];
    if (!rfq || !quote) return;

    // Calculate total: (Qty * BasePrice) + Freight + 5% VAT
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
    triggerAlert(`Order ${newOrder.id} has been created! Our logistics team will dispatch the cargo soon.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Alert Notification */}
      {notification && (
        <div className="fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-bounce">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-xl p-4 shadow-2xl backdrop-blur-md flex items-start space-x-3">
            <div className="p-1 bg-indigo-600/20 rounded-lg text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-200 text-sm">System Update</h3>
              <p className="text-xs text-slate-400 mt-1">{notification}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-805 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-orange-500 flex items-center justify-center font-bold text-xl tracking-wider shadow-lg shadow-indigo-500/20 text-white">
              J
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide uppercase text-white">The J Platform</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-805 text-slate-400 rounded-md">B2B Core</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 hidden md:inline-block font-mono">Environment: Vercel Dev-Preview</span>
            
            {/* Perspective Switcher */}
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex space-x-1 shadow-inner">
              <button
                onClick={() => { setCurrentView("client"); setSelectedRfqForQuote(null); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  currentView === "client" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Client Portal
              </button>
              <button
                onClick={() => { setCurrentView("admin"); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentView === "admin" 
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/10" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Admin Panel</span>
                {rfqs.filter(r => r.status === "PENDING_QUOTE").length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === "client" ? (
          // CLIENT VIEW
          <div className="space-y-12">
            
            {/* Hero / Promo Section */}
            <div className="text-center py-6 max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400">
                Bulk Industrial Raw Materials, Optimized
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Aggregated procurement platform for SMEs. Enter your specification RFQ, receive real-time freight and commodity quotes, and lock down secure supply chains.
              </p>
            </div>

            {/* Core Workspace: Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: RFQ Submission Form */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
                
                <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Submit a Request for Quote (RFQ)</span>
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
                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRfqSubmit} className="space-y-4">
                  {/* Select Product */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Material</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    >
                      {CATEGORIES[activeCategory].products.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Quantity</label>
                      <span className="text-[10px] text-slate-500 italic">Min Order: {CATEGORIES[activeCategory].minQty} {CATEGORIES[activeCategory].unit}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min={CATEGORIES[activeCategory].minQty}
                        value={rfqQty}
                        onChange={(e) => setRfqQty(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                      />
                      <span className="absolute right-4 top-3 text-sm font-semibold text-slate-500">{CATEGORIES[activeCategory].unit}</span>
                    </div>
                  </div>

                  {/* Target Price */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Price (BDT per {CATEGORIES[activeCategory].unit.slice(0,-1)})</label>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Delivery Location / Yard</label>
                    <select
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    >
                      {DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  {/* Expected Delivery Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all text-sm mt-2"
                  >
                    Send RFQ to Operations
                  </button>
                </form>
              </div>

              {/* Right Column: Submitted RFQs & Active Quotes */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Active RFQs Dashboard */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Your Requests & Active Quotes</span>
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full font-mono">{rfqs.length} Total</span>
                  </h2>

                  <div className="space-y-4">
                    {rfqs.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                        No RFQs submitted yet. Use the form to submit one.
                      </div>
                    ) : (
                      rfqs.map((rfq) => {
                        const quote = quotes[rfq.id];
                        return (
                          <div 
                            key={rfq.id} 
                            className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center space-x-3">
                                <span className="text-xs font-mono font-bold text-indigo-400">{rfq.id}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-400 font-semibold">{rfq.category}</span>
                              </div>
                              <h3 className="font-bold text-slate-100 text-sm">{rfq.product}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                <span>Qty: <strong className="text-slate-200">{rfq.quantity} {rfq.unit}</strong></span>
                                <span>Yard: <strong className="text-slate-200">{rfq.deliveryLocation.split(" ")[0]}</strong></span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-850">
                              {/* Status Badges */}
                              {rfq.status === "PENDING_QUOTE" && (
                                <>
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-950/40 text-orange-400 border border-orange-800/40">
                                    Awaiting Admin Quote
                                  </span>
                                  <span className="text-[9px] text-slate-500 italic hidden sm:block">Check Admin panel to price this</span>
                                </>
                              )}
                              
                              {rfq.status === "QUOTED" && quote && (
                                <div className="space-y-2 w-full sm:w-auto text-right">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-950/40 text-blue-400 border border-blue-800/40">
                                    Quote Received
                                  </span>
                                  <div className="text-[11px] text-slate-300 font-semibold">
                                    Offered BDT: {quote.basePrice.toLocaleString()} / {rfq.unit.slice(0,-1)}
                                  </div>
                                  <button
                                    onClick={() => handleAcceptQuote(rfq.id)}
                                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-550 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg active:scale-95 transition-all shadow-md shadow-emerald-500/10"
                                  >
                                    Accept & Order
                                  </button>
                                </div>
                              )}

                              {rfq.status === "ORDER_CONFIRMED" && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                                  Order Confirmed
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Orders tracking dashboard */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Confirmed Orders ({orders.length})</span>
                  </h2>

                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-xs font-bold text-emerald-400 font-mono">{ord.id}</span>
                            <span className="text-[10px] font-mono text-slate-500">RFQ ref: {ord.rfqId}</span>
                          </div>
                          <h4 className="font-bold text-slate-200 text-sm">{ord.product}</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Qty: <strong className="text-slate-300">{ord.quantity} {ord.unit}</strong> | Final Value: <strong className="text-indigo-400">BDT {ord.totalAmount.toLocaleString()}</strong>
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-850">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-500 font-semibold">Delivery Transit</div>
                            <div className="text-xs text-slate-300">{ord.deliveryDays} Days Est.</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            ord.status === "SHIPPED"
                              ? "bg-indigo-950/40 text-indigo-400 border-indigo-800"
                              : ord.status === "DELIVERED"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800"
                              : "bg-slate-900 text-slate-400 border-slate-800"
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
        ) : (
          // ADMIN PANEL VIEW
          <div className="space-y-8 animate-fadeIn">
            
            <div className="py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                  <span>Operations Control Center</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">Review requests from SMEs, assign freight costs, issue bids, and dispatch shipments.</p>
              </div>
              <div className="flex space-x-2">
                <span className="text-xs bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 font-mono text-orange-400">
                  Role: Platform Administrator
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: RFQs to Process */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Incoming RFQs (Needing Quote)</span>
                </h3>

                <div className="space-y-4">
                  {rfqs.filter(r => r.status === "PENDING_QUOTE").length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                      No pending RFQs left. All requests have been quoted!
                    </div>
                  ) : (
                    rfqs.filter(r => r.status === "PENDING_QUOTE").map((rfq) => (
                      <div 
                        key={rfq.id}
                        className={`border rounded-xl p-4 transition-all cursor-pointer ${
                          selectedRfqForQuote?.id === rfq.id 
                            ? "bg-slate-950 border-orange-500 shadow-md shadow-orange-500/5" 
                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                        }`}
                        onClick={() => {
                          setSelectedRfqForQuote(rfq);
                          setAdminBasePrice(rfq.targetPrice + 500); // Admin suggestion
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-orange-400">{rfq.id}</span>
                          <span className="text-[10px] text-slate-400">{rfq.createdAt}</span>
                        </div>
                        <h4 className="font-bold text-slate-100 text-sm">{rfq.product}</h4>
                        <div className="grid grid-cols-2 gap-y-2 mt-3 text-xs text-slate-400">
                          <div>Quantity: <strong className="text-slate-200">{rfq.quantity} {rfq.unit}</strong></div>
                          <div>Target: <strong className="text-slate-200">BDT {rfq.targetPrice.toLocaleString()}</strong></div>
                          <div>Yard Location: <strong className="text-slate-200">{rfq.deliveryLocation}</strong></div>
                          <div>Requested Delivery: <strong className="text-slate-200">{rfq.deliveryDate}</strong></div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button 
                            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                            onClick={() => {
                              setSelectedRfqForQuote(rfq);
                              setAdminBasePrice(rfq.targetPrice + 500);
                            }}
                          >
                            Prepare Quotation
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Quote Submission Form (Conditional) or Order Log */}
              <div className="lg:col-span-5 space-y-6">
                
                {selectedRfqForQuote ? (
                  <div className="bg-slate-900 border border-orange-800/40 rounded-2xl p-6 shadow-xl relative animate-fadeIn">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>Quote Form: {selectedRfqForQuote.id}</span>
                    </h3>

                    <form onSubmit={handleAdminQuoteSubmit} className="space-y-4">
                      <div className="text-xs bg-slate-950 p-3 rounded-lg text-slate-400 space-y-1">
                        <p>Product: <strong className="text-slate-200">{selectedRfqForQuote.product}</strong></p>
                        <p>Quantity: <strong className="text-slate-200">{selectedRfqForQuote.quantity} {selectedRfqForQuote.unit}</strong></p>
                        <p>Target Bid BDT: <strong className="text-slate-200">{selectedRfqForQuote.targetPrice.toLocaleString()}</strong></p>
                      </div>

                      {/* Base Price per Unit */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Base Cost (BDT per {selectedRfqForQuote.unit.slice(0,-1)})</label>
                        <input 
                          type="number"
                          value={adminBasePrice}
                          onChange={(e) => setAdminBasePrice(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>

                      {/* Freight Cost */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Logistics / Freight (BDT)</label>
                        <input 
                          type="number"
                          value={adminFreight}
                          onChange={(e) => setAdminFreight(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>

                      {/* Delivery Days */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estimated Delivery Transit (Days)</label>
                        <input 
                          type="number"
                          value={adminDeliveryDays}
                          onChange={(e) => setAdminDeliveryDays(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>

                      {/* VAT percentage Info */}
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>VAT (Government Standard)</span>
                        <span>5%</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRfqForQuote(null)}
                          className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 font-semibold py-3 px-4 rounded-xl text-xs transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-orange-500/10 transition"
                        >
                          Send Quotation
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md text-center py-16 text-slate-500 text-sm">
                    Select a pending RFQ on the left to review it and generate a price quotation.
                  </div>
                )}

                {/* Admin Order Dispatch Tracker */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4">Operations Fulfillment</h3>
                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No active client orders found.</p>
                    ) : (
                      orders.map(ord => (
                        <div key={ord.id} className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-200">{ord.id}</span>
                            <span className="text-orange-400 font-semibold">{ord.status}</span>
                          </div>
                          <p className="text-slate-400">{ord.product} - {ord.quantity} {ord.unit}</p>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                            {ord.status === "PROCESSING" && (
                              <button
                                onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: "SHIPPED" } : o))}
                                className="bg-slate-800 hover:bg-indigo-900 border border-slate-700 text-slate-300 py-1 px-2.5 rounded font-semibold text-[10px]"
                              >
                                Mark Dispatched
                              </button>
                            )}
                            {ord.status === "SHIPPED" && (
                              <button
                                onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: "DELIVERED" } : o))}
                                className="bg-slate-800 hover:bg-emerald-950 border border-slate-700 text-emerald-400 py-1 px-2.5 rounded font-semibold text-[10px]"
                              >
                                Confirm Delivery
                              </button>
                            )}
                            {ord.status === "DELIVERED" && (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Cargo Delivered
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
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="max-w-md mx-auto leading-relaxed">
          &copy; 2026 The J Platform. Structured B2B marketplace and operations control software. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
