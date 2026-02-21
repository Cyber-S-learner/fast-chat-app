const tryErrorHandler = (error)=>{
    return {
        error_message : error.message,
        success : false
    }
}

export default tryErrorHandler