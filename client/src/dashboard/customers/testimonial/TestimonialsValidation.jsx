import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Archived } from './Archived';
import { Pending } from './Pending';


export const TestimonialsValidation = () => {

  const [testimonials, setTestimonials] = useState([]);
  const [archivedTestimonials, setArchivedTestimonials] = useState([]);

  //récuparation des témoignages
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/testimonials`, {
          withCredentials: true,
        });
        const allTestimonials = response.data;
        //filtre les commentaires validé ou non
        const pendingTestimonials = allTestimonials.filter((testimonial) => testimonial.validated === 0);
        const archivedTestimonials = allTestimonials.filter((testimonial) => testimonial.validated === 1);
        setTestimonials(pendingTestimonials);
        setArchivedTestimonials(archivedTestimonials);
      } catch (error) {
        console.error('Erreur lors de la récupération des témoignages :', error);
      }
    };

    fetchTestimonials();
  }, []);

  //mise à jour du statu validé
  const validateTestimonial = async (testimonialId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/api/testimonials/${testimonialId}`, {
        validated: 1,
      }, {
        withCredentials: true,
      });

      // transfert du témoignage dans la liste des témoignages archivés
      const updatedTestimonials = testimonials.filter(
        (testimonial) => testimonial.id !== testimonialId
      );
      const archivedTestimonial = testimonials.find(
        (testimonial) => testimonial.id === testimonialId
      );
      setTestimonials(updatedTestimonials);
      setArchivedTestimonials([...archivedTestimonials, archivedTestimonial]);
    } catch (error) {
      console.error('Erreur lors de la validation du témoignage :', error);
    }
  };

  //effacer témoignage
  const deleteTestimonial = async (testimonialId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.delete(`${apiUrl}/api/testimonials/${testimonialId}`, {
        withCredentials: true,
      });
  
      // supprime témoignage dans le tableau archivé
      const updatedArchivedTestimonials = archivedTestimonials.filter(
        (testimonial) => testimonial.id !== testimonialId
      );
      setArchivedTestimonials(updatedArchivedTestimonials);
  
      // supprimer temoignage de la liste des témoignages en attente
      const updatedTestimonials = testimonials.filter(
        (testimonial) => testimonial.id !== testimonialId
      );
      setTestimonials(updatedTestimonials);
    } catch (error) {
      console.error('Erreur lors de la suppression du témoignage :', error);
    }
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Témoignages en attente de validation</h2>
      <Pending
        testimonials={testimonials}
        validateTestimonial={validateTestimonial}
        deleteTestimonial={deleteTestimonial}
      />

      <h2 className="text-xl pt-5 font-bold my-4">Témoignages archivés</h2>
      <Archived
        archivedTestimonials={archivedTestimonials}
        deleteTestimonial={deleteTestimonial}
      />
    </div>
  );
};