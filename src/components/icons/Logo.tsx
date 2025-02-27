export default function Logo() {
  return (
    <div className=" bg-black rounded-full [&_path]:fill-white flex items-center justify-center w-10 h-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        className="w-5 h-5"
        height="30"
        viewBox="0 0 25 30"
      >
        <path
          fillRule="evenodd"
          d="M21 7v1h2v2l-1 1v3l1 1v9h-2V14l-1-1h-2V3l-3-3H5L2 3v25H0v2h20v-2h-2V14h2v10l1 1h2l1-1v-9l1-1V9l-2-2h-2zm-5 6H4V3l1-1h10l1 1v10z"
        ></path>
      </svg>
    </div>
  );
}
