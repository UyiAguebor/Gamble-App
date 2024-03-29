import express from 'express';
import bodyParser from 'body-parser';
import engines from 'consolidate';
import paypal from 'paypal-rest-sdk';

const app = express();

app.engine("ejs",engines.ejs);
app.set("views","./views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWQYE-qpBmXOlYr620xnRF5FjarOpFaGfN0muwVjxt0hbW4mgmkAMPgqfm0xH4nUO5ffHbvn-ewnkWRR',
    'client_secret': 'EOa3g2JoEAoHTYq7Kp28XMy6cYE2rjs02Oyw_ByhAgoIH6sAeUNwuXmHn9gzwZeDQCkjm9RPImSSS_fZ'
  });

app.get("/", (req,res) => {
    res.render('index');
});

app.get('/paypal',(req, res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://192.168.0.19:3000/success",
            "cancel_url": "http://192.168.0.19:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "100.00",
                    "currency": "GBP",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "GBP",
                "total": "100.00"
            },
            "description": "This is the payment description."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href); 
        }
    });
});

app.get('/success', (req,res) => {
    res.render('success');
    // var PayerID = req.query.payerID;
    // var paymentId = req.query.paymentId
    // var execute_payment_json = {
    //     "payer_id": PayerID,
    //     "transactions": [{
    //         "amount": {
    //             "currency": "GBP",
    //             "total": "10.00"
    //         }
    //     }]
    // };
    
    
    
    // paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    //     if (error) {
    //         console.log(error.response);
    //         throw error;
    //     } else {
    //         console.log("Get Payment Response");
    //         console.log(JSON.stringify(payment));
    //         res.render('success');
    //     }
    // });
});

app.get('/cancel',(req,res) => {
   res.render('cancel');
});

app.listen(3000,() => {
    console.log("Server is running");
});
