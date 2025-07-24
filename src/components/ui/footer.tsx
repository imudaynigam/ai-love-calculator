import { Heart, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-pink-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-primary">
                AI Love Calculator
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center md:text-left">
              Discover your cosmic compatibility with AI Love Calculator.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Links
            </h3>
            <div className="mt-4 space-y-4">
              <a
                href="/"
                className="text-base text-gray-500 hover:text-primary"
              >
                Home
              </a>
              <a
                href="/about"
                className="block text-base text-gray-500 hover:text-primary"
              >
                About
              </a>
              <a
                href="/privacy"
                className="block text-base text-gray-500 hover:text-primary"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Connect
            </h3>
            <div className="mt-4 flex space-x-6">
              <a
                href="https://github.com/imudaynigam"
                className="text-gray-400 hover:text-primary"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/yourusername"
                className="text-gray-400 hover:text-primary"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-pink-100 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} AI Love Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
