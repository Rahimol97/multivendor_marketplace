import React from 'react'
import Carousel from '../../../components/customer/Carousel'

function AboutUs() {
  return (
       <div className='w-full space-y-6 pt-27 md:pt-5'>
        <Carousel />
       <div className=" px-4 md:px-12 bg-(--light-bg) min-h-screen text-(--dark-teal)">

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">About MultiNest</h1>
        <p className="max-w-2xl mx-auto text-(--mid-teal)">
          MultiNest is a modern multi-vendor marketplace connecting customers with trusted sellers,
          delivering quality products, seamless shopping, and fast delivery — all in one place.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We empower small and large vendors to reach more customers while giving shoppers
            a secure, diverse, and affordable online shopping experience.
          </p>
        </div>
        <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" className="w-64 mx-auto" />
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Feature title="Trusted Vendors" text="All sellers are verified for quality and reliability." />
        <Feature title="Secure Payments" text="Razorpay-powered secure transactions." />
        <Feature title="Fast Delivery" text="Quick and safe delivery to your doorstep." />
        <Feature title="Wide Variety" text="Thousands of products across multiple categories." />
        <Feature title="Customer Support" text="We’re here to help whenever you need us." />
      </div>

      {/* Closing Section */}
      <div className="text-center pb-16">
        <h2 className="text-xl font-semibold mb-3">Built for Vendors. Loved by Customers.</h2>
        <p className="text-(--mid-teal)">Thank you for being part of the MultiNest community 💙</p>
      </div>

    </div> 
   </div>
  )
}
function Feature({ title, text }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg mb-2 text-(--dark-teal)">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
export default AboutUs