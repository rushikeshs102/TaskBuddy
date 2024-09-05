function signupValidation(values) {
   let error = {}
   const name_pattern = /^[a-zA-Z\s]+$/
   const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   const password_pattern = /^.{4,}$/

   if (values.name === "") {
      error.name = "Name should not be empty"
   }
   else if (!name_pattern.test(values.name)) {
      error.name = "Enter valid name"
   }
   else {
      error.name = ""
   }

   if (values.email === "") {
      error.email = "Name should not be empty"
   }
   else if (!email_pattern.test(values.email)) {
      error.email = "Enter valid email"
   } else {
      error.email = ""
   }

   if (values.password === "") {
      error.password = "Password should not be empty"
   }
   else if (!password_pattern.test(values.password)) {
      error.password = "Password must contain 4 characters "
   } else {
      error.password = ""
   }
   return error;
}

export default signupValidation