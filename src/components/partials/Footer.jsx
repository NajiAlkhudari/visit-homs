
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-primary  border-gray-200  ">

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="text-2xl font-bold  text-gray-200  ">
            Visit Homs
          </Link>
          <p className="max-w-md mx-auto mt-2 text-gray-400 ">
            Discover the rich history and vibrant culture of Homs, Syria.
          </p>
          <div className="flex space-x-6 mt-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Visit Homs. All Rights Reserved.</p>
          <p className="mt-1">
            Designed with ❤️ by Naji
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
