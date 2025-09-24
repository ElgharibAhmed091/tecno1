const Footer=()=>{
    return(<footer className="bg-gray-900 text-gray-300 py-10 mt-10 ">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-white">Tecno Soft</h2>
            <p className="mt-2 text-gray-400">
              Empowering learners with high-quality courses and certifications.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/FAQ" className="hover:text-white">FAQ</a></li>
              <li><a href="/news" className="hover:text-white">News</a></li>
            </ul>
          </div>
  
          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold text-white">Follow Us</h3>
            <div className="mt-3 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
  
        </div>
  
        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Tecno Soft. All rights reserved.
        </div>
      </footer>)
}
export default Footer