"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(initialFormState);

  // Estado inicial do formulário
  function initialFormState() {
    return {
      id: null,
      nome: "",
      classe: "",
      valor: "",
      descricao: "",
      foto: null,
    };
  }

  // Carregar produtos ao montar o componente
  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const response = await fetch("/api/produtos");
    const data = await response.json();
    setProdutos(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/produtos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(initialFormState());
    fetchProdutos();
  };

  const handleDelete = async (id) => {
    await fetch("/api/produtos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProdutos((prev) => prev.filter((produto) => produto.id !== id));
  };

  const handleEdit = (produto) => {
    setForm(produto);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administração de Produtos</h1>

      {/* Formulário */}
      <Form
        form={form}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
      />

      {/* Lista de Produtos */}
      <ProductList produtos={produtos} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

// Componente de Formulário
function Form({ form, onSubmit, onInputChange, onFileChange }) {
  return (
    <form onSubmit={onSubmit} className="mb-8 grid grid-cols-1 gap-4">
      <input
        type="text"
        name="nome"
        placeholder="Nome do Produto"
        value={form.nome}
        onChange={onInputChange}
        className="border border-gray-300 rounded p-2"
        required
      />
      <input
        type="text"
        name="classe"
        placeholder="Classe"
        value={form.classe}
        onChange={onInputChange}
        className="border border-gray-300 rounded p-2"
        required
      />
      <input
        type="number"
        name="valor"
        placeholder="Valor (R$)"
        value={form.valor}
        onChange={onInputChange}
        className="border border-gray-300 rounded p-2"
        required
      />
      <textarea
        name="descricao"
        placeholder="Descrição"
        value={form.descricao}
        onChange={onInputChange}
        className="border border-gray-300 rounded p-2"
      />
      <input
        type="file"
        onChange={onFileChange}
        className="border border-gray-300 rounded p-2"
      />
      <button
        type="submit"
        className={`p-2 rounded text-white ${
          form.id ? "bg-yellow-500" : "bg-blue-500"
        }`}
      >
        {form.id ? "Atualizar Produto" : "Criar Produto"}
      </button>
    </form>
  );
}

// Componente de Lista de Produtos
function ProductList({ produtos, onEdit, onDelete }) {
  return (
    <ul className="space-y-4">
      {produtos.map((produto) => (
        <li
          key={produto.id}
          className="flex justify-between items-center border border-gray-300 rounded p-4"
        >
          <div>
            <p className="text-lg font-bold">{produto.nome}</p>
            <p className="text-sm text-gray-600">
              {produto.classe} - R$ {produto.valor}
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(produto)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(produto.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
