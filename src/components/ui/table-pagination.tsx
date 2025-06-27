import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useMemo } from "react";

type Props = {
    page: number;
    totalPage: number;
    changePage: (page: number) => void;
    className?: string;
}

const Pagination = ({ className, changePage, page, totalPage }: Props) => {

    const pages = useMemo(() => {
        const pagesArr = [];

        //show three
        if (totalPage <= 3) {
            for (let i = 1; i <= totalPage; i++) {
                pagesArr.push(i);
            }
        } else {
            if (page <= 1) {
                pagesArr.push(1, 2, 3);
            } else if (page >= totalPage) {
                pagesArr.push(totalPage - 2, totalPage - 1, totalPage);
            } else {
                pagesArr.push(page - 1, page, page + 1);
            }
        }
        return pagesArr;

    }, [page, totalPage]);

    const nextPage = () => {
        if (page < totalPage) {
            changePage(page + 1);
        }
    }

    const prevPage = () => {
        if (page > 1) {
            changePage(page - 1);
        }
    }

    return (
        <div className={cn("flex h-fit items-center rounded-md bg-white/10 backdrop-blur-md border border-white/20", className)}>
            <Button 
                className="my-0 rounded-none bg-transparent hover:bg-white/20 text-white border-none" 
                onClick={prevPage} 
                variant={'ghost'}
            >
                Previous
            </Button>
            {pages.map((p) => (
                <Button 
                    key={p} 
                    variant={'ghost'} 
                    className={cn(
                        "my-0 rounded-none bg-transparent hover:bg-white/20 text-white border-none", 
                        p === page ? 'bg-white/20 text-white' : ''
                    )} 
                    onClick={() => changePage(p)}
                >
                    {p}
                </Button>
            ))}

            <Button 
                className="my-0 rounded-none bg-transparent hover:bg-white/20 text-white border-none" 
                onClick={nextPage} 
                variant={'ghost'}
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination;