// import Bag from '../models/BagModel.js';
// import Bodycare from '../models/bodycareModel.js';
// import Jewellery from '../models/jewelleryModel.js';
// import Innerwear from '../models/innerModel.js';

// // Helper to map category to model
// const modelMap = {
//   bag: Bag,
//   bodycare: Bodycare,
//   jewellery: Jewellery,
//   innerwear: Innerwear
// };

// // @desc    Upload a new product
// // @route   POST /api/product/upload
// // @access  Private (Admin only)
// export const uploadProduct = async (req, res) => {
//   try {
//     const { name, price, category, description, imageUrl } = req.body;

//     if (!name || !price || !category || !imageUrl) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const Model = modelMap[category.toLowerCase()];
//     if (!Model) {
//       return res.status(400).json({ message: 'Invalid product category' });
//     }

//     const newProduct = new Model({
//       name,
//       price,
//       category,
//       description,
//       imageUrl,
//       createdBy: req.user.id
//     });

//     await newProduct.save();
//     res.status(201).json({ message: 'Product uploaded successfully', product: newProduct });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'Server error during product upload' });
//   }
// };

// // @desc    Get all products by category
// // @route   GET /api/product/:category
// // @access  Public
// export const getAllProducts = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const Model = modelMap[category.toLowerCase()];
//     if (!Model) {
//       return res.status(400).json({ message: 'Invalid product category' });
//     }

//     const products = await Model.find().sort({ createdAt: -1 });
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Fetch error:', error);
//     res.status(500).json({ message: 'Server error fetching products' });
//   }
// };