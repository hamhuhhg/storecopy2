import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { MenuItem } from '@/types';
import { productApi } from '@/services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    tags: string;
    popular: boolean;
  }>({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'food',
    tags: '',
    popular: false,
  });
  
  // Load product data if in edit mode
  useEffect(() => {
    const loadProduct = async () => {
      if (isEditMode && id) {
        try {
          const product = await productApi.getProductById(id);
          if (product) {
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              image: product.image,
              category: product.category,
              tags: product.tags.join(', '),
              popular: product.popular || false,
            });
          }
        } catch (error) {
          console.error('Error loading product:', error);
          toast({
            title: "Error",
            description: "Failed to load product data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProduct();
  }, [id, isEditMode, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as 'food' | 'juice' }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) 
        throw new Error('Price must be a positive number');
      if (!formData.image.trim()) throw new Error('Image URL is required');
      
      // Create product object
      const productData: Omit<MenuItem, 'id'> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim(),
        category: formData.category as 'food' | 'juice',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        popular: formData.popular,
      };
      
      // Save to database
      if (isEditMode && id) {
        await productApi.updateProduct(id, productData);
        toast({
          title: "Product updated",
          description: `${productData.name} has been updated successfully.`,
        });
      } else {
        await productApi.createProduct(productData);
        toast({
          title: "Product created",
          description: `${productData.name} has been created successfully.`,
        });
      }
      
      // Redirect back to products page
      navigate('/admin/products');
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode 
            ? 'Update the details of an existing product' 
            : 'Create a new menu item for your restaurant'
          }
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">Loading product data...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Burger Deluxe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="9.99"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Delicious burger with cheese, lettuce, tomato, and special sauce..."
              required
              rows={4}
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="juice">Juice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="burger, cheese, special (comma-separated)"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="popular"
              checked={formData.popular}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, popular: checked }))
              }
            />
            <Label htmlFor="popular">Mark as popular</Label>
          </div>
          
          <div className="flex items-center gap-4">
            <Button type="submit">
              {isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
