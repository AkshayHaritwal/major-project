const joi = require('joi');
//yaha humne listingSchema ko export kar diya hai ab isse app.js me require kar lenge 
module.exports.listingSchema = joi.object({  // yaha humne listingschema me define kar diya hai ki isme ek object hoga jo required hai 
    listing : joi.object({   // iske baad humne define kar diya hai ki listing object me given values hogi 
        title: joi.string().required(),
        description :joi.string().required(),
        location :joi.string().required(),
        country :joi.string().required(),
        price :joi.number().required(),
        image : joi.string().allow("" , null),  // image me humne allow kar diya hai ki isko empty chor sakte hai and null value bhi de sakte hai 


    }).required()
}) ;

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating: joi.number().required().min(1).max(5),
        comment : joi.string().required(),

    }).required()
})