import Product from "../models/Product.js";

// Add product
export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    const image = req.file?.path; // Cloudinary URL

    const product = await Product.create({
      title,
      description,
      price,
      image,
      category,
      stock,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// Get single product
export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  res.json(p);
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    let updateData = {
      title,
      description,
      price,
      category,
      stock,
    };

    if (req.file?.path) {
      updateData.image = req.file.path; // new Cloudinary image
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
