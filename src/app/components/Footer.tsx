'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Youtube, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-6 md:px-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="space-y-4">
          <div className="h-10 flex items-center">
            <img src="/logo_dark.png" alt="Mokafor Logo" className="h-9 object-contain" />
          </div>
          <p className="text-xs leading-relaxed max-w-xs">
            Providing exceptional academic instruction, certified curricula (WAEC, SAT, IGCSE), and modern digital learning tools globally.
          </p>
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Mokafor Global Education. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/?tab=about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
            <li><Link href="/?tab=programs" className="hover:text-emerald-500 transition-colors">Our Programmes</Link></li>
            <li><Link href="/tutors" className="hover:text-emerald-500 transition-colors">Find a Tutor</Link></li>
            <li><Link href="/courses" className="hover:text-emerald-500 transition-colors font-bold text-emerald-400">Self-Paced Recorded Courses</Link></li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Legal & Policies</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Refund Policy</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Safeguarding & Child Protection</a></li>
          </ul>
        </div>

        {/* Contact Info & Socials */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white mb-4">Contact & Location</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>3, Compassion road, Dagbana Estate, Karu Abuja</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-emerald-500 shrink-0" />
              <a 
                href="https://wa.me/2349078013408" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-500 font-bold transition-colors"
              >
                WhatsApp: +234 907 801 3408
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-emerald-500 shrink-0" />
              <span>support@mokafor.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-500 shrink-0" />
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </li>
          </ul>

          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-300 mb-2">Connect With Us</p>
            <div className="flex items-center gap-2 flex-wrap">
              <a 
                href="https://www.youtube.com/@mokaforglobaleducation" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Youtube size={15} />
              </a>
              <a 
                href="https://www.instagram.com/markokafor/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Instagram size={15} />
              </a>
              <a 
                href="https://twitter.com/MarkOkafor1" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-sky-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Twitter size={15} />
              </a>
              <a 
                href="https://www.facebook.com/Mokaforeducation" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Facebook size={15} />
              </a>
              <a 
                href="https://www.linkedin.com/in/mark-okafor/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Linkedin size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
