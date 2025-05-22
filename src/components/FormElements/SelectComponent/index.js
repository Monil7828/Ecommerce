export default function SelectComponent({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="relative">
      <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-800 bg-gray-50 ">
        {label}
      </p>
      <select
        value={value}
        onChange={onChange}
        className="border placeholder-gray-500 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-1 mt-0 ml-0 text-gray-600 text-base block bg-gray-50 border-gray-900 border-b rounded-md"
      >
        {options && options.length ? (
          options.map((optionItem) => (
            <option
              id={optionItem.id}
              value={optionItem.id}
              key={optionItem.id}
            >
              {optionItem.label}
            </option>
          ))
        ) : (
          <option id="" value={""}>
            Select
          </option>
        )}
      </select>
    </div>
  );
}
