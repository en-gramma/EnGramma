import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import { EditorState, convertToRaw, ContentState, convertFromHTML, Modifier } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

export const UpdateHome = () => {
  const [status, setStatus] = useState('');
  const [homes, setHomes] = useState([]);
  const formRef = useRef();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorStateEn, setEditorStateEn] = useState(() => EditorState.createEmpty());

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
    text: DOMPurify.sanitize(''),
    textEn: DOMPurify.sanitize(''),
  });

  useEffect(() => {
    if (homes.length > 0) {
      const home = homes[0]; // Prendre le premier élément de homes par défaut
  
      const blocksFromHtmlFr = convertFromHTML(home.text);
      const stateFr = ContentState.createFromBlockArray(
        blocksFromHtmlFr.contentBlocks,
        blocksFromHtmlFr.entityMap,
      );
  
      const blocksFromHtmlEn = convertFromHTML(home.textEn);
      const stateEn = ContentState.createFromBlockArray(
        blocksFromHtmlEn.contentBlocks,
        blocksFromHtmlEn.entityMap,
      );
  
      setEditorState(EditorState.createWithContent(stateFr));
      setEditorStateEn(EditorState.createWithContent(stateEn));
  
      setFormData({
        text: draftToHtml(convertToRaw(stateFr)),
        textEn: draftToHtml(convertToRaw(stateEn)),
      });
    }
  }, [homes]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex pour la validation

    const descriptionRegex = /^[\w\W\s]*$/;
    if (!descriptionRegex.test(formData.text)) {
        alert('Le texte contient des caractères non valides.');
        return;
    }

    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.put(`${apiUrl}/api/homes/1`, {
          ...formData,
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchHomes();
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de la mise à jour de l\'article');
      }
    };

    useEffect(() => {
      if(status === 'success') {
        formRef.current.reset();

        setFormData({
          text: '',
          textEn: '',
        });
        setEditorState(EditorState.createWithContent(ContentState.createFromText('')));
        setEditorStateEn(EditorState.createWithContent(ContentState.createFromText('')));
      }
    }, [status])

  const fetchHomes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/homes`);
      setHomes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données');
    }
  };
  
  useEffect(() => {
    fetchHomes();
  }, []);

  
  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur page d'accueil</h2>
    <div className="mb-5 mt-5 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full">Editer le texte d'accueil</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full  md:mx-2'>
      <div className='flex items-center'>
        <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte en français</h2>
        <img src={fr} alt="" className='w-[25px] h-[15px] align-middle' />
      </div>
      <div className="p-4">

        <div className="mb-4 border border-gray-300">
      <Editor
        key={status}
        editorState={editorState}
        handlePastedText={handlePastedTextFr}
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
          <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte en anglais</h2>
          <img src={en} alt="" className='w-[25px] h-[15px] align-middle' />
        </div>

        <div className="mb-4 border border-gray-300">
      <Editor
        key={status}
        editorState={editorStateEn}
        handlePastedText={handlePastedTextEn}
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

        {status === 'success' && <div className="text-green-500">La page d'accueil a été mise à jour avec succès!</div>}
        {status === 'error' && <div className="text-red-500">Erreur lors de l'édition de la page</div>}
        <button className=" mt-9 w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

    </div>
  );
};