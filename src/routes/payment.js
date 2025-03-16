const express = require('express')
const { authUser } = require('../middlewares/auth')

const paymentRouter = express.Router()
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment')
const User = require('../models/user')
const membershipAmount = require('../utils/constants')
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

paymentRouter.post("/payment/create" , authUser , async(req,res) => {
    try{

        const {firstName , lasttName ,emailId} = req.user
        const {membershipType} = req.body
        const orderDetails = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lasttName,
                emailId,
                membershipType: membershipType,
              },
          })

          console.log(orderDetails)

          const payment = new Payment({
             userId : req.user._id,
             orderId : orderDetails.id,
             amount : orderDetails.amount,
             status : orderDetails.status,
             currency : orderDetails.currency,
             receipt : orderDetails.receipt,
             notes : orderDetails.notes
          })
          const savePayment = await payment.save()
          res.json({ ...savePayment.toJSON(), keyId : process.env.RAZORPAY_KEY_ID})
    }catch(error){
      return res.status(500).json({msg : error.message})
    }
} )

paymentRouter.post('/payment/webhook' , async(req,res) => {

    try{

        const webhookSignature = req.get('X-Razorpay-Signature')

        const isWebHookValid = validateWebhookSignature(JSON.stringify(req.body), 
        webhookSignature, 
        process.env.RAZORPA_WEBHOOK_SECRET_HASH_KEY)

        if(!isWebHookValid){
            return res.status(400).json({msg : 'WebHook signature is invalid'})
        }

        const paymentDetails = req.body.payload.payment.entity
        const payment = await Payment.findOne({orderId : paymentDetails.order_id})
        payment.status = paymentDetails.status
        await payment.save()

        const user = await User.findOne({_id : payment.userId})
        console.log('payment details',paymentDetails.status == 'captured')
        if(paymentDetails.status == 'captured'){
            user.isPremium = true
            user.membershipType = payment.notes.membershipType
            await user.save()
        }
        
        
        return res.status(200).json({ msg: "Webhook received successfully" });


    }catch(error){
        return res.status(500).json({msg : error.message})
    }

   
})

module.exports = paymentRouter