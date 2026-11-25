import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items: [{ productId, quantity: 1 }]
    });
  } else {
    const item = cart.items.find(i => i.productId == productId);

    if (item) item.quantity++;
    else cart.items.push({ productId, quantity: 1 });

    await cart.save();
  }

  res.json(cart);
};
