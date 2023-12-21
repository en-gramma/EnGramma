import React from 'react';
import {AiOutlineDelete} from 'react-icons/ai';

export const Archived = ({ archivedTestimonials, deleteTestimonial }) => {
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
        {archivedTestimonials.map((testimonial) => (
          <tr key={testimonial.id} className="border border-gray-300">
            <td className="border border-gray-300 px-4 py-2">{testimonial.user}</td>
            <td className="border border-gray-300 px-4 py-2">{testimonial.testimonial}</td>
            <td className="border border-gray-300 px-4 py-2">{testimonial.note}</td>
            <td className="border border-gray-300 px-4 py-2">
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