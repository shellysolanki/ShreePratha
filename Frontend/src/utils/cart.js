export async function addToCartApi(productId, quantity = 1, productType) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('userData') || 'null');
  if (!user?._id) throw new Error('Not logged in');

  const res = await fetch('http://localhost:5000/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ user: user._id, product: productId, productType, quantity })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add to cart');
  return data;
}


