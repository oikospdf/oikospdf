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
            <div className="bg-card border border-border rounded-lg p-6 text-left hover:border-primary transition-colors h-full cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
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