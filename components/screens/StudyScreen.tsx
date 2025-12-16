
import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import { generateStudyExplanation } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown'; // For GitHub Flavored Markdown
import remarkGfm from 'remark-gfm';
import { useAppContext } from '../Layout';
import { useAuth } from '../../AuthContext'; // Import useAuth

const StudyScreen: React.FC = () => {
  const { getApiKey } = useAppContext();
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext

  const [studyTopic, setStudyTopic] = useState<string>('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateExplanation = async () => {
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('API Key não disponível. Por favor, selecione sua chave.');
      setIsLoading(false);
      return;
    }

    if (!studyTopic.trim()) {
      setError('Por favor, insira um versículo ou tópico para estudar.');
      setIsLoading(false);
      return;
    }

    try {
      const generatedExplanation = await generateStudyExplanation(apiKey, studyTopic);
      setExplanation(generatedExplanation);
    } catch (err: any) {
      console.error('Failed to generate study explanation:', err);
      setError(err.message || 'Falha ao gerar explicação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    alert('Funcionalidade de edição de perfil em desenvolvimento!');
    console.log('Editar Perfil clicado');
  };

  const handleSettings = () => {
    alert('Funcionalidade de configurações em desenvolvimento!');
    console.log('Configurações clicadas');
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-text-white mb-6">Meu Perfil e Configurações</h1>

      {/* Placeholder for Profile Info */}
      <div className="mb-8 bg-card-dark p-6 rounded-2xl shadow-card border border-white/5 text-center">
        <div className="size-24 rounded-full bg-surface-lighter mx-auto flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-5xl text-premium-gold/50">person</span>
        </div>
        <h2 className="text-xl font-display font-medium text-text-white">{user?.name || 'Usuário'}</h2>
        <p className="text-sm text-text-muted font-sans mt-1">{user?.email || 'N/A'}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            className="flex items-center gap-2 text-sm text-premium-gold hover:text-premium-gold-light transition-colors font-sans"
            onClick={handleEditProfile}
            aria-label="Editar perfil"
          >
            <span className="material-symbols-outlined text-lg">edit</span> Editar Perfil
          </button>
          <button
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-white transition-colors font-sans"
            onClick={handleSettings}
            aria-label="Abrir configurações"
          >
            <span className="material-symbols-outlined text-lg">settings</span> Configurações
          </button>
        </div>
        <Button onClick={logout} variant="secondary" className="mt-6 w-full max-w-[200px]" aria-label="Sair da conta">
          Sair
        </Button>
      </div>

      {/* Study Area - repurposed from original functionality */}
      <div className="mb-8 bg-card-dark p-6 rounded-2xl shadow-card border border-white/5">
        <h2 className="text-xl font-display font-medium text-text-white mb-4">Explicador Bíblico</h2>
        <Input
          id="study-topic"
          placeholder="Ex: João 3:16, parábola do semeador, o que é fé?"
          value={studyTopic}
          onChange={(e) => setStudyTopic(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGenerateExplanation();
            }
          }}
          className="mb-4"
          aria-label="Tópico para explicação bíblica"
        />
        <Button onClick={handleGenerateExplanation} fullWidth disabled={isLoading} aria-label="Gerar explicação">
          {isLoading ? 'Gerando Explicação...' : 'Gerar Explicação'}
        </Button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center mt-4 font-sans">{error}</p>}

      {explanation && (
        <div className="bg-card-dark p-6 rounded-2xl shadow-card border border-white/5 mt-8">
          <h2 className="text-2xl font-display font-bold text-premium-gold mb-4">Explicação para "{studyTopic}"</h2>
          <div className="prose dark:prose-invert max-w-none text-text-white font-sans text-base leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {explanation}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyScreen;