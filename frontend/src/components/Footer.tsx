import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-[#100325] border-t border-white/10 z-40'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='col-span-1'>
            <div className='text-2xl font-bold text-white mb-4'>
              Gov<span className='text-violet-400'>Trace</span>
            </div>
            <p className='text-white/70 mb-4'>
              Ensuring government transparency and accountability through blockchain technology.
            </p>
            <div className='flex space-x-4'>
              <a href="#" className='text-white/60 hover:text-violet-400 transition-colors'>
                <span className='sr-only'>Twitter</span>
                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'/>
                </svg>
              </a>
              <a href="#" className='text-white/60 hover:text-violet-400 transition-colors'>
                <span className='sr-only'>LinkedIn</span>
                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className='-col-end-2'>
            <h3 className='text-white font-semibold mb-4'>Platform</h3>
            <ul className='space-y-2'>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Transaction Tracker</a></li>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>AI Analytics</a></li>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Smart Contracts</a></li>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Public Dashboard</a></li>
            </ul>
          </div>
          

          {/* Support */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Support</h3>
            <ul className='space-y-2'>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Help Center</a></li>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Contact Us</a></li>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Report Issues</a></li>
              <li><a href="#" className='text-white/70 hover:text-violet-400 transition-colors'>Community</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-white/60 text-sm'>
            © 2025 GovTrace. All rights reserved. Building transparency for Sri Lanka.
          </p>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <a href="#" className='text-white/60 hover:text-violet-400 text-sm transition-colors'>Terms of Service</a>
            <a href="#" className='text-white/60 hover:text-violet-400 text-sm transition-colors'>Privacy Policy</a>
            <a href="#" className='text-white/60 hover:text-violet-400 text-sm transition-colors'>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer