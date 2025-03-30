import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { User, UserRole } from '@/types';
import { userApi } from '@/services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await userApi.getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [toast]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddNew = () => {
    setCurrentUser({ name: '', email: '', role: 'customer' });
    setIsDialogOpen(true);
  };
  
  const handleEdit = (user: User) => {
    setCurrentUser({ ...user });
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await userApi.deleteUser(id);
      // Update users list after deletion
      const updatedUsers = await userApi.getAllUsers();
      setUsers(updatedUsers);
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveUser = async () => {
    if (!currentUser || !currentUser.name || !currentUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (currentUser.id) {
        // Update existing user
        await userApi.updateUser(currentUser.id, currentUser);
        const updatedUsers = await userApi.getAllUsers();
        setUsers(updatedUsers);
        toast({
          title: "User updated",
          description: "The user has been updated successfully."
        });
      } else {
        // Add new user
        await userApi.register(
          currentUser.name,
          currentUser.email,
          'defaultPassword' // You might want to generate a random password or handle this differently
        );
        
        const updatedUsers = await userApi.getAllUsers();
        setUsers(updatedUsers);
        toast({
          title: "User added",
          description: "The new user has been created successfully."
        });
      }
      
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the user.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage users and access permissions
          </p>
        </div>
        
        <Button onClick={handleAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="max-w-sm flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : user.role === 'restaurant' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUser?.id ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {currentUser?.id 
                ? 'Edit the details for this user' 
                : 'Fill in the details for the new user'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={currentUser?.name || ''}
                onChange={(e) => setCurrentUser({ ...currentUser!, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={currentUser?.email || ''}
                onChange={(e) => setCurrentUser({ ...currentUser!, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={currentUser?.role || 'customer'}
                onValueChange={(value) => 
                  setCurrentUser({ ...currentUser!, role: value as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="restaurant">Restaurant Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {currentUser?.id ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
