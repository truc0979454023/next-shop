import connectDB from "../../../utils/connectDB";
import Orders from "../../../models/orderModel";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrder(req, res);
      break;
  }
};

const getOrder = async (req, res) => {
  try {
    const result = await auth(req, res);

    let orders;
    if (result.role !== "1") {
      orders = await Orders.find({ user: result.id }).populate(
        "user",
        "-password"
      );
    } else {
      orders = await Orders.find().populate("user", "-password");
    }
    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { address, mobile, cart, total } = req.body;

    const newOrder = new Orders({
      user: result.id,
      address,
      mobile,
      cart,
      total,
    });

    cart.filter((item) => {
      return sold(item._id, item.quantity, item.inStock, item.sold);
    });

    await newOrder.save();
    res.json({
      msg: "Order success! We will contact you to confirm the order.",
      newOrder,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const sold = async (id, quantity, oldInStock, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - quantity,
      sold: quantity + oldSold,
    }
  );
};
