export default function InputComponent({
  label,
  placeholder,
  onChange,
  value,
  type,
}) {
  return (
    <div className="relative text-gray-500">
      <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-800 bg-gray-50 ">
        {label}
      </p>
      <input
        placeholder={placeholder}
        type={type || "text"}
        value={value}
        onChange={onChange}
        className="border placeholder-gray-500 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-1 mt-0 ml-0 text-base block bg-gray-50 border-black rounded-md"
      />
    </div>
  );
}
