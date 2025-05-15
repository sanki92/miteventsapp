import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

// Selector Component
export default function Selector ({ label, data, selected, setSelected, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-white">{label}</label>}
      <div className="relative">
        <div 
          className="bg-black/30 border-0 text-white h-14 rounded-md flex items-center px-4 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex-1">
            {selected ? data.find(item => item.value === selected)?.label : placeholder}
          </span>
          <div className="flex space-x-1">
            {selected && (
              <X 
                size={18} 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected('');
                }} 
              />
            )}
            <ChevronDown size={18} />
          </div>
        </div>
        
        {isOpen && (
          <div className="absolute w-full mt-1 bg-slate-900 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
            {data.map((item) => (
              <div
                key={item.value}
                className={`px-4 py-2 cursor-pointer hover:bg-slate-800 ${
                  selected === item.value ? 'bg-slate-700' : ''
                }`}
                onClick={() => handleSelect(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

