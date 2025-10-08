import { Link } from "react-router-dom"

interface ToolCardProps {
    title: string;
    description: string;
    icon: React.ReactElement;
    path: string;
}


export const ToolCard = ({ title, description, icon, path }: ToolCardProps) => {
    return (
        <Link to={path}>
            <div className="toolcard border border-border border-t-highlight rounded-2xl p-8 text-left hover:border-primary transition-colors h-full cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                    {icon}
                    <h3 className="text-xl font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    {description}
                </p>
            </div>
        </Link>
    )
}