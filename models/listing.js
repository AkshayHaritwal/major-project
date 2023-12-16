const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required : true
    },
    description : String,
    image:{
        url:String,
        filename : String ,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref :"Review", 
        },
    ],
    owner:{  // yaha humne listing ke liye owner define kar diya hai 
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    geometry:{  // isme map location ka schema define kar diya hai 
        type:{
            type:String,
            enum : ['Point'], 
            required: true
        },
        coordinates:{
            type : [Number],
            required :true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{   // jese hii listingschema me findbyidanddelete call hoga wese hii uss listing se related sabhi reviews delete ho jaayenge
    if (listing) {
        await Review.deleteMany({_id:{$in : listing.reviews}});
        
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;  // yaha humne listing file ko export kar diya hai ab hum isse app.js me require kar lenge 