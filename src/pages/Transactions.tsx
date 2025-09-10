import { useState, useEffect } from 'react';
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
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade_profit' | 'trade_loss' | 'bonus' | 'refund';
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
  description: string;
  reference: string;
  fee?: number;
}

const Transactions = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Mock transaction data
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: 'WTH-001',
        type: 'withdrawal',
        amount: 1000,
        method: 'Bank Transfer',
        status: 'pending',
        date: '2025-09-08T10:23:00',
        description: 'Withdrawal request - Monday morning',
        reference: 'WTH-001',
        fee: 0
      },
      {
        id: 'WTH-002',
        type: 'withdrawal',
        amount: 1000,
        method: 'Bank Transfer',
        status: 'pending',
        date: '2025-09-09T10:23:00',
        description: 'Withdrawal request - Tuesday morning',
        reference: 'WTH-002',
        fee: 0
      },
      {
        id: 'WTH-003',
        type: 'withdrawal',
        amount: 1000,
        method: 'Bank Transfer',
        status: 'pending',
        date: '2025-09-10T10:00:00',
        description: 'Withdrawal request - Wednesday morning',
        reference: 'WTH-003',
        fee: 0
      }
    ];

    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
    setIsLoading(false);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(transaction => new Date(transaction.date) >= filterDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4 text-red-400" />;
      case 'trade_profit':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'trade_loss':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'bonus':
        return <DollarSign className="h-4 w-4 text-yellow-400" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-blue-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-600 text-white">Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-600 text-white">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'trade_profit':
        return 'Trade Profit';
      case 'trade_loss':
        return 'Trade Loss';
      case 'bonus':
        return 'Bonus';
      case 'refund':
        return 'Refund';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to local time and format
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const exportTransactions = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Exporting transactions...');
  };

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalProfits = transactions
    .filter(t => t.type === 'trade_profit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLosses = transactions
    .filter(t => t.type === 'trade_loss' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-400 mt-2">View all your account transactions and trading activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-400">${totalDeposits.toLocaleString()}</p>
                </div>
                <ArrowUpRight className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-400">${totalWithdrawals.toLocaleString()}</p>
                </div>
                <ArrowDownLeft className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Trading Profits</p>
                  <p className="text-2xl font-bold text-green-400">${totalProfits.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Trading Losses</p>
                  <p className="text-2xl font-bold text-red-400">${totalLosses.toLocaleString()}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label className="text-gray-300">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Types</SelectItem>
                    <SelectItem value="deposit" className="text-white hover:bg-gray-600">Deposits</SelectItem>
                    <SelectItem value="withdrawal" className="text-white hover:bg-gray-600">Withdrawals</SelectItem>
                    <SelectItem value="trade_profit" className="text-white hover:bg-gray-600">Trade Profits</SelectItem>
                    <SelectItem value="trade_loss" className="text-white hover:bg-gray-600">Trade Losses</SelectItem>
                    <SelectItem value="bonus" className="text-white hover:bg-gray-600">Bonuses</SelectItem>
                    <SelectItem value="refund" className="text-white hover:bg-gray-600">Refunds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Status</SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-gray-600">Completed</SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-gray-600">Pending</SelectItem>
                    <SelectItem value="failed" className="text-white hover:bg-gray-600">Failed</SelectItem>
                    <SelectItem value="cancelled" className="text-white hover:bg-gray-600">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Time</SelectItem>
                    <SelectItem value="today" className="text-white hover:bg-gray-600">Today</SelectItem>
                    <SelectItem value="week" className="text-white hover:bg-gray-600">This Week</SelectItem>
                    <SelectItem value="month" className="text-white hover:bg-gray-600">This Month</SelectItem>
                    <SelectItem value="year" className="text-white hover:bg-gray-600">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={exportTransactions}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium text-white">
                          {getTypeLabel(transaction.type)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.reference} • {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        {transaction.fee && transaction.fee > 0 && (
                          <div className="text-xs text-gray-400">
                            Fee: ${transaction.fee.toFixed(2)}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Transactions;
