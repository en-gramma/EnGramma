import React from 'react';
import {AiOutlineDelete} from 'react-icons/ai';
import { FaCheck } from "react-icons/fa";

export const Pending = ({ testimonials, validateTestimonial, deleteTestimonial }) => {
  return (
    <table className="min-w-full border-collapse shadow">
        <thead>
        <tr className="bg-neutral-200">
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Commentaire</th>
            <th className="border border-gray-300 px-4 py-2">Note</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
        </thead>
        <tbody className="bg-white">
        {testimonials.map((testimonial) => (
            <tr key={testimonial.id} className="border border-gray-300">
            <td className="border border-gray-300 px-4 py-2">{testimonial.user}</td>
            <td className="border border-gray-300 px-4 py-2">{testimonial.testimonial}</td>
            <td className="border border-gray-300 px-4 py-2">{testimonial.note}</td>
            <td className="border border-gray-300 px-4 py-2">
            <button
                onClick={() => validateTestimonial(testimonial.id)}
              className="text-blue-600 hover:text-blue-800 flex items-center">
              <FaCheck className="mr-1" />
              Valider
              </button>
              <div className="mb-2 mt-2 border-b border-gray-300"></div>
                <button
                onClick={() => deleteTestimonial(testimonial.id)}
              className="text-red-600 hover:text-red-800 flex items-center">
              <AiOutlineDelete className="mr-1" />
              Supprimer
              </button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    );
};




