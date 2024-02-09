import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { DeleteAlbum } from './DeleteAlbum';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";

export const AddAlbum = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorStateEn, setEditorStateEn] = useState(() => EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setFormData({
      ...formData,
      description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    });
  };

  const onEditorStateChangeEn = (editorStateEn) => {
    setEditorStateEn(editorStateEn);
    setFormData({
      ...formData,
      descriptionEn: draftToHtml(convertToRaw(editorStateEn.getCurrentContent()))
    });
  };
  const [formData, setFormData] = useState({
    title: DOMPurify.sanitize(''),
    description: DOMPurify.sanitize(''),
    descriptionEn: DOMPurify.sanitize(''),
    bandcamp: '',
    albumLink: DOMPurify.sanitize('', { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assainir les données avant l'envoi
    const sanitizedData = {
      title: DOMPurify.sanitize(formData.title),
      description: DOMPurify.sanitize(formData.description),
      descriptionEn: DOMPurify.sanitize(formData.descriptionEn),
      bandcamp: formData.bandcamp,
      albumLink: DOMPurify.sanitize(formData.albumLink, { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
    };
    
    const frenchTitleRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -]+$/;
    const descriptionRegex = /^[\w\W\s]*$/;
  
    // Validation
    if (!frenchTitleRegex.test(formData.title)) {
      alert('Erreur : Le titre contient des caractères non valides');
      return;
    }
    if (!descriptionRegex.test(formData.description)) {
      alert('Erreur : La description contient des caractères non valides.');
      return;
    }
    if (!descriptionRegex.test(formData.descriptionEn)) {
      alert('Erreur : La description contient des caractères non valides.');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/api/albums`, sanitizedData, {
        withCredentials: true,
      });

      console.log(response.data); // Vous pouvez traiter la réponse comme nécessaire

      // Réinitialiser le formulaire après avoir ajouté l'album avec succès
      setFormData({
        title: DOMPurify.sanitize(''),
        description: DOMPurify.sanitize(''),
        descriptionEn: DOMPurify.sanitize(''),
        bandcamp: '',
        albumLink: DOMPurify.sanitize('', { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
      });

      setFormStatus('success');

    } catch (error) {
      console.error("Erreur lors de l'ajout de l'album ");
      setFormStatus('error');
    }
  };

  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur d'album</h2>
      
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <h2 className="text-lg font-bold mb-4  px-2 py-2 w-full">Ajouter un album</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-lg md:mx-2">
          <label className="block mb-4">
            <span className="text-gray-700">Titre de l'album:</span>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Intégrer lecteur Bandcamp (iframe):</span>
            <input type="text" name="bandcamp"  value={formData.bandcamp} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          <div className='flex items-center'>
            <span className="text-gray-700">Description en français:</span>
            <img src={fr} alt="" className='h-4 align-middle' />
          </div>
          <div className="mb-4 border border-gray-300">
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
              toolbar={{
                options: ['inline'],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic', 'underline']
                },
              }}
            />
        </div>
        <div className='flex items-center'>
            <span className="text-gray-700">Description en anglais:</span>
            <img src={en} alt="" className='h-4 align-middle' />
          </div>
        <div className="mb-4 border border-gray-300">
            <Editor
              editorState={editorStateEn}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChangeEn}
              toolbar={{
                options: ['inline'],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic', 'underline']
                },
              }}
            />
        </div>
          <label className="block mb-4">
            <span className="text-gray-700">Lien Bfan:</span>
            <input type="text" name="albumLink" value={formData.albumLink} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          {formStatus === 'success' && <div className="text-green-500 mb-3">Album ajouté avec succès!</div>}
          {formStatus === 'error' && <div className="text-red-500 mb-3">Erreur lors de l'ajout de l'album.</div>}
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Ajouter l'album</button>
        </form>

        <div className="mb-3 mt-9 border-b border-gray-300"></div>
        <DeleteAlbum />
    </div>
  );
};
