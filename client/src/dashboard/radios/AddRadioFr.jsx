import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


export const AddRadioFr = () => {
  const [status, setStatus] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const [radios, setRadios] = useState([]);
  const formRef = useRef();

  const [formData, setFormData] = useState({

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
        await axios.post(`${apiUrl}/api/radiofrs/`, {
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
      formRef.current.reset();
      setFormData({

        file: null,
      })
    }
  }, [status]) 

  const deleteRadio = (id) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    setFormStatus('loading');
    axios.delete(`${apiUrl}/api/radiofrs/${id}`, {
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
      const response = await axios.get(`${apiUrl}/api/radiofrs`);
      setRadios(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données');
    }
  };
  
  useEffect(() => {
    fetchRadios();
  }, []);

  return (
    <div className="">

      <h2 className="text-lg font-bold  px-2 py-2 w-full">Ajouter une radio française</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full max-w-lg md:mx-2'>
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

        {status === 'success' && <div className="text-green-500">La radio a été ajouté avec succès!</div>}
        {status === 'error' && <div className="text-red-500">Erreur lors de l'ajout de la radio</div>}
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Effacer une radio française</h2>
        {formStatus === 'success' && <div className="text-green-500">La radio a été effacé avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500">Erreur lors de l'effacement de la radio</div>}
        <div className="grid md:grid-cols-3 gap-4">
        {radios.map(radio => (
        <div key={radio.id} className="p-4 flex flex-col items-center">
            <div className=' w-[250px] text-center px-4 rounded'>
            <img src={radio.image} alt={radio.name} className="w-auto mx-auto h-[75px] object-cover mb-4 rounded" />
            </div>
            <button onClick={() => deleteRadio(radio.id)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Effacer</button>
            <div className="mb-5 mt-2 border-b border-gray-300 "></div>
        </div>
        ))}
        </div>
    </div>
  );
};