export const CreatePost = (props:{setOpenModal:any}) => {
  return (
    <div className="p-4 pb-0 md:w-96 red  " onClick={()=>props.setOpenModal(true)}>
      <div className="p-4 flex relative hover-svg  items-center justify-center border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden hover:bg-red-50  ">
          <div className="absolute inset-y-0 left-6 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" className="w-6 h-6 text-gray-500 dark:text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"/>
              </svg>
          </div>
        <h1 className="title-font text-lg font-medium text-gray-900 ">
          Create your own post.
        </h1>
      </div>
    </div>
  );
};
