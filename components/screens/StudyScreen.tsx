
import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import { generateStudyExplanation } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppContext } from '../Layout';
import { useAuth } from '../../AuthContext';

const StudyScreen: React.FC = () => {
  const { apiKey, triggerApiKeySelection } = useAppContext();
  const { user, logout } = useAuth();

  const [studyTopic, setStudyTopic] = useState<string>('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateExplanation = async () => {
    setIsLoading(true);
    setError(null);

    if (!studyTopic.trim()) {
      setError('Por favor, insira um tópico.');
      setIsLoading(false);
      return;
    }

    if (!apiKey) {
      // Demo Mode Explanation Fallback
      await new Promise(resolve => setTimeout(resolve, 2000));
      setExplanation(`### Explicação para: ${studyTopic} (Modo Demo)
      
Esta é uma simulação de como a IA do HINEMI funciona. No modo completo, o Gemini Pro 2 analisaria profundamente este tópico.

**O que este tópico geralmente ensina:**
1. **Contexto Histórico:** Muitos estudiosos relacionam este tema com a soberania divina e a responsabilidade humana.
2. **Conexão Bíblica:** Pode ser conectado com Romanos 12 e Efésios 6.
3. **Aplicação:** Pratique a paciência e a fé em sua rotina diária.

*Ative sua chave Gemini no perfil para explicações teológicas reais.*`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateStudyExplanation(apiKey, studyTopic);
      setExplanation(result);
    } catch (err: any) {
      setError('Falha ao conectar com o céu digital. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in pb-32">
      <h1 className="text-3xl font-display font-bold text-text-white mb-8">Meu Santuário</h1>

      <div className="bg-card-dark p-6 rounded-2xl border border-white/5 mb-8 text-center">
        <div className="size-20 rounded-full bg-premium-gold/10 mx-auto flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-premium-gold">person</span>
        </div>
        <h2 className="text-xl font-display font-medium text-text-white">{user?.email?.split('@')[0] || 'Discípulo(a)'}</h2>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Nível de Fé: Semeador</p>
        
        <div className="mt-8 flex flex-col gap-2">
          <Button variant="secondary" onClick={() => alert('Alterar dados em breve.')} className="text-xs">Editar Perfil</Button>
          <Button variant="ghost" onClick={logout} className="text-xs text-red-500">Encerrar Sessão</Button>
        </div>
      </div>

      <div className="bg-card-dark p-6 rounded-2xl border border-white/5">
        <h2 className="text-xl font-display font-medium text-text-white mb-2">Explicador Teológico</h2>
        <p className="text-xs text-text-muted mb-6">Dúvida sobre um versículo? Peça luz ao HINEMI.</p>
        <Input
          id="study-topic"
          placeholder="Ex: Por que Jesus chorou em João 11?"
          value={studyTopic}
          onChange={(e) => setStudyTopic(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGenerateExplanation()}
        />
        <Button onClick={handleGenerateExplanation} fullWidth disabled={isLoading}>
          {isLoading ? 'Consultando as escrituras...' : 'Pedir Explicação'}
        </Button>
      </div>

      {isLoading && <LoadingSpinner />}
      
      {explanation && !isLoading && (
        <div className="bg-surface-dark p-6 rounded-2xl border border-premium-gold/20 mt-8 animate-fade-in">
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-sans">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
      
      {!apiKey && (
        <div className="mt-8 p-6 rounded-2xl bg-premium-gold/5 border border-premium-gold/20">
          <p className="text-xs text-text-white font-bold mb-2">💎 Inteligência Premium Desativada</p>
          <p className="text-[11px] text-text-muted mb-4">Conecte sua API Key do Gemini Pro para acesso ilimitado a análises teológicas reais e histórias personalizadas.</p>
          <Button variant="secondary" fullWidth onClick={triggerApiKeySelection} className="text-xs">Ativar IA Completa</Button>
        </div>
      )}
    </div>
  );
};

export default StudyScreen;
