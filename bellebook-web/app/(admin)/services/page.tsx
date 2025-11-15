'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { servicesService, Service, Category } from '@/services/services.service';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ServiceFormDialog } from '@/components/admin/ServiceFormDialog';

export default function ServicesManagement() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  useEffect(() => {
    checkAccess();
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);

  const checkAccess = () => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      toast.error('Access denied. Administrators only.');
      router.push('/home');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const cats = await servicesService.getAllCategories();
      setCategories(cats);

      // Load all services
      await loadAllServices();
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllServices = async () => {
    try {
      const allServices: Service[] = [];
      const cats = await servicesService.getAllCategories();
      
      for (const cat of cats) {
        const catServices = await servicesService.getByCategory(cat.id);
        allServices.push(...catServices);
      }
      
      setServices(allServices);
    } catch (error) {
      console.error('Error loading services:', error);
      throw error;
    }
  };

  const filterServices = async () => {
    if (selectedCategory !== 'all' && selectedCategory) {
      try {
        const filtered = await servicesService.getByCategory(selectedCategory, {
          search: searchQuery || undefined,
        });
        setServices(filtered);
      } catch (error) {
        console.error('Error filtering services:', error);
      }
    } else {
      await loadAllServices();
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setShowFormDialog(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowFormDialog(true);
  };

  const handleFormSuccess = async () => {
    setShowFormDialog(false);
    setEditingService(null);
    await loadData();
    toast.success(editingService ? 'Service updated!' : 'Service created!');
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesService.toggleActiveService(service.id);
      await loadData();
      toast.success(
        service.isActive ? 'Service deactivated!' : 'Service activated!'
      );
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Error toggling service status');
    }
  };

  const handleDeleteClick = (service: Service) => {
    setDeletingService(service);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;

    try {
      await servicesService.deleteService(deletingService.id);
      setDeletingService(null);
      await loadData();
      toast.success('Service deleted!');
    } catch (error) {
      console.error('Error deleting service:', error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Error deleting service';
      toast.error(errorMessage);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Services Management
          </h1>
          <p className="text-gray-600">
            Add, edit or remove services from catalog
          </p>
        </div>

        {/* Toolbar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Add Button */}
              <Button
                onClick={handleCreateService}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services ({services.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No services found
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        {service.images && service.images.length > 0 ? (
                          <div className="relative w-12 h-12">
                            <Image
                              src={service.images[0]}
                              alt={service.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">N/D</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.category?.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          {service.promoPrice ? (
                            <>
                              <div className="line-through text-gray-400 text-sm">
                                {formatPrice(service.price)}
                              </div>
                              <div className="text-pink-600 font-semibold">
                                {formatPrice(service.promoPrice)}
                              </div>
                            </>
                          ) : (
                            <div className="font-semibold">
                              {formatPrice(service.price)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell>
                        <Badge
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={
                            service.isActive
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(service)}
                            title={
                              service.isActive
                                ? 'Deactivate service'
                                : 'Activate service'
                            }
                          >
                            {service.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(service)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Service Form Dialog */}
      <ServiceFormDialog
        open={showFormDialog}
        onClose={() => {
          setShowFormDialog(false);
          setEditingService(null);
        }}
        onSuccess={handleFormSuccess}
        service={editingService}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingService}
        onOpenChange={(open: boolean) => !open && setDeletingService(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the service{' '}
              <strong>{deletingService?.name}</strong>?
              <br />
              <br />
              This action cannot be undone. The service will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingService(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
