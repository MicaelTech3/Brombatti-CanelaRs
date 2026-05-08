import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/db';
import { Save, RefreshCw, Server, Shield, Link as LinkIcon } from 'lucide-react';

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
    </div>
  );
}
