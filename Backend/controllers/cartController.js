import Cart from "../models/cartModel.js";
import Jewellery from '../models/jewelleryModel.js';
import Makeup from '../models/makeupModel.js';
import Innerwear from '../models/innerModel.js';
import Bodycare from '../models/bodycareModel.js';
import Bag from '../models/BagModel.js';

// 🆕 Create or Add to Cart
export const createCart = async (req, res) => {
  try {
    const { user, product, productType, quantity } = req.body;
    if (!user || !product || !productType || !quantity) {
      return res.status(400).json({ error: 'user, product, productType and quantity are required' });
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({ user, items: [{ product, productType, quantity }] });
    } else {
      const item = cart.items.find(i => i.product.toString() === product && i.productType === productType);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product, productType, quantity });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📦 Get Cart by User
export const getCart = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.user;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(200).json({ items: [] });

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        let productDoc = null;
        try {
          switch (item.productType) {
            case 'jewellery':
              productDoc = await Jewellery.findById(item.product);
              break;
            case 'makeup':
              productDoc = await Makeup.findById(item.product);
              break;
            case 'inner':
              productDoc = await Innerwear.findById(item.product);
              break;
            case 'bodycare':
              productDoc = await Bodycare.findById(item.product);
              break;
            case 'bag':
              productDoc = await Bag.findById(item.product);
              break;
          }
        } catch (_) {}

        return { ...item.toObject(), product: productDoc };
      })
    );

    const validItems = populatedItems.filter(it => it.product);
    res.status(200).json({ ...cart.toObject(), items: validItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const user = req.params.userId || req.params.user;
    const product = req.params.productId || req.params.product;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === product);
    if (item) item.quantity = quantity;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Remove Item from Cart
export const deleteCartItem = async (req, res) => {
  try {
    const user = req.params.userId || req.params.user;
    const product = req.params.productId || req.params.product;

    const cart = await Cart.findOneAndUpdate(
      { user },
      { $pull: { items: { product } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🧹 Clear Entire Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.user;
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};