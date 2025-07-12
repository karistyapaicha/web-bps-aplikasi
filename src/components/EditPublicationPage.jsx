import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePublications } from '../hooks/usePublications';
import { uploadImageToCloudinary } from '../services/publicationService';

export default function EditPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publications, editPublication } = usePublications();
  const publication = publications.find(pub => pub.id === Number(id));

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (publication) {
      setTitle(publication.title || '');
      setReleaseDate(publication.releaseDate || '');
      setCoverUrl(publication.coverUrl || '');
      setDescription(publication.description || '');
    }
  }, [publication]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !releaseDate) {
      alert('Judul dan Tanggal Rilis harus diisi!');
      return;
    }
    let finalCoverUrl = coverUrl;

    if (coverFile) {
      try {
        finalCoverUrl = await uploadImageToCloudinary(coverFile);
      } catch (err) {
        alert('Gagal upload gambar: ' + err.message);
        return;
      }
    }
    const updatedPub = {
      ...publication,
      title: title.trim() || '(Tanpa Judul)',
      releaseDate,
      coverUrl: finalCoverUrl || '',
      description,
    };
    try {
      await editPublication(updatedPub);
      requestAnimationFrame(() => {
        navigate('/publications');
      });
    } catch (err) {
      alert('Gagal mengedit publikasi: ' + err.message);
      return;
    }
  };


  if (!publication) {
    return <div className="text-center mt-10">Publikasi tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Provinsi Kalimantan Selatan dalam Angka 2024"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Publikasi ini memuat data strategis Kalimantan Selatan."
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Sampul (Gambar)</label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {coverUrl && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Sampul saat ini:</span>
              <img
                src={coverFile ? URL.createObjectURL(coverFile) : coverUrl}
                alt="Current Cover"
                className="h-40 mt-1 rounded shadow-md"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/publications')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
} 