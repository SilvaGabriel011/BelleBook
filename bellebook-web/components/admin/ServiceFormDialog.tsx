'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
  servicesService,
  Service,
  Category,
  CreateServiceDto,
  UpdateServiceDto,
} from '@/services/services.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service: Service | null;
  categories: Category[];
}

export function ServiceFormDialog({
  open,
  onClose,
  onSuccess,
  service,
  categories,
}: ServiceFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    promoPrice: '',
    duration: '',
    images: [] as string[],
    isActive: true,
    customFields: {} as Record<string, any>,
  });
  const [imageUrl, setImageUrl] = useState('');
  const [customFieldKey, setCustomFieldKey] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        categoryId: service.categoryId,
        price: service.price.toString(),
        promoPrice: service.promoPrice?.toString() || '',
        duration: service.duration.toString(),
        images: service.images || [],
        isActive: service.isActive,
        customFields: (service as any).customFields || {},
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        promoPrice: '',
        duration: '',
        images: [],
        isActive: true,
        customFields: {},
      });
    }
  }, [service, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomField = () => {
    if (customFieldKey.trim() && customFieldValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [customFieldKey.trim()]: customFieldValue.trim(),
        },
      }));
      setCustomFieldKey('');
      setCustomFieldValue('');
    }
  };

  const handleRemoveCustomField = (key: string) => {
    setFormData((prev) => {
      const newCustomFields = { ...prev.customFields };
      delete newCustomFields[key];
      return {
        ...prev,
        customFields: newCustomFields,
      };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return false;
    }
    if (!formData.categoryId) {
      toast.error('Categoria é obrigatória');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Preço deve ser maior que zero');
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Duração deve ser maior que zero');
      return false;
    }
    if (formData.promoPrice && parseFloat(formData.promoPrice) >= parseFloat(formData.price)) {
      toast.error('Preço promocional deve ser menor que o preço normal');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const serviceDto: CreateServiceDto | UpdateServiceDto = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : undefined,
        duration: parseInt(formData.duration),
        images: formData.images,
        isActive: formData.isActive,
        customFields: Object.keys(formData.customFields).length > 0 ? formData.customFields : undefined,
      };

      if (service) {
        await servicesService.updateService(service.id, serviceDto);
      } else {
        await servicesService.createService(serviceDto as CreateServiceDto);
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast.error('Erro ao salvar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </DialogTitle>
          <DialogDescription>
            {service
              ? 'Edite as informações do serviço abaixo'
              : 'Preencha os dados para criar um novo serviço'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Manicure Completa"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o serviço..."
              rows={3}
              required
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preços e Duração */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoPrice">Preço Promocional (R$)</Label>
              <Input
                id="promoPrice"
                name="promoPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.promoPrice}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (min) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                placeholder="60"
                required
              />
            </div>
          </div>

          {/* Imagens */}
          <div className="space-y-2">
            <Label>Imagens</Label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Cole a URL da imagem..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                variant="outline"
                size="icon"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded border overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campos Personalizados */}
          <div className="space-y-2">
            <Label>Campos Personalizados (Extensibilidade)</Label>
            <div className="flex gap-2">
              <Input
                value={customFieldKey}
                onChange={(e) => setCustomFieldKey(e.target.value)}
                placeholder="Nome do campo (ex: location, skill_level)"
                className="flex-1"
              />
              <Input
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                placeholder="Valor"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomField();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddCustomField}
                variant="outline"
              >
                Adicionar
              </Button>
            </div>

            {Object.keys(formData.customFields).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(formData.customFields).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">
                      <strong>{key}:</strong> {String(value)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {loading ? 'Salvando...' : service ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
