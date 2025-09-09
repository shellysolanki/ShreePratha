import Wishlist from '../models/wishlistModel.js';
import Jewellery from '../models/jewelleryModel.js';
import Makeup from '../models/makeupModel.js';
import Innerwear from '../models/innerModel.js';
import Bodycare from '../models/bodycareModel.js';
import Bag from '../models/BagModel.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.json({ success: true, wishlist: { items: [] } });
    }

    // Populate products based on their type
    const populatedItems = await Promise.all(
      wishlist.items.map(async (item) => {
        let product = null;
        
        try {
          switch (item.productType) {
            case 'jewellery':
              product = await Jewellery.findById(item.product);
              break;
            case 'makeup':
              product = await Makeup.findById(item.product);
              break;
            case 'inner':
              product = await Innerwear.findById(item.product);
              break;
            case 'bodycare':
              product = await Bodycare.findById(item.product);
              break;
            case 'bag':
              product = await Bag.findById(item.product);
              break;
            default:
              console.error('Unknown product type:', item.productType);
          }
        } catch (err) {
          console.error('Error fetching product:', err);
        }

        return {
          ...item.toObject(),
          product: product
        };
      })
    );

    // Filter out items where product was not found
    const validItems = populatedItems.filter(item => item.product !== null);

    res.json({ 
      success: true, 
      wishlist: { 
        ...wishlist.toObject(), 
        items: validItems 
      } 
    });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, productType } = req.body;
    if (!productId || !productType) {
      return res.status(400).json({ message: 'Product ID and type are required' });
    }

    // Validate product exists
    let product = null;
    try {
      switch (productType) {
        case 'jewellery':
          product = await Jewellery.findById(productId);
          break;
        case 'makeup':
          product = await Makeup.findById(productId);
          break;
        case 'inner':
          product = await Innerwear.findById(productId);
          break;
        case 'bodycare':
          product = await Bodycare.findById(productId);
          break;
        case 'bag':
          product = await Bag.findById(productId);
          break;
        default:
          return res.status(400).json({ message: 'Invalid product type' });
      }
    } catch (err) {
      console.error('Error validating product:', err);
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
    }

    // Check if item already exists
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId && item.productType === productType
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add new item
    wishlist.items.push({
      product: productId,
      productType: productType,
      addedAt: new Date()
    });

    await wishlist.save();
    res.json({ success: true, message: 'Item added to wishlist' });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ message: 'Failed to add item to wishlist' });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, productType } = req.body;
    if (!productId || !productType) {
      return res.status(400).json({ message: 'Product ID and type are required' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      item => !(item.product.toString() === productId && item.productType === productType)
    );

    await wishlist.save();
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ message: 'Failed to remove item from wishlist' });
  }
};

// Get wishlist count
export const getWishlistCount = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const wishlist = await Wishlist.findOne({ user: userId });
    const count = wishlist ? wishlist.items.length : 0;

    res.json({ success: true, count });
  } catch (err) {
    console.error('Get wishlist count error:', err);
    res.status(500).json({ message: 'Failed to get wishlist count' });
  }
};

// Check if item is in wishlist
export const checkWishlistItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, productType } = req.query;
    if (!productId || !productType) {
      return res.status(400).json({ message: 'Product ID and type are required' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.json({ success: true, inWishlist: false });
    }

    const inWishlist = wishlist.items.some(
      item => item.product.toString() === productId && item.productType === productType
    );

    res.json({ success: true, inWishlist });
  } catch (err) {
    console.error('Check wishlist item error:', err);
    res.status(500).json({ message: 'Failed to check wishlist item' });
  }
};

// Clean up invalid wishlist items (remove items where product no longer exists)
export const cleanupWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.json({ success: true, message: 'No wishlist found' });
    }

    const validItems = [];
    let removedCount = 0;

    for (const item of wishlist.items) {
      let product = null;
      
      try {
        switch (item.productType) {
          case 'jewellery':
            product = await Jewellery.findById(item.product);
            break;
          case 'makeup':
            product = await Makeup.findById(item.product);
            break;
          case 'inner':
            product = await Innerwear.findById(item.product);
            break;
          case 'bodycare':
            product = await Bodycare.findById(item.product);
            break;
          case 'bag':
            product = await Bag.findById(item.product);
            break;
        }
      } catch (err) {
        console.error('Error checking product:', err);
      }

      if (product) {
        validItems.push(item);
      } else {
        removedCount++;
      }
    }

    wishlist.items = validItems;
    await wishlist.save();

    res.json({ 
      success: true, 
      message: `Wishlist cleaned up. Removed ${removedCount} invalid items.`,
      removedCount 
    });
  } catch (err) {
    console.error('Cleanup wishlist error:', err);
    res.status(500).json({ message: 'Failed to cleanup wishlist' });
  }
};
