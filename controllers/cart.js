import items from "../models/items.js";
import user from "../models/users.js";

export const cart_specific = async (req, res) => {
    const { id, method } = req.params;

    const product = await items.findById(id);
    const userz = await user.findById(req.user._id).populate('cart_items.item');
    const obj = userz.cart_items.find((obj) => obj.item.id == id);
    let removed = false;

    if (method == "add" || method == "increase") {
        if (obj) obj.quantity += 1;
        else userz.cart_items.push({ item: req.params.id });
    }
    if (method == "remove" || method == "decrease") {
        if (obj && obj.quantity > 1 && method === "decrease") obj.quantity -= 1;
        else {
            await user.findByIdAndUpdate(userz._id, {
                $pull: { cart_items: obj },
            });
            removed = true;
        }
    }
    await userz.save();
    if (req.xhr) {
        return res.status(200).json({
            object: obj,
            removed,
            messege: "cart-item changed succesfully",
        });
    }
    res.redirect("back");
};