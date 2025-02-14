// import { Cart } from '../models/cartModel.js';
// import { Dish } from '../models/dishModel.js';



// //ADD to CART
// export const addToCart = async (req, res, next) => {
//   try {
//     const { dishId, quantity } = req.body;
//     //const userId = req.user.userId;
//     const userId = req.body.user
//     const restaurantId = req.body.restaurant;
   

//     // Find the active cart for the user
//     let cart = await Cart.findOne({ user: userId, status: 'active' });

//     // Find the dish by its ID
//     const dish = await Dish.findById("6790160c89dd922d111d8f07");
//     if (!dish) {
//       return res.status(404).json({ success: false, message: 'Dish not found' });
//     }

//     // Check if the dish's restaurant matches the current cart's restaurant
//     if (cart && cart.restaurant && !cart.restaurant.equals(restaurantId)) {
//       // Clear the cart if it's from a different restaurant
//       cart.items = [];
//       cart.status = null;
//       cart.restaurant = null;
//       await cart.save();
//     }

//     // If no cart exists or cleared, create a new one
//     if (!cart || !cart.restaurant) {
//       cart = new Cart({ user: userId, restaurant: restaurantId });
//     }

//     // Check if the dish already exists in the cart
//     const existingItem = cart.items.find(item => item.dish.equals(dishId));

//     if (existingItem) {
//       // If it exists, increase the quantity
//       existingItem.quantity += quantity;
//     } else {
//       // If not, add it to the cart
//       cart.items.push({ dish: dishId, quantity, price: dish.price });
//     }

//     // Save the cart with updated items
//     await cart.save();

//     res.status(200).json({ success: true, message: 'Item added to cart', cart });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };






// export const getActiveCart = async (req, res, next) => {
//   try {
//     const userId = req.user.userId;


// // Find the active cart for the user
//     const cart = await Cart.findOne({ user: userId, status: 'active' })
//       .populate('restaurant')
//       .populate('items.dish')
//       .populate('user');

//     if (!cart) {
//       return res.status(200).json({ 
//         success: true, 
//         message: 'No active cart found', 
//       });
//     }

//     // Step 3: Return the active cart
//     res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// };





// // View All Carts

// export const getCart = async (req, res, next) => {
//   try {
//     const userId = req.user.userId;

//     const cart = await (await Cart.find({ user: userId, status: { $ne: null }}).populate('items.dish').populate('restaurant'))
//        // Step 1: Delete any carts with status 'null' for the user
//     const deleteNull =   await Cart.deleteMany({ user: userId, status: { $in: ['null',null ] } });
//     if (!deleteNull){
//     console.log("Failed to delete Null carts")}

//     if (!cart) {
//       return res.status(404).json({ success: false, message: 'Your cart is empty' });
//     }

//     res.status(200).json({ success: true, cart });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };




// // Update Cart 

// export const updateCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;  
//     const { items } = req.body; // Frontend will send updated items

//     // Find the user's active cart
//     const cart = await Cart.findOne({ user: userId, status: 'active' });

//     if (!cart) {
//       return res.status(404).json({ success: false, message: 'Cart not found' });
//     }

//     // Update the cart's items
//     cart.items = items;

//     // Recalculate subtotal, tax, and total
//     cart.subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     cart.tax = cart.subtotal * 0.1; // Assuming a 10% tax rate
//     cart.total = cart.subtotal + cart.tax;

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ success: true, message: 'Cart updated successfully', cart });
//   } catch (error) {
//     console.error('Error updating cart:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };




// export const checkoutCart = async (req, res, next) => {
//   try {
//     const userId = req.user.userId;

//     // Find the user's active cart
//     const cart = await Cart.findOne({ user: userId, status: 'active' });

//     if (!cart) {
//       return res.status(404).json({ success: false, message: 'Cart not found' });
//     }

//     // Update the cart status to 'ordered'
//     cart.status = 'ordered';
//     cart.orderedAt = new Date(); // Add a timestamp for when the order was placed

//     await cart.save();

//     res.status(200).json({ success: true, message: 'Order placed successfully', order: cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };


// // cart status CANCEL

// export const cancelStatus = async (req, res,next) => {
//   try {
//     const orderId = req.params.orderId;
//     const userId = req.user.userId;

//     // Find the cart by orderId and update the status to 'cancelled'

//     const updatedCart = await Cart.findOneAndUpdate(
//       { _id: orderId, user: userId, status: 'ordered' },
//       { status: 'cancelled' },
//       { new: true }
//     );

//     if (!updatedCart) {
//       return res.status(404).json({ success: false, message: 'Order not found or already cancelled' });
//     }

//     res.status(200).json({ success: true, message: 'Order cancelled successfully', cart: updatedCart });
//   } catch (error) {
//     console.error('Error canceling order:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };


// // cart status REORDER

// export const reOrder = async (req, res, next) => {
//   try {
//     const orderId = req.params.orderId;
//     const userId = req.user.userId;

//     // Find the original order
//     const originalOrder = await Cart.findOne({
//       _id: orderId,
//       user: userId,
//       status: { $in: ['cancelled', 'delivered'] },
//     }).lean(); // Use .lean() to get a plain JavaScript object

//     if (!originalOrder) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // Remove unnecessary fields and reset status and timestamps
//     const { _id, status, createdAt, updatedAt, ...orderData } = originalOrder;

//     // Create a new order with the same items and restaurant
//     const newOrder = new Cart({
//       ...orderData,
//       status: 'active',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     await newOrder.save();

//     res.status(200).json({ success: true, message: 'Order placed successfully', cart: newOrder });
//   } catch (error) {
//     console.error('Error in reorder:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };





import { Cart } from "../models/cartModel.js";
import { Restaurant } from "../models/restaurantModel.js";

export const updateCart = async (req, res) => {
  try {
    const { menuItems, restaurantId } = req.body;
    const userId = req.user.id;
    
    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }

    // Filter out items with quantity <= 0
    const validMenuItems = menuItems.filter(item => item.quantity > 0);  

    // Handle case where no valid items are left in the cart
    if (validMenuItems.length === 0) {
      // Clear the cart if no valid items
      await Cart.findOneAndUpdate(
        { user: userId, "restaurant.id": restaurantId },
        { $set: { cartItems: [], totalPrice: 0 } },
        { new: true }
      );
      return res.status(200).json({ success: true, message: "Cart cleared successfully", cart: [] }); // Return an empty cart array
    }

    // Create an array to hold the updates (valid items only)
    const updates = validMenuItems.map(item => {
      const menuItem = restaurant.menuItems.find(m => m._id.equals(item.menuItemId));   
      
      if (!menuItem) {
        throw new Error(`Menu item with ID ${item.menuItemId} not found in restaurant ${restaurant.name}.`);
      }
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        veg: menuItem.veg,
        price: menuItem.price,
        image: menuItem.image1,
        quantity: item.quantity,
        total: menuItem.price * item.quantity
      };
    });

    // Try to find and update the cart
    let cart = await Cart.findOneAndUpdate(
      { user: userId, "restaurant.id": restaurantId },
      { 
        $set: {
          cartItems: updates, 
          totalPrice: updates.reduce((acc, item) => acc + item.total, 0)
        } 
      },
      { new: true, runValidators: true }
    );

    // If cart does not exist, create a new one
    if (!cart) {
      const newCart = new Cart({
        user: userId,
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          location: restaurant.location
        },
        cartItems: updates,
        totalPrice: updates.reduce((acc, item) => acc + item.total, 0)
      });
      cart = await newCart.save();
      return res.status(200).json({ success: true, message: "Cart created successfully", cart });
    }
    
    // Return the updated cart
    res.status(200).json({ success: true, message: "Cart updated successfully", cart });

  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Server error, failed to update cart." });
  }
};

export const getCart = async (req, res) => {
  try {
    const { restaurantId } = req.query; // Assuming restaurantId is passed as a query parameter  

    if (!restaurantId) {
      return res.status(400).json({ success: false, message: "Restaurant ID is required." });
    }

    const cart = await Cart.findOne({ user: req.user.id, "restaurant.id": restaurantId })
      .populate("user", "name email")
      .populate("cartItems", "name price image");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found for this restaurant." });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error, failed to fetch cart." });
  }
};


// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Server error, failed to clear cart." });
  }
};

