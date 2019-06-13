let express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Cart = require('../cart/Cart');
var errorHandler = require('../errorhandler');

/*
    ------------------------------------
    API Endpoint for adding item to cart
    ------------------------------------
*/

router.post("/cart", function (req, res) {
    let userUUID = req.headers['userid'];
    let itemData = req.body.item;
    let quantity = req.body.quantity
   // first check if a cart object exist in the DB, create a new cart if there is no cart found

   Cart.findOne({userUUID: userUUID}, function (error, cart) {
       if (error) return errorHandler.serverError(res);
       if (!cart) {
           Cart.create({
               userUUID: userUUID,
               products: [{item: itemData, quantity: quantity}]
               },
               function (err) {
                   if (err) return errorHandler.itemNotCreated(res);

                   res.status(200).send({message: "Product added successfully"});
               });
       } else {
            // if item exists, increase quantity
           Cart.findOneAndUpdate({"userUUID" : userUUID, products: {$elemMatch : {item: itemData}}},
               {$set : {"products.0.quantity" : quantity}}, function (error, item) {
                   console.log(error);
                   console.log(item);

               if (error) return errorHandler.serverError(res);

               // if there is no such item in the cart -> inserting into cart
               if (!item) {
                   Cart.update({"userUUID": userUUID},
                       {$push : { "products" :  {item: itemData, quantity: quantity}}},
                       function (error, result) {
                           console.log(error);
                           console.log(result);
                       if (error) return errorHandler.serverError(res);
                       res.status(200).send({message: "Product added successfully"});
                   });
               } else {
                   res.status(200).send({message: "Product added successfully"});

               }
           });
       }
   });
});

/*
    ------------------------------------
    API Endpoint for deleting item to cart
    ------------------------------------
*/

router.delete("/cart/:itemId", function (req, res) {
    let userUUID = req.headers['userid'];
    let itemUUID = req.params.itemId.toString();

    Cart.update({"userUUID": userUUID},
        {$pull : { products : { "item.id": itemUUID}}},
        function (error, result) {
            console.log(error);
            console.log(result);
            if (error) return errorHandler.serverError(res);
            res.status(200).send({message: "Product added successfully"});
        });
});


/*
    --------------------------------------------
    API Endpoint for getting all items from cart
    --------------------------------------------
*/

router.get("/cart", function (req, res) {
    let userUUID = req.headers['userid'];
    Cart.findOne({userUUID: userUUID}, function (error, cart) {
        if (error) return errorHandler.serverError(res);
        if (!cart) return errorHandler.cartIsEmpty(res);
        res.status(200).send(cart.products);
    })

});

module.exports = router;
