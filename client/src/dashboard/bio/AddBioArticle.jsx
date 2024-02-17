import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import { EditorState, convertToRaw, Modifier } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";


export const AddBioArticle = () => {
  const [status, setStatus] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const [bios, setBios] = useState([]);
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
    title: DOMPurify.sanitize(''),
    titleEn: DOMPurify.sanitize(''),
    text: DOMPurify.sanitize(''),
    textEn: DOMPurify.sanitize(''),
    copyright: DOMPurify.sanitize(''),
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,});
  };

  const handlePastedTextFr = (text, html, editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const ncs = Modifier.replaceText(contentState, selection, text);
    const es = EditorState.push(editorState, ncs, 'insert-characters');
    setEditorState(es);
    return 'handled';
  };
  
  const handlePastedTextEn = (text, html, editorStateEn) => {
    const selection = editorStateEn.getSelection();
    const contentState = editorStateEn.getCurrentContent();
    const ncs = Modifier.replaceText(contentState, selection, text);
    const es = EditorState.push(editorStateEn, ncs, 'insert-characters');
    setEditorStateEn(es);
    return 'handled';
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
      console.error('error');
    }
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
  
    // empeche l'envoi du formulaire si le fichier est trop lourd
    if (formData.file && formData.file.size > 5 * 1024 * 1024) {
        alert("Le fichier dépasse 5 Mo");
        return;
        }

    const {url, filename} = await uploadImage(formData.file);

    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.post(`${apiUrl}/api/bios/`, {
          ...formData,
          image: url,
          filename: filename
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchBios();
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de l\'ajout de l\'article');
      }
    };

  useEffect(() => {
    if(status === 'success') {
      formRef.current.reset();
      setFormData({
        title: '',
        titleEn: '',
        text: '',
        textEn: '',
        file: null,
      })
    }
  }, [status]) 

  const deleteBio= (id) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?');
    if (!confirmation) {
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    
    axios.delete(`${apiUrl}/api/bios/${id}`, {
        withCredentials: true,
      })
      .then(response => {
        setBios(bios.filter(bio=> bio.id !== id));
        setFormStatus('success');
      })
      .catch(error => {
        setFormStatus('error');
      });
  };

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

      <h2 className="text-lg font-bold  px-2 py-2 w-full">Ajouter un texte bio</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full  md:mx-2'>
      <div className='flex items-center'>
        <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte bio en français</h2>
        <img src={fr} alt="" className='w-[25px] h-[15px] align-middle' />
      </div>
      <div className="p-4">
        <div className="mb-4 max-w-lg">
            <label htmlFor="file" className="block mb-2">Image de l'article</label>
            <p className='italic text-md mb-2'>Idéalement de taille 850x450px et au format jpg ou png</p>
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
            <input className="border p-2 w-full" placeholder="Auteur de l'image" name="copyright" value={formData.copyright} onChange={handleChange} />
        </div>

        <div className="mb-4">
            <input className="border p-2 w-full font-custom" placeholder="Titre de l'article" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="mb-4 border border-gray-300">
      <Editor
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
          <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte bio en anglais</h2>
          <img src={en} alt="" className='w-[25px] h-[15px] align-middle' />
        </div>

        <div className="mb-4">
            <input className="border p-2 w-full font-custom" placeholder="Titre de l'article en anglais" name="titleEn" value={formData.titleEn} onChange={handleChange} />
        </div>
        <div className="mb-4 border border-gray-300">

      <Editor
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

        {status === 'success' && <div className="text-green-500">L'article a été ajouté avec succès!</div>}
        {status === 'error' && <div className="text-red-500">Erreur lors de l'ajout de l'article</div>}
        <button className=" mt-9 w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Effacer un article</h2>
        {formStatus === 'success' && <div className="text-green-500 mb-2">L'article a été effacé avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500 mb-2">Erreur lors de l'effacement de l'article</div>}
        <div className="grid md:grid-cols-3 gap-4">
        {bios.map(bio => (
          <div key={bio.id} className="p-3 flex flex-col items-center bg-neutral-800 rounded shadow-lg border border-gray-300">
            <h2 className="mb-2"><span className='text-md font-bold text-white font-custom'>{bio.title}</span></h2>
            <img src={bio.image} alt={bio.title} className="w-[350px] h-[150px] object-cover mb-4 rounded " />
            
            <button onClick={() => deleteBio(bio.id)} className="mt-auto  bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full  ">Effacer</button>
        </div>
        ))}
        </div>
    </div>
  );
};