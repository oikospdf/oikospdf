
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="min-h-screen transition-colors">
            <header className="border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold"><Link to="/">OIKOS PDF</Link></h1>
                    {/* <Link to="/support">Support</Link> */}
                    <ThemeToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        {children}
                        {/* TODO: Separate texts for future translations */}
                        <h2 className="text-3xl font-bold">About Oikos PDF</h2>
                        <p className="text-muted-foreground">
                            Oikos PDF is a privacy first, open source minimalist PDF toolkit. All the process is done locally in your browser, and none of your data is sent to any server. All the code is open source and available on GitHub. You can check it by yourself here: <a href="https://github.com/oikospdf/oikospdf"><span className="font-bold">https://github.com/oikospdf/oikospdf</span></a>.
                        </p>
                        <p className="text-muted-foreground">
                            Our tools are desinged to be simple and straightforward, so you can use them in an intuitive way. If that is not the case, every tool has a short documentation at the end where you can find all the information you need.
                        </p>
                        <p className="text-muted-foreground">
                            This page does not have any ad or tracking, so we do not monetize it in any way. If you want to support us so we can improve this page and build new tools, please consider buying us a coffee, supporting us on Patreon or donating us with crypto. This info is not yet available, but it will be soon.
                        </p>
                        <p className="text-muted-foreground">
                            If you have any suggestion, question, bug report or feature request, please contact us on <a href="mailto:contact@oikospdf.com."><span className="font-bold">contact@oikospdf.com.</span></a>. Pull requests will not be accepted for now, but they will be more than welcome for translations in the near future.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
