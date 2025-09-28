import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Table } from "./ui/table";
import { Card, CardHeader } from "./ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

function StyledMd({ children }) {
    return (
        <Markdown remarkPlugins={[remarkGfm]} disallowedElements={['a']} components={{
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-4" {...props} />,
            h3: ({ node, ...props }) => (<h3 className="text-lg font-bold my-4" {...props} />),
            h4: ({ node, ...props }) => <h4 className="text-md font-semibold my-3" {...props} />,
            h5: ({ node, ...props }) => <h5 className="text-sm font-semibold my-2" {...props} />,
            h6: ({ node, ...props }) => <h6 className="text-xs font-semibold my-1" {...props} />,
            p: ({ node, ...props }) => <p className="my-5" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-inside my-2 mx-1" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
            li: ({ node, ...props }) => (<li className="flex items-start space-x-2 sm:my-2 my-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span className="text-sm" {...props}></span>
        </li>),
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            table: ({ node, ...props }) => (<Card className="sm:max-w-3xl max-w-full max-sm:overflow-auto"><Table className="my-4" {...props} /></Card>),
            thead: ({ node, ...props }) => <thead className="bg-muted p-4 font-medium text-muted-foreground" {...props} />,
            tbody: ({ node, ...props }) => <tbody className="p-4" {...props} />,
            tr: ({ node, ...props }) => <tr className="border-t even:bg-muted" {...props} />,
            th: ({ node, ...props }) => <th className="px-4 py-2 text-left font-medium" {...props} />,
            td: ({ node, ...props }) => <td className="px-4 py-2" {...props} />,
        }}>
            {children}
        </Markdown>
    );
}

export default StyledMd;