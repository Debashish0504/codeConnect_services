const authAdmin = (req,res,next) => {
    console.log("Admin auth inserted")
    const token = 'xyz'
    const isAdminAuthorized = token === 'xyz'
    if(!isAdminAuthorized){
        res.send("Admin not Authorized")
    }
    next()
}

const authUser = (req,res,next) => {
    console.log("User auth inserted")
    const token = 'xyz'
    const isAdminAuthorized = token === 'xyz'
    if(!isAdminAuthorized){
        res.send("User not Authorized")
    }
    next()
}

module.exports ={
    authUser,
    authAdmin
}
