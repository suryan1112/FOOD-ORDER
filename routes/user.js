import { Router } from "express";
import { dark_web_register, delete_user, profile, sign_in, sign_out, sign_up, update_user} from "../controllers/user.js";
import { isAuthenticated, want_sign_in, want_sign_up, want_update_user } from "../middlewares/authentication.js";
import { upload } from "../models/users.js";
import passport from 'passport'

const router=Router();

router.post('/sign_in',sign_in)
router.post('/dark_in',dark_web_register)
router.post('/sign_up',upload,sign_up)

router.get('/profile/:id',profile)

router.get('/want_signIn',want_sign_in)
router.get('/want_signUp',want_sign_up)

router.get('/want_update',isAuthenticated,want_update_user)
router.post('/update_user',isAuthenticated,update_user)

router.get( '/auth/google', passport.authenticate( 'google', {scope: ['profile', 'email' ] }));
router.get( '/auth/google/callback', passport.authenticate( 'google', {failureRedirect: '/users/sign—in'}),()=>res.redirect('/'));

router.post('/delete-user',isAuthenticated,delete_user)

router.get('/want_signOut',sign_out)
export default router;

