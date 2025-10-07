import Layout from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Trash2, Scissors, Merge, Axe, Shrink, ImageIcon, Combine } from "lucide-react";

const TOOLS = [
    {
        "title": "Super Merge files",
        "description": "Combine several images and PDF files into a single PDF document.",
        "icon": <Combine className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/super-merge"
    },
    {
        "title": "Merge PDFs",
        "description": "Combine several PDF files into a single document.",
        "icon": <Merge className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/merge"
    },
    {
        "title": "Split PDF",
        "description": "Break your PDF document into several single-page docs.",
        "icon": <Scissors className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/split"
    },
    {
        "title": "Delete Pages",
        "description": "Delete pages from your PDF document.",
        "icon": <Trash2 className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/delete"
    },
    {
        "title": "Extract PDF",
        "description": "Get a sub document by choosing a page range.",
        "icon": <Axe className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/extract"
    },
    {
        "title": "Compress PDF",
        "description": "Reduce the size of your PDF document while maintaining quality.",
        "icon": <Shrink className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/compress"
    },
    {
        "title": "PNG to PDF",
        "description": "Convert and merge PNG files into a single PDF document.",
        "icon": <ImageIcon className="h-5 w-5 text-primary mt-0.5" />,
        "path": "/png-to-pdf"
    }
]

const HomePage = () => {

    return (
        <Layout>
            <h2 className="text-3xl font-bold">PDF Tools</h2>
            <p className="text-muted-foreground">
                Work with your PDF files in several ways. Merge or split PDF documents with ease, turn images into documents and more.
            </p>

            <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
                {
                    TOOLS.map((tool) => (
                        <ToolCard
                            key={tool.title}
                            title={tool.title}
                            description={tool.description}
                            icon={tool.icon}
                            path={tool.path}
                        />
                    ))
                }
            </div>
        </Layout>
    );
};

export default HomePage;
