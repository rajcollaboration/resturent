const express = require('express');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const fs = require('fs')
var request = require("request"); 

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(history());
app.use('/', express.static('./dist'));


app.get('*', (req, res, next) => {
    res.sendFile('index.html');
})

app.put("/getPrediction", async function(req, res) {
    console.log(req.body.placename," req.body.placename");
    request("https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+req.body.placename+"&key=AIzaSyDil5J0RMBBJMKPiRe3uWRTLrpITVzTjIc&language=en&components=country:in", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            return res.send(body);
        }else{
            return res.json({"status":"error","req":req.body,"error":error});
        }
    });
 
});
app.put("/getPostalcode", async function(req, res) {
    console.log(req.body.placename," req.body.placename");
    request("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDil5J0RMBBJMKPiRe3uWRTLrpITVzTjIc&address="+req.body.placename+"&sensor=true", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            return res.send(body);
        }else{
            return res.json({"status":"error","req":req.body,"error":error});
        }
    });
 
});

app.post('/saveOrder', function(req, res) {
    datetime = new Date();
    dayFolder = ("0" + datetime.getDate()).slice(-2) + "_" + ("0"+(datetime.getMonth()+1)).slice(-2) + "_" + datetime.getFullYear()
    folderName =  __dirname + "/uploads/"+dayFolder;
    hmsFileName = req.body.mobile+"_"+dayFolder+"_"+("0" + datetime.getHours()).slice(-2)+ "_" +("0" + datetime.getMinutes()).slice(-2)+ "_" +("0" + datetime.getSeconds()).slice(-2)+".txt";
    try {
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName)
        }
    } catch (err) {
        console.error(err)
    }
    uploadPath = folderName+"/"+hmsFileName;
    content = req.body.fileContent
    console.log(uploadPath);
    
    fs.writeFile(uploadPath, content, err => {
        if (err) {
            console.error(err);
            return res.json({"req":req.body,err:err});
        }
        //file written successfully
        return res.json({"req":req.body,success:"success"});
    });
});

app.post('/checkCoupon', function(req, res) {
    const promoCodeList = [
        {id:1,name:"INVALID",discount:0,hasCondition:false,message:"Invalid Coupon Code Used"},
        {id:2,name:"SUPER30",discount:10,hasCondition:true,minPurchase:0,maxDiscount:10,itemCount:3, message:"discount offered on 3 items",discountType:"price"},
        {id:3,name:"SUPER20",discount:10,hasCondition:true,minPurchase:300,maxDiscount:100,itemCount:0,message:"discount offered up 100 rs on minimum purchase 300 rs",discountType:"percentage"},
    ]
     let amount = req.body.amount||0;
     let couponcode = req.body.couponCode||"";
     let totalItemCounter = req.body.itemCount||0;
     if(couponcode =="") return res.json({"message":"","discount":0});
    let promoDiscount=0;
    let  promoCodelength = promoCodeList.length
    let selectedPCodeIndex=0;
    let promoMessage ="";
    let i=0;
      for (i = 0; i < promoCodelength; i++) {
      let promocodename = promoCodeList[i].name;
        if (promocodename == couponcode) {
          selectedPCodeIndex=i;
          break; 
        }
      }
      if (promoCodeList[selectedPCodeIndex].hasCondition == true && promoCodeList[selectedPCodeIndex].discountType == "price") {
        if (amount >= promoCodeList[selectedPCodeIndex].minPurchase) {
          if (totalItemCounter >= promoCodeList[selectedPCodeIndex].itemCount ) {
            promoDiscount = promoCodeList[selectedPCodeIndex].discount;
            promoMessage = "Enjoy Your Meal with Saftey";
          }else{
            promoMessage = promoCodeList[selectedPCodeIndex].message;
          }
        }
      }
      else if (promoCodeList[selectedPCodeIndex].hasCondition == true && promoCodeList[selectedPCodeIndex].discountType == "percentage") {
       
        if (amount >= promoCodeList[selectedPCodeIndex].minPurchase) {
          if (totalItemCounter >= promoCodeList[selectedPCodeIndex].itemCount) {
            promoDiscount = (promoCodeList[selectedPCodeIndex].discount/100)*amount;
            if(promoDiscount>promoCodeList[selectedPCodeIndex].maxDiscount){
                promoDiscount =  promoCodeList[selectedPCodeIndex].maxDiscount;
            }
            promoMessage = "Enjoy Your Meal with Saftey";
          }
        }else{
          promoMessage =promoCodeList[selectedPCodeIndex].message;
        }
      }else{
        promoMessage = promoCodeList[selectedPCodeIndex].message
      }
      console.log(" cupon check");
       
      return res.json({"message":promoMessage,"discount":promoDiscount})
});

app.use((req, res, next) => {
    res.status(404);
    next(new Error('Not Fount -' + req.url));
})

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message
    });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Port on listening http://localhost:${PORT}`);
})