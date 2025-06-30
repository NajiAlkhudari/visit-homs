"use client";
import React, { useState, useRef } from "react";
import { BsCart4, BsSearch, BsChevronDown, BsList, BsXLg } from "react-icons/bs";
import { HiTranslate } from "react-icons/hi";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(null);
  const timeoutRef = useRef(null);

  const navigationItems = {
    home: {
      label: "الرئيسية",
      content: "مرحباً بكم في موقع هومس",
      subItems: ["الصفحة الرئيسية", "أخبار الموقع", "إحصائيات الموقع"],
    },
    categories: {
      label: "التصنيفات",
      content: "تصفح تصنيفاتنا المختلفة",
      subItems: ["صنف 1", "صنف 2", "صنف 3"],
    },
    foods: {
      label: "ماكولات",
      content: "اكتشف أشهى المأكولات",
      subItems: ["حلويات", "مشروبات"],
    },
    products: {
      label: "المنتجات",
      content: "منتجاتنا المميزة",
      subItems: ["منتجات جديدة", "الأكثر مبيعاً", "منتجات مخفضة"],
    },
    offers: {
      label: "العروض",
      content: "أحدث العروض والخصومات",
      subItems: ["عروض اليوم", "عروض الأسبوع"],
    },
    discounts: {
      label: "الخصومات",
      content: "خصومات حصرية",
      subItems: ["خصم 20%", "خصم 30%", "خصم 50%", "خصومات حصرية"],
    },
    articles: {
      label: "المقالات",
      content: "مقالات مفيدة ومعلومات قيمة",
      subItems: [
        "مقالات طهي",
        "نصائح صحية",
        "وصفات سريعة",
        "مقالات عامة",
      ],
    },
    contact: {
      label: "اتصل بنا",
      content: "تواصل معنا",
      subItems: ["معلومات الاتصال", "فرم التواصل", "المواقع", "ساعات العمل"],
    },
  };

  // فتح القائمة على hover - للشاشات الكبيرة
  const handleMouseEnter = (key) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // التبديل في أكورديون الجوال
  const toggleMobileAccordion = (key) => {
    setMobileAccordionOpen((prev) => (prev === key ? null : key));
  };

  return (
    <header className="bg-slate-700 text-white relative z-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4">
        <a className="font-bold text-2xl text-neutral-200 cursor-pointer">Homs</a>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-slate-600 rounded-full">
            <BsSearch />
          </button>
          <button className="p-2 hover:bg-slate-600 rounded-full">
            <HiTranslate />
          </button>

          {/* زر الهامبرجر فقط على الشاشات الصغيرة */}
          <button
            className="lg:hidden p-2 hover:bg-slate-600 rounded-full"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileAccordionOpen(null);
            }}
            aria-label="فتح القائمة"
          >
            {mobileMenuOpen ? <BsXLg /> : <BsList />}
          </button>
        </div>
      </div>

      {/* قائمة التنقل الأفقية - تظهر على الشاشات الكبيرة فقط */}
      <nav
        className="hidden lg:flex justify-center border-t border-slate-600 relative"
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center space-x-8">
          {Object.entries(navigationItems).map(([key, item]) => (
            <button
              key={key}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                openDropdown === key
                  ? "bg-slate-600 text-white"
                  : "text-neutral-200 hover:bg-slate-600/50"
              }`}
              onMouseEnter={() => handleMouseEnter(key)}
              dir="rtl"
            >
              <span>{item.label}</span>
              <BsChevronDown
                className={`${
                  openDropdown === key ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>
          ))}
        </div>

        {/* القائمة المنسدلة الثابتة تحت الهيدر للشاشات الكبيرة */}
        {openDropdown && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-[1000px] bg-white text-black rounded-xl shadow-xl p-6 z-50"
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }}
            onMouseLeave={handleMouseLeave}
            dir="rtl"
          >
            <h3 className="font-bold text-lg mb-2">
              {navigationItems[openDropdown].label}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {navigationItems[openDropdown].content}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {navigationItems[openDropdown].subItems.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setOpenDropdown(null)}
                  className="hover:bg-gray-100 p-2 rounded w-full text-start"
                >
                  <div className="font-medium text-gray-800">{sub}</div>
                  <div className="text-sm text-gray-500">
                    اضغط للانتقال إلى {sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* قائمة الجوال - تظهر على الشاشات الصغيرة فقط */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-slate-700 border-t border-slate-600 p-4 z-50">
          {Object.entries(navigationItems).map(([key, item]) => (
            <div key={key} className="mb-2 border-b border-slate-600 last:border-none">
              <button
                onClick={() => toggleMobileAccordion(key)}
                className="w-full flex justify-between items-center py-2 text-right text-neutral-200 hover:bg-slate-600 rounded px-2"
                dir="rtl"
              >
                <span>{item.label}</span>
                <BsChevronDown
                  className={`transition-transform ${
                    mobileAccordionOpen === key ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* محتوى الأكورديون */}
              {mobileAccordionOpen === key && (
                <div className="mt-1 px-4">
                  <p className="text-gray-300 text-sm mb-2">{item.content}</p>
                  <div className="flex flex-col space-y-1">
                    {item.subItems.map((sub, i) => (
                      <button
                        key={i}
                        className="text-gray-200 hover:bg-slate-600 p-2 rounded text-right"
                        onClick={() => setMobileMenuOpen(false)} // أغلق القائمة الجوال عند اختيار
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
