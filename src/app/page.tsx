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
      { name: "বিএসআরএম ৬০জি ডিফর্মড বার (১০মিমি)", specs: "ভারী ফাউন্ডেশনের জন্য উচ্চ-শক্তির টিএমটি রিইনফোর্সমেন্ট রড", price: 94000, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=60" },
      { name: "একেএস টিএমটি বার (১২মিমি)", specs: "উнят বন্ডিং ক্ষমতাসম্পন্ন থার্মো-মেকানিক্যালি ট্রিটেড রড", price: 93000, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=60" },
      { name: "জিপিএইচ কোয়ান্টাম স্টিল (১৬মিমি)", specs: "উচ্চ নমনীয়তা বিশিষ্ট অত্যাধুনিক স্ট্রাকচারাল রড", price: 95500, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60" },
      { name: "কেএসআরএম টিএমটি বার (২০মিমি)", specs: "উঁচু ভবনের দীর্ঘস্থায়ী কাঠামোর জন্য প্রিমিয়াম রড", price: 92500, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&auto=format&fit=crop&q=60" },
      { name: "আনোয়ার গ্যালভানাইজড জিআই পাইপ (২ ইঞ্চি)", specs: "মরিচারোধী হট-ডিপড গ্যালভানাইজড ইউটিলিটি পাইপ", price: 115000, image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=60" },
      { name: "এমএস অ্যাঙ্গেল বার (৫০মিমি x ৫০মিমি)", specs: "ট্রাস ও ফ্রেম তৈরির জন্য মাইল্ড স্টিল অ্যাঙ্গেল", price: 88000, image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=400&auto=format&fit=crop&q=60" },
      { name: "এমএস ফ্ল্যাট বার (২৫মিমি x ৫মিমি)", specs: "শিল্প গ্রেডের গ্রাটিংস তৈরির জন্য এমএস ফ্ল্যাট বার", price: 89000, image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=60" },
      { name: "কোল্ড রোল্ড শিট কয়েল (১.২মিমি)", specs: "অটো ও হোম অ্যাপ্লায়েন্সের জন্য উন্নত ফিনিশের শিট", price: 120000, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&auto=format&fit=crop&q=60" },
      { name: "হট রোল্ড শিট কয়েল (৩.০মিমি)", specs: "শিল্প কাঠামোর উপযোগী হট রোল্ড শিট কয়েল", price: 105000, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&auto=format&fit=crop&q=60" },
      { name: "গ্যালভানাইজড ঢেউখেলানো টিন (০.৩৬মিমি)", specs: "কারখানার শেডের উপযোগী প্রিমিয়াম দস্তা প্রলেপযুক্ত টিন", price: 130000, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60" },
      { name: "এইচ-বিম স্ট্রাকচারাল স্টিল (১৫০x১৫০)", specs: "ভারী সিভিল ইঞ্জিনিয়ারিং কাঠামোর জন্য এইচ-সেকশন স্টিল", price: 98000, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "আই-বিম স্ট্রাকচারাল স্টিল (২০০x১০০)", specs: "সেতু ও ক্রেন রানওয়ের জন্য স্ট্যান্ডার্ড আই-সেকশন", price: 97500, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=60" },
      { name: "এমএস স্কয়ার পাইপ (৫০মিমি x ৫০মিমি)", specs: "কাঠামো নির্মাণের জন্য ফাঁপা স্কয়ার মেটাল টিউবিং", price: 92000, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=60" },
      { name: "এমএস রাউন্ড চ্যানেল (১০০মিমি)", specs: "ভারী যন্ত্রপাতির সাপোর্টের জন্য সি-চ্যানেল স্টিল", price: 91000, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=60" },
      { name: "হাই টেনসিল পিসি ওয়্যার (৫মিমি)", specs: "বৈদ্যুতিক খুঁটি ও প্রিকাস্ট কাজের জন্য উচ্চ ক্ষমতার তার", price: 118000, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Tons",
    minQty: 10,
  },
  Cement: {
    products: [
      { name: "শাহ সিমেন্ট স্পেশাল (OPC)", specs: "ভারী ঢালাই এবং কলামের জন্য অর্ডিনারি পোর্টল্যান্ড সিমেন্ট", price: 530, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=60" },
      { name: "বসুন্ধরা সিমেন্ট (PCC)", specs: "সাধারণ গাঁথুনি এবং প্লাস্টারিংয়ের জন্য পোর্টল্যান্ড কম্পোজিট সিমেন্ট", price: 510, image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&auto=format&fit=crop&q=60" },
      { name: "সেভেন রিংস গোল্ড (OPC)", specs: "দ্রুত কাজের উপযোগী প্রিমিয়াম গ্রেড হাই-আর্লি স্ট্রেন্থ সিমেন্ট", price: 545, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&auto=format&fit=crop&q=60" },
      { name: "ফ্রেশ সিমেন্ট প্রিমিয়াম (PCC)", specs: "ফ্লাই-অ্যাশ ফর্মুলায় তৈরি দীর্ঘস্থায়ী কম্পোজিট সিমেন্ট", price: 505, image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop&q=60" },
      { name: "লাফার্জ হোলসিম স্ট্রং স্ট্রাকচার (PCC)", specs: "ড্যাম্প-লক শিল্ড প্রযুক্তিসম্পন্ন শক্তিশালী সিমেন্ট", price: 515, image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=400&auto=format&fit=crop&q=60" },
      { name: "প্রিমিয়ার সিমেন্ট স্পেশাল (OPC)", specs: "সেতু ও ফ্লাইওভারের জন্য উচ্চ কার্যক্ষমতাসম্পন্ন সিমেন্ট", price: 525, image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=60" },
      { name: "ক্রাউন সিমেন্ট কনক্রিট (PCC)", specs: "কম হাইড্রেশন তাপ উৎপন্নকারী টেকসই কম্পোজিট সিমেন্ট", price: 500, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&auto=format&fit=crop&q=60" },
      { name: "আকিজ সিমেন্ট স্ট্রং (OPC)", specs: "ভারী সিভিল ফাউন্ডেশনের জন্য প্রিমিয়াম খাঁটি ক্লিঙ্কার সিমেন্ট", price: 535, image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=400&auto=format&fit=crop&q=60" },
      { name: "হাইডেলবার্গ স্ক্যান সিমেন্ট (PCC)", specs: "ছাদ ঢালাইয়ের জন্য নির্ভরযোগ্য স্ট্রাকচারাল কম্পোজিট সিমেন্ট", price: 520, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&auto=format&fit=crop&q=60" },
      { name: "এমআই সিমেন্ট সুপার (PCC)", specs: "উচ্চ শক্তির ব্লক ও সাধারণ কাঠামোর জন্য স্ট্যান্ডার্ড সিমেন্ট", price: 510, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&auto=format&fit=crop&q=60" },
      { name: "ডায়মন্ড সিমেন্ট (PCC)", specs: "আঞ্চলিক দীর্ঘস্থায়ী কাঠামোর জন্য সাধারণ কম্পোজিট সিমেন্ট", price: 495, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60" },
      { name: "কনফিডেন্স সিমেন্ট (OPC)", specs: "প্রিকাস্ট গার্ডার ও কলামের জন্য দ্রুত শক্ত হওয়া সিমেন্ট", price: 540, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "আনোয়ার সিমেন্ট স্পেশাল (PCC)", specs: "দীর্ঘস্থায়িত্বের জন্য উন্নত সিলিকা কণা সমৃদ্ধ সিমেন্ট", price: 505, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=60" },
      { name: "সেনা সিমেন্ট প্রিমিয়াম (PCC)", specs: "উপকূলীয় অঞ্চলের লোনা পানি প্রতিরোধী শক্তিশালী সিমেন্ট", price: 500, image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=60" },
      { name: "মংলা সিমেন্ট (PCC)", specs: "সাশ্রয়ী প্লাস্টারিং ও সাধারণ ইটের গাঁথুনির কম্পোজিট সিমেন্ট", price: 490, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Bags",
    minQty: 500,
  },
  Textile: {
    products: [
      { name: "১০০% কটন সুতা (৩০/১ কার্ডেড)", specs: "রপ্তানিযোগ্য নিট পোশাকের জন্য উপযোগী কার্ডেড সুতা", price: 420, image: "https://images.unsplash.com/photo-1594913785162-e6785368a735?w=400&auto=format&fit=crop&q=60" },
      { name: "পলিয়েস্টার সিঙ্গেল জার্সি ফ্যাব্রিক", specs: "অ্যাক্টিভওয়্যারের জন্য ডাইড নিট সিঙ্গেল জার্সি ফ্যাব্রিক (১৬০ GSM)", price: 380, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&auto=format&fit=crop&q=60" },
      { name: "কটন ক্যানভাস হেভি GSM", specs: "ব্যাগ ও কাজের পোশাক তৈরির উপযোগী টেকসই ক্যানভাস ফ্যাব্রিক", price: 650, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=60" },
      { name: "টিসি ফ্লিস ফ্যাব্রিক (ব্রাশড ব্যাক)", specs: "কোয়েটশার্ট ও হুডির জন্য সুতি-পলিয়েস্টার ব্লেন্ড ফ্যাব্রিক", price: 480, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&auto=format&fit=crop&q=60" },
      { name: "কটন রিব ফ্যাব্রিক (২x২ লাইক্রা)", specs: "পোশাকের কাফ ও কলারের জন্য স্প্যানডেক্স-ব্লেন্ডেড ফ্যাব্রিক", price: 520, image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&auto=format&fit=crop&q=60" },
      { name: "কটন পিক ফ্যাব্রিক (ল্যাকোস্ট)", specs: "ক্লাসিক পিক নিট ফ্যাব্রিক দিয়ে তৈরি পোলো শার্টের কাপর", price: 490, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&auto=format&fit=crop&q=60" },
      { name: "১০০% পলিয়েস্টার ইন্টারলক ফ্যাব্রিক", specs: "সাবলিমেশন প্রিন্ট ও স্পোর্টসওয়্যারের জন্য ফাইন গেজ ফ্যাব্রিক", price: 340, image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400&auto=format&fit=crop&q=60" },
      { name: "কটন টুইল ফ্যাব্রিক (১০ আউন্স)", specs: "প্যান্ট ও জ্যাকেট তৈরির উপযোগী কোনাকুনি বুননের সুতি কাপড়", price: 580, image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=400&auto=format&fit=crop&q=60" },
      { name: "ডেনিম ফ্যাব্রিক (১২ আউন্স ইন্ডিগো)", specs: "জিন্স তৈরির জন্য ক্লাসিক ইন্ডিগো ডাইড কটন ডেনিম", price: 720, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=60" },
      { name: "ভিসকোস স্প্যানডেক্স সিঙ্গেল জার্সি", specs: "নমনীয়তা ও ভালো ফিটিংসের জন্য স্প্যানডেক্স-মিশ্রিত ভিসকোস ফ্যাব্রিক", price: 560, image: "https://images.unsplash.com/photo-1524295988897-b13b53a309a6?w=400&auto=format&fit=crop&q=60" },
      { name: "নাইলন ট্যাফেটা ফ্যাব্রিক", specs: "উইন্ডব্রেকার ও জ্যাকেটের ভেতরের লাইনিংয়ের ওয়াটারপ্রুফ ফ্যাব্রিক", price: 290, image: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=400&auto=format&fit=crop&q=60" },
      { name: "মেলাঞ্জ কটন সুতা (৩২/১ নিট)", specs: "ফ্যাশনেবল নিটওয়্যারের জন্য ডুয়াল-টোন ব্লেন্ডেড কটন সুতা", price: 460, image: "https://images.unsplash.com/photo-1584992236310-6edddc085354?w=400&auto=format&fit=crop&q=60" },
      { name: "অ্যাক্রিলিক সোয়েটার সুতা (২/২৮ এনএম)", specs: "সোয়েটার তৈরির উপযোগী উলের বিকল্প সিন্থেটিক সুতা", price: 390, image: "https://images.unsplash.com/photo-1575844269151-a99a59968aa2?w=400&auto=format&fit=crop&q=60" },
      { name: "সেলাই সুতা কোন (৪০/২)", specs: "গার্মেন্টস কারখানায় উচ্চ-গতির সেলাইয়ের উপযোগী পলিয়েস্টার সুতা", price: 85, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=60" },
      { name: "পলিয়েস্টার বোতাম (বাল্ক)", specs: "পোশাকের জন্য স্ট্যান্ডার্ড ৪-হোল বিশিষ্ট বোতামের বাল্ক বক্স", price: 45, image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Kgs",
    minQty: 1000,
  },
  Agro: {
    products: [
      { name: "নন-বাসমতি চাল (মিনিকেট)", specs: "পাইকারি ও খুচরা বিক্রির জন্য ডাবল পলিশড প্রিমিয়াম চাল", price: 62000, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=60" },
      { name: "ইয়েলো মেজ/ভুট্টা ফিড গ্রেড", specs: "কম আর্দ্রতা সম্পন্ন পশুখাদ্য তৈরির ভুট্টার দানা", price: 32000, image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=400&auto=format&fit=crop&q=60" },
      { name: "প্রিমিয়াম কোয়ালিটি সয়ামিল", specs: "পোল্ট্রি ও ফিশ ফিডের জন্য উচ্চ প্রোটিন সমৃদ্ধ সয়াবিন খৈল", price: 68000, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&auto=format&fit=crop&q=60" },
      { name: "সরিষার খৈল", specs: "গবাদি পশুর সুষম পুষ্টির জন্য তেল নিষ্কাশিত প্রিমিয়াম খৈল", price: 42000, image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&auto=format&fit=crop&q=60" },
      { name: "গম ময়দা (আটা) বাল্ক", specs: "বাণিজ্যিক বেকারি ও ময়দা কলের জন্য উন্নত মানের আটা", price: 48000, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60" },
      { name: "সুজি বাল্ক", specs: "খাদ্য প্রক্রিয়াকরণ কারখানার জন্য হাই-গ্লুটেন গমের সুজি", price: 52000, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=60" },
      { name: "রাইস ব্র্যান অয়েল (ক্রুড)", specs: "ভোজ্যতেল রিফাইনারি কারখানার অপরিশোধিত তেল", price: 145000, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=60" },
      { name: "মসুর ডাল", specs: "আমদানি করা উন্নত মানের পলিশড লাল মসুর ডাল", price: 110000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=60" },
      { name: "ছোলা বুট বাল্ক", specs: "পাইকারি বাজারে বিতরণের জন্য শুকনো আস্ত কাঁচা ছোলা", price: 85000, image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e2?w=400&auto=format&fit=crop&q=60" },
      { name: "ধনে বীজ আস্ত", specs: "ধনে গুঁড়া কারখানার উপযোগী রোদে শুকানো প্রিমিয়াম ধনে বীজ", price: 165000, image: "https://images.unsplash.com/photo-1599940824399-b8898bb9706a?w=400&auto=format&fit=crop&q=60" },
      { name: "শুকনো আস্ত লাল মরিচ", specs: "মরিচের গুঁড়া তৈরির জন্য বোঁটাহীন শুকনো ঝাল লাল মরিচ", price: 280000, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop&q=60" },
      { name: "পরিশোধিত চিনি (বাল্ক)", specs: "শিল্পে ব্যবহারের উপযোগী ৫০ কেজি বস্তার পরিশোধিত চিনি", price: 125000, image: "https://images.unsplash.com/photo-1581781870027-04212e231e96?w=400&auto=format&fit=crop&q=60" },
      { name: "ফিড গ্রেড ডাই-ক্যালসিয়াম ফসফেট", specs: "মুরগি ও গরুর খাদ্যের খনিজ ক্যালসিয়াম সাপ্লিমেন্ট", price: 72000, image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=400&auto=format&fit=crop&q=60" },
      { name: "ফিশ মিল প্রোটিন কনসেন্ট্রেট", specs: "অ্যাকোয়া ফিড কারখানার জন্য বাষ্পে শুকানো মাছের গুঁড়া", price: 95000, image: "https://images.unsplash.com/photo-1534818113099-dbe2b2e800ad?w=400&auto=format&fit=crop&q=60" },
      { name: "সাদা তিল বীজ", specs: "বেকারি ও বেকিং শিল্পের জন্য ধোয়া এবং বাছাই করা সাদা তিল", price: 180000, image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Tons",
    minQty: 15,
  },
  Chemicals: {
    products: [
      { name: "হাইড্রোজেন পারক্সাইড (৫০%)", specs: "টেক্সটাইল ওয়াশ ও ইটিপির ব্লিচিং এজেন্ট", price: 68, image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=60" },
      { name: "কস্টিক সোডা ফ্লেক্স (৯৯%)", specs: "শিল্প পরিচ্ছন্নতা ও সাবান কারখানার সোডিয়াম হাইড্রোক্সাইড", price: 95, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "সাইট্রিক অ্যাসিড অ্যানহাইড্রাস", specs: "খাদ্য, পানীয় এবং ডিটারজেন্টের অম্লতা নিয়ন্ত্রক", price: 145, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=60" },
      { name: "অ্যাসিটিক অ্যাসিড (গ্ল্যাসিয়াল ৯৯%)", specs: "পোশাকের ডাইং ও ইটিপির পিএইচ নিয়ন্ত্রক অ্যাসিড", price: 110, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "সোডিয়াম সালফেট অ্যানহাইড্রাস", specs: "টেক্সটাইল ডাইংয়ের লেভেলিং ও অক্সিলিয়ারি এজেন্ট", price: 38, image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=60" },
      { name: "সোডা অ্যাশ লাইট", specs: "লন্ড্রি পাউডার এবং সাবান তৈরির প্রধান কাঁচামাল সোডিয়াম কার্বনেট", price: 48, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "লিকুইড ক্লোরিন (সিলিন্ডার)", specs: "পানি শোধনাগারের জীবাণুনাশক সংকুচিত ক্লোরিন গ্যাস", price: 120, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&auto=format&fit=crop&q=60" },
      { name: "হাইড্রোক্লোরিক অ্যাসিড (৩৫%)", specs: "ধাতব মরিচা পরিষ্কার (পিকলিং) ও কেমিক্যাল ফর্মুলেশনের অ্যাসিড", price: 28, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "নাইট্রিক অ্যাসিড (৬৮%)", specs: "সার ও ধাতব প্লেটিং কারখানার জন্য শক্তিশালী খনিজ অ্যাসিড", price: 55, image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=60" },
      { name: "গ্লিসারিন ইউএসপি গ্রেড", specs: "কসমেটিকস ও ওষধ কারখানার জন্য ৯৯.৫% খাঁটি ভেজিটেবল গ্লিসারিন", price: 180, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "মিথানল ইন্ডাস্ট্রিয়াল গ্রেড", specs: "শিল্প কারখানায় বহুল ব্যবহৃত দ্রাবক ও কেমিক্যাল সলভেন্ট", price: 72, image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=60" },
      { name: "ফরমালিন (৩৭% সলিউশন)", specs: "স্থিতিশীল ডেসিনফেক্ট্যান্ট ও প্রিজারভেটিভ কেমিক্যাল", price: 45, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "ব্লিচিং পাউডার (৩৫% ক্লোরিন)", specs: "মেঝে ও ড্রেন জীবাণুমুক্ত করার ক্যালসিয়াম হাইপোক্লোরাইট", price: 85, image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=60" },
      { name: "ফিটকিরি স্ফটিক", specs: "ইটিপি ও তরল বর্জ্য শোধনাগারের কোয়াগুল্যান্ট এজেন্ট", price: 32, image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=400&auto=format&fit=crop&q=60" },
      { name: "ফসফরিক অ্যাসিড (৮৫% ফুড গ্রেড)", specs: "কোমল পানীয় কারখানার অম্লতা বৃদ্ধিকারী ফুড গ্রেড অ্যাসিড", price: 165, image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Kgs",
    minQty: 1000,
  },
  Packaging: {
    products: [
      { name: "ক্রাফট লাইনার পেপার (১৫০ GSM)", specs: "কার্টন কারখানার জন্য উন্নত বার্স্ট ফ্যাক্টরযুক্ত লাইনার কাগজ", price: 82000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" },
      { name: "ডুপ্লেক্স বোর্ড গ্রে ব্যাক (৩০০ GSM)", specs: "প্যাকেজিং ও ওষধের বাক্স প্রিন্টিংয়ের কোটেড বোর্ড", price: 74000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=60" },
      { name: "ফ্লুটিং পেপার রোল (১২০ GSM)", specs: "কার্টন বাক্সের ভেতরের ঢেউখেলানো স্তর তৈরির ফ্লুটিং পেপার", price: 68000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" },
      { name: "টেস্ট লাইনার পেপার (১৪০ GSM)", specs: "রিসাইকেলড পেপার থেকে তৈরি কম খরচের আউটার কার্টন পেপার", price: 78000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=60" },
      { name: "আর্ট পেপার ডাবল কোটেড (১৫০ GSM)", specs: "প্রিমিয়াম চকচকে আর্ট পেপার কালার ব্রোশিওর ও লিফলেটের জন্য", price: 115000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" },
      { name: "আর্ট কার্ড গ্লসি (৩০০ GSM)", specs: "শক্ত এবং চকচকে আর্ট কার্ড ডাই-কাট প্যাকেজিং বক্সের জন্য", price: 125000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=60" },
      { name: "হোয়াইট ক্রাফট পেপার রোল (৮০ GSM)", specs: "খাদ্য ও শপিং ব্যাগ তৈরির ব্লিচড স্ট্রং ক্রাফট পেপার", price: 95000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" },
      { name: "ঢেউখেলানো শিট ৩-প্লাই", specs: "ডাই-কাট কার্টন তৈরিতে ব্যবহৃত ৩ স্তরের শক্ত শিট", price: 45000, image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=60" },
      { name: "ঢেউখেলানো শিট ৫-প্লাই", specs: "ভারী পণ্য দূরপাল্লার শিপিংয়ের ৫ স্তরের ডাবল ওয়াল শিট", price: 55000, image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=60" },
      { name: "স্ট্রেচ র‍্যাপ ফিল্ম রোল", specs: "এলএলডিপিই স্ট্রং প্যালেট র‍্যাপিং মোড়ানো ফিল্ম রোল", price: 165000, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&auto=format&fit=crop&q=60" },
      { name: "পিপি স্ট্র্যাপিং ব্যান্ড রোল", specs: "ভারী কার্টন ও বান্ডিল বাধার জন্য উচ্চ টেনসিল স্ট্র্যাপ বেল্ট", price: 135000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" },
      { name: "সেলফ অ্যাডহেসিভ বিওপিপি টেপ", specs: "কার্টন বক্স সিল করার শক্তিশালী আঠালো টেপ রোল", price: 140000, image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&auto=format&fit=crop&q=60" },
      { name: "বাবল র‍্যাপ কুশনিং রোল", specs: "ভঙ্গুর পণ্য নিরাপদে শিপিংয়ের বাবল কুশন শিট রোল", price: 98000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" },
      { name: "স্যাক ক্রাফট পেপার ক্লুপাক", specs: "সিমেন্ট ও কেমিক্যালের বস্তা তৈরির প্রসারণযোগ্য ক্লুপাক কাগজ", price: 88000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=60" },
      { name: "সেমি-কেমিক্যাল ফ্লুটিং পেপার", specs: "আর্দ্র পরিবেশে কার্টন বাক্সের শক্তি ধরে রাখার স্পেশাল ফ্লুটিং", price: 72000, image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Tons",
    minQty: 2,
  },
  Electrical: {
    products: [
      { name: "ডিস্ট্রিবিউশন ট্রান্সফরমার ২৫০kVA", specs: "কারখানার সাবস্টেশনের জন্য ১১kV তেল-নিমজ্জিত ট্রান্সফরমার", price: 420000, image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop&q=60" },
      { name: "ইন্ডাস্ট্রিয়াল এইচটি সুইচগিয়ার প্যানেল", specs: "ভ্যাকুয়াম সার্কিট ব্রেকারযুক্ত ১১kV সেফটি প্যানেল", price: 850000, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60" },
      { name: "৩-ফেজ টোটাল ক্লোজড মোটর ১৫HP", specs: "শিল্পের ব্লোয়ার, কম্প্রেসার ও পাম্প চালনার জন্য থ্রি-ফেজ ১৫HP মোটর", price: 85000, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "এনওয়াইওয়াই ক্যাবল ৪-কোর ১৬rm", specs: "কারখানার অভ্যন্তরীণ সংযোগের ভারী কপার পাওয়ার ক্যাবল", price: 1850, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "ডিস্ট্রিবিউশন ট্রান্সফরমার ৫০০kVA", specs: "মাঝারি থেকে বৃহৎ কারখানার সাবস্টেশনের জন্য ৫০০kVA ট্রান্সফরমার", price: 650000, image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop&q=60" },
      { name: "এলটি সুইচগিয়ার প্যানেল (ইনকামিং)", specs: "সাবস্টেশন থেকে কারখানায় মেইন পাওয়ার ডিস্ট্রিবিউশন প্যানেল", price: 450000, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60" },
      { name: "পিএফআই প্ল্যান্ট প্যানেল ১০০kVAR", specs: "বিদ্যুৎ বিল কমাতে ক্যাপাসিটর ব্যাংক পাওয়ার ফ্যাক্টর উন্নত প্যানেল", price: 220000, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60" },
      { name: "বিওয়াইএ ক্যাবল সিঙ্গেল কোর ২.৫rm", specs: "কারখানার লাইটিং ও ওয়্যারিংয়ের সাধারণ পিভিসি তামার তার", price: 45, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "বিওয়াইএ ক্যাবল সিঙ্গেল কোর ৪.০rm", specs: "ভারী পাওয়ার প্লাগ লাইনের জন্য ৪.০rm পিভিসি কপার ক্যাবল", price: 68, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "এলইডি হাই বে লাইট ১৫০W", specs: "ফ্যাক্টরি শেড ও ওয়ারহাউস আলোকিত করার হ্যাঙ্গিং লাইট", price: 6500, image: "https://images.unsplash.com/photo-1565538810844-1e119ba1848a?w=400&auto=format&fit=crop&q=60" },
      { name: "ইন্ডাস্ট্রিয়াল এক্সহস্ট ফ্যান (২৪ ইঞ্চি)", specs: "কারখানার বাষ্প ও গরম বাতাস বের করার শক্তিশালী ভেন্টিলেশন ফ্যান", price: 12500, image: "https://images.unsplash.com/photo-1565538810844-1e119ba1848a?w=400&auto=format&fit=crop&q=60" },
      { name: "বাসবার ট্রাঙ্কিং সিস্টেম ৮০০A", specs: "কারখানার বিদ্যুৎ বিতরণের নিরাপদ কপার বাসবার ওভারহেড লাইন", price: 15000, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60" },
      { name: "৩-ফেজসি ইনডাকশন মোটর ৫HP", specs: "কনভেয়র বেল্ট ও ছোট মেকানিক্যাল শ্যাফ্ট ড্রাইভের ৫HP মোটর", price: 45000, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&auto=format&fit=crop&q=60" },
      { name: "এইচটি ড্রপ আউট ফিউজ অ্যাসেম্বলি", specs: "overhead সাবস্টেশন লাইনের নিরাপত্তা ফিউজ সেট", price: 18000, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60" },
      { name: "লাইটনিং অ্যারেস্টার (১১kV)", specs: "বজ্রপাত থেকে সাবস্টেশন ও ট্রান্সফরমার রক্ষা করার অ্যারেস্টার", price: 12000, image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop&q=60" }
    ],
    unit: "Pcs",
    minQty: 2,
  }
};

const DISTRICTS = [
  "ঢাকা (টঙ্গী/গাজীপুর)",
  "চট্টগ্রাম (হালিশহর/পতেঙ্গা)",
  "নারায়ণগঞ্জ (সিদ্ধিরগঞ্জ)",
  "কুমিল্লা (ইপিজেড)",
  "সিলেট (মহানগর)",
  "বগুড়া (বিসিক শিল্প এলাকা)",
  "যশোর (কোতোয়ালি)"
];

// Mapping English keys to Bengali labels for displaying tabs
const CATEGORY_LABELS: Record<string, string> = {
  Steel: "ইস্পাত",
  Cement: "সিমেন্ট",
  Textile: "টেক্সটাইল",
  Agro: "এগ্রো/কৃষি",
  Chemicals: "কেমিক্যালস",
  Packaging: "প্যাকেজিং",
  Electrical: "ইলেকট্রিক্যাল"
};

// 30 Exporter categories based on export.indiamart.com style for the Export landing page
const EXPORT_CATEGORIES = [
  {
    title: "তৈরি পোশাক ও নিটওয়্যার",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=120&auto=format&fit=crop&q=60",
    items: ["ওভেন শার্ট ও প্যান্ট", "টি-শার্ট ও পোলো শার্ট", "সোয়েটার ও নিটওয়্যার", "ডেনিম পোশাক", "বাচ্চাদের পোশাক"]
  },
  {
    title: "পাট ও পাটজাত পণ্য",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=60",
    items: ["কাঁচা পাট", "পাটের সুতা ও দড়ি", "পাটের শপিং ব্যাগ", "পাটের চট ও বস্তা", "পাটজাত হস্তশিল্প"]
  },
  {
    title: "চামড়া ও ফুটওয়্যার",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=120&auto=format&fit=crop&q=60",
    items: ["চামড়ার জুতো ও বুট", "চামড়ার জ্যাকেট", "চামড়ার ব্যাগ ও ওয়ালেট", "ফিনিশড ক্রাস্ট লেদার", "ট্রাভেল বেল্ট ও বেল্ট"]
  },
  {
    title: "হিমায়িত ও তাজা খাদ্য",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&auto=format&fit=crop&q=60",
    items: ["গলদা ও বাগদা চিংড়ি", "হিমায়িত ইলিশ ও সামুদ্রিক মাছ", "হিমায়িত সবজি ও পরোটা", "শুঁটকি মাছ", "কাঁকড়া ও কুঁচে"]
  },
  {
    title: "কৃষি ও খাদ্য প্রক্রিয়া",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=120&auto=format&fit=crop&q=60",
    items: ["সুগন্ধি চিনিগুঁড়া চাল", "ব্ল্যাক টি ও চা পাতা", "আস্ত ও গুঁড়া মসলা", "হিমায়িত আলু ও টমেটো", "আম ও লিচুর জুস"]
  },
  {
    title: "ওষুধ ও ফার্মা প্রোডাক্টস",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=120&auto=format&fit=crop&q=60",
    items: ["ট্যাবলেট ও ক্যাপসুল", "ইনজেকশন ও ভ্যাকসিন", "লিকুইড সিরাপ ও সাসপেনশন", "ইনহেলার ও ওরাল স্যালাইন", "অ্যাক্টিভ ফার্মা ইনগ্রেডিয়েন্টস"]
  },
  {
    title: "প্লাস্টিক ও পলিমার সামগ্রী",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=120&auto=format&fit=crop&q=60",
    items: ["প্লাস্টিকের খেলনা", "প্লাস্টিক হ্যাঙ্গার ও পিন", "পিভিসি পাইপ ও ফিটিংস", "গৃহস্থালি প্লাস্টিক পণ্য", "প্যাকেজিং ফিল্ম"]
  },
  {
    title: "সিরামিক ও টেবিলওয়্যার",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=120&auto=format&fit=crop&q=60",
    items: ["সিরামিক প্লেট ও বাটি", "পোর্সেলিন ডিনার সেট", "সিরামিক কাপ ও মগ", "মেঝে ও দেয়ালের টাইলস", "স্যানিটারি ওয়্যার"]
  },
  {
    title: "হ্যান্ডলুম ও হস্তশিল্প",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=120&auto=format&fit=crop&q=60",
    items: ["ঐতিহ্যবাহী জামদানি শাড়ি", "নকশিকাঁথা ও বেডশীট", "বাঁশ ও বেতের আসবাব", "টেরাকোটা ও মাটির পাত্র", "কাঠের তৈরি শোপিস"]
  },
  {
    title: "জাহাজ ও জলযান নির্মাণ",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=60",
    items: ["মালবাহী কার্গো ভেসেল", "খনন ড্রেজার জাহাজ", "টাগবোট ও স্পিডবোট", "প্যাট্রোল ভেসেল", "ফেরি ও লঞ্চ"]
  },
  {
    title: "তথ্য প্রযুক্তি ও সফটওয়্যার",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&auto=format&fit=crop&q=60",
    items: ["কাস্টম সফটওয়্যার", "মোবাইল অ্যাপ্লিকেশন", "ওয়েব পোর্টাল ডেভেলপমেন্ট", "ডাটা এন্ট্রি ও প্রসেসিং", "আইটি কনসালটেন্সি"]
  },
  {
    title: "রাসায়নিক ও রঞ্জক পদার্থ",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=120&auto=format&fit=crop&q=60",
    items: ["হাইড্রোজেন পারক্সাইড", "টেক্সটাইল ওয়াশ কেমিক্যাল", "ইউরিয়া ও রাসায়নিক সার", "পেইন্টস ও বার্নিশ", "ওয়াটার ট্রিটমেন্ট কেমিক্যাল"]
  },
  {
    title: "প্যাকেজিং ও কাগজের পণ্য",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=120&auto=format&fit=crop&q=60",
    items: ["করুগেটেড কার্টন বক্স", "ডুপ্লেক্স পেপার বোর্ড", "হোয়াইট ক্রাফট পেপার", "খাদ্য প্যাকেজিং কাগজের ব্যাগ", "আঠালো লেবেল ও স্টিকার"]
  },
  {
    title: "আসবাবপত্র ও হোম ডেকর",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=120&auto=format&fit=crop&q=60",
    items: ["সেগুন কাঠের খাট", "কাঠের ডাইনিং টেবিল", "সোফা ও কুশন সেট", "অফিস কেবিন ফার্নিচার", "ডেকোরেটিভ ওয়াল প্যানেল"]
  },
  {
    title: "হোম টেক্সটাইল ও লিনেন",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=120&auto=format&fit=crop&q=60",
    items: ["বিছানার চাদর ও কভার", "সোফার কভার ও পর্দা", "বাথরুমের তোয়ালে", "টেবিল ক্লথ ও ন্যাপকিন", "রান্নাঘরের গ্লাভস ও অ্যাপ্রন"]
  },
  {
    title: "বৈদ্যুতিক ও সাবস্টেশন",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=60",
    items: ["ডিস্ট্রিবিউশন ট্রান্সফরমার", "এইচটি ও এলটি প্যানেল", "কপার পাওয়ার ক্যাবল", "পিএফআই ক্যাপাসিটর প্ল্যান্ট", "স্মার্ট এনার্জি মিটার"]
  },
  {
    title: "হালকা প্রকৌশল ও মেটাল",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&auto=format&fit=crop&q=60",
    items: ["বাইসাইকেল ও স্পেয়ার পার্টস", "মেটাল নাট-বোল্ট ও ফাস্টেনার", "কৃষি যন্ত্রপাতি ও লাঙল", "মেটাল ক্যাবল ট্রে", "মেশিনারি স্পেয়ার পার্টস"]
  },
  {
    title: "সিমেন্ট ও বিল্ডিং ক্লিংকার",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=120&auto=format&fit=crop&q=60",
    items: ["পোর্টল্যান্ড সিমেন্ট (OPC)", "কম্পোজিট সিমেন্ট (PCC)", "কাঁচা জিপসাম পাথর", "লাইমস্টোন চুনাপাথর", "ফ্লাই-অ্যাশ পাউডার"]
  },
  {
    title: "কয়লা ও খনিজ সম্পদ",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=120&auto=format&fit=crop&q=60",
    items: ["সিলিকা স্যান্ড (বালি)", "গ্রানাইট ও মার্বেল পাথর", "চায়না ক্লে (সাদা মাটি)", "কয়লা ও খনিজ কাঠ", "কোয়ার্টজ পাথর"]
  },
  {
    title: "মেডিকেল ও সার্জিক্যাল",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=120&auto=format&fit=crop&q=60",
    items: ["ডিসপোজেবল প্লাস্টিক সিরিঞ্জ", "সার্জিক্যাল গজ ও ব্যান্ডেজ", "সার্জিক্যাল ফেস মাস্ক", "পরীক্ষামূলক রাবার গ্লাভস", "আইভি ক্যানুলা ও ক্যাথেটার"]
  },
  {
    title: "ফাইন আর্টস ও ফটোগ্রাফি",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=120&auto=format&fit=crop&q=60",
    items: ["হস্তনির্মিত ক্যানভাস পেইন্টিং", "কাঠের খোদাইকৃত ভাস্কর্য", "ধাতব ওয়াল আর্ট", "ডিজিটাল আর্ট প্রিন্ট", "ফটোগ্রাফি ফ্রেমেড পিকচার"]
  },
  {
    title: "মোটরগাড়ি ও যন্ত্রাংশ",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&auto=format&fit=crop&q=60",
    items: ["রিকশা ও সাইকেল হুব", "১২V মোটরগাড়ি ব্যাটারি", "ব্রেক শু ও প্যাড", "লুব্রিকেন্ট অয়েল ফিল্টার", "টায়ার ও রাবার টিউব"]
  },
  {
    title: "ক্রীড়া সামগ্রী ও পোশাক",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=120&auto=format&fit=crop&q=60",
    items: ["চামড়ার ফুটবল ও ভলিবল", "উড ক্রিকেট ব্যাট", "স্পোর্টস টিম জার্সি", "পলিয়েস্টার ট্র্যাকস্যুট", "উইকেট কিপিং গ্লাভস"]
  },
  {
    title: "কসমেটিকস ও টয়লেট্রিজ",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=120&auto=format&fit=crop&q=60",
    items: ["নিম ও ভেষজ সাবান", "নারকেল ও ভেষজ চুলের তেল", "অর্গানিক ফেসওয়াশ", "মেকআপ বিউটি কিটস", "অ্যান্টিব্যাকটেরিয়াল হ্যান্ডওয়াশ"]
  },
  {
    title: "গহনা ও ফ্যাশন এক্সেসরিজ",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=120&auto=format&fit=crop&q=60",
    items: ["খাঁটি মুক্তার গহনা", "রুপার আংটি ও ব্রেসলেট", "ইমিটেশন কানের দুল", "পুঁতির নকশা করা মালা", "মেটাল বাধন বেল্ট"]
  },
  {
    title: "অফিস ও স্টেশনারি সামগ্রী",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=120&auto=format&fit=crop&q=60",
    items: ["কাগজের খাতা ও নোটবুক", "প্লাস্টিক ডিসপ্লে ফাইল", "বলপয়েন্ট কলম ও পেন্সিল", "বৈজ্ঞানিক ক্যালকুলেটর", "ধাতব পেপার ক্লিপ ও পিন"]
  },
  {
    title: "খেলনা ও বিনোদন সামগ্রী",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=120&auto=format&fit=crop&q=60",
    items: ["কাঠের শিক্ষামূলক খেলনা", "তুলতুলে স্টাফড টেডি বিয়ার", "প্লাস্টিক বিল্ডিং ব্লক", "পারিবারিক বোর্ড গেম", "পাজল কার্ড সেট"]
  },
  {
    title: "অপটিক্যাল ও কাচের সামগ্রী",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=60",
    items: ["চশমার প্লাস্টিক ফ্রেম", "কাচের বোতল ও ফুড জার", "লেন্স ক্লিন পরিচ্ছন্ন সলিউশন", "মিরর কাচ শিট", "নকশা করা রঙিন কাচ"]
  },
  {
    title: "নিরাপত্তা ও সেফটি ইকুইপমেন্ট",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=120&auto=format&fit=crop&q=60",
    items: ["ইন্ডাস্ট্রিয়াল সেফটি হেলমেট", "স্টিল টো জুতো ও গ্লাভস", "উচ্চ দৃশ্যমান প্রতিফলিত ভেস্ট", "অগ্নি নির্বাপক সিলিন্ডার", "সেফটি হারনেস বেল্ট"]
  },
  {
    title: "সামুদ্রিক পণ্য ও শৈবাল",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&auto=format&fit=crop&q=60",
    items: ["কাঁচা ও হিমায়িত কাঁকড়া", "শুকনো সামুদ্রিক শৈবাল", "তাজা কোরাল ও ভেটকি মাছ", "কচ্ছপের আলংকারিক খোলস", "কুঁচে মাছ (পাইকারি লট)"]
  }
];

export default function Home() {
  // Navigation tabs state: "commerce" (B2B Core portal) or "export" (IndiaMART Export clone)
  const [activeTab, setActiveTab] = useState<"commerce" | "export">("commerce");

  // Demo State for Commerce tab: default is "guest"
  const [currentView, setCurrentView] = useState<"guest" | "client" | "admin">("guest");
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>("Steel");
  
  // Database Mock State (All translated to Bengali status and values)
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: "RFQ-7291",
      product: "বিএসআরএম ৬০জি ডিফর্মড বার (১০মিমি)",
      category: "Steel",
      quantity: 25,
      unit: "Tons",
      targetPrice: 92000,
      deliveryLocation: "ঢাকা (টঙ্গী/গাজীপুর)",
      deliveryDate: "2026-07-05",
      status: "QUOTED",
      createdAt: "2026-06-22"
    },
    {
      id: "RFQ-5014",
      product: "বসুন্ধরা সিমেন্ট (PCC)",
      category: "Cement",
      quantity: 1200,
      unit: "Bags",
      targetPrice: 510,
      deliveryLocation: "চট্টগ্রাম (হালিশহর/পতেঙ্গা)",
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
      product: "সেভেন রিংস গোল্ড (OPC)",
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

  // Export Tab Form State
  const [exportProductSearch, setExportProductSearch] = useState<string>("");
  const [exportMobile, setExportMobile] = useState<string>("");
  const [exportNameSearch, setExportNameSearch] = useState<string>("");

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
    triggerAlert(`কোটেশনের আবেদন (${newId}) সফলভাবে পাঠানো হয়েছে! এডমিন প্যানেল থেকে দর সাবমিট করুন।`);
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
    triggerAlert(`কোটেশন সফলভাবে পাঠানো হয়েছে (${rfqId})! ক্লায়েন্ট ড্যাশবোর্ড থেকে এটি গ্রহণ করুন।`);
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
    triggerAlert(`অর্ডার ${newOrder.id} সফলভাবে কনফার্ম করা হয়েছে! মালামাল দ্রুত পাঠানো হবে।`);
  };

  const handleExportFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exportProductSearch || !exportMobile) {
      triggerAlert("দয়া করে প্রয়োজনীয় তথ্যগুলো পূরণ করুন।");
      return;
    }
    triggerAlert(`আপনার রপ্তানি ক্যোয়ারীটি সফলভাবে রেকর্ড করা হয়েছে! আমাদের এক্সপোর্ট কনসালটেন্ট দল শীঘ্রই আপনার সাথে যোগাযোগ করবে।`);
    setExportProductSearch("");
    setExportMobile("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-650/20 selection:text-indigo-900 pb-16">
      
      {/* Alert Notification */}
      {notification && (
        <div className="fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-fade-in-down">
          <div className="bg-white border-l-4 border-indigo-650 rounded-xl p-4 shadow-xl flex items-start space-x-3">
            <div className="p-1 bg-indigo-50 rounded-lg text-indigo-650">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-xs">প্ল্যাটফর্ম আপডেট</h3>
              <p className="text-xs text-slate-650 mt-1">{notification}</p>
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
              <div className="w-12 h-12 rounded-full bg-indigo-55 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
                J
              </div>
              <h3 className="text-base font-bold text-slate-900">দরপত্র (RFQ) রিকোয়েস্ট পাঠাতে লগইন করুন</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                পাইকারি দর, কাস্টম লজিস্টিকস হিসাব এবং বাকিতে কাঁচামাল ক্রয়ের সুবিধা পেতে আপনার ব্যবসায়ের ট্রেড লাইসেন্স বা প্রয়োজনীয় কাগজপত্র আপলোড করে প্রোফাইল ভেরিফাই করুন।
              </p>
              
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setCurrentView("client");
                    setShowAuthModal(false);
                    triggerAlert("সফলভাবে ডেমো ক্লায়েন্ট হিসেবে লগইন করা হয়েছে!");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition"
                >
                  লগইন করুন / ডেমো ক্লায়েন্ট হিসেবে চালু রাখুন
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
                >
                  ডিরেক্টরিতে ফিরে যান
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab("commerce"); setCurrentView("guest"); }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl tracking-wider shadow-md text-white">
                J
              </div>
              <div>
                <span className="font-bold text-base tracking-wide uppercase text-slate-900">The J Platform</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-650 rounded-md">B2B কোর</span>
              </div>
            </div>

            {/* Menu Items (Primary Tabs: Home vs Export) */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => { setActiveTab("commerce"); }}
                className={`text-sm font-bold transition-all px-3 py-2 rounded-xl ${
                  activeTab === "commerce" 
                    ? "text-indigo-650 bg-indigo-50/50" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                হোম (Commerce)
              </button>
              <button
                onClick={() => { setActiveTab("export"); }}
                className={`text-sm font-bold transition-all px-3 py-2 rounded-xl flex items-center space-x-1 ${
                  activeTab === "export" 
                    ? "text-teal-650 bg-teal-50" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>রপ্তানি (Export)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              </button>
            </nav>
          </div>

          {/* Perspective Switcher / Secondary Menu */}
          <div className="flex items-center space-x-4">
            {activeTab === "commerce" ? (
              <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-xl flex space-x-1 shadow-inner">
                <button
                  onClick={() => { setCurrentView("guest"); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentView === "guest" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  গেস্ট ভিউ
                </button>
                <button
                  onClick={() => { setCurrentView("client"); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentView === "client" 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ক্লায়েন্ট ড্যাশবোর্ড
                </button>
                <button
                  onClick={() => { setCurrentView("admin"); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    currentView === "admin" 
                      ? "bg-orange-600 text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>এডমিন প্যানেল</span>
                  {rfqs.filter(r => r.status === "PENDING_QUOTE").length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span className="text-slate-400">রপ্তানি পোর্টাল লাইভ</span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              </div>
            )}
            
            {/* Small screen Export Navigation */}
            <div className="md:hidden flex space-x-1.5">
              <button 
                onClick={() => { setActiveTab(activeTab === "commerce" ? "export" : "commerce"); }}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-250 p-2 rounded-xl text-slate-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === "commerce" ? (
          // COMMERCE VIEW
          currentView === "guest" ? (
            // GUEST VIEW (Fully-Featured Landing Page)
            <div className="space-y-16">
              
              {/* Hero Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
                
                <div className="max-w-xl space-y-5 relative z-10 text-center md:text-left">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-55 text-indigo-700">
                    শিল্পের বাল্ক কাঁচামাল সংগ্রহকারী পোর্টাল
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    রড, সিমেন্ট, টেক্সটাইল ও কেমিক্যালের পাইকারি বাজার
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    সরাসরি প্রস্তুতকারক ও মিল থেকে আমদানিকৃত বাল্ক কাঁচামাল সংগ্রহ করুন সেরা মূল্যে। খুব সহজে অনলাইনে আরএফকিউ সাবমিট করুন, পরিবহন চার্জ হিসাব করুন এবং দ্রুত মালামাল ডেলিভারি বুঝে নিন।
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center md:justify-start">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl text-xs transition shadow-md"
                    >
                      ব্যবসার প্রোফাইল তৈরি করুন
                    </button>
                    <a
                      href="#catalog"
                      className="w-full sm:w-auto text-center border border-slate-205 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl text-xs transition"
                    >
                      কাঁচামাল ডিরেক্টরি দেখুন
                    </a>
                  </div>
                </div>

                {/* Live Market Index Widget */}
                <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-2xl p-6 relative z-10 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-800">আজকের বাজার দর ইনডেক্স</span>
                    <span className="text-[10px] text-green-600 font-bold flex items-center">
                      <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +১.৪%
                    </span>
                  </div>
                  <div className="space-y-3 font-medium">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">ডিফর্মড রড (ইস্পাত/Ton)</span>
                      <span className="font-bold text-slate-850">BDT ৯৪,০০০</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">ওপিসি সিমেন্ট (বস্তা/Bag)</span>
                      <span className="font-bold text-slate-850">BDT ৫৩০</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">কটন সুতা (সুতি/Kg)</span>
                      <span className="font-bold text-slate-850">BDT ৪২০</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Propositions / Features Section */}
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">জে প্ল্যাটফর্ম কেন ব্যবহার করবেন?</h2>
                  <p className="text-xs text-slate-500">কারখানা ও ক্ষুদ্র মাঝারি ব্যবসা সমূহের কাঁচামাল সংগ্রহ প্রক্রিয়া সহজ ও নির্ভরযোগ্য করতে আমরা প্রতিশ্রুতিবদ্ধ</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow transition">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold">৳</div>
                    <h4 className="font-bold text-slate-900 text-sm">সেরা পাইকারি দাম</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">মাঝারি কোনো দালাল বা এজেন্সি ছাড়াই সরাসরি প্রস্তুতকারক ও ডিলার পয়েন্ট থেকে পণ্য সংগ্রহ করায় সেরা রেটের নিশ্চয়তা।</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow transition">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">নিশ্চিত লজিস্টিকস</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">আমাদের রয়েছে দেশব্যাপী ট্রাকিং ও ডেলিভারি নেটওয়ার্ক। জিপিএস ট্র্যাকিং এর মাধ্যমে সরাসরি আপনার কারখানায় পণ্য খালাস।</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow transition">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">১০০% গুণগত মান</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">প্রতিটি কাঁচামালের অফিশিয়াল টেস্ট রিপোর্ট এবং নিজস্ব কোয়ালিটি কন্ট্রোল টিম দ্বারা মালামাল লোডিং-আনলোডিং তদারকি।</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow transition">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">পেমেন্ট টার্মস সুবিধা</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">ভেরিফাইড ব্যবসায়ী ও রেগুলার বায়ারদের জন্য ক্যাশ অন ডেলিভারি এবং ক্রেডিট (বাকিতে ক্রয়ের) বিশেষ আর্থিক সুবিধা।</p>
                  </div>
                </div>
              </div>

              {/* Catalog Directory Section */}
              <div id="catalog" className="space-y-6 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">কাঁচামাল ডিরেক্টরি</h2>
                    <p className="text-xs text-slate-500 mt-1">ক্যাটাগরি সিলেক্ট করে আপনার প্রয়োজনীয় বাল্ক পণ্যটি খুঁজে নিন।</p>
                  </div>
                  
                  {/* Category Navigation (Translated) */}
                  <div className="bg-slate-100 p-1.5 border border-slate-200 rounded-xl flex overflow-x-auto space-x-1">
                    {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                          activeCategory === cat
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {CATEGORY_LABELS[cat] || cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CATEGORIES[activeCategory].products.map((prod, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Product Image */}
                        {prod.image && (
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-full h-36 object-cover rounded-xl border border-slate-100 bg-slate-50"
                          />
                        )}
                        <div className="flex justify-between items-start pt-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600">
                            {CATEGORY_LABELS[activeCategory] || activeCategory}
                          </span>
                          <span className="text-[9px] text-slate-500 italic">
                            MOQ: {CATEGORIES[activeCategory].minQty} {CATEGORIES[activeCategory].unit}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</h3>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{prod.specs}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] text-slate-400 uppercase font-semibold">সম্ভাব্য বাজার মূল্য</span>
                          <strong className="text-xs font-extrabold text-slate-800 font-mono">
                            BDT {prod.price.toLocaleString()}
                          </strong>
                          <span className="text-[9px] text-slate-500"> / {CATEGORIES[activeCategory].unit.slice(0, -1)}</span>
                        </div>
                        <button
                          onClick={() => setShowAuthModal(true)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold py-1.5 px-3 rounded-lg transition"
                        >
                          কোটেশন পাঠান
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">যেভাবে মালামাল সরবরাহ করা হয়</h2>
                  <p className="text-xs text-slate-500">৪টি সহজ ধাপে আমরা আপনার ফ্যাক্টরি বা প্রজেক্ট ইয়ার্ডে মালামাল পৌঁছে দেই</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 text-center md:text-left relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mx-auto md:mx-0">১</div>
                    <h4 className="font-bold text-slate-900 text-sm pt-2">অনলাইনে আরএফকিউ (RFQ) প্রদান</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">আপনার প্রয়োজনীয় কাঁচামালের পরিমাণ, ডেলিভারি লোকেশন ও টার্গেট বাজেট সাবমিট করুন।</p>
                  </div>
                  <div className="space-y-2 text-center md:text-left relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mx-auto md:mx-0">২</div>
                    <h4 className="font-bold text-slate-900 text-sm pt-2">চূড়ান্ত কোটেশন প্রাপ্তি</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">আমাদের টিম বাজার দর ও পরিবহন খরচসহ বিস্তারিত প্রফর্মা কোটেশন ইস্যু করবে।</p>
                  </div>
                  <div className="space-y-2 text-center md:text-left relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mx-auto md:mx-0">৩</div>
                    <h4 className="font-bold text-slate-900 text-sm pt-2">অর্ডার কনফার্মেশন ও চুক্তি</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">প্রাপ্ত কোটেশনটি আপনার ড্যাশবোর্ডে রিভিউ করে এক ক্লিকে অর্ডার বুকিং সম্পন্ন করুন।</p>
                  </div>
                  <div className="space-y-2 text-center md:text-left relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mx-auto md:mx-0">৪</div>
                    <h4 className="font-bold text-slate-900 text-sm pt-2">ফ্যাক্টরি ইয়ার্ডে ডেলিভারি</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">আমাদের লজিস্টিকস টিম পণ্য লোড করে আপনার ফ্যাক্টরি ইয়ার্ডে সরাসরি ডেলিভারি নিশ্চিত করবে।</p>
                  </div>
                </div>
              </div>

              {/* Special Order CTA Banner */}
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold">স্পেশাল বা কাস্টম অর্ডারের সন্ধান করছেন?</h3>
                  <p className="text-xs text-slate-400">তালিকায় না থাকা যেকোনো বিশেষ লট বা ইমপোর্ট কাঁচামালের জন্য আমাদের সোর্সিং নেটওয়ার্ক প্রস্তুত রয়েছে।</p>
                </div>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs transition"
                >
                  সরাসরি রিকোয়েস্ট পাঠান
                </button>
              </div>

              {/* Get Free Quotes from Multiple Sellers Widget Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    একাধিক বিক্রেতার কাছ থেকে <span className="text-teal-650">ফ্রি কোটেশন</span> পান
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center mx-auto text-teal-600 shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">আপনার কি প্রয়োজন আমাদের বলুন</p>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center mx-auto text-teal-600 shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">বিক্রেতাদের থেকে ফ্রি কোটেশন পান</p>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center mx-auto text-teal-600 shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">সেরা ডিলটি চূড়ান্ত করুন</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 border border-slate-150 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-850">আপনার চাহিদা আমাদের জানান</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <input 
                        type="text" 
                        placeholder="পণ্য বা সেবার নাম লিখুন..." 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600 transition"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="email" 
                        placeholder="আপনার ইমেইল লিখুন" 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600 transition"
                      />
                      <input 
                        type="text" 
                        placeholder="আপনার নাম লিখুন" 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600 transition"
                      />
                    </div>

                    <div className="flex items-center text-slate-500 text-[10px] space-x-1">
                      <span className="text-slate-400">🌐</span>
                      <span>আপনার দেশ হচ্ছে</span>
                      <strong className="text-slate-700 font-bold">বাংলাদেশ</strong>
                    </div>

                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="w-full bg-teal-700 hover:bg-teal-850 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-sm"
                    >
                      চাহিদা পত্র সাবমিট করুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Find Suppliers from Top Cities Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
                <div className="text-center sm:text-left space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">শীর্ষ শহরগুলো থেকে সাপ্লায়ার খুঁজুন</h2>
                  <p className="text-xs text-slate-500">বাংলাদেশের প্রধান বাণিজ্যিক কেন্দ্রসমূহের ভেরিফাইড সাপ্লায়ার নেটওয়ার্ক</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {[
                    { name: "ঢাকা", icon: "🏢" },
                    { name: "চট্টগ্রাম", icon: "⚓" },
                    { name: "নারায়ণগঞ্জ", icon: "🏭" },
                    { name: "গাজীপুর", icon: "🏗️" },
                    { name: "সাভার", icon: "🌾" },
                    { name: "খুলনা", icon: "🪵" },
                    { name: "রাজশাহী", icon: "🥭" },
                    { name: "সিলেট", icon: "🍃" },
                    { name: "বগুড়া", icon: "⚙️" },
                    { name: "কুমিল্লা", icon: "🏛️" }
                  ].map((city, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setShowAuthModal(true)}
                      className="group cursor-pointer bg-slate-50 hover:bg-white border border-slate-150 hover:border-indigo-200 rounded-2xl p-4 text-center transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full bg-white group-hover:bg-indigo-50 border border-slate-150 group-hover:border-indigo-150 flex items-center justify-center text-lg mx-auto mb-2.5 transition shadow-sm">
                        {city.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-750 group-hover:text-indigo-650 transition">{city.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : currentView === "client" ? (
            // CLIENT PORTAL VIEW
            <div className="space-y-8 animate-fade-in">
              <div className="py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <span>ক্লায়েন্ট কাঁচামাল সংগ্রহকারী ড্যাশবোর্ড</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">লগইন আইডি: **ডেমো এসএমই এন্টারপ্রাইজ** (ট্রেড লাইসেন্স আইডি: #TRD-88210)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: RFQ Form */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>নতুন আরএফকিউ (RFQ) তৈরি করুন</span>
                  </h2>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`py-2 px-1 text-center rounded-lg font-semibold text-xs border transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
                          activeCategory === cat
                            ? "bg-indigo-55 border-indigo-200 text-indigo-700"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                      >
                        {CATEGORY_LABELS[cat] || cat}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleRfqSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">কাঁচামাল নির্বাচন করুন</label>
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

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">প্রয়োজনীয় পরিমাণ</label>
                        <span className="text-[10px] text-slate-500 italic">সর্বনিম্ন অর্ডার: {CATEGORIES[activeCategory].minQty} {CATEGORIES[activeCategory].unit}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min={CATEGORIES[activeCategory].minQty}
                          value={rfqQty}
                          onChange={(e) => setRfqQty(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                        />
                        <span className="absolute right-4 top-3 text-sm font-semibold text-slate-500">{CATEGORIES[activeCategory].unit}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">लक्ष्यমাত্রা বাজেট (প্রতি {CATEGORIES[activeCategory].unit.slice(0,-1)} BDT)</label>
                      <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ডেলিভারি ইয়ার্ড / গন্তব্য</label>
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

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">কাঙ্ক্ষিত ডেলিভারির তারিখ</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition text-xs mt-2"
                    >
                      কোটেশনের আবেদন পাঠান
                    </button>
                  </form>
                </div>

                {/* Right Column: Quotes & Orders */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>আপনার কোটেশন আবেদনসমূহ</span>
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-605 rounded-full font-mono">{rfqs.length} টি</span>
                    </h2>

                    <div className="space-y-4">
                      {rfqs.map((rfq) => {
                        const quote = quotes[rfq.id];
                        return (
                          <div 
                            key={rfq.id} 
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-350 transition"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono font-bold text-indigo-650">{rfq.id}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">{CATEGORY_LABELS[rfq.category] || rfq.category}</span>
                              </div>
                              <h3 className="font-bold text-slate-800 text-xs">{rfq.product}</h3>
                              <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-500">
                                <span>পরিমাণ: <strong className="text-slate-700">{rfq.quantity} {rfq.unit}</strong></span>
                                <span>গন্তব্য: <strong className="text-slate-700">{rfq.deliveryLocation.split(" ")[0]}</strong></span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-start sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                              {rfq.status === "PENDING_QUOTE" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  কোটেশন অপেক্ষমান
                                </span>
                              )}
                              
                              {rfq.status === "QUOTED" && quote && (
                                <div className="space-y-2 w-full sm:w-auto text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    কোটেশন তৈরি
                                  </span>
                                  <div className="text-[11px] text-slate-700 font-bold font-mono">
                                    BDT {quote.basePrice.toLocaleString()} / {rfq.unit.slice(0,-1)}
                                  </div>
                                  <button
                                    onClick={() => handleAcceptQuote(rfq.id)}
                                    className="w-full sm:w-auto bg-emerald-650 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition"
                                  >
                                    কোটেশন গ্রহণ ও অর্ডার
                                  </button>
                                </div>
                              )}

                              {rfq.status === "ORDER_CONFIRMED" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  অর্ডার করা হয়েছে
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
                      <span>সক্রিয় অর্ডার সমূহ ({orders.length})</span>
                    </h2>

                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-bold text-emerald-700 font-mono">{ord.id}</span>
                              <span className="text-[10px] font-mono text-slate-400">রেফারেন্স: {ord.rfqId}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs">{ord.product}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              পরিমাণ: <strong className="text-slate-700">{ord.quantity} {ord.unit}</strong> | মূল্য: <strong className="text-indigo-650 font-mono font-bold">BDT {ord.totalAmount.toLocaleString()}</strong>
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                            <div className="text-right text-xs">
                              <span className="block text-[9px] text-slate-400 uppercase font-semibold">পৌঁছানোর সম্ভাব্য সময়</span>
                              <span className="text-slate-700 font-medium">{ord.deliveryDays} দিন</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              ord.status === "SHIPPED"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : ord.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {ord.status === "PROCESSING" ? "প্রসেসিং" : ord.status === "SHIPPED" ? "পাঠানো হয়েছে" : "ডেলিভারি সম্পন্ন"}
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
            <div className="space-y-8 animate-fade-in">
              <div className="py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                    <span>অপারেশনস কন্ট্রোল সেন্টার (এডমিন)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">রোল: **প্ল্যাটফর্ম অপারেটর** (হ্যান্ডল আইডি: #OPS-990)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: RFQs to Process */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-orange-655" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>প্রক্রিয়াধীন আরএফকিউ (RFQ) সমূহ</span>
                  </h3>

                  <div className="space-y-4">
                    {rfqs.filter(r => r.status === "PENDING_QUOTE").length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                        নতুন কোনো আরএফকিউ জমা নেই। সবগুলোর কোটেশন পাঠানো হয়েছে।
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
                            <div>পরিমাণ: <strong className="text-slate-700">{rfq.quantity} {rfq.unit}</strong></div>
                            <div>টার্গেট প্রাইস: <strong className="text-slate-700 font-mono">BDT {rfq.targetPrice.toLocaleString()}</strong></div>
                            <div>ডেলিভারি লোকেশন: <strong className="text-slate-700">{rfq.deliveryLocation}</strong></div>
                            <div>নির্ধারিত তারিখ: <strong className="text-slate-700">{rfq.deliveryDate}</strong></div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-end">
                            <span className="bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition">
                              কোটেশন কনফিগারেটর চালু করুন
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column: Quote Calculation Form */}
                <div className="lg:col-span-5 space-y-6">
                  {selectedRfqForQuote ? (
                    <div className="bg-white border-2 border-orange-500 rounded-2xl p-6 shadow-md relative animate-fade-in">
                      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <span>কোটেশন ফর্ম: {selectedRfqForQuote.id}</span>
                      </h3>

                      <form onSubmit={handleAdminQuoteSubmit} className="space-y-4">
                        <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-500 space-y-1">
                          <p>পণ্য: <strong className="text-slate-700">{selectedRfqForQuote.product}</strong></p>
                          <p>পরিমাণ: <strong className="text-slate-700">{selectedRfqForQuote.quantity} {selectedRfqForQuote.unit}</strong></p>
                          <p>টার্গেট প্রাইস: <strong className="text-slate-700 font-mono font-bold">BDT {selectedRfqForQuote.targetPrice.toLocaleString()}</strong></p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ভিত্তি মূল্য BDT (প্রতি {selectedRfqForQuote.unit.slice(0,-1)})</label>
                          <input 
                            type="number"
                            value={adminBasePrice}
                            onChange={(e) => setAdminBasePrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">মোট লজিস্টিকস / পরিবহন ভাড়া (BDT)</label>
                          <input 
                            type="number"
                            value={adminFreight}
                            onChange={(e) => setAdminFreight(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">পৌঁছানোর আনুমানিক সময় (দিন)</label>
                          <input 
                            type="number"
                            value={adminDeliveryDays}
                            onChange={(e) => setAdminDeliveryDays(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-450 pt-2">
                          <span>ভ্যাট হার (নিয়ম অনুযায়ী)</span>
                          <span>৫%</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRfqForQuote(null)}
                            className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl text-xs transition"
                          >
                            বাতিল করুন
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md"
                          >
                            কোটেশন পাঠান
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center py-12 text-slate-400 text-xs">
                      বাম পাশের আরএফকিউ সিলেক্ট করে কোটেশনের মূল্য হিসাব করুন।
                    </div>
                  )}

                  {/* Operations logistics coordinator */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">লজিস্টিকস ও পণ্য ডেলিভারি ট্র্যাকার</h3>
                    <div className="space-y-3">
                      {orders.map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-850">{ord.id}</span>
                            <span className="text-indigo-650 font-semibold uppercase">
                              {ord.status === "PROCESSING" ? "প্রসেসিং" : ord.status === "SHIPPED" ? "ট্রানজিটে" : "ডেলিভারি সম্পন্ন"}
                            </span>
                          </div>
                          <p className="text-slate-600">{ord.product} - {ord.quantity} {ord.unit}</p>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                            {ord.status === "PROCESSING" && (
                              <button
                                onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: "SHIPPED" } : o))}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-1 px-2.5 rounded font-semibold text-[10px] transition"
                              >
                                পণ্যবাহী ট্রাক ছাড়ুন
                              </button>
                            )}
                            {ord.status === "SHIPPED" && (
                              <button
                                onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: "DELIVERED" } : o))}
                                className="bg-indigo-600 hover:bg-indigo-755 text-white py-1 px-2.5 rounded font-semibold text-[10px] transition"
                              >
                                ডেলিভারি কনফার্ম করুন
                              </button>
                            )}
                            {ord.status === "DELIVERED" && (
                              <span className="text-[10px] text-emerald-650 font-bold flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                পণ্য খালাস সম্পন্ন ও বন্ধ
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        ) : (
          // EXPORT PORTAL VIEW (IndiaMART Export clone layout in Bengali)
          <div className="space-y-12 animate-fade-in">
            
            {/* Top secondary search / navigation links */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600 shadow-sm">
              <div className="flex items-center space-x-2 text-indigo-650">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>জে প্ল্যাটফর্ম গ্লোবাল ট্রেড নেটওয়ার্ক</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#whytust" className="hover:text-slate-900 transition">আমরা কেন সেরা?</a>
                <a href="#stats" className="hover:text-slate-900 transition">আমাদের অর্জনসমূহ</a>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 cursor-pointer hover:text-slate-800" onClick={() => triggerAlert("রপ্তানিকারক সাইন-ইন পোর্টাল শীঘ্রই উন্মুক্ত করা হবে।")}>রপ্তানিকারক লগইন</span>
                <span className="text-slate-550 bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-150 cursor-pointer" onClick={() => triggerAlert("বিক্রেতা প্রোফাইল তৈরি করতে ড্যাশবোর্ডে ব্যবসার কাগজপত্র আপলোড করুন।")}>সেলার হিসেবে যুক্ত হোন</span>
              </div>
            </div>

            {/* IndiaMART Export Hero Section & RFQ Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
              
              {/* Left Side text */}
              <div className="max-w-xl space-y-4 text-center lg:text-left relative z-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  ভেরিফাইড বাংলাদেশী রপ্তানিকারকদের সাথে যুক্ত হোন
                </h1>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  বাংলাদেশের বৃহত্তম B2B রপ্তানি প্ল্যাটফর্ম দ্বারা সমর্থিত। এখানে আপনি পোশাক, পাট, চামড়া, হিমায়িত খাদ্য ও ওষুধ সহ ৩০টি খাতের শীর্ষ রপ্তানিকারকদের সাথে সরাসরি ডিল করতে পারবেন।
                </p>
                <div className="flex items-center space-x-3 pt-2 text-xs font-semibold justify-center lg:justify-start text-slate-650">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-teal-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    ১০০% ভেরিফাইড সাপ্লায়ার্স
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-teal-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    নিরাপদ পেমেন্ট গেটওয়ে
                  </span>
                </div>
              </div>

              {/* Right Side: RFQ Form Widget */}
              <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-6 relative z-10 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-teal-650" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>আপনার কী প্রয়োজন আমাদের জানান</span>
                </h3>

                <form onSubmit={handleExportFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">পণ্য অথবা সেবার নাম</label>
                    <input 
                      type="text"
                      placeholder="যেমন: ওভেন শার্ট, পাটের বস্তা, চিংড়ি মাছ..."
                      value={exportProductSearch}
                      onChange={(e) => setExportProductSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">মোবাইল নম্বর</label>
                    <div className="relative flex">
                      <div className="bg-white border border-slate-200 border-r-0 rounded-l-xl px-3 py-3 text-xs text-slate-500 flex items-center space-x-1.5">
                        <span className="inline-block w-4 h-3 bg-red-600 relative overflow-hidden">
                          <span className="absolute left-0 top-0 w-2.5 h-3 bg-green-700 rounded-full" style={{ left: '20%', top: '15%', width: '60%', height: '70%' }} />
                        </span>
                        <span>+৮৮০</span>
                      </div>
                      <input 
                        type="tel"
                        placeholder="০১XXXXXXXXX"
                        value={exportMobile}
                        onChange={(e) => setExportMobile(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-r-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-650 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md shadow-teal-600/10"
                  >
                    রিকোয়েস্ট সাবমিট করুন
                  </button>
                </form>
              </div>

            </div>

            {/* Top Product Categories from Bangladesh (30 Grid Card Layout) */}
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">রপ্তানিযোগ্য শীর্ষ পণ্য ক্যাটাগরি সমূহ</h2>
                <p className="text-xs text-slate-500">বাংলাদেশে উৎপাদিত ও প্রক্রিয়াজাত রপ্তানিযোগ্য পণ্যের বৃহত্তম B2B ডিরেক্টরি</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXPORT_CATEGORIES.map((cat, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex items-start space-x-4"
                  >
                    {/* Left Thumbnail */}
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                    />
                    
                    {/* Right text list */}
                    <div className="flex-1 space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center justify-between">
                        <span>{cat.title}</span>
                        <svg className="w-3 h-3 text-slate-400 group-hover:text-slate-655" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </h4>
                      <ul className="grid grid-cols-1 gap-1 text-[10px] text-slate-500 font-medium">
                        {cat.items.map((item, itemIdx) => (
                          <li 
                            key={itemIdx} 
                            className="cursor-pointer hover:text-indigo-650 transition truncate flex items-center"
                            onClick={() => { setExportProductSearch(item); triggerAlert(`আপনার আরএফকিউ পণ্যের নাম "${item}" সেট করা হয়েছে।`); }}
                          >
                            <span className="w-1 h-1 rounded-full bg-slate-300 mr-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Trust Section */}
            <div id="whytust" className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">রপ্তানির জন্য জে প্ল্যাটফর্ম কেন নির্ভরযোগ্য?</h2>
                <p className="text-xs text-slate-500">বাংলাদেশ থেকে আন্তর্জাতিক বাজারে সুনির্দিষ্ট ও নির্ভরযোগ্য লেনদেনের নিশ্চয়তা</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-650 flex items-center justify-center font-bold mx-auto text-lg">✓</div>
                  <h4 className="font-bold text-slate-900 text-xs pt-1">ভেরিফাইড সাপ্লায়ার্স</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">ট্রেড লাইসেন্স, এক্সপোর্ট পারমিট ও ক্রেডিট হিস্ট্রি ভেরিফাই করার পর আমরা রপ্তানিকারকদের অনুমোদন দেই।</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-650 flex items-center justify-center font-bold mx-auto text-lg">🛡</div>
                  <h4 className="font-bold text-slate-900 text-xs pt-1">নিরাপত্তা ও ইন্সুরেন্স</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">পণ্য লোডিং এবং লজিস্টিকস সুরক্ষার সাথে সাথে ১০০% সিকিউর পেমেন্ট এসক্রো গেটওয়ে সুবিধা।</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-650 flex items-center justify-center font-bold mx-auto text-lg">⚖</div>
                  <h4 className="font-bold text-slate-900 text-xs pt-1">আইনি ও ট্যাক্স সম্মতি</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">এইচএস কোড ম্যাপিং, ট্যাক্স রিটার্ন ও কাস্টম ছাড়পত্রের জন্য প্রয়োজনীয় ডকুমেন্টেশন হ্যান্ডলিং টিম।</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-650 flex items-center justify-center font-bold mx-auto text-lg">✈</div>
                  <h4 className="font-bold text-slate-900 text-xs pt-1">রপ্তানি সহযোগিতা</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">শিপিং এজেন্ট সিলেকশন, কার্গো কন্টেইনার বুকিং ও পোর্ট হ্যান্ডলিংয়ে সার্বক্ষণিক সহযোগিতা।</p>
                </div>
              </div>
            </div>

            {/* Statistics / Numbers Section */}
            <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="block text-2xl font-extrabold text-slate-900 font-mono">২,০০,০০০+</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ভেরিফাইড রপ্তানিকারক</span>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="block text-2xl font-extrabold text-slate-900 font-mono">১,৫০,০০০+</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">রপ্তানিযোগ্য পণ্য ও সেবা</span>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="block text-2xl font-extrabold text-slate-900 font-mono">১৫,০০০+</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">দৈনিক ক্রয়ের লিড চাহিদা</span>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="block text-2xl font-extrabold text-slate-900 font-mono">১৫০+</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">দেশ ও পোর্টে সরবরাহ</span>
              </div>
            </div>

            {/* Corporate Info Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-xs text-slate-500 leading-relaxed space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">আমাদের এক্সপোর্ট নেটওয়ার্ক সম্পর্কে</h4>
              <p>
                **দ্য জে প্ল্যাটফর্ম এক্সপোর্ট (The J Platform Export)** বাংলাদেশের শীর্ষস্থানীয় লাইসেন্সপ্রাপ্ত রপ্তানিকারকদের একত্রিত করে বিশ্ববাজারে সুনামের সাথে B2B পণ্য বাণিজ্য সেবা দিয়ে যাচ্ছে। আমরা বিশ্বমানের প্রযুক্তি ও আধুনিক লজিস্টিকস ম্যানেজমেন্টের মাধ্যমে কাস্টমস ক্লিয়ারেন্স, পেমেন্ট ক্লিয়ারেন্স ও জাহাজের কার্গো বুকিং অত্যন্ত দ্রুততা ও সততার সাথে নিশ্চিত করি।
              </p>
              <p>
                আমাদের পোর্টাল ব্যবহারকারী ক্রেতা ও বিক্রেতারা সরাসরি একে অপরের সাথে যোগাযোগের পাশাপাশি কাস্টম ট্রেড লাইসেন্স স্ক্যান এবং ব্যাংক নিশ্চয়তা ভেরিফিকেশন করার জন্য আমাদের অভ্যন্তরীণ রিস্ক এসেসমেন্ট সেবা পেয়ে থাকেন।
              </p>
            </div>

          </div>
        )}

      </main>

      {/* Sticky Bottom Help Bar (IndiaMART Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-teal-900 text-white z-50 py-3 shadow-2xl border-t border-teal-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <svg className="w-5 h-5 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-semibold text-[11px] sm:text-xs">রপ্তানি ও হেল্পলাইন সহায়তার জন্য আমরা প্রস্তুত!</span>
          </div>
          <button 
            onClick={() => triggerAlert("হেল্পলাইন কল সেন্টার: ০৯৬১২৩-৪৫৬৭৮ (সকাল ৯:০০ - রাত ৮:০০)")}
            className="bg-white hover:bg-slate-100 text-teal-900 font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs transition active:scale-95 flex items-center space-x-1"
          >
            <span>যোগাযোগ করুন</span>
            <span className="hidden sm:inline">/ Helpline</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p className="max-w-md mx-auto leading-relaxed">
          &copy; ২০২৬ দ্য জে প্ল্যাটফর্ম (The J Platform)। বাল্ক কাঁচামাল ও কমার্স হাব। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </footer>
    </div>
  );
}
