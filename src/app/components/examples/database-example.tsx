import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/use-database.hook';

interface ExampleRecord {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function DatabaseExample() {
  const [examples, setExamples] = useState<ExampleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [newExample, setNewExample] = useState({ name: '', description: '' });
  const { createExample, findAllExamples, deleteExample } = useDatabase();

  // Load examples on component mount
  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    setLoading(true);
    const result = await findAllExamples();
    if (result.success && result.result) {
      setExamples(result.result);
    } else {
      console.error('Failed to load examples:', result.error);
    }
    setLoading(false);
  };

  const handleCreateExample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExample.name.trim()) return;

    const result = await createExample({
      name: newExample.name,
      description: newExample.description || undefined,
      isActive: true,
    });

    if (result.success) {
      setNewExample({ name: '', description: '' });
      await loadExamples(); // Reload the list
    } else {
      console.error('Failed to create example:', result.error);
    }
  };

  const handleDeleteExample = async (id: number) => {
    const result = await deleteExample(id);
    if (result.success) {
      await loadExamples(); // Reload the list
    } else {
      console.error('Failed to delete example:', result.error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Example</h1>
      
      {/* Create new example form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Create New Example</h2>
        <form onSubmit={handleCreateExample} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={newExample.name}
              onChange={(e) => setNewExample({ ...newExample, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={newExample.description}
              onChange={(e) => setNewExample({ ...newExample, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Example
          </button>
        </form>
      </div>

      {/* Examples list */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Examples ({examples.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : examples.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No examples found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {examples.map((example) => (
              <div key={example.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{example.name}</h3>
                    {example.description && (
                      <p className="text-gray-600 mt-1">{example.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>ID: {example.id}</span>
                      <span>Active: {example.isActive ? 'Yes' : 'No'}</span>
                      <span>Created: {new Date(example.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExample(example.id)}
                    className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 