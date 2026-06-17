function presentOrder(order, items = []) {
  return {
    id: order.id,
    order_number: order.order_number,
    customer_id: order.customer_id,
    customer_name: order.customer_name,
    address: order.address || order.location || '',
    date: order.order_date,
    items,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    total: Number(order.total_amount),
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    status: order.order_status,
    notes: order.notes || ''
  };
}

module.exports = { presentOrder };
