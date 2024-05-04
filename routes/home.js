import { Router } from "express";
import { isAuthenticated, sub_Authenticated } from "../middlewares/authentication.js";

import { upload } from "../models/items.js";
import { upload2 } from "../models/comments.js";
import { home, home2, home3, home_pg_sorted } from "../controllers/home_menu.js";
import { orderPlace, order_pg } from "../controllers/order_page.js";
import { about_pg, about_pg_sorted, update_orders } from "../controllers/about_page.js";
import { cart_specific } from "../controllers/cart.js";
import { add_item, item, remove_item, update_item } from "../controllers/item.js";
import { add_comment, remove_comment, subComment } from "../controllers/comments.js";
import { likes_handler } from "../controllers/likes.js";

const router = Router();

router.get('/food', home)
router.get('/scrap' , home)
router.get('/darkL1',isAuthenticated,sub_Authenticated, home)
router.get('/darkL2',isAuthenticated,sub_Authenticated, home)
router.get('/darkL3',isAuthenticated,sub_Authenticated, home)
router.post('/', home3)

router.get('/', home2)

router.get('/orders', isAuthenticated, order_pg)
router.get('/about', isAuthenticated, about_pg)

router.post('/sorted', home_pg_sorted)
router.post('/sorted_order', about_pg_sorted)
router.post('/update_orders/:id', update_orders)
router.get('/cart-specific/:id/:method', isAuthenticated, cart_specific)

router.post('/add_item', upload, isAuthenticated, add_item)
router.get('/remove_item/:id', isAuthenticated, remove_item)

router.get('/:id', item)
router.post('/update-item/:id', upload, isAuthenticated, update_item)


router.post('/add_comment/:id', upload2, isAuthenticated, add_comment)
router.get('/remove_comment/:id', isAuthenticated, remove_comment)
router.post('/submit_sub_comment/:id', isAuthenticated, subComment)


router.post('/order_place', orderPlace)

router.post('/likes/:id/:object', isAuthenticated, likes_handler)
export default router;