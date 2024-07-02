import React from "react";

const InputComponent = ({
  placeholder = "Place holder text",
  label = "My Label",
  icon = "Icon",
  name,
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="border-black hover:border-gray-300 focus:border-blue-100 border p-1 rounded-xl flex items-center gap-2">
        <div>
          <input
            id={name}
            placeholder={placeholder}
            className="border-none outline-none bg-transparent"
          ></input>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const PageJsx = () => {
  return (
    <div className="m-5 flex-col gap-3 flex w-52 items-center justify-center">
      <InputComponent
        label="Email"
        name={"email"}
        placeholder="Enter your Email"
      ></InputComponent>

      <InputComponent
        name={"password"}
        label="Password"
        placeholder="Enter your password"
        icon="Lock"
      ></InputComponent>
      <InputComponent
        placeholder="Enter your firstName"
        icon="Lock"
      ></InputComponent>

      <InputComponent
        icon={<span>Tree</span>}
        placeholder="Enter Age"
      ></InputComponent>
    </div>
  );
};

export default PageJsx;
