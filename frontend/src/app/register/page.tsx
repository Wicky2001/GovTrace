"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
// import { FormEvent } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";

const RegisterGuest = () => {
  const router = useRouter();

  const RegisterSuccessAlert = (message: string) => {
    toast.success(`${message}`, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const RegisterFaildAlert = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const RegisterdGuest = z.object({
    firstName: z.string().min(5, "Too short!"),
    lastName: z.string().min(5),
    email: z.email("Not a valid email!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long") // Custom message for password length
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // Custom regex error
      .regex(/[a-z]/, "Password must contain at least one lowercase letter") // Custom regex error
      .regex(/[0-9]/, "Password must contain at least one number") // Custom regex error
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  });
  type FormData = z.infer<typeof RegisterdGuest>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(RegisterdGuest) });

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await fetch(
        "https://localhost:4000/api/auth/register/guest",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        RegisterSuccessAlert("Sucessfully registerd");
        RegisterSuccessAlert("Now please login as guest");
        router.push("/");
      } else {
        const data = await response.json();
        RegisterFaildAlert("ERROR OCCURED DURING REGISTRATION");
        RegisterFaildAlert(`${data?.message}`);
      }
    } catch (err) {
      console.log(err);
      RegisterFaildAlert("INTERNAL SERVER ERROR");
      RegisterFaildAlert("Sorry for inconvinience");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Hola! Please register.
            </h1>
            <form
              className="space-y-4 md:space-y-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex gap-3  ">
                <div className="w-full">
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    id="firstName"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="David"
                  />
                  {errors.firstName && (
                    <p className=" pl-0.25 pt-0.5 w-full text-xs text-red-600 hover:text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    last name
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    id="lastName"
                    placeholder="Jhones"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    // required=""
                  />
                  {errors.lastName && (
                    <p className=" pl-0.25 pt-0.5 w-full text-xs text-red-600 hover:text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    id="email"
                    placeholder="davidJhones@gmail.com"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    // required=""
                  />
                  {errors.email && (
                    <p className=" pl-0.25 pt-0.5 w-full text-xs text-red-600 hover:text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    id="password"
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    // required=""
                  />
                  {errors.password && (
                    <p className=" pl-0.25 pt-0.5 w-full text-xs text-red-600 hover:text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-3 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    // required=""
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <p className=" pl-0.25 mb-1 w-full text-xs text-red-600 hover:text-sm">
                  {errors.terms.message}
                </p>
              )}
              <button
                type="submit"
                className="mb-2 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:outline-none"
              >
                Create an account
              </button>
              <hr className=" my-2 h-px -my-y-4 bg-gray-200  dark:bg-gray-700" />
              <button
                type="submit"
                className="flex gap-1 inline-center justify-center focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:outline-none"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20} // Added margin-right to separate the icon from the text
                />
                Continue with Google
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  {" "}
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterGuest;
