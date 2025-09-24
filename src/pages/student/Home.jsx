import { Helmet } from "react-helmet-async";
import { FaBook, FaChalkboardTeacher, FaCertificate, FaUsers } from "react-icons/fa";

export default function Home() {
  return (
    
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Helmet>
            <title>Home</title>
      </Helmet>
      {/* Hero Section */}
      <div className="text-center bg-blue-100 dark:bg-gray-900 p-12 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to Tecno Soft
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Unlock knowledge and enhance your skills with our top-quality courses.
        </p>
        <a
          href="/courses"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Explore Courses
        </a>
      </div>

      {/* Key Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <FaBook className="text-blue-500 text-4xl mx-auto" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">100+ Courses</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Learn from a wide range of high-quality courses.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <FaChalkboardTeacher className="text-blue-500 text-4xl mx-auto" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Expert Instructors</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Learn from industry professionals and experts.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <FaCertificate className="text-blue-500 text-4xl mx-auto" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Certified Courses</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Earn certificates to showcase your skills.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <FaUsers className="text-blue-500 text-4xl mx-auto" />
          <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">Global Community</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Join thousands of learners worldwide.
          </p>
        </div>
      </div>

      {/* Popular Courses Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Popular Courses</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Card - Replace with dynamic data later */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Python for Beginners</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Master Python from scratch and start coding.
            </p>
            <a href="/course/python-for-beginners" className="mt-4 inline-block text-blue-500 font-semibold">
              Learn More →
            </a>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Full-Stack Web Development</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Learn React, Django, and build real-world apps.
            </p>
            <a href="/course/full-stack-web" className="mt-4 inline-block text-blue-500 font-semibold">
              Learn More →
            </a>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Data Science with AI</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Analyze data and build AI-powered applications.
            </p>
            <a href="/course/data-science-ai" className="mt-4 inline-block text-blue-500 font-semibold">
              Learn More →
            </a>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">What Our Students Say</h2>
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          {/* Testimonial 1 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-300">
              "Tecno Soft changed my career. The courses are top-notch and easy to follow!"
            </p>
            <p className="mt-4 font-semibold text-gray-800 dark:text-white">- Alex Johnson</p>
          </div>
          {/* Testimonial 2 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-300">
              "I landed my dream job after completing the Full-Stack Web Development course!"
            </p>
            <p className="mt-4 font-semibold text-gray-800 dark:text-white">- Sarah Williams</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center bg-blue-100 dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Start Learning Today!
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Join thousands of students learning new skills.
        </p>
        <a
          href="/signup"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
