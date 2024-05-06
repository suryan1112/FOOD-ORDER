import items from "../models/items.js";
import { abc, abc2, def, shuffleObject } from "./helper.js";


export const home = async (req, res) => {
    let User = await def(req.cookies.token);

    let cls=String(req.url).substring(1)
   
    let item=await items.find({class:cls}).populate('user_id')

    var group = abc(item);
    group=shuffleObject(group)
    // new Noty({
    //     text:req.flash('success')
    // }).show()
    // res.render('home',{User})
    res.render("house", { group, User,cls, messege: req.flash("success")});
};
export const home2=async(req,res)=>{
    let User = await def(req.cookies.token);
    res.render('home',{User})
}
export const home3=async(req,res)=>{
    let User = await def(req.cookies.token);

    if(req.body.search=='') return res.redirect('back');
    const cls=req.body.cls
    console.log(req.body.search,cls)
    
    const item=await items.findOne({name:new RegExp(req.body.search, 'i')})

    if(item && item.class==cls ){
    const str=item.category
        
    let group = abc(await items.find({}).populate('user_id'));
    group={[str]:group[str],}

  if (group[str]) {
            const currentIndex = group[str].findIndex((element) => element.name === item.name);
            if (currentIndex !== -1) {
                // Remove the item from its current position in the array
                const removedItem = group[str].splice(currentIndex, 1);

                // Add the item to the beginning of the array
                group[str].unshift(removedItem[0]);
            }
        }

    return res.render("house",{group,User,cls})}
    else {console.log('not found');
    return res.redirect('back')
    }
}
export const home_pg_sorted = async (req, res) => {
    try {
        let User = await def(req.cookies.token);

        const { categories, min_price, max_price, sort,cls } = req.body;

        const query = {
            category: categories,
            price: { $gte: min_price, $lte: max_price },
        };

        const sortObject = {};
        if(sort==='rating') sortObject[sort]=-1;
        else sortObject[sort]=1;

        var group,item_s
        if(sort){
            item_s = await items
            .find(query)
            .sort(sortObject).populate('user_id')
 
            group = abc2(item_s);
        }
        else{
            item_s = await items
            .find(query).populate('user_id')
        
            group=abc(item_s)
        }

        res.render("house", { group, User,cls });
    } catch (error) {
        console.error("Error in home_pg_sorted:", error);
        res.status(500).send("Internal Server Error");
    }
};
