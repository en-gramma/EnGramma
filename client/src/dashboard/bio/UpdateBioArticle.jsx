import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import { EditorState, convertToRaw, ContentState, convertFromHTML, } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

export const UpdateBioArticle = () => {
  const [status, setStatus] = useState('');
  const [bios, setBios] = useState([]);
  const formRef = useRef();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorStateEn, setEditorStateEn] = useState(() => EditorState.createEmpty());
  const [editingId, setEditingId] = useState(null);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setFormData({
      ...formData,
      text: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    });
  };

  const onEditorStateChangeEn = (editorStateEn) => {
    setEditorStateEn(editorStateEn);
    setFormData({
      ...formData,
      textEn: draftToHtml(convertToRaw(editorStateEn.getCurrentContent()))
    });
  };

  const [formData, setFormData] = useState({
    title: DOMPurify.sanitize(''),
    titleEn: DOMPurify.sanitize(''),
    text: DOMPurify.sanitize(''),
    textEn: DOMPurify.sanitize(''),
    copyright: DOMPurify.sanitize(''),
  });

  const editBio = (bio) => {
    setEditingId(bio.id);
    const blocksFromHtmlFr = convertFromHTML(bio.text);
    const stateFr = ContentState.createFromBlockArray(
      blocksFromHtmlFr.contentBlocks,
      blocksFromHtmlFr.entityMap,
    );

    const blocksFromHtmlEn = convertFromHTML(bio.textEn);
    const stateEn = ContentState.createFromBlockArray(
      blocksFromHtmlEn.contentBlocks,
      blocksFromHtmlEn.entityMap,
    );

    setEditorState(EditorState.createWithContent(stateFr));
    setEditorStateEn(EditorState.createWithContent(stateEn));

    setFormData({
      title: DOMPurify.sanitize(bio.title),
      titleEn: DOMPurify.sanitize(bio.titleEn),
      text: draftToHtml(convertToRaw(stateFr)),
      textEn: draftToHtml(convertToRaw(stateEn)),
      copyright: DOMPurify.sanitize(bio.copyright),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex pour la validation
    const frenchTextRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -]*$/;
    if (!frenchTextRegex.test(formData.title)) {
      alert('Le titre contient des caractères non valides.');
      return;
    }

    const descriptionRegex = /^[\w\W\s]*$/;
    if (!descriptionRegex.test(formData.text)) {
        alert('Le texte contient des caractères non valides.');
        return;
    }

    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.put(`${apiUrl}/api/bios/${editingId}`, {
          ...formData,
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchBios();
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de la mise à jour de l\'article');
      }
    };

    useEffect(() => {
      if(status === 'success') {
        formRef.current.reset();
        setEditingId(null);
        setFormData({
          title: '',
          titleEn: '',
          text: '',
          textEn: '',
          copyright: '',
        });
        setEditorState(EditorState.createWithContent(ContentState.createFromText('')));
        setEditorStateEn(EditorState.createWithContent(ContentState.createFromText('')));
      }
    }, [status])

  const fetchBios = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/bios`);
      setBios(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données');
    }
  };
  
  useEffect(() => {
    fetchBios();
  }, []);

  
  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur d'article (bio)</h2>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Editer un article</h2>
        <div className="grid md:grid-cols-3 gap-4">
        {bios.map(bio => (
        <div key={bio.id} className="p-3 flex flex-col items-center bg-neutral-800 rounded shadow-lg border border-gray-300">
            <h2 className="mb-2"><span className='text-md font-bold text-white font-custom'>{bio.title}</span></h2>
            <img src={bio.image} alt={bio.title} className="w-[350px] h-[150px] object-cover mb-4 rounded " />
            <button onClick={() => editBio(bio)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Editer</button>
        </div>
        ))}
        </div>

    <div className="mb-5 mt-5 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full">Editer un texte bio</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full  md:mx-2'>
      <div className='flex items-center'>
        <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte bio en français</h2>
        <img src={fr} alt="" className='h-4 align-middle' />
      </div>
      <div className="p-4">

        <div className="mb-4">
            <input className="border p-2 w-full" placeholder="Auteur de l'image" name="copyright" value={formData.copyright} onChange={handleChange} />
        </div>

        <div className="mb-4">
            <input className="border p-2 w-full font-custom" placeholder="Titre de l'article" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="mb-4 border border-gray-300">
      <Editor
        key={status}
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

        <div className='flex items-center mt-[75px] mb-3'>
          <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte bio en anglais</h2>
          <img src={en} alt="" className='h-4 align-middle' />
        </div>

        <div className="mb-4">
            <input className="border p-2 w-full font-custom" placeholder="Titre de l'article en anglais" name="titleEn" value={formData.titleEn} onChange={handleChange} />
        </div>
        <div className="mb-4 border border-gray-300">
      <Editor
        key={status}
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

        {setStatus === 'success' && <div className="text-green-500">L'article a été édité avec succès!</div>}
        {setStatus === 'error' && <div className="text-red-500">Erreur lors de l'édition de l'article</div>}
        <button className=" mt-9 w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

    </div>
  );
};