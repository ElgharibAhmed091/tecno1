import { Helmet } from "react-helmet-async";
import { FaUsers, FaBullseye, FaLightbulb, FaStar } from "react-icons/fa";

export default function About() {
  return (

    <div className="max-w-6xl mx-auto px-6 py-12">
            <Helmet>
                  <title>About us</title>
            </Helmet>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">About Tecno Soft</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Empowering learners with innovative and accessible education technology.
        </p>
      </div>

      {/* Introduction Section */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Who We Are</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Tecno Soft is a cutting-edge Learning Management System (LMS) designed to revolutionize online education.
          Our mission is to provide a seamless and engaging learning experience through advanced technology.
        </p>
      </div>

      {/* Core Values Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-blue-100 dark:bg-gray-800 rounded-lg text-center">
          <FaBullseye className="text-blue-500 mx-auto text-4xl" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            To make high-quality education accessible to everyone.
          </p>
        </div>
        <div className="p-6 bg-blue-100 dark:bg-gray-800 rounded-lg text-center">
          <FaLightbulb className="text-blue-500 mx-auto text-4xl" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Innovation</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            We embrace cutting-edge technologies to enhance learning.
          </p>
        </div>
        <div className="p-6 bg-blue-100 dark:bg-gray-800 rounded-lg text-center">
          <FaUsers className="text-blue-500 mx-auto text-4xl" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Community</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Building a global network of learners and educators.
          </p>
        </div>
        <div className="p-6 bg-blue-100 dark:bg-gray-800 rounded-lg text-center">
          <FaStar className="text-blue-500 mx-auto text-4xl" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Excellence</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Delivering top-tier educational experiences for all.
          </p>
        </div>
      </div>
    </div>
  );
}
