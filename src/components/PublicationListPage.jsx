import React, {useState} from 'react';
import { usePublications } from '../hooks/usePublications';
import { useNavigate } from 'react-router-dom';

export default function PublicationListPage() {
  const { publications, deletePublication } = usePublications();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState([]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin hapus publikasi ini?");
    if (!confirm) return;

    try {
      await deletePublication(id);
      alert("Publikasi berhasil dihapus.");
    } catch (error) {
      alert("Gagal hapus publikasi: " + error.message);
    }
  };

  const toggleDescription = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const truncate = (text, limit = 15) => {
    const words = text.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : text;
  };  

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Daftar Publikasi BPS Provinsi Kalimantan Selatan</h1>
        <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
      </header>
      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700 text-center">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-15">No</th>
              <th scope="col" className="px-6 py-3 w-1/5">Judul</th>
              <th scope="col" className="px-6 py-3 whitespace-pre-line w-2/5">Deskripsi</th>
              <th scope="col" className="px-6 py-3">Tanggal Rilis</th>
              <th scope="col" className="px-6 py-3 text-center">Sampul</th>
              <th scope="col" className="px-6 py-3 text-center w-1/7">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub, idx) => (
              <tr key={pub.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 font-medium text-gray-900 text-center">{idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{pub.title || '-'}</td>
                <td className="px-6 py-4 text-gray-700 whitespace-pre-line">
                  {expandedRows.includes(pub.id)
                    ? pub.description
                    : truncate(pub.description || '-', 15)}
                  {pub.description && pub.description.split(' ').length > 15 && (
                    <div>
                      <span
                        onClick={() => toggleDescription(pub.id)}
                        className="text-blue-600 cursor-pointer text-sm"
                      >
                        {expandedRows.includes(pub.id) ? 'Lebih Sedikit' : 'Baca Selengkapnya'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">{pub.releaseDate}</td>
                <td className="px-6 py-4 flex justify-center items-center h-full w-full">
                  <img
                    src={pub.coverUrl || 'https://placehold.co/100x140?text=No+Image'}
                    alt={`Sampul ${pub.title}` || 'Publikasi'}
                    className="h-24 w-auto object-cover rounded shadow-md"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x140/cccccc/ffffff?text=Error'; }}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold"
                    onClick={() => navigate(`/publications/edit/${pub.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold ml-2"
                    onClick={() => handleDelete(pub.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}