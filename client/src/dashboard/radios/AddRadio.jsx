import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';

export const AddRadio = () => {
  const [status, setStatus] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const [radios, setRadios] = useState([]);

  const [formData, setFormData] = useState({
    description: DOMPurify.sanitize(''),
    country: DOMPurify.sanitize(''),
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,});
  };

  const uploadImage = async (file) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Le fichier dépasse 5Mo');
    }
 
    try {
      //setup cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
      const response = await axios.post("https://api.cloudinary.com/v1_1/dvfel75pw/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      // récupération de l'url et du nom du fichier
      return {
        url: response.data.url, 
        filename: file.name
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // empeche l'envoi du formulaire si le fichier est trop lourd
    if (formData.file && formData.file.size > 5 * 1024 * 1024) {
        alert("Le fichier dépasse 5 Mo");
        return;
        }

    const {url, filename} = await uploadImage(formData.file);

    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.post(`${apiUrl}/api/radios/`, {
          ...formData,
          image: url,
          filename: filename
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchRadios();
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de l\'ajout de la radio');
      }
    };

  useEffect(() => {
    if(status === 'success') {
      setFormData({
        description: '',
        country: '',
        file: null,
      })
    }
  }, [status]) 

  const deleteRadio = (id) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    setFormStatus('loading');
    axios.delete(`${apiUrl}/api/radios/${id}`, {
        withCredentials: true,
      })
      .then(response => {
        setRadios(radios.filter(radio => radio.id !== id));
        setFormStatus('success');
      })
      .catch(error => {
        console.error(error);
        setFormStatus('error');
      });
  };

  const fetchRadios = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/radios`);
      setRadios(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données');
    }
  };
  
  useEffect(() => {
    fetchRadios();
  }, []);

  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur radio</h2>
      <div className="mb-5 mt-2 border-b border-gray-300 "></div>

      <h2 className="text-lg font-bold  px-2 py-2 w-full">Ajouter une radio internationale</h2>
      <form onSubmit={handleSubmit}>
      <div className="p-4">
        <div className="mb-4">
            <label htmlFor="file" className="block mb-2">Logo de la radio</label>
            <p className='italic text-md mb-2'>Idéalement de taille 100x100px et au format .png transparent</p>
            <input
            required
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            className="border border-gray-400 w-full"
            />
        </div>

        <div className="mb-4">
            <input required className="border p-2 w-full" placeholder="Non de la radio" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="mb-4">
            <input required className="border p-2 w-full" placeholder="Pays" name="country" value={formData.country} onChange={handleChange} />
        </div>
        <div className="mb-4">
            <input className="border p-2 w-full" placeholder="Brève description de la radio" name="description" value={formData.description} onChange={handleChange} />
        </div>
        {setStatus === 'success' && <div className="text-green-500">La radio a été ajouté avec succès!</div>}
        {setStatus === 'error' && <div className="text-red-500">Erreur lors de l'ajout de la radio</div>}
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Effacer une radio internationale</h2>
        {formStatus === 'success' && <div className="text-green-500">La radio a été effacé avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500">Erreur lors de l'effacement de la radio</div>}
        <div className="grid md:grid-cols-3 gap-4">
        {radios.map(radio => (
        <div key={radio.id} className="p-4 flex flex-col items-center">
            <div className='bg-gray-100 border w-[250px] text-center px-4 rounded'>
            <img src={radio.image} alt={radio.name} className="w-auto mx-auto h-[75px] object-cover mb-4 rounded" />
            <div className="my-1 border-b border-gray-300 "></div>
            <h2 className="mb-2"> <span className=' font-semibold'>{radio.country}</span></h2>

            <p className='text-gray-700 '>{radio.description}</p>
            </div>
            <button onClick={() => deleteRadio(radio.id)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Effacer</button>
            <div className="mb-5 mt-2 border-b border-gray-300 "></div>
        </div>
        ))}
        </div>
    </div>
  );
};