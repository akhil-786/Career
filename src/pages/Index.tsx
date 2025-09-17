// src/pages/Index.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, MapPin, Calendar, Book, Target, Menu, X } from 'lucide-react';
import heroImage from '../assets/hero-image.jpg';

// ---------------- Navbar ----------------
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-primary">Career View</div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
        <Link to="/quiz" className="text-gray-700 hover:text-primary transition">Quiz</Link>
        <Link to="/colleges" className="text-gray-700 hover:text-primary transition">Colleges</Link>
        <Link to="/auth" className="text-gray-700 hover:text-primary transition">Timeline</Link>
        <Link to="/auth" className="text-gray-700 hover:text-primary transition">Login</Link>
        <Link
          to="/auth"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md shadow hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-primary focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col px-4 py-4 space-y-3">
          <Link to="/" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/quiz" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>Quiz</Link>
          <Link to="/colleges" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>Colleges</Link>
          <Link to="/auth" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>Timeline</Link>
          <Link to="/auth" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>Login</Link>
          <Link
            to="/auth"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md shadow hover:opacity-90 transition text-center"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

// ---------------- Hero ----------------
const Hero: React.FC = () => (
  <section className="py-16 bg-gray-50 px-4 md:px-8">
    <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Your Career Journey <span className="text-primary">Starts Here</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover the perfect educational path after Class 10 &amp; 12. Get personalized recommendations, explore career roadmaps, and find government colleges in your area.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/quiz" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center">
            Take Career Quiz
          </Link>
          <Link to="/colleges" className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 text-center">
            Explore Colleges
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-8">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">10,000+</div>
            <div className="text-gray-600">Students Guided</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-gray-600">Courses Available</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
      <div className="flex-1 relative w-full md:w-auto">
        <img src={heroImage} alt="Students" className="rounded-lg shadow-lg w-full object-cover" />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-green-600 shadow">
          Class 10 Passed ✓
        </div>
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-orange-600 shadow">
          Dream Career Awaits
        </div>
      </div>
    </div>
  </section>
);

// ---------------- Features ----------------
type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="p-6 bg-white shadow rounded-lg flex flex-col h-full">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 flex-1">{description}</p>
    <div className="mt-4">
      <Link to="#" className="text-blue-500 font-medium hover:underline">
        Learn More →
      </Link>
    </div>
  </div>
);

const Features: React.FC = () => (
  <section className="py-16 bg-gray-100 px-4 md:px-8">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <FeatureItem
        icon={<Brain className="w-8 h-8" />}
        title="Smart Aptitude Quiz"
        description="Discover your strengths and interests with our AI-powered assessment designed for Indian students. Personalized for Class 10 & 12, scientific methodology, instant results."
      />
      <FeatureItem
        icon={<Target className="w-8 h-8" />}
        title="Career Roadmaps"
        description="Visualize your future with detailed pathways from education to career success. Government job paths, private sector routes, entrepreneurship options."
      />
      <FeatureItem
        icon={<Book className="w-8 h-8" />}
        title="Government College Directory"
        description="Find quality government colleges in your district with complete details and admission info. District-wise search, admission criteria, contact details."
      />
      <FeatureItem
        icon={<Calendar className="w-8 h-8" />}
        title="Important Timelines"
        description="Never miss deadlines with our comprehensive calendar of admissions and exams. Admission dates, scholarship deadlines, exam schedules."
      />
    </div>
  </section>
);

// ---------------- Footer ----------------
const Footer: React.FC = () => (
  <footer className="bg-white mt-16 py-12 px-4 md:px-8">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="text-2xl font-bold text-primary">Career View</div>
        <p className="mt-2 text-gray-600">
          Empowering Indian students to make informed career decisions through personalized guidance, comprehensive resources, and expert insights.
        </p>
        <div className="mt-4 space-y-2 text-gray-600">
          <div><strong>Email:</strong> support@careerview.in</div>
          <div><strong>Phone:</strong> +91 98765 43210</div>
          <div><strong>Location:</strong> Hyderabad, India</div>
        </div>
        <div className="mt-4 flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-700">Facebook</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">Twitter</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">Instagram</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">YouTube</a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-lg text-gray-800 mb-2">Platform</h4>
        <ul className="text-gray-600 space-y-1">
          <li><Link to="/quiz" className="hover:text-primary">Career Quiz</Link></li>
          <li><Link to="/colleges" className="hover:text-primary">College Directory</Link></li>
          <li><Link to="/roadmap" className="hover:text-primary">Career Roadmaps</Link></li>
          <li><Link to="/timeline" className="hover:text-primary">Timeline</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-lg text-gray-800 mb-2">Resources</h4>
        <ul className="text-gray-600 space-y-1">
          <li><Link to="/how-it-works" className="hover:text-primary">How it Works</Link></li>
          <li><Link to="/success-stories" className="hover:text-primary">Success Stories</Link></li>
          <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-lg text-gray-800 mb-2">Support</h4>
        <ul className="text-gray-600 space-y-1">
          <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
          <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-500 text-sm">
      © 2024 Career View. All rights reserved. Made with ❤ for Indian students.
    </div>
  </footer>
);

// ---------------- HomePage ----------------
const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
