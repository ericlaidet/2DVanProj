import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserGuide.css';

const UserGuide: React.FC = () => {
    const [content, setContent] = useState<string>('Chargement du guide...');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/NOTICE_UTILISATION.md')
            .then(res => res.text())
            .then(text => setContent(text))
            .catch(err => {
                console.error('Erreur chargement guide:', err);
                setContent('Erreur lors du chargement du guide d\'utilisation.');
            });
    }, []);

    // Simple custom markdown parser to avoid dependency issues with react-markdown
    const formatMarkdown = (text: string) => {
        return text.split('\n').map((line, i) => {
            // 1. Headers
            if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;

            // 2. Bold & Simple Text
            const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            // 3. Lists
            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                const listText = line.trim().substring(2);
                return <li key={i}>{listText}</li>;
            }

            // 4. Blockquotes
            if (line.startsWith('> ')) {
                return <blockquote key={i}>{line.replace('> ', '')}</blockquote>;
            }

            // 5. Empty lines
            if (!line.trim()) return <div key={i} style={{ height: '0.5rem' }} />;

            // 6. Simple Paragraph
            return <p key={i}>{parts}</p>;
        });
    };

    return (
        <div className="user-guide-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                ← Retour
            </button>
            <div className="guide-container fade-in">
                {formatMarkdown(content)}
            </div>
        </div>
    );
};

export default UserGuide;
