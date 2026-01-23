import React from 'react'
const pagination =({
    currentpage =1,
    totalpage=1,
    onPageChange,
  maxVisiblePages = 5,
}) =>{
    if(!totalpage || totalpage<1) return null;

    const handlepageclick =(page)=>{
        if(page<1 ||page> totalpage) return;
        onPageChange(page);
    };
    const getpaginationnumbers =()=>{
     const pages = [];

    const half = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentpage - half);
    let endPage = Math.min(totalpage, currentpage + half);
if (currentpage <= half) {
      startPage = 1;
      endPage = Math.min(totalpage, maxVisiblePages);
    }
    // adjust when near end
    if (currentpage + half >= totalpage) {
      endPage = totalpage;
      startPage = Math.max(1, totalpage - maxVisiblePages + 1);
    }
      if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }
    

    // middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
 // last page + dots
    if (endPage < totalpage) {
      if (endPage < totalpage - 1) pages.push("...");
      pages.push(totalpage);
    }
     return pages;
    };
     const pages = getpaginationnumbers();
  return (
    <div className='flex justify-end items-end gap-2 mt-4 flex-wrap'>
      <button onClick={() => handlepageclick(currentpage - 1)} disabled={currentpage===1}
      className = "px-3 pt-1 border border-(--accent) rounded-lg disabled:opacity-50 hover:bg-slate-100">
        prev
      </button>
      {pages.map((page,index)=>
      page==="..." ?(
        <span key= {index} className='px-2 text-slate-500'>
            ...
        </span>
      ):(
        <button
            key={index}
            onClick={() => handlepageclick(page)}
            className={`px-3 pt-1 border border-(--accent) rounded-lg hover:bg-slate-100 ${
              page === currentpage ? "bg-(--accent) text-white" : ""
            }`}
          >
            {page}
          </button> 
      )
    )}
    <button onClick={()=>handlepageclick(currentpage+1)}
        disabled={currentpage===totalpage}  className="px-4 pt-1 border border-(--accent) rounded-lg disabled:opacity-50 hover:bg-slate-100">
            next</button>
    </div>
  )
}

export default pagination

