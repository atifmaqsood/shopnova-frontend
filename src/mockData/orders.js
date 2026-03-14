export const orders = [
  {
    id: 'ORD-1001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { productId: 1, name: 'Pro Wireless Headphones', quantity: 1, price: 299.99 }
    ],
    total: 299.99,
    status: 'Delivered',
    paymentStatus: 'Paid',
    createdAt: '2024-03-10T14:30:00Z',
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-1002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      { productId: 7, name: 'Classic White Tee', quantity: 2, price: 25.00 },
      { productId: 8, name: 'Slim Fit Denim Jeans', quantity: 1, price: 65.00 }
    ],
    total: 115.00,
    status: 'Shipped',
    paymentStatus: 'Paid',
    createdAt: '2024-03-12T10:15:00Z',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
  },
  {
    id: 'ORD-1003',
    customerName: 'Robert Johnson',
    customerEmail: 'robert@example.com',
    items: [
      { productId: 13, name: 'Modern Table Lamp', quantity: 1, price: 45.99 }
    ],
    total: 45.99,
    status: 'Processing',
    paymentStatus: 'Paid',
    createdAt: '2024-03-14T16:45:00Z',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  }
];
