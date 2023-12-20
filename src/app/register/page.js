"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import { registrationFormControls } from "@/utils";

const isRegistered = false;

export default function Register() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row ">
          <div className="w-fullmt-20 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12 ">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-slate-300 shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center text-gray-600 font-serif">
                {isRegistered
                  ? "Registration Successfull !"
                  : "Sign up for an account"}
              </p>
              {isRegistered ? (
                <button className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium tracking-wide hover:bg-gray-700">
                  Login
                </button>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative text-gray-500 space-y-8">
                  {registrationFormControls.map((controlItem) =>
                    controlItem.componentType === "input" ? (
                      <InputComponent
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        label={controlItem.label}
                      />
                    ) : controlItem.componentType === "select" ? (
                      <SelectComponent
                        options={controlItem.options}
                        label={controlItem.label}
                      />
                    ) : null
                  )}
                  <button className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium tracking-wide rounded-md hover:bg-gray-700">
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}