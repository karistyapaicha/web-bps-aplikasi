import React, { createContext, useState, useEffect } from 'react';
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const data = await publicationService.getPublications();
                setPublications(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const addPublication = async (newPub) => {
        try {
            const added = await publicationService.addPublication(newPub);
            setPublications((prev) => [added, ...prev]);
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const editPublication = async (updatedPub) => {
        try {
            const result = await publicationService.updatePublication(updatedPub.id, updatedPub);
            setPublications((prev) =>
                prev.map(pub => pub.id === updatedPub.id ? result : pub)
            );
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deletePublication = async (id) => {
        try {
            await publicationService.deletePublication(id);
            setPublications(prev => prev.filter(pub => pub.id !== id));
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return (
        <PublicationContext.Provider
            value={{
                publications,
                loading,
                error,
                addPublication,
                editPublication,
                deletePublication,
            }}
        >
            {children}
        </PublicationContext.Provider>
    );
};


export { PublicationContext, PublicationProvider };