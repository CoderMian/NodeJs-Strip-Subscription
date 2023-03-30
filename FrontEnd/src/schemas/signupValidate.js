import * as Yup from "yup";
export const signUpSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Please enter your name"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  phones: Yup.array().of(
    Yup.object().shape({
      // add validation rules for each field in the array
      no: Yup.string().min(11).max(11).required("Phone is required"),
    })
  ),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
  avatar: Yup.mixed()
    .required("Required")
    .test(
      "fileType",
      "Invalid file type",
      (value) => value && ["image/jpeg", "image/png"].includes(value.type)
    ),
  video: Yup.mixed()
    .required("Required")
    .test(
      "fileType",
      "Invalid file type",
      (value) =>
        value && ["video/mp4", "video/mkv", "video/x-m4v"].includes(value.type)
    ),
});
