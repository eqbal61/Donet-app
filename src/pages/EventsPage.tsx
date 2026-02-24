import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Annual Seerat-un-Nabi Conference",
      date: "Oct 25, 2023",
      time: "After Maghrib",
      location: "Main Prayer Hall",
      description: "Join us for an enlightening evening discussing the life and teachings of Prophet Muhammad (PBUH). Guest speakers from Al-Azhar University."
    },
    {
      id: 2,
      title: "Free Medical Camp",
      date: "Nov 05, 2023",
      time: "9:00 AM - 4:00 PM",
      location: "Mosque Community Center",
      description: "Free health checkup, diabetes test, and blood pressure monitoring for all community members."
    },
    {
      id: 3,
      title: "Winter Cloth Distribution",
      date: "Nov 15, 2023",
      time: "10:00 AM",
      location: "Mosque Gate 2",
      description: "Distributing warm clothes to the needy. Donations are welcome until Nov 10."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <p className="text-gray-500">Participate in our community activities</p>
        </div>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="md:flex">
              <div className="md:w-48 bg-indigo-50 flex flex-col items-center justify-center p-6 text-indigo-700 border-b md:border-b-0 md:border-r border-indigo-100">
                <span className="text-3xl font-bold">{event.date.split(' ')[1]}</span>
                <span className="text-sm font-medium uppercase tracking-wider">{event.date.split(' ')[0]}</span>
                <span className="text-xs mt-1 text-indigo-500">{event.date.split(' ')[2]}</span>
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
