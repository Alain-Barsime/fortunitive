import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Wallet as WalletIcon, TrendingUp, CreditCard } from "lucide-react";

export default function Wallet() {
  return (
    <div className="text-foreground font-sans transition-colors duration-300 min-h-screen">
      <Navigation />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8 glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                <WalletIcon className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-4xl font-bold gradient-text">
                  My Wallet
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage your funds, transactions, and payment methods.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Current Balance Card */}
            <Card className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <DollarSign className="h-12 w-12 text-green-500 mb-4 floating-element" />
              <CardTitle className="text-3xl font-bold mb-2">$125.00</CardTitle>
              <p className="text-muted-foreground">Current Balance</p>
              <Button className="mt-6 w-full glass-button rounded-xl">Add Funds</Button>
            </Card>

            {/* Recent Transactions Card */}
            <Card className="glass-card rounded-2xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Course Purchase</span>
                  <span className="text-red-500">-$49.99</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Job Payout</span>
                  <span className="text-green-500">+$250.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Subscription Fee</span>
                  <span className="text-red-500">-$9.99</span>
                </div>
                <Button variant="link" className="p-0 h-auto text-primary">View All Transactions</Button>
              </CardContent>
            </Card>

            {/* Payment Methods Card */}
            <Card className="glass-card rounded-2xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-500" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Visa **** 1234</span>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Mastercard **** 5678</span>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <Button className="w-full glass-button rounded-xl mt-4">Add New Method</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
