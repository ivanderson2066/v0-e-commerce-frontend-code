import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior que zero'),
  images: z.array(z.string()).min(1, 'Pelo menos uma imagem é obrigatória'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  category_id: z.string().uuid('ID de categoria inválido').optional(),
  featured: z.boolean().optional().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Pedido deve ter pelo menos 1 item'),
  shipping_address: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    cep: z.string().min(8),
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
  }),
  shipping_price: z.number().min(0),
  payment_method: z.string().min(1),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
