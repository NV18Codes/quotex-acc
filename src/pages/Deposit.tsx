import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  CreditCard, 
  Wallet, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  Banknote,
  Smartphone,
  Globe
} from 'lucide-react';

const Deposit = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/');
    return null;
  }

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      minAmount: 10,
      maxAmount: 5000,
      processingTime: 'Instant',
      fee: '2.5%',
      popular: true
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: Banknote,
      description: 'Direct bank transfer',
      minAmount: 50,
      maxAmount: 10000,
      processingTime: '1-3 business days',
      fee: 'Free',
      popular: false
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Wallet,
      description: 'Bitcoin, Ethereum, USDT',
      minAmount: 20,
      maxAmount: 20000,
      processingTime: '10-30 minutes',
      fee: '1%',
      popular: true
    },
    {
      id: 'e-wallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'PayPal, Skrill, Neteller',
      minAmount: 25,
      maxAmount: 3000,
      processingTime: 'Instant',
      fee: '3%',
      popular: false
    }
  ];

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleDeposit = async () => {
    if (!selectedMethod || !amount) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Handle successful deposit
      console.log('Deposit processed:', { method: selectedMethod, amount });
    }, 2000);
  };

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Deposit Funds</h1>
          <p className="text-gray-400 mt-2">Add funds to your trading account securely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Deposit Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Balance */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="h-5 w-5" />
                  Account Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300">Demo Balance</Label>
                    <div className="text-2xl font-bold text-blue-400">
                      ${user?.demoBalance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Live Balance</Label>
                    <div className="text-2xl font-bold text-green-400">
                      ${user?.liveBalance.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5" />
                  Select Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-gray-300" />
                            <div>
                              <div className="font-medium text-white">{method.name}</div>
                              <div className="text-sm text-gray-400">{method.description}</div>
                            </div>
                          </div>
                          {method.popular && (
                            <Badge className="bg-blue-600 text-white">Popular</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                          <div>Min: ${method.minAmount}</div>
                          <div>Max: ${method.maxAmount}</div>
                          <div>Fee: {method.fee}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Amount Selection */}
            {selectedMethod && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="h-5 w-5" />
                    Enter Amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="amount" className="text-gray-300">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="mt-1 bg-gray-700 border-gray-600 text-white text-lg"
                      min={selectedPaymentMethod?.minAmount}
                      max={selectedPaymentMethod?.maxAmount}
                    />
                    {selectedPaymentMethod && (
                      <div className="text-sm text-gray-400 mt-1">
                        Min: ${selectedPaymentMethod.minAmount} - Max: ${selectedPaymentMethod.maxAmount}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-300">Quick Amounts</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          variant="outline"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          ${quickAmount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {amount && selectedPaymentMethod && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Amount:</span>
                          <span className="text-white">${parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Processing Fee:</span>
                          <span className="text-white">
                            ${(parseFloat(amount) * parseFloat(selectedPaymentMethod.fee.replace('%', '')) / 100).toFixed(2)}
                          </span>
                        </div>
                        <Separator className="bg-gray-600" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-300">Total:</span>
                          <span className="text-white">
                            ${(parseFloat(amount) + (parseFloat(amount) * parseFloat(selectedPaymentMethod.fee.replace('%', '')) / 100)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleDeposit}
                    disabled={!selectedMethod || !amount || isProcessing}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Deposit ${amount || '0'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Regulated & licensed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>24/7 fraud monitoring</span>
                </div>
              </CardContent>
            </Card>

            {/* Processing Times */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  Processing Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{method.name}</span>
                      </div>
                      <span className="text-gray-400">{method.processingTime}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Having trouble with your deposit? Our support team is here to help.
                </p>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Deposit;
