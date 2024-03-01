import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { DeleteAlbum } from './DeleteAlbum';
import { EditorState, convertToRaw, Modifier } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import xss from 'xss';

export const AddAlbum = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorStateEn, setEditorStateEn] = useState(() => EditorState.createEmpty());
  const [isMounted, setIsMounted] = useState(false);

  //config xss
  const options = {
    whiteList: {
      iframe: ['src', 'style'],
      a: ['href']
    },
    onTag: function(tag, html, options) {
      if (tag === 'iframe') {
        const srcMatch = html.match(/src="([^"]*)"/i);
        if (srcMatch && srcMatch[1] && !srcMatch[1].includes('https://bandcamp.com')) {
          return '';
        }
      }
    },
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
      if (name === 'style') {
        return `${name}="${xss.escapeAttrValue(value)}"`;
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Gestion de l'éditeur de texte
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    if (isMounted) {
      setFormData({
        ...formData,
        description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      });
    }
  };

  const onEditorStateChangeEn = (editorStateEn) => {
    setEditorStateEn(editorStateEn);
    if (isMounted) {
      setFormData({
        ...formData,
        descriptionEn: draftToHtml(convertToRaw(editorStateEn.getCurrentContent()))
      });
    }
  };

  // Gestion du collage de texte
  const handlePastedTextFr = (text, html, editorState) => {
    text = text.replace(/\n/g, ' ');
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const ncs = Modifier.replaceText(contentState, selection, text);
    const es = EditorState.push(editorState, ncs, 'insert-characters');
    setEditorState(es);
    return 'handled';
  };
  
  const handlePastedTextEn = (text, html, editorStateEn) => {
    text = text.replace(/\n/g, ' ');
    const selection = editorStateEn.getSelection();
    const contentState = editorStateEn.getCurrentContent();
    const ncs = Modifier.replaceText(contentState, selection, text);
    const es = EditorState.push(editorStateEn, ncs, 'insert-characters');
    setEditorStateEn(es);
    return 'handled';
  };
  
  const [formData, setFormData] = useState({
    title: DOMPurify.sanitize(''),
    description: DOMPurify.sanitize(''),
    descriptionEn: DOMPurify.sanitize(''),
    bandcamp: '',
    albumLink: DOMPurify.sanitize('', { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
});

useEffect(() => {
    setFormData(prevState => ({
        ...prevState,
        bandcamp: xss(prevState.bandcamp, options),
    }));
}, []);

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
      bandcamp: xss(formData.bandcamp, options),
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
       await axios.post(`${apiUrl}/api/albums`, sanitizedData, {
        withCredentials: true,
      });
    
      // Réinitialiser le formulaire après avoir ajouté l'album avec succès
      setFormData({
        title: DOMPurify.sanitize(''),
        description: DOMPurify.sanitize(''),
        descriptionEn: DOMPurify.sanitize(''),
        bandcamp: xss('', options),
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
          <div className='flex items-center mb-2'>
            <span className="text-gray-700 ">Description en français:</span>
            <img src={fr} alt="" className='w-[25px] h-[15px] align-middle' />
          </div>
          <div className="mb-4 border border-gray-300">
            <Editor
              editorState={editorState}
              handlePastedText={handlePastedTextFr}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
              stripPastedStyles={true}
              toolbar={{
                options: ['inline'],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic', 'underline']
                },
              }}
            />
        </div>
        <div className='flex items-center mb-2'>
            <span className="text-gray-700 ">Description en anglais:</span>
            <img src={en} alt="" className='w-[25px] h-[15px] align-middle' />
          </div>
        <div className="mb-4 border border-gray-300">
            <Editor
              editorState={editorStateEn}
              handlePastedText={handlePastedTextEn}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChangeEn}
              stripPastedStyles={true}
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
