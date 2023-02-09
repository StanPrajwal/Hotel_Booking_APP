const routes = require("express").Router()
const {Hotel,isHotels} = require('../Models/Hotel')
const {getCloudinaryLink} = require("../Cloudinary")
require("dotenv").config()
routes.get("/",async (req,res)=>{
    try {
        const hotels = await Hotel.find()
        if(hotels.length){
            res.json({
                hotels:hotels
            })
        }else{
            res.json({
                message:"No Hotels Availabel"
            })
        }
   
   } catch (error) {
        res.status(500).json({
            error:"Page Not Found"
        })
   }
    
   
})
routes.get("/query",async(req,res)=>{
    try {
        
       
        let query  = req.query.q
        query = new RegExp(query,"i")
        const hotels = await Hotel.find({$or:[
            {pincode:query},
            {country:query},
            {city:query},
            {state:query},
            {hotel_type:query}
            
        ]})
        
        if(hotels.length){
            res.json({
                hotels:hotels
            })
        }else{
            console.log(hotels)

            res.json({
                message:"No Hotels Availabel"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Page Not Found"
        })
    }
})
routes.get("/sort",async(req,res)=>{
    try {
        
       
        let query  = req.query.q
        if(query==="low"){
            query = 1
        }
        if(query === "high"){
            query = -1
        }
        const hotels = await Hotel.find().sort({price_per_night:query})
        
        if(hotels.length){
            res.json({
                hotels:hotels
            })
        }else{
            console.log(hotels)

            res.json({
                message:"No Hotels Availabel"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Page Not Found"
        })
    }
})
routes.post('/',async(req,res)=>{
    try {
        
        const {hotel_name,address,country,state,city,description,hotel_type,image_url,facililies,max_count,price_per_night,pincode} = req.body
        
        const image_URl = await getCloudinaryLink(image_url)
        
        if(image_URl.length){
            const hotel = await Hotel.create({
                hotel_name,address,country,state,city,description,hotel_type,image_url:image_URl,facililies,max_count,price_per_night,pincode
            })
            res.json({
                greeting:"Thank You!",
                message:"Your Hotel Addedd Succeffully."
            })
        }
        else{
            return res.status(400).json({
                error:"Image Field mandatory"
            })
        }
       
       
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Try Again Aftter some time"
            
        })
    }
})

module.exports = routes