
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import MenuItemCard from '@/components/MenuItemCard';
import { menuItems } from '@/data/menuItems';
import BottomNavigation from '@/components/BottomNavigation';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(menuItems);
  
  useEffect(() => {
    if (query.trim() === '') {
      setResults(menuItems);
      return;
    }
    
    const filtered = menuItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setResults(filtered);
  }, [query]);
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="p-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for food, drinks..."
                className="pl-10 pr-10"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {results.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-lg font-semibold mb-2">No Results Found</h2>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {results.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
