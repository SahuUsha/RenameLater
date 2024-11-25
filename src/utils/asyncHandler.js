

const asyncHandler=(requestHandler)=>{
 (req,res , next)=>{

    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
 }
    
}

export {asyncHandler}




// const asyncHandler = ()=>{}
// // higher orer function-->a function accept function and return function
// const asyncHandler=(func)=>{()=>{}}
// const asyncHandler=(func)=>()=>{}
// const asyncHandler=(func)=>async()=>{}

// wrapper function to use everywhere using try catch
// const asyncHandler=(fn)=>async(req, res, next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
        
//     }
// }



