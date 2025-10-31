import React, { useState } from 'react';
import { Mood, MoodLog } from '../types';
import { TrashIcon } from './icons';

interface MoodLogFormProps {
  date: string;
  existingLog?: MoodLog;
  onSave: (log: MoodLog) => void;
  onDelete: (date: string) => void;
  onClose: () => void;
}

const MoodLogForm: React.FC<MoodLogFormProps> = ({ date, existingLog, onSave, onClose, onDelete }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(existingLog?.mood || null);
  const [note, setNote] = useState(existingLog?.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood) {
      onSave({ date, mood: selectedMood, note });
      onClose();
    }
  };

  const handleDelete = () => {
      onDelete(date);
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">How are you feeling on {new Date(date + 'T00:00:00').toLocaleDateString()}?</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex justify-around p-4 bg-base-200 rounded-lg">
            {Object.values(Mood).map(mood => (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`text-4xl p-2 rounded-full transition-transform duration-200 transform hover:scale-125 ${selectedMood === mood ? 'bg-primary' : ''}`}
              >
                {mood}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Add a note (optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="What happened today?"
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              {existingLog && (
                <button 
                    type="button" 
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-danger rounded-md hover:bg-red-200 transition-all duration-200 transform hover:scale-105"
                >
                    <TrashIcon className="h-4 w-4" /> Delete
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-200 transform hover:scale-105">
                Cancel
              </button>
              <button type="submit" disabled={!selectedMood} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-green-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:bg-gray-400">
                Save Mood
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodLogForm;
