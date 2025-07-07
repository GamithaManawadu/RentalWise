import { IoSearch } from "react-icons/io5";

export default function BannerwithSearch() {
  
  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat text-white px-4 md:px-8 py-10 md:py-20 flex flex-col items-center text-center min-h-[500px]"
      style={{ backgroundImage: `url('/images/hero.jpg')` }}
    >
      <h2 className="text-4xl md:text-6xl font-extrabold mt-20 max-w-3xl">
        Let your property <br />
        adventure begin!
      </h2>

      <div className="w-full max-w-full md:max-w-xl mt-6 mb-4 md:mb-0 relative">
        <input
          type="text"
          placeholder="Enter an address, neighborhood, city, or ZIP code"
          className="w-full px-4 py-5 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-black"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700"
        >
          <IoSearch className="h-6 w-6"/>
        </button>
      </div>
    </div>
  );
}
