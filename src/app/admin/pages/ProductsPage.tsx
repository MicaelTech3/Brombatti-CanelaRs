import { useEffect, useState } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  imageUrl: string;
  visible: boolean;
  onOffer: boolean;
  unit: string;
  createdAt?: unknown;
}

const EMPTY: Omit<Product, 'id'> = {
  name: '', description: '', price: 0, originalPrice: 0,
  discount: 0, category: '', imageUrl: '', visible: true,
  onOffer: false, unit: 'un',
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });
    return unsub;
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'products', editing.id), { ...form });
      } else {
        await addDoc(collection(db, 'products'), { ...form, createdAt: serverTimestamp() });
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    setDeleting(id);
    await deleteDoc(doc(db, 'products', id));
    setDeleting(null);
  };

  const toggleVisible = async (p: Product) =>
    updateDoc(doc(db, 'products', p.id), { visible: !p.visible });

  const set = (k: keyof typeof EMPTY, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Produtos</h2>
          <p className="text-sm text-gray-500">{products.length} produto(s) cadastrado(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Produto</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar por nome ou categoria..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Imagem</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Nome</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Categoria</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Preço</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Desconto</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Visível</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhum produto encontrado.</td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="h-12 w-12 object-cover rounded-lg border" />
                    : <div className="h-12 w-12 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-300 text-xs">sem img</div>
                  }
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {p.name}
                  {p.onOffer && <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Oferta</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category || '—'}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">
                  R$ {Number(p.price).toFixed(2).replace('.', ',')}
                  <span className="text-gray-400 text-xs">/{p.unit}</span>
                </td>
                <td className="px-4 py-3">
                  {p.discount && p.discount > 0
                    ? <span className="text-red-600 font-medium">{p.discount}% off</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleVisible(p)} title={p.visible ? 'Ocultar' : 'Mostrar'}>
                    {p.visible ? <Eye className="h-5 w-5 text-red-500" /> : <EyeOff className="h-5 w-5 text-gray-300" />}
                  </button>
                </td>
                <td className="px-4 py-3 flex items-center gap-2 pt-5">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-40">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">Nenhum produto encontrado.</div>
        )}
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-3">
            {p.imageUrl
              ? <img src={p.imageUrl} alt={p.name} className="h-16 w-16 object-cover rounded-lg border flex-shrink-0" />
              : <div className="h-16 w-16 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-300 text-xs flex-shrink-0">sem img</div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category || '—'}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisible(p)}>
                    {p.visible ? <Eye className="h-4 w-4 text-red-500" /> : <EyeOff className="h-4 w-4 text-gray-300" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1 text-blue-500"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-1 text-red-400 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-gray-800">R$ {Number(p.price).toFixed(2).replace('.', ',')}<span className="text-gray-400 font-normal text-xs">/{p.unit}</span></span>
                {p.discount && p.discount > 0 && <span className="text-xs text-red-600 font-medium">{p.discount}% off</span>}
                {p.onOffer && <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Oferta</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal (bottom-sheet no mobile) */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editing ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={closeModal}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-32 w-full object-contain rounded-lg border bg-gray-50" />}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL da Imagem</label>
                <input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome do Produto *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Arroz Branco 5kg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" placeholder="Descrição opcional..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
                <input type="text" value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Grãos e Cereais" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preço (R$)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Desconto (%)</label>
                  <input type="number" min="0" max="100" value={form.discount} onChange={e => set('discount', parseFloat(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Unidade</label>
                  <select value={form.unit} onChange={e => set('unit', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="pct">pct</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} className="accent-red-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">Produto visível</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.onOffer} onChange={e => set('onOffer', e.target.checked)} className="accent-orange-500 w-4 h-4" />
                  <span className="text-sm text-gray-700">Oferta da semana</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60">
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