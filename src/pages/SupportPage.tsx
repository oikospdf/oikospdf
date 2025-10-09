import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

const SupportPage = () => {
  const navigate = useNavigate();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const cryptoCurrencies = [
    { name: "Bitcoin (BTC)", address: "bc1qjs2346jwxgx2zvl74dhdc5setkascxdfw8tuqz" },
    /* { name: "Monero (XMR)", address: "" }, */
    { name: "Ripple (XRP)", address: "rQGzW1JmMTqvNNGT8x42rp4Y5ZM73QBbN3" },
    { name: "Cardano (ADA)", address: "addr1qxzy5fc47n2haujvenmp2rp0s49hvmkhxc6t3vhr43s67wjwcuwhwtjurpa6zyykh7yc2h33q04w46xq2s2a6cdm522q6sqe6t" },
    /* { name: "Ethereum (ETH)", address: "" }, */
    { name: "Litecoin (LTC)", address: "ltc1qrqy7vvzprthsl0a478ruw4w70n0nkszh8ec2ra" },
    { name: "Vechain (VET)", address: "0x5219998abdF3AaF876221139F1066CD4a72Bd43F" },
  ];

  const copyToClipboard = (address: string, currency: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success(`Copied ${currency} address to clipboard`);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Support This Project</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Thank you for considering supporting this project! Your contributions help keep this tool free and maintained. 
            Whether it's a one-time donation or ongoing support, every bit helps us continue improving and adding new features. 
            Choose your preferred method below and help us keep this service running for everyone.
          </p>
        </Card>

        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct">Direct Donation</TabsTrigger>
            <TabsTrigger value="patreon">Patreon</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">One-Time Donations</h2>
              <p className="text-muted-foreground mb-6">
                Support us with a one-time contribution through PayPal or Ko-fi. No subscription required!
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">PayPal</h3>
                    <p className="text-sm text-muted-foreground">Quick and secure payment</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="https://paypal.me/yourusername" target="_blank" rel="noopener noreferrer">
                      Donate <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Ko-fi</h3>
                    <p className="text-sm text-muted-foreground">Buy us a coffee</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="https://ko-fi.com/yourusername" target="_blank" rel="noopener noreferrer">
                      Support <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="patreon" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Become a Patron</h2>
              <p className="text-muted-foreground mb-6">
                Join our community on Patreon for exclusive perks and ongoing support. Get early access to new features 
                and help shape the future of this tool!
              </p>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Patreon Membership</h3>
                  <p className="text-sm text-muted-foreground">Monthly support with benefits</p>
                </div>
                <Button asChild>
                  <a href="https://patreon.com/yourusername" target="_blank" rel="noopener noreferrer">
                    Join Patreon <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crypto" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Cryptocurrency Donations</h2>
              <p className="text-muted-foreground mb-6">
                Support us with cryptocurrency. Click on a currency below to reveal the wallet address and QR code.
              </p>
              <Accordion type="single" collapsible className="w-full">
                {cryptoCurrencies.map((crypto, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{crypto.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-center p-6 bg-muted rounded-lg">
                          <div className="w-48 h-48 bg-background border-2 border-border rounded-lg flex items-center justify-center">
                            <p className="text-sm text-muted-foreground text-center px-4">QR Coming Soon</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Wallet Address</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={crypto.address}
                              readOnly
                              className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => copyToClipboard(crypto.address, crypto.name)}
                            >
                              {copiedAddress === crypto.address ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupportPage;
