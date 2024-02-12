import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import { EditorState, convertToRaw, ContentState, convertFromHTML, } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

export const UpdateAlbum = () => {
  const [status, setStatus] = useState('');
  const [albums, setAlbums] = useState([]);
  const formRef = useRef();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorStateEn, setEditorStateEn] = useState(() => EditorState.createEmpty());
  const [editingId, setEditingId] = useState(null);
  const { t, i18n } = useTranslation();

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

  const editAlbum = (album) => {
    setEditingId(album.id);
    const blocksFromHtmlFr = convertFromHTML(album.description);
    const stateFr = ContentState.createFromBlockArray(
      blocksFromHtmlFr.contentBlocks,
      blocksFromHtmlFr.entityMap,
    );

    const blocksFromHtmlEn = convertFromHTML(album.descriptionEn);
    const stateEn = ContentState.createFromBlockArray(
      blocksFromHtmlEn.contentBlocks,
      blocksFromHtmlEn.entityMap,
    );

    setEditorState(EditorState.createWithContent(stateFr));
    setEditorStateEn(EditorState.createWithContent(stateEn));

    setFormData({
      title: DOMPurify.sanitize(album.title),
      description: draftToHtml(convertToRaw(stateFr)),
      descriptionEn: draftToHtml(convertToRaw(stateEn)),
      bandcamp: album.bandcamp,
      albumLink: DOMPurify.sanitize(album.albumLink, { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
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
    if (!descriptionRegex.test(formData.description)) {
        alert('Le texte contient des caractères non valides.');
        return;
    }

    if (!descriptionRegex.test(formData.descriptionEn)) {
      alert('Le texte contient des caractères non valides.');
      return;
  }

    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.put(`${apiUrl}/api/albums/${editingId}`, {
          ...formData,
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchAlbums();
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
          description: '',
          descriptionEn: '',
          bandcamp: '',
          albumLink: '',
        });
        setEditorState(EditorState.createWithContent(ContentState.createFromText('')));
        setEditorStateEn(EditorState.createWithContent(ContentState.createFromText('')));
      }
    }, [status])

  const fetchAlbums = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/albums`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données');
    }
  };
  
  useEffect(() => {
    fetchAlbums();
  }, []);

  const extractBandcampLink = (iframeHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(iframeHtml, 'text/html');
    const iframe = doc.querySelector('iframe');
    if (iframe) {
      return iframe.getAttribute('src');
    }
    return null;
  };

  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Modifier un album</h2>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Editer un album</h2>
        <div className="grid md:grid-cols-3 gap-4">
        {albums.map(album => (
        <div 
          key={album.id} 
          className={`p-3 flex flex-col items-center bg-neutral-800 rounded shadow-lg border ${album.id === editingId ? 'border-[4px] border-green-500' : 'border-gray-300'}`}
        >
          <h2 className="mb-2"><span className='text-md font-bold text-white font-custom'>{album.title}</span></h2>
          <button onClick={() => editAlbum(album)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Editer</button>
        </div>
      ))}
        </div>

        <h2 className="text-2xl text-center font-bold  px-2 py-2 w-full">Aperçu</h2>
        {editingId ? (
          albums.slice().reverse().map((album) => (
            album.id === editingId ? (
                    <div key={album.id} className=" flex flex-col lg:flex-row align-items-start bg-neutral-800  md:p-5 text-white rounded">
                      <div className="lg:mb-0 mb-4 ">
                        <div className='flex items-center mb-4'>
                          <h1 className='text-xl font-bold uppercase  text-center lg:text-left mr-5'>{album.title}</h1>
                        </div>
                        <iframe
                          title={`Bandcamp ${t(album.title)}`}
                          style={{ border: 10, width: '350px', height: '470px' }}
                          className='mx-auto lg:mx-0 shadow-xl rounded-lg'
                          src={extractBandcampLink(album.bandcamp)}
                          seamless
                        >
                          <a href={album.bandcamp}>{t(album.title)} sur Bandcamp</a>
                        </iframe>
                      </div>
                      <div className='lg:flex lg:flex-col lg:items-center lg:ml-8 mb-7'>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? album.descriptionEn : album.description).replace(/\n/g, '<br />')) }} 
                        className='text-lg text-justify p-3 mx-2 bg-black bg-opacity-50 md:bg-transparent lg:text-left sm:w-[400px] md:w-[600px] md:mt-[50px]  animate-fade-left'/>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 ">
                          <a
                            href={album.albumLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-orange2 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded lg:mb-0 mx-3 text-center animate-fade-up shadow-md"
                          >
                            {t('music.button')}
                          </a>
                          <a href="/media" className='text-orange2 underline mt-1 mx-3 text-center animate-fade-up animate-delay-500 '>{t('music.press')}</a>
                        </div>
                      </div>
                    </div>
              ) : null
              ))
            ) : (
              
              <div className="skeleton flex flex-col items-center justify-center bg-neutral-800  md:p-5 text-white rounded">
                <img src={logo} alt="Engramma Logo" className='h-[100px] my-5' />
                <p className='text-white font semibold text-lg'>Veuillez sélectionner un album à éditer pour voir l'aperçu</p>
                <div className="skeleton-box flex flex-col items-center ml-8 mb-5"></div>
              </div>
            )}

    <div className="mb-5 mt-5 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full">Editer un album</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full  md:mx-2'>
      <div className='flex items-center'>
        <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte de l'album en français</h2>
        <img src={fr} alt="" className='w-[25px] h-[15px] align-middle' />
      </div>
      <div className="p-4">

        <div className="mb-4">
          <span className='mb-2'>Lien bandcamp</span>
            <input className="border p-2 w-full" placeholder="Lien bandcamp" name="copyright" value={formData.bandcamp} onChange={handleChange} />
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
          <h2 className="text-lg px-2" style={{ lineHeight: '1.5' }}>Texte de l'album en anglais</h2>
          <img src={en} alt="" className='w-[25px] h-[15px] align-middle' />
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

        {status === 'success' && <div className="text-green-500">L'album a été édité avec succès!</div>}
        {status === 'error' && <div className="text-red-500">Erreur lors de l'édition de l'album</div>}
        <button className=" mt-9 w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  );
};