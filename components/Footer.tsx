"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="font-tajawal text-lg font-semibold text-gray-900 dark:text-white">
              About DZ Market
            </h3>
            <p className="mt-4 font-poppins text-sm text-gray-600 dark:text-gray-400">
              Your trusted online marketplace for quality products delivered
              across Algeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-tajawal text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {["Home", "Shop", "About", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-poppins text-sm text-gray-600 transition-colors hover:text-dz-green dark:text-gray-400 dark:hover:text-dz-green"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-tajawal text-lg font-semibold text-gray-900 dark:text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {["Help Center", "Contact Us", "Returns", "Shipping"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-poppins text-sm text-gray-600 transition-colors hover:text-dz-green dark:text-gray-400 dark:hover:text-dz-green"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Delivery & Payments */}
          <div>
            <h3 className="font-tajawal text-lg font-semibold text-gray-900 dark:text-white">
              Delivery Coverage
            </h3>
            <p className="mt-4 font-poppins text-sm text-gray-600 dark:text-gray-400">
              Fast delivery to all major cities in Algeria including Algiers,
              Oran, and Constantine.
            </p>
            <div className="mt-4">
              <h4 className="font-tajawal font-semibold text-gray-900 dark:text-white">
                Payment Methods
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Visa", "Mastercard", "Bank Transfer"].map((method) => (
                  <span
                    key={method}
                    className="rounded bg-gray-200 px-2 py-1 font-poppins text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700" />

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-poppins text-sm text-gray-600 dark:text-gray-400">
            © 2024 DZ Market. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-poppins text-sm text-gray-600 transition-colors hover:text-dz-green dark:text-gray-400 dark:hover:text-dz-green"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
