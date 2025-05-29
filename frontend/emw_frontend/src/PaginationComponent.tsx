import React,{useState} from 'react';
import clsx from 'clsx';

const PaginationComponent = ({array, itemsPerPage}:{array:React.ReactNode[], itemsPerPage:number}) => {

    const total = array.length;

    const [currentPage, setCurrentPage] = useState(1);

    const endIndex =  itemsPerPage * currentPage ;
    const startIndex = endIndex - itemsPerPage;

    const totalPage = Math.ceil( total / itemsPerPage) ;

    const currentItemsArray = array.slice(startIndex,endIndex) ;

    let numberOfButtons = []

    for( let i=1; i <=totalPage; i++) {
        numberOfButtons.push(i)
    }

    return (
        <div className='relative flex flex-col justify-between items-center gap-1 text-xl mt-[20px] w-full'>
            <div className='absolute left-[30px]'><span className='text-5xl text-bold'>{total}</span> Results</div>
            <div className='flex justify-center items-center gap-2'>
        {/* // <div >
        //     <div ><span >{total}</span> Results</div>
        //     <div > */}
                { numberOfButtons.length > 0 && <button className ='hover:cursor-pointer hover:bg-green-500 font-bold bg-green-300 rounded-sm p-[5px]' onClick={() => {
                const max = Math.max.apply(null, numberOfButtons);
                const min = Math.min.apply(null, numberOfButtons);
                if ( currentPage === min) {
                    setCurrentPage (max);
                }
                else {
                    setCurrentPage ( current => current - 1 )
                }
                }}>Previous</button> }
                <div className='flex justify-center items-center gap-2'>
                    {
                        numberOfButtons.length > 0 && (numberOfButtons.map( (number,index) => {
                            return <button className={clsx( number === currentPage ? "text-3xl font-bold text-pink-500 border-pink-500" :"text-xl")} key={index} onClick={()=>setCurrentPage(number)}>{number}</button>
                        }))
                    }
                </div>
                { numberOfButtons.length > 0 && <button className ='hover:cursor-pointer hover:bg-green-500 font-bold bg-green-300 rounded-sm p-[5px]' onClick={() => {
                    const max = Math.max.apply(null, numberOfButtons);
                    const min = Math.min.apply(null, numberOfButtons);
                    if ( currentPage === max) {
                        setCurrentPage (min);
                    }
                    else {
                        setCurrentPage ( current => current + 1 )
                    }
                    }}>Next</button> 
                }
                
            </div>
            {   
                currentItemsArray && currentItemsArray.map( (item) => {
                    return item
                })
            }
            
        </div>
    )
}

export default PaginationComponent