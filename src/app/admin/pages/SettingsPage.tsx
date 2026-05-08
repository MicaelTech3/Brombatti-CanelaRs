import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { Save, RefreshCw, Server, Shield, Link as LinkIcon, FileText, X } from 'lucide-react';

export function SettingsPage() {
  const [config, setConfig] = useState({
    provider: 'syspdv',
    apiUrl: '',
    apiKey: '',
    autoSync: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteConfig', 'integration'));
        if (snap.exists()) {
          setConfig(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (error) {
        console.error("Erro ao carregar configurações", error);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteConfig', 'integration'), config, { merge: true });
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    // Placeholder para a futura integração real
    setTimeout(() => {
      setSyncing(false);
      alert('Aviso: A integração real com a API ainda precisa ser desenvolvida no servidor (Cloud Functions) baseada no manual do sistema escolhido.');
    }, 2000);
  };

  if (loading) return <div className="p-8 text-gray-500 flex items-center gap-2"><div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/> Carregando configurações...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h2>
        <p className="text-gray-500 text-sm mt-1">Integração de preços e produtos com seu sistema de caixa (ERP/PDV).</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <Server className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">Integração ERP/PDV</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Utilizado</label>
              <select
                value={config.provider}
                onChange={e => setConfig({ ...config, provider: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              >
                <option value="syspdv">SysPDV</option>
                <option value="consinco">Consinco</option>
                <option value="vr">VR Software</option>
                <option value="totvs">TOTVS</option>
                <option value="custom">API Personalizada</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Selecione o sistema de gestão atual do supermercado.</p>
              
              <button 
                onClick={() => setManualOpen(true)}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Ler Manual de Integração do {config.provider.toUpperCase()}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                URL da API (Endpoint)
              </label>
              <input
                type="text"
                placeholder="https://api.seusistema.com.br/v1/"
                value={config.apiUrl}
                onChange={e => setConfig({ ...config, apiUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Token / Chave de Acesso
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••••••"
                value={config.apiKey}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={config.autoSync}
                  onChange={e => setConfig({ ...config, autoSync: e.target.checked })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${config.autoSync ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.autoSync ? 'translate-x-4' : ''}`}></div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700 block group-hover:text-red-600 transition-colors">Sincronização Automática</span>
                <span className="text-gray-400 block">Atualizar preços todos os dias às 03:00 da manhã.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleSync}
            disabled={syncing || !config.apiUrl}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin text-red-500' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>

      {/* Modal do Manual */}
      {manualOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Manual de Integração API - {config.provider.toUpperCase()}
              </h3>
              <button onClick={() => setManualOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-gray-700 text-sm leading-relaxed space-y-4">
              <p>Este é o guia rápido para integração automática do <strong>{config.provider.toUpperCase()}</strong> com a nossa plataforma.</p>
              
              <h4 className="font-bold text-gray-900 mt-6">Passo 1: Geração do Token</h4>
              <p>No painel administrativo do seu sistema de caixa, acesse <strong>Integrações &gt; Gerar Token API</strong>. Copie o código gerado de 32 caracteres e cole no campo "Token / Chave de Acesso" do nosso painel.</p>

              <h4 className="font-bold text-gray-900 mt-4">Passo 2: Configuração de Endpoint</h4>
              <p>Dependendo da versão do seu sistema, a URL de API (Endpoint) será diferente. Normalmente ela segue o formato: <code className="bg-gray-100 px-2 py-1 rounded text-red-600">https://api.seusistema.com.br/v2/</code>. Consulte o suporte do seu ERP caso não saiba a sua URL local.</p>

              <h4 className="font-bold text-gray-900 mt-4">Passo 3: Mapeamento de Categorias</h4>
              <p>O nosso sistema buscará apenas os produtos marcados com o flag <code>ecommerce_visible=true</code> no seu PDV. Certifique-se de que os setores (Açougue, Padaria, Hortifruti) tenham os mesmos nomes no seu caixa e aqui no painel administrativo para o vínculo automático funcionar perfeitamente.</p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6 text-blue-800 flex items-start gap-3">
                <Shield className="h-5 w-5 shrink-0" />
                <p className="text-sm">A sincronização automática rodará todos os dias de madrugada, substituindo preços e ativando/desativando ofertas automaticamente com base nas informações do seu caixa.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setManualOpen(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
