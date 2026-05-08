import { useEffect, useState } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Tag } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName: string;
  color: string;
  visible: boolean;
  createdAt?: unknown;
}

const EMPTY: Omit<Category, 'id'> = {
  title: '',
  description: '',
  image: '',
  iconName: 'Tag',
  color: 'bg-primary',
  visible: true,
};

const AVAILABLE_ICONS = [
  { name: 'Beef', label: 'Carnes / Açougue' },
  { name: 'Sandwich', label: 'Pães / Padaria' },
  { name: 'Apple', label: 'Frutas' },
  { name: 'Carrot', label: 'Legumes / Hortifruti' },
  { name: 'Wine', label: 'Bebidas Alcoólicas' },
  { name: 'CupSoda', label: 'Refrigerantes / Sucos' },
  { name: 'Milk', label: 'Laticínios' },
  { name: 'IceCream', label: 'Congelados' },
  { name: 'Fish', label: 'Peixes' },
  { name: 'ShoppingBasket', label: 'Cestas / Mercearia' },
  { name: 'Tag', label: 'Categoria Genérica (Etiqueta)' },
];

const AVAILABLE_COLORS = [
  { value: 'bg-primary', label: 'Verde (Principal)' },
  { value: 'bg-red-600', label: 'Vermelho' },
  { value: 'bg-[#d97706]', label: 'Laranja (Padaria)' },
  { value: 'bg-blue-600', label: 'Azul' },
  { value: 'bg-purple-600', label: 'Roxo' },
  { value: 'bg-gray-600', label: 'Cinza' },
  { value: 'bg-pink-600', label: 'Rosa' },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), snap => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    });
    return unsub;
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ ...c }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'categories', editing.id), { ...form });
      } else {
        await addDoc(collection(db, 'categories'), { ...form, createdAt: serverTimestamp() });
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria? Os produtos vinculados a ela não serão apagados, mas ficarão sem categoria correspondente na tela principal.')) return;
    setDeleting(id);
    await deleteDoc(doc(db, 'categories', id));
    setDeleting(null);
  };

  const toggleVisible = async (c: Category) =>
    updateDoc(doc(db, 'categories', c.id), { visible: !c.visible });

  const loadInitialCategories = async () => {
    setSaving(true);
    const defaults = [
      {
        title: 'Açougue',
        description: 'Cortes selecionados e tradição',
        color: 'bg-red-600', // Adaptado para a nova paleta do Admin
        iconName: 'Beef',
        image: 'https://images.unsplash.com/photo-1597417321971-45e034f7a993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        visible: true,
      },
      {
        title: 'Padaria',
        description: 'Pães fresquinhos de fabricação própria',
        color: 'bg-[#d97706]',
        iconName: 'Sandwich',
        image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        visible: true,
      },
      {
        title: 'Hortifruti - Dia Verde',
        description: 'Terças e quartas com frutas e legumes frescos',
        color: 'bg-primary',
        iconName: 'Apple',
        image: 'https://images.unsplash.com/photo-1768734837679-9b3180433384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        visible: true,
      },
    ];

    try {
      for (const cat of defaults) {
        await addDoc(collection(db, 'categories'), { ...cat, createdAt: serverTimestamp() });
      }
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof EMPTY, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  // Helper to render icon dynamically
  const renderIcon = (iconName: string, className: string = "h-5 w-5") => {
    // @ts-ignore - dynamic icon access
    const IconComponent = Icons[iconName] || Icons.Tag;
    return <IconComponent className={className} />;
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Especialidades (Categorias)</h2>
          <p className="text-sm text-gray-500">{categories.length} categoria(s) cadastrada(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Categoria</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>

      {/* Grid de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 && (
          <div className="col-span-full bg-white rounded-xl p-8 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
            <Tag className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Nenhuma categoria cadastrada</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Você pode começar adicionando as categorias padrão do site (Açougue, Padaria e Dia Verde) ou criar uma nova do zero.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={loadInitialCategories} 
                disabled={saving}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Importando...' : 'Importar Categorias Iniciais'}
              </button>
              <button 
                onClick={openCreate} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Criar do Zero
              </button>
            </div>
          </div>
        )}
        
        {categories.map(c => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-40 bg-gray-100 flex-shrink-0">
              {c.image ? (
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>
              )}
              <div className={`absolute inset-0 ${c.color} opacity-30`}></div>
              
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm">
                <button onClick={() => toggleVisible(c)} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" title={c.visible ? 'Ocultar' : 'Mostrar'}>
                  {c.visible ? <Eye className="h-4 w-4 text-red-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                </button>
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors" title="Editar">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="p-1.5 rounded-md hover:bg-red-50 text-red-400 transition-colors disabled:opacity-40" title="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm flex items-center gap-2">
                <div className={`w-8 h-8 rounded ${c.color} flex items-center justify-center text-white`}>
                  {renderIcon(c.iconName)}
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{c.description || 'Sem descrição'}</p>
            </div>
            {!c.visible && (
              <div className="bg-gray-50 text-gray-500 text-xs text-center py-2 font-medium border-t border-gray-100">
                Oculto no site
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editing ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={closeModal}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Título da Categoria *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Açougue" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" placeholder="Ex: Cortes selecionados e tradição" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL da Imagem (Fundo)</label>
                {form.image && <img src={form.image} alt="preview" className="h-24 w-full object-cover rounded-lg border mb-2" />}
                <input type="url" value={form.image} onChange={e => set('image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ícone</label>
                  <div className="relative">
                    <select value={form.iconName} onChange={e => set('iconName', e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white">
                      {AVAILABLE_ICONS.map(i => (
                        <option key={i.name} value={i.name}>{i.label}</option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {renderIcon(form.iconName, "h-4 w-4")}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Cor de Destaque</label>
                  <div className="relative">
                    <select value={form.color} onChange={e => set('color', e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white">
                      {AVAILABLE_COLORS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${form.color}`}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} className="accent-red-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">Categoria visível no site</span>
                </label>
              </div>

            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
