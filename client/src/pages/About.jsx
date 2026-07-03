import React from 'react';
import { Heart, Clock, ShieldCheck, Truck } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About AduFood</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bringing the authentic taste of Ethiopian cuisine to your doorstep with passion and tradition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              AduFood was born from a love for Ethiopian cuisine and a desire to share its rich flavors with the world. 
              Our journey began with a simple mission: to deliver authentic, home-cooked Ethiopian meals that bring 
              families together.
            </p>
            <p className="text-gray-600 mb-4">
              Every dish we serve is prepared with care, using traditional recipes passed down through generations. 
              We source our ingredients from local farmers and suppliers to ensure the highest quality and freshness.
            </p>
            <p className="text-gray-600">
              From injera to doro wat, our menu celebrates the diversity and depth of Ethiopian culinary traditions. 
              We invite you to experience the warmth and hospitality that defines Ethiopian culture.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#dd804f]/10 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-[#dd804f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Passion for Quality</h3>
                  <p className="text-gray-600 text-sm">We never compromise on the quality of our ingredients or preparation.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#dd804f]/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-[#dd804f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Timely Delivery</h3>
                  <p className="text-gray-600 text-sm">Hot, fresh meals delivered to your door on time, every time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#dd804f]/10 p-3 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-[#dd804f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Food Safety</h3>
                  <p className="text-gray-600 text-sm">Strict hygiene standards and safe handling practices in every step.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#dd804f]/10 p-3 rounded-lg">
                  <Truck className="h-6 w-6 text-[#dd804f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Customer First</h3>
                  <p className="text-gray-600 text-sm">Your satisfaction is our priority. We go above and beyond for you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1F1B18] rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Family</h2>
            <p className="text-gray-300 mb-6">
              Whether you're craving a quick lunch or planning a special dinner, AduFood is here to serve you 
              with the best Ethiopian cuisine. Order now and taste the difference!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
